// @ts-nocheck

import { useEffect } from 'react';
import { fetcher } from './RealmClient';
import { toast } from 'react-toastify';

export function useEffectForGQLQuery(
  {
    query,
    queryVariables = undefined,
    handle = (respData) => {
      console.error(`Handler not implemented for query: ${query}`);
      console.info('Response:', respData);
    },
    handleError = (abortController, error) => {
      if (!abortController.signal.aborted) {
        console.log(error);
        toast.error('Error! ' + JSON.stringify(error.message));
      }
    },
    executeValidation = (dependency) => {
      return !(!dependency || (Array.isArray(dependency) && dependency.length === 0));
    }
  },
  deps: React.DependencyList
) {
  useEffect(() => {
    for (const dependency of deps) {
      if (!executeValidation(dependency)) {
        return;
      }
    }

    const abortController = new AbortController();

    async function fetchData() {
      const responseData = await fetcher(
        JSON.stringify({
          query: query,
          variables: queryVariables
        }),
        abortController.signal
      );

      handle(responseData);
    }

    fetchData().catch((error) => handleError(abortController, error));

    return () => {
      abortController.abort();
    };
  }, deps);
}

export function fetchGQL(
  {
    query,
    queryVariables = undefined,
    handle = (respData) => {
    },
    handleError = (error) => {
      console.log(error);
    }
  }: {
    query: string,
    queryVariables: any
    handle: ({ data: any, status: number }) => {}
    handleError: (any) => {}
  }): Promise<{ data: any, status: number } | {}> {
  fetcher(
    JSON.stringify({
      query: query,
      variables: queryVariables
    })
  )
    .catch((error) => handleError(error))
    .then((responseData) => {
      return handle(responseData);
    });
}

export function simpleFetcher(
  {
    query,
    queryVariables = undefined
  }: {
    query: string,
    queryVariables?: any
  }) {

  return fetcher(
    JSON.stringify({
      query: query,
      variables: queryVariables
    })
  );
}

export function simpleFetchGQL(
  {
    query,
    queryVariables = undefined
  }: {
    query: string,
    queryVariables?: any
  }): Promise<{ data: any, status: number } | any> {
  fetcher(
    JSON.stringify({
      query: query,
      variables: queryVariables
    })
  )
    .catch((error) => {
    })
    .then((responseData) => {
      console.log(responseData);
      if (responseData && responseData.status === 200) {
        return responseData.data;
      }
      return null;
    });
}
