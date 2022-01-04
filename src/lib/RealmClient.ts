// @ts-nocheck

import { App, Credentials } from 'realm-web';
import { getAccessToken } from '@auth0/nextjs-auth0';
import jwt_decode from 'jwt-decode';
import type { NextApiRequest, NextApiResponse } from 'next';

const APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
const BASE_PATH = process.env.NEXT_PUBLIC_REALM_BASE_PATH;
const REALM_GRAPHQL_ENDPOINT = `${BASE_PATH}/api/client/v2.0/app/${APP_ID}/graphql`;

function isServer() {
	return !(typeof window != 'undefined' && window.document);
}

/*
	RealmClient is a wrapper for Realm SDK to help with managing sessions.
	To call Realm API you need to have a Realm Access Token.
	We are using custom authentication on the Realm side where we login with Auth0 access token.
	Both Realm and Auth0 access tokens can expire.
	This Client helps keeping track of their expiration, minimizing round trips to the Auth servers.

	IMPORTANT! Make sure to call reset() when the user logs out. 
*/

export const callbacks = {
	onAccessTokenExpired: () => {},
};

// those are not all fields from the token
interface IAuth0AccessToken {
	iss: string;
	sub: string;
	aud?: string[];
	iat: number;
	exp: number;
	scope: string;
	permissions: string[];
}

// those are not all fields from the token
interface IRealmAccessToken {
	exp: number;
	iat: number;
	iss: string;
	sub: string;
	typ: string;
}

interface ICachedToken {
	token: string;
	expireAt: number;
}

type ErrorPlus = Error & { info: string; status: number };

export const app = !isServer()
	? new App({
			id: APP_ID,
			baseUrl: BASE_PATH,
	  })
	: null;

let cachedAuth0Token: ICachedToken = null;
let cachedRealmAccessToken: ICachedToken = null;

export const reset = async () => {
	console.log('Realm: cleaning app cache');
	cachedAuth0Token = null;
	cachedRealmAccessToken = null;
	await app?.currentUser?.logOut();
};

let sessionRefreshPromise = [];

const ensureServerSession = async (serverProps: { req; res } = undefined): Promise<string> => {
	const auth0Token = (await getAccessToken(serverProps.req, serverProps.res))?.accessToken;
	if (!auth0Token) {
		throw new Error('Could not get Auth0 token, most likely user has to login again.');
	}

	const app = new App({
		id: APP_ID,
		baseUrl: BASE_PATH,
	});
	await app.logIn(Credentials.jwt(auth0Token));
	const { accessToken } = app.currentUser;
	return accessToken;
};

const ensureClientSession = async () => {
	let shouldLogIn = false;

	// get new token if don't have any yet or if it's expired
	// or if we are on the server, since lambda can re-used we don't want to have tokens of other users here
	if (!cachedAuth0Token || cachedAuth0Token.expireAt < new Date().getTime() / 1000) {
		const auth0Token = await fetchAccessToken();

		if (!auth0Token) {
			reset();
			sessionRefreshPromise = null;
			if (callbacks.onAccessTokenExpired) callbacks.onAccessTokenExpired();
			return; //no token = nothing to do here, waiting for user to re-login
		}

		const decodedToken = jwt_decode<IAuth0AccessToken>(auth0Token);
		cachedAuth0Token = {
			token: auth0Token,
			expireAt: decodedToken.exp,
		};

		shouldLogIn = true;
	}

	if (!app.currentUser) {
		shouldLogIn = true;
	}

	if (shouldLogIn) {
		await app.logIn(Credentials.jwt(cachedAuth0Token.token));
	} else {
		// An already logged in user's access token might be stale. To guarantee that the token is
		// valid, we refresh the user's custom data which also refreshes their access token.

		if (!cachedRealmAccessToken || cachedRealmAccessToken.expireAt < new Date().getTime() / 1000) {
			await app.currentUser.refreshCustomData();
		}
	}

	// Get a valid access token for the current user
	const { accessToken } = app.currentUser;

	const decodedToken = jwt_decode<IRealmAccessToken>(accessToken);

	cachedRealmAccessToken = {
		token: accessToken,
		expireAt: decodedToken.exp,
	};

	// promises are sticky, once you assing a promise to a variable it will always stay there
	// an option to go around that is to keep it in an array an assing new array (or as a field in an object)
	sessionRefreshPromise = [];
};

// fetch Auth0 access token on client side
const fetchAccessToken = async () => {
	let token: string = null;
	await fetch('/api/accesstoken', { method: 'GET' })
		.then((res) => res.json())
		.then((res) => {
			token = res.access_token;
		})
		.catch((error) => {
			console.error('Access token error: ', error);
		});
	return token;
};

export const fetcher = async <T = any>(
	body: BodyInit,
	signal: AbortSignal = undefined,
	serverProps: { req: NextApiRequest; res: NextApiResponse } = undefined
) => {
	const ensureHeader = async () => {
		// on server we don't want to cache anything globally
		// only if we can cache something really smart
		// as lambda instance is shared between requests
		// we could end up serving some people content they are not suppose to see
		if (isServer()) {
			return {
				Authorization: `Bearer ${await ensureServerSession(serverProps)}`,
			};
		} else {
			if (sessionRefreshPromise.length === 0) {
				sessionRefreshPromise.push(ensureClientSession());
			}

			await Promise.allSettled(sessionRefreshPromise);

			return {
				Authorization: `Bearer ${cachedRealmAccessToken?.token}`,
			};
		}
	};

	const response = await fetch(REALM_GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: await ensureHeader(),
		body: body,
		signal,
	});

	if (!response.ok) {
		const error = new Error('An error occurred while fetching the data.') as ErrorPlus;
		// Attach extra info to the error object.
		error.info = await response.json();
		error.status = response.status;
		console.log(error);
		throw error;
	}

	const data = await response.json();
	// this error is specifc to graphQL - response might containt array with errors explaining failures in graphQL
	if (data.errors) {
		const error = new Error('Error from GraphQL') as ErrorPlus;
		error.info = data;
		error.status = 500;
		console.error(error);
		console.error(JSON.stringify(data));
		throw error;
	}

	return { data: (data ? data.data : null) as T, status: response.status };
};
