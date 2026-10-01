import { CART_EVENT } from "./config.js";
import { getCount } from "./cart.js";
import { debounce, on, qs } from "./utilities.js";

export function initNavbar({ onSearch } = {}) {
  const header = qs(".site-header");
  const toggle = qs("[data-menu-toggle]");
  const searchForm = qs("[data-search-form]");
  const searchInput = qs("#site-search");
  const badge = qs("[data-cart-count]");

  function renderCount() {
    const count = getCount();
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
  }

  renderCount();
  on(window, CART_EVENT, renderCount);

  on(toggle, "click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  if (searchForm && onSearch) {
    const run = debounce(() => onSearch(searchInput.value.trim()), 200);
    on(searchForm, "submit", (event) => {
      event.preventDefault();
      onSearch(searchInput.value.trim());
    });
    on(searchInput, "input", run);
  } else if (searchForm) {
    on(searchForm, "submit", (event) => {
      event.preventDefault();
      const q = searchInput.value.trim();
      window.location.href = q ? `index.html?q=${encodeURIComponent(q)}` : "index.html";
    });
  }
}
