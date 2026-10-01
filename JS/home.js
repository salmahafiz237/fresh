import { getCategories, getProducts } from "./api.js";
import { initHero } from "./hero.js";
import { initNavbar } from "./navbar.js";
import { renderProductCard } from "./product-card.js";
import { escapeHtml, getQueryParam, qs, setBusy } from "./utilities.js";

function showStatus(container, message, isError = false) {
  container.innerHTML = "";
  const p = document.createElement("p");
  p.className = isError ? "status status--error" : "status";
  p.textContent = message;
  container.append(p);
}

async function loadCategories() {
  const root = qs("[data-categories]");
  setBusy(root, true);
  try {
    const categories = await getCategories();
    if (!categories.length) {
      showStatus(root, "No categories are available right now.");
      return;
    }
    root.innerHTML = "";
    categories.forEach((category) => {
      const card = document.createElement("a");
      card.className = "category-card";
      card.href = `index.html?category=${encodeURIComponent(category.name)}`;
      card.innerHTML = `
        <img src="${escapeHtml(category.image)}" alt="" width="64" height="64">
        <span>${escapeHtml(category.name)}</span>
      `;
      root.append(card);
    });
  } catch {
    showStatus(root, "Could not load categories. Try again later.", true);
  } finally {
    setBusy(root, false);
  }
}

function renderProducts(container, products) {
  container.innerHTML = "";
  if (!products.length) {
    showStatus(container, "No products match your search.");
    return;
  }
  products.forEach((product) => container.append(renderProductCard(product)));
}

async function loadProducts() {
  const root = qs("[data-products]");
  const query = (getQueryParam("q") || "").toLowerCase();
  const category = (getQueryParam("category") || "").toLowerCase();
  setBusy(root, true);

  try {
    const products = await getProducts();
    const applyFilter = (term) => {
      const needle = (term || "").toLowerCase();
      return products.filter((product) => {
        const haystack = `${product.title} ${product.categoryName} ${product.brandName}`.toLowerCase();
        const matchesQuery = !needle || haystack.includes(needle);
        const matchesCategory = !category || product.categoryName.toLowerCase() === category;
        return matchesQuery && matchesCategory;
      });
    };

    renderProducts(root, applyFilter(query));
    initNavbar({
      onSearch: (term) => renderProducts(root, applyFilter(term)),
    });

    const searchInput = qs("#site-search");
    if (searchInput && query) searchInput.value = query;
  } catch {
    showStatus(root, "Could not load products. Try again later.", true);
    initNavbar();
  } finally {
    setBusy(root, false);
  }
}

initHero();
loadCategories();
loadProducts();
