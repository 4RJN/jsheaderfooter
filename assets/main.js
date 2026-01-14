// Demo: Header/Footer per JS "include" laden.
// Alle Container mit [data-include] werden mit dem HTML aus der URL befüllt.

async function loadInclude(el) {
  const url = el.getAttribute("data-include");
  if (!url) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    console.error("Include failed:", err);
    el.innerHTML = `
      <div class="include-error">
        Include konnte nicht geladen werden: <code>${url}</code><br/>
        Tipp: Starte die Seite über einen lokalen Server (nicht direkt via file://).
      </div>
    `;
  }
}

function setActiveNav() {
  // Markiert den aktuellen Menüpunkt.
  // Wir vergleichen den "pathname" mit href, tolerant gegenüber "index.html".
  const current = (location.pathname || "/").replace(/\/index\.html$/, "/");
  const links = document.querySelectorAll("a.nav-link[href]");

  links.forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    const normalized = href.replace(/\/index\.html$/, "/");
    const isActive = normalized === current || (current === "/" && normalized === "/");

    a.classList.toggle("is-active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function setFooterYear() {
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
}

async function init() {
  const includeTargets = document.querySelectorAll("[data-include]");
  // Erst Includes laden, dann Active Nav setzen (weil Nav erst danach im DOM ist)
  for (const el of includeTargets) {
    // eslint-disable-next-line no-await-in-loop
    await loadInclude(el);
  }
  setActiveNav();
  setFooterYear();
}

document.addEventListener("DOMContentLoaded", init);
