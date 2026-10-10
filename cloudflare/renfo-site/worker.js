const SITE = "https://tylerkeegan.com";
const WEB = "https://web.renfo.app";
const PAGE_FILES = ["/styles.css", "/theme-toggle.js", "/navigation.js", "/icons/", "/social/", "/renfo/"];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith("/.well-known/") || path.startsWith("/api/")) {
      return fetch(new Request(WEB + path + url.search, request));
    }
    if (path === "/" && url.searchParams.has("festival")) {
      return Response.redirect(WEB + "/" + url.search, 301);
    }
    if (url.hostname === "www.renfo.app") {
      url.hostname = "renfo.app";
      return Response.redirect(url.toString(), 301);
    }
    if (path === "/robots.txt" || path === "/sitemap.xml") {
      return fetch(SITE + "/renfo" + path);
    }
    if (path === "/support" || path === "/support/") {
      return fetch(SITE + "/renfo/support/" + url.search);
    }
    if (path === "/privacy" || path === "/privacy/") {
      return fetch(SITE + "/renfo/privacy/" + url.search);
    }
    if (path === "/legal" || path === "/legal/") {
      return fetch(SITE + "/renfo/legal/" + url.search);
    }
    if (path === "/") {
      return fetch(SITE + "/renfo/");
    }
    if (PAGE_FILES.some((p) => path.startsWith(p))) {
      return fetch(SITE + path + url.search);
    }
    return Response.redirect(WEB + path + url.search, 301);
  },
};
