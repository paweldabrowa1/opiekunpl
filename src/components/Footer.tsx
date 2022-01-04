import { AppConfig } from '../utils/AppConfig';

export const Footer = () => {
  return <div className="border-t border-gray-300 text-center py-8 text-sm">
    © Copyright {new Date().getFullYear()} {AppConfig.title}. Powered with{' '}
    <span role="img" aria-label="Love">
          ♥
        </span>{' '}
    by <a href="https://creativedesignsguru.com">CreativeDesignsGuru</a>
    {/*
     * PLEASE READ THIS SECTION
     * We'll really appreciate if you could have a link to our website
     * The link doesn't need to appear on every pages, one link on one page is enough.
     * Thank you for your support it'll mean a lot for us.
     */}
  </div>
}