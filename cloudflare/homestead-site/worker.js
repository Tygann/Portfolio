const ORIGIN = 'https://tylerkeegan.com';
const pages = new Map([
  ['/', '/homestead/'],
  ['/og.png', '/social/homestead.png'],
  ['/robots.txt', '/homestead/robots.txt'],
  ['/sitemap.xml', '/homestead/sitemap.xml'],
  ['/support', '/homestead/support/'],
  ['/support/', '/homestead/support/'],
  ['/privacy', '/homestead/privacy/'],
  ['/privacy/', '/homestead/privacy/'],
]);
const aliases = new Map([
  ['/homestead', '/'], ['/homestead/', '/'],
  ['/homestead/support', '/support'], ['/homestead/support/', '/support'],
  ['/homestead/privacy', '/privacy'], ['/homestead/privacy/', '/privacy'],
]);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // This Worker owns only website hosts, never the API or OAuth host.
    if (!['homesteadcontrol.com', 'www.homesteadcontrol.com'].includes(url.hostname) &&
        !url.hostname.endsWith('.workers.dev') && !['localhost', '127.0.0.1'].includes(url.hostname)) {
      return new Response('Not found.', { status: 404 });
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed.', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (url.hostname === 'www.homesteadcontrol.com') {
      url.hostname = 'homesteadcontrol.com';
      return Response.redirect(url.toString(), 308);
    }
    if (aliases.has(url.pathname)) {
      url.pathname = aliases.get(url.pathname);
      return Response.redirect(url.toString(), 308);
    }
    const asset = ['/styles.css', '/theme-toggle.js'].includes(url.pathname) ||
      url.pathname.startsWith('/icons/') || url.pathname.startsWith('/social/') || url.pathname.startsWith('/homestead/screens/');
    const path = pages.get(url.pathname) || (asset ? url.pathname : null);
    if (!path) return new Response('Not found.', { status: 404 });
    const upstream = new URL(path, ORIGIN);
    upstream.search = url.search;
    // Website requests never forward visitor cookies or authorization credentials.
    return fetch(new Request(upstream, { method: request.method }));
  },
};
