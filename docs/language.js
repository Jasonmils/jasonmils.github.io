(() => {
  "use strict";
  // Keep shared assets rooted at the site directory even after URL changes.
  const root = new URL(".", document.currentScript.src);
  document.querySelector("base").href = root.href;
  const fromPath = () => {
    const suffix = location.pathname.slice(root.pathname.length);
    if (/^EN(?:\/index\.html)?\/?$/i.test(suffix)) return "en";
    if (/^CN(?:\/index\.html)?\/?$/i.test(suffix)) return "zh";
    return null;
  };
  const syncLinks = () => {
    document.querySelectorAll('a[href^="#"], a[data-language-hash]').forEach(link => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) link.dataset.languageHash = href;
      link.setAttribute("href", location.pathname + location.search + link.dataset.languageHash);
    });
  };
  window.portfolioLanguage = {
    fromPath,
    pathnameFor: lang => root.pathname + (lang === "en" ? "EN/" : "CN/"),
    syncLinks
  };
  let lang = fromPath();
  if (!lang) {
    try { lang = localStorage.getItem("jason-portfolio-language"); } catch (_) {}
  }
  lang = lang === "en" ? "en" : "zh";
  document.documentElement.className = "lang-" + lang;
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  if (fromPath()) {
    try { localStorage.setItem("jason-portfolio-language", lang); } catch (_) {}
  }
})();
