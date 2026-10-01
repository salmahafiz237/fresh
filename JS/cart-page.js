import { getCart, getSubtotal, removeItem, setQuantity } from "./cart.js";
import { CURRENCY } from "./config.js";
import { initNavbar } from "./navbar.js";
import { announce, escapeHtml, formatPrice, on, qs, writeStorage } from "./utilities.js";

function render() {
  const root = qs("[data-cart]");
  const cart = getCart();

  if (!cart.items.length) {
    root.innerHTML = `
      <div class="empty">
        <h1>Your cart is empty</h1>
        <p>Browse featured products and add items to save them on this device.</p>
        <p><a class="btn" href="index.html">Continue shopping</a></p>
      </div>`;
    return;
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal();
  const shippingFees = 0; // Calculated at checkout - placeholder for now
  const total = subtotal + shippingFees;

  root.innerHTML = `
    <h1>Shopping cart</h1>
    <div class="cart-wrapper">
      <!-- Shopping Cart Table -->
      <div class="cart-table-column">
        <table class="cart-table">
          <caption class="sr-only">Items in your cart</caption>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col"><span class="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            ${cart.items
              .map(
                (item) => `
              <tr data-id="${escapeHtml(item.id)}">
                <td>
                  <div class="cart-item">
                    <img src="${escapeHtml(item.image)}" alt="">
                    <a href="product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a>
                  </div>
                </td>
                <td>${escapeHtml(formatPrice(item.price, CURRENCY))}</td>
                <td>
                  <div class="qty">
                    <button type="button" data-dec aria-label="Decrease quantity of ${escapeHtml(item.title)}">−</button>
                    <input type="number" min="1" value="${item.quantity}" aria-label="Quantity for ${escapeHtml(item.title)}">
                    <button type="button" data-inc aria-label="Increase quantity of ${escapeHtml(item.title)}">+</button>
                  </div>
                </td>
                <td>${escapeHtml(formatPrice(item.price * item.quantity, CURRENCY))}</td>
                <td>
                  <button class="btn btn--ghost" type="button" data-remove>Remove</button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <!-- Order Summary -->
      <div class="order-summary-column">
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal (${itemCount} items):</span>
            <span>${escapeHtml(formatPrice(subtotal, CURRENCY))}</span>
          </div>
          <div class="summary-row">
            <span>Shipping fees:</span>
            <span>${escapeHtml(formatPrice(shippingFees, CURRENCY))}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${escapeHtml(formatPrice(total, CURRENCY))}</span>
          </div>
          <a href="checkout.html" class="btn btn--primary btn--block">Login to checkout</a>
        </div>
      </div>
    </div>

    <!-- Cart Actions -->
    <div class="cart-actions">
      <a href="index.html" class="btn btn--ghost">← Continue shopping</a>
      <button class="btn btn--danger" id="clear-all">Clear all</button>
    </div>
  `;

  root.querySelectorAll("tr[data-id]").forEach((row) => {
    const id = row.dataset.id;
    const input = row.querySelector("input");
    on(row.querySelector("[data-dec]"), "click", () => {
      setQuantity(id, Number(input.value) - 1);
      announce("Cart updated");
      render();
    });
    on(row.querySelector("[data-inc]"), "click", () => {
      setQuantity(id, Number(input.value) + 1);
      announce("Cart updated");
      render();
    });
    on(input, "change", () => {
      setQuantity(id, Number(input.value));
      announce("Cart updated");
      render();
    });
    on(row.querySelector("[data-remove]"), "click", () => {
      removeItem(id);
      announce("Item removed from cart");
      render();
    });
  });

  // Clear all button handler
  const clearAllBtn = qs("#clear-all");
  if (clearAllBtn) {
    on(clearAllBtn, "click", () => {
      if (confirm("Are you sure you want to clear all items from your cart?")) {
        const emptyCart = { items: [] };
        writeStorage(CART_STORAGE_KEY, emptyCart);
        window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: emptyCart }));
        announce("Cart cleared");
        render();
      }
    });
  }
}

initNavbar();
render();
