async function loadInclude(el) {
  const raw = el.getAttribute("data-include");
  if (!raw) return;

  // Wichtig: durch <base> werden relative URLs korrekt aufgelöst
  const url = new URL(raw, document.baseURI).toString();

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error("Include failed:", err);
    el.innerHTML = `
      <div class="include-error">
        Include konnte nicht geladen werden: <code>${raw}</code><br/>
        (Aufgelöst zu: <code>${url}</code>)
      </div>
    `;
  }
}

function setActiveNav() {
  const current = location.pathname.replace(/\/index\.html$/, "/");
  const links = document.querySelectorAll("a.nav-link[href]");

  links.forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    const target = new URL(href, document.baseURI);
    const targetPath = target.pathname.replace(/\/index\.html$/, "/");

    const isActive = targetPath === current || (current.endsWith("/") && targetPath === current);
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
  for (const el of includeTargets) {
    // eslint-disable-next-line no-await-in-loop
    await loadInclude(el);
  }
  setActiveNav();
  setFooterYear();
}

document.addEventListener("DOMContentLoaded", init);
