(() => {
  "use strict";
  const key = "jason-portfolio-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const isTheme = value => value === "light" || value === "dark";
  let preference = null;
  try { preference = localStorage.getItem(key); } catch (_) {}
  if (!isTheme(preference)) preference = null;

  function syncControls() {
    const english = document.documentElement.lang === "en";
    document.querySelectorAll(".theme-switch").forEach(group => {
      group.setAttribute("aria-label",english ? "Color theme" : "颜色主题");
    });
    document.querySelectorAll("[data-theme-choice]").forEach(button => {
      const dark = button.dataset.themeChoice === "dark";
      const label = english ? (dark ? "Dark theme" : "Light theme") : (dark ? "深色主题" : "浅色主题");
      button.setAttribute("aria-pressed",String(button.dataset.themeChoice === document.documentElement.dataset.theme));
      button.setAttribute("aria-label",label);
      button.title = label;
    });
  }
  function apply(theme) {
    const dark = theme === "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",dark ? "#08090d" : "#f8fafc");
    syncControls();
  }
  window.portfolioTheme = {
    set(theme) {
      if (!isTheme(theme)) return;
      preference = theme;
      try { localStorage.setItem(key,theme); } catch (_) {}
      apply(theme);
    },
    syncControls
  };
  // Run before the stylesheet to avoid a light flash on a saved dark theme.
  apply(preference || (systemTheme.matches ? "dark" : "light"));
  systemTheme.addEventListener("change",event => {
    if (!preference) apply(event.matches ? "dark" : "light");
  });
  window.addEventListener("storage",event => {
    if (event.key !== key && event.key !== null) return;
    preference = isTheme(event.newValue) ? event.newValue : null;
    apply(preference || (systemTheme.matches ? "dark" : "light"));
  });
})();
