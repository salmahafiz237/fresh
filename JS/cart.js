import { CART_EVENT, CART_STORAGE_KEY } from "./config.js";
import { readStorage, writeStorage } from "./utilities.js";

function emptyCart() {
  return { items: [] };
}

export function getCart() {
  const stored = readStorage(CART_STORAGE_KEY, emptyCart());
  if (!stored || !Array.isArray(stored.items)) return emptyCart();
  return stored;
}

function saveCart(cart) {
  writeStorage(CART_STORAGE_KEY, cart);
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: cart }));
}

export function getCount() {
  return getCart().items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getSubtotal() {
  return getCart().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function addItem(product, quantity = 1) {
  const qty = Math.max(1, Number(quantity) || 1);
  const cart = getCart();
  const existing = cart.items.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.unitPrice ?? product.salePrice ?? product.price,
      quantity: qty,
    });
  }

  saveCart(cart);
  return cart;
}

export function setQuantity(id, quantity) {
  const cart = getCart();
  const item = cart.items.find((entry) => entry.id === id);
  if (!item) return cart;

  const next = Math.max(0, Number(quantity) || 0);
  if (next === 0) {
    cart.items = cart.items.filter((entry) => entry.id !== id);
  } else {
    item.quantity = next;
  }

  saveCart(cart);
  return cart;
}

export function removeItem(id) {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.id !== id);
  saveCart(cart);
  return cart;
}
