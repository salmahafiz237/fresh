import { getProductById } from "./api.js";
import { addItem } from "./cart.js";
import { CURRENCY } from "./config.js";
import { initNavbar } from "./navbar.js";
import {
  announce,
  createEl,
  escapeHtml,
  formatPrice,
  getQueryParam,
  on,
  qs,
} from "./utilities.js";

function injectJsonLd(product) {
  const script = createEl("script", { type: "application/ld+json" });
  script.textContent = JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: [product.image, ...product.images],
    description: product.description,
    brand: product.brandName,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: CURRENCY,
      price: product.unitPrice,
      availability:
        product.quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.ratingsQuantity
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.ratingsQuantity,
        }
      : undefined,
  });
  document.head.append(script);
}

function renderGallery(product) {
  const images = [product.image, ...product.images.filter((src) => src !== product.image)];
  const main = qs("[data-gallery-main]");
  const thumbs = qs("[data-thumbs]");
  main.innerHTML = `<img alt="${escapeHtml(product.title)}" src="${escapeHtml(images[0])}">`;

  thumbs.innerHTML = "";
  images.forEach((src, index) => {
    const button = createEl("button", {
      type: "button",
      "aria-label": `View image ${index + 1} of ${product.title}`,
      "aria-current": index === 0 ? "true" : null,
    });
    button.innerHTML = `<img src="${escapeHtml(src)}" alt="">`;
    on(button, "click", () => {
      qs("img", main).src = src;
      thumbs.querySelectorAll("button").forEach((el) => el.removeAttribute("aria-current"));
      button.setAttribute("aria-current", "true");
    });
    thumbs.append(button);
  });
}

function renderReviews(product) {
  const list = qs("[data-reviews]");
  if (!product.reviews.length) {
    list.innerHTML = `<p class="status">No reviews yet.</p>`;
    return;
  }
  list.innerHTML = product.reviews
    .map(
      (review) => `
      <article class="review">
        <header>
          <strong>${escapeHtml(review.user?.name || "Customer")}</strong>
          <span aria-label="Rated ${review.rating} out of 5">${"★".repeat(review.rating || 0)}</span>
        </header>
        <p>${escapeHtml(review.review || "")}</p>
      </article>`
    )
    .join("");
}

initNavbar();

const id = getQueryParam("id");
const root = qs("[data-product]");

if (!id) {
  root.innerHTML = `<p class="status status--error">This product link is missing an id.</p>`;
} else {
  getProductById(id)
    .then((product) => {
      document.title = `${product.title} | FreshCart`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", product.description.slice(0, 150));
      qs("[data-product-title]").textContent = product.title;
      qs("[data-product-meta]").textContent = `${product.brandName} · ${product.categoryName}`;
      qs("[data-product-rating]").textContent = `${product.rating} (${product.ratingsQuantity} reviews)`;
      qs("[data-product-stock]").textContent =
        product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock";
      const priceNode = qs("[data-product-price]");
      priceNode.innerHTML = product.salePrice
        ? `<span class="price price--sale">${escapeHtml(formatPrice(product.salePrice))}</span>
           <s class="price price--was">${escapeHtml(formatPrice(product.price))}</s>`
        : `<span class="price">${escapeHtml(formatPrice(product.price))}</span>`;
      qs("[data-product-desc]").textContent = product.description;
      renderGallery(product);
      renderReviews(product);
      injectJsonLd(product);

      const qtyInput = qs("#qty");
      on(qs("[data-qty-minus]"), "click", () => {
        qtyInput.value = String(Math.max(1, Number(qtyInput.value) - 1));
      });
      on(qs("[data-qty-plus]"), "click", () => {
        qtyInput.value = String(Number(qtyInput.value) + 1);
      });
      on(qs("[data-add]"), "click", () => {
        addItem(product, Number(qtyInput.value) || 1);
        announce(`${product.title} added to cart`);
      });
    })
    .catch(() => {
      root.innerHTML = `<p class="status status--error">We could not find this product.</p>`;
    });
}
