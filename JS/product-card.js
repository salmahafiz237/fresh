import { addItem } from "./cart.js";
import { CURRENCY } from "./config.js";
import { announce, createEl, escapeHtml, formatPrice, on } from "./utilities.js";

function stars(rating) {
  const rounded = Math.round(rating);
  const filled = "★".repeat(rounded);
  const empty = "☆".repeat(5 - rounded);
  return `${filled}${empty}`;
}

/**
 * Truncate a string to a maximum number of words.
 * @param {string} text - The input string.
 * @param {number} maxWords - Maximum number of words to keep.
 * @returns {string} - The truncated string (original if within limit).
 */
function truncateWords(text, maxWords = 20) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ");
}

export function renderProductCard(product) {
  const titleForDisplay = truncateWords(product.title, 20);
  const href = `product.html?id=${encodeURIComponent(product.id)}`;
  const priceHtml = product.salePrice
    ? `<span class="price price--sale">${escapeHtml(formatPrice(product.salePrice, CURRENCY))}</span>
       <s class="price price--was">${escapeHtml(formatPrice(product.price, CURRENCY))}</s>
`
    : `<span class="price">${escapeHtml(formatPrice(product.price, CURRENCY))}</span>`;

  const article = createEl("article", { class: "product-card" });
  article.innerHTML = `
    <a class="product-card__media" href="${href}">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(titleForDisplay)}" width="280" height="220" loading="lazy">
    </a>
    <div class="product-card__body">
      <p class="product-card__meta">${escapeHtml(product.categoryName)}</p>
      <h3 class="product-card__title">
        <a href="${href}">${escapeHtml(titleForDisplay)}</a>
      </h3>
      <p class="product-card__rating" aria-label="Rated ${product.rating} out of 5">
        <span aria-hidden="true">${stars(product.rating)}</span>
        <span>${product.rating}</span>
      </p>
      <div class="product-card__row">
        <p class="product-card__price">${priceHtml}</p>
        <button class="btn btn--icon btn--cart" type="button" aria-label="Add ${escapeHtml(titleForDisplay)} to cart">
          +
        </button>
      </div>
    </div>
  `;

  on(article.querySelector(".btn--cart"), "click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product, 1);
    announce(`${product.title} added to cart`);

    const button = event.currentTarget;
    const originalHtml = button.innerHTML;
    button.innerHTML = '✓';
    if (button.dataset.timeoutId) {
      clearTimeout(Number(button.dataset.timeoutId));
    }
    const timeoutId = setTimeout(() => {
      button.innerHTML = originalHtml;
      delete button.dataset.timeoutId;
    }, 1200);
    button.dataset.timeoutId = String(timeoutId);
  });

  return article;
}