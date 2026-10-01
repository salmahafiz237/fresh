export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function on(element, event, handler, options) {
  if (!element) return () => {};
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export function formatPrice(amount, currency = "EGP") {
  const value = Number(amount);
  if (Number.isNaN(value)) return "";
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (val == null || val === false) return;
    if (key === "class") el.className = val;
    else if (key === "dataset") Object.assign(el.dataset, val);
    else if (key.startsWith("on") && typeof val === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (key === "text") el.textContent = val;
    else if (val === true) el.setAttribute(key, "");
    else el.setAttribute(key, String(val));
  });
  children.forEach((child) => {
    if (child == null) return;
    el.append(typeof child === "string" ? document.createTextNode(child) : child);
  });
  return el;
}

export function getQueryParam(name, search = window.location.search) {
  return new URLSearchParams(search).get(name);
}

export function debounce(fn, wait = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function announce(message, politeness = "polite") {
  let region = qs("#live-region");
  if (!region) {
    region = createEl("div", {
      id: "live-region",
      class: "sr-only",
      role: "status",
      "aria-live": politeness,
      "aria-atomic": "true",
    });
    document.body.append(region);
  }
  region.setAttribute("aria-live", politeness);
  region.textContent = "";
  window.setTimeout(() => {
    region.textContent = message;
  }, 50);
}

export function setBusy(element, isBusy) {
  if (!element) return;
  element.setAttribute("aria-busy", isBusy ? "true" : "false");
}
