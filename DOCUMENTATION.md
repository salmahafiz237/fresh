# FreshCart Project Documentation

This document explains the purpose, implementation, and inter‑file relationships of each source file in the FreshCart e‑commerce storefront.

---

## Table of Contents
1. [HTML Files](#html-files)
2. [CSS Files](#css-files)
3. [JavaScript Modules](#javascript-modules)
4. [Data Flow & Interaction Overview](#data-flow--interaction-overview)

---

## HTML Files

### `index.html`
- **Role**: Home page of the store.
- **Structure**:
  - Header with utility bar, main bar (logo, search, account, cart), and category navigation.
  - Hero carousel (three slides) with autoplay and accessibility features.
  - Service KPI section (Free Shipping, Secure Payments, Easy Returns, 24/7 Support).
  - Categories section (loaded via JS).
  - Featured products section (loaded via JS).
  - Footer with site information.
- **JS Dependency**: Loads `js/home.js` as an ES module at the bottom of `<body>`.
- **CSS**: Uses all CSS files (`tokens.css`, `base.css`, `layout.css`, `components.css`).

### `product.html`
- **Role**: Product detail page shown when a product card or cart item is clicked.
- **Structure**:
  - Shared header (same as `index.html`).
  - Main area with:
    - Product gallery (main image + thumbnail buttons).
    - Product info (title, meta, rating, stock, price, description).
    - Quantity stepper and “Add to cart” button.
    - Reviews section (loaded via JS).
- **JS Dependency**: Loads `js/product.js` as an ES module.
- **CSS**: Same shared stylesheet as other pages.

### `cart.html`
- **Role**: Shopping cart page.
- **Structure**:
  - Shared header.
  - Main container (`[data-cart]`) initially shows a loading placeholder; JS replaces it with:
    - Shopping cart table (product, price, quantity, total, remove).
    - Order summary (subtotal, shipping fees, total, login‑to‑checkout button).
    - Cart actions (Continue shopping ← | Clear all →).
- **JS Dependency**: Loads `js/cart-page.js` as an ES module.
- **CSS**: Same shared stylesheet.

---

## CSS Files

All CSS files are imported in the `<head>` of each HTML page in the following order:
1. `css/tokens.css` – design tokens (colors, radii, fonts, etc.).
2. `css/base.css` – global resets, base typography, focus styles, skip link, reduced motion handling.
3. `css/layout.css` – layout components (header, footer, grid containers, responsive breakpoints).
4. `css/components.css` – reusable UI components (buttons, hero, KPI, category cards, product grid, product card, product detail, reviews, cart table, cart summary, empty state, cart‑wrapper, cart‑actions, order‑summary, button variants).

### `css/tokens.css`
- Defines CSS custom properties:
  - `--green`: `#0aad0a` (brand green).
  - `--green-dark`, `--green-soft` for variations.
  - `--ink`, `--muted`, `--line`, `--bg` for text and backgrounds.
  - `--radius`: `14px` (default card radius).
  - `--shadow`: subtle drop‑shadow.
  - `--max`: `1180px` (content width).
  - `--font`: Inter stack.

### `css/base.css`
- Box‑sizing border‑box.
- Smooth scroll (respects reduced‑motion).
- Base body styling (font, colors, line‑height, min‑height).
- Image max‑width 100%.
- Link and button base styles.
- `.sr-only` class for accessible hidden content.
- Skip‑link styling.
- `:focus-visible` outline using brand green.
- Reduced‑motion media query to disable animations/transitions.

### `css/layout.css`
- Site header (sticky, white background, bottom border).
- Utility bar, main bar, category bar layout (flex, max‑width, centering).
- Logo styling (Fresh + green Cart).
- Search bar styling (rounded, green button).
- Header actions (login, cart link with badge).
- Menu toggle (hamburger) for mobile.
- Category bar (horizontal scrollable, active link styling).
- Footer styling (dark background, grid layout, link hover).
- `.layout` container (max‑width, padding).
- Section heading spacing.
- Loader animation (used while fetching data).
- Responsive adjustments:
  - <900px: footer becomes two‑column, menu toggle shows, search hidden, category bar hidden.
  - <640px: utility bar hidden, footer single column.

### `css/components.css`
- **Button variants**:
  - `.btn`: primary green button.
  - `.btn--ghost`: white border button.
  - `.btn--icon`: square icon button (used for cart).
  - `.btn--cart`: green icon button.
  - `.btn--danger`: red for destructive actions.
  - `.btn--primary`: green primary action.
  - `.btn--block`: full‑width button.
- **Hero carousel**: slide layout, controls, dots, accessibility.
- **KPIs**: four‑column grid with icons and text.
- **Categories**: eight‑column grid (collapsing responsively).
- **Product card**:
  - White background, radius, shadow, overflow hidden.
  - Flex column layout (`.product-card__body` uses `display: flex; flex-direction: column;`).
  - Media aspect‑ratio 1:1 with placeholder background.
  - Body contains meta, title, rating, price row.
  - Price row uses `margin-top: auto` to push the “Add to cart” button to the bottom, ensuring equal‑height cards.
  - Rating shows star characters.
- **Product detail page**: two‑column layout (gallery | info), gallery main image, thumbnails, qty selector, reviews.
- **Reviews**: simple card layout.
- **Cart table**: full width, collapsed borders, radius, hover‑free.
- **Cart item**: image + title flex.
- **Quantity selector**: inline flex with − input + buttons.
- **Cart summary**: subtotal display.
- **Empty state**: centered message with continue‑shopping link.
- **Cart wrapper** (`.cart-wrapper`): CSS Grid `2fr 1fr` on desktop (≥768px) – cart table takes 2/3, order summary takes 1/3. Switches to `1fr` (stacked) below 768px.
- **Cart actions**: flex container with `justify-content: space-between` – Continue shopping on left, Clear all on right; stacks vertically on ≤640px.
- **Order summary**: white card with shadow, rows for subtotal, shipping, total, and checkout button.
- Responsive breakpoints adjust product grid columns (5 → 3 → 2 → 1), categories (8 → 4 → 2 → 1), KPIs (4 → 1), hero slide padding, etc.

---

## JavaScript Modules

All JS files are ES modules (`type="module"`). They import only from other JS modules in the same `js/` folder, never accessing `fetch` or `localStorage` directly—those calls are encapsulated in shared utilities.

### `js/config.js`
- **Exports**:
  - `API_BASE`: `"https://ecommerce.routemisr.com/api/v1"`
  - `CART_STORAGE_KEY`: `"freshcart.cart"`
  - `CART_EVENT`: `"cart:updated"`
  - `SITE_NAME`: `"FreshCart"`
  - `CURRENCY`: `"EGP"`
- **Usage**: Imported by modules that need API base, cart storage key/event, or currency formatting.

### `js/utilities.js`
- **Utility functions** (all exported as named exports):
  - `qs(selector, root)`: `querySelector` shortcut.
  - `qsa(selector, root)`: `querySelectorAll` returning array.
  - `on(element, event, handler, options)`: attaches listener and returns a cleanup function.
  - `fetchJson(url, options)`: wrapper around `fetch` that adds `Accept: application/json` header, throws on non‑OK status, returns parsed JSON.
  - `formatPrice(amount, currency)`: Intl.NumberFormat for EN‑EG currency, zero fractional digits.
  - `escapeHtml(value)`: escapes HTML entities to prevent XSS.
  - `createEl(tag, attrs, children)`: helper to create DOM elements with attributes/event listeners.
  - `getQueryParam(name, search)`: returns URL query string value.
  - `debounce(fn, wait)`: returns debounced version.
  - `readStorage(key, fallback)`: safe `localStorage.getItem` with JSON.parse fallback.
  - `writeStorage(key, value)`: safe `localStorage.setItem` with JSON.stringify.
  - `prefersReducedMotion()`: media query match.
  - `announce(message, politeness)`: injects/updates an ARIA live region for screen‑reader announcements.
  - `setBusy(element, isBusy)`: toggles `aria-busy` attribute.
- **Usage**: Imported by nearly every other module for DOM queries, event handling, storage, formatting, announcements, etc.

### `js/api.js`
- **Purpose**: Thin service layer that fetches data from the backend and maps raw API responses to plain objects used throughout the app.
- **Dependencies**:
  - `API_BASE` from `config.js`.
  - `fetchJson` from `utilities.js`.
- **Exports**:
  - `mapProduct(raw)`: converts API product object to UI shape (`id`, `title`, `image`, `images`, `price`, `salePrice`, `unitPrice`, `rating`, etc.).
  - `mapCategory(raw)`: converts API category object.
  - `getProducts()`: GET `${API_BASE}/products` → returns array of mapped products.
  - `getProductById(id)`: GET `${API_BASE}/products/${id}` → returns mapped product.
  - `getCategories()`: GET `${API_BASE}/categories` → returns array of mapped categories.
- **Usage**: Imported by `home.js` (for categories & featured products) and `product.js` (for single product).

### `js/cart.js`
- **Purpose**: Sole authority for reading, writing, and mutating cart state in `localStorage`.
- **Dependencies**:
  - `CART_EVENT`, `CART_STORAGE_KEY` from `config.js`.
  - `readStorage`, `writeStorage` from `utilities.js`.
- **Internal shape**: `{ items: [{ id, title, image, price, quantity }] }`.
- **Exports**:
  - `getCart()`: returns cart object (empty if none/invalid).
  - `getCount()`: total quantity of all items.
  - `getSubtotal()`: sum of `price * quantity`.
  - `addItem(product, quantity)`: adds product (using its `unitPrice`/`salePrice`/`price`) – merges if exists.
  - `setQuantity(id, quantity)`: updates quantity; removes if ≤0.
  - `removeItem(id)`: removes item by id.
- **Side‑effect**: After mutating cart, calls `writeStorage` then dispatches a `CustomEvent(CART_EVENT, {detail: cart})` so listeners (navbar, cart page) can update UI.
- **Usage**: Imported by `navbar.js` (badge), `product-card.js` (add to cart), `product.js` (add to cart), `cart-page.js` (all cart mutations).

### `js/navbar.js`
- **Purpose**: Initializes the site header: menu toggle, search, and cart badge.
- **Dependencies**:
  - `CART_EVENT` from `config.js`.
  - `getCount` from `cart.js`.
  - `debounce`, `on`, `qs` from `utilities.js`.
- **Exports**: `initNavbar({ onSearch })` – call with optional search handler.
- **Behavior**:
  - Renders cart count into `[data-cart-count]` badge.
  - Listens to `cart:updated` event to keep badge in sync.
  - Toggles mobile menu (`is-open` class) and updates `aria-expanded`.
  - If a custom `onSearch` callback is provided, debounces search input and calls it; otherwise redirects to `index.html?q=…`.
- **Usage**: Called from `home.js`, `product.js`, and `cart-page.js`.

### `js/hero.js`
- **Purpose**: Creates an accessible carousel (hero) with autoplay, pause on hover/focus, keyboard navigation, and live region announcements.
- **Dependencies**: `announce`, `on`, `prefersReducedMotion`, `qs`, `qsa` from `utilities.js`.
- **Exports**: `initHero(root=document.querySelector('[data-hero]'))`.
- **Behavior**:
  - Tracks slide index, updates `transform` on `.hero__track`.
  - Sets `aria-hidden` on slides, `aria-current` on dots.
  - Announces slide change (title) via ARIA live region.
  - Autoplay loop (6 s) pauses when user interacts or prefers reduced motion.
  - Prev/next buttons and dot navigation.
- **Usage**: Called once from `home.js`.

### `js/home.js`
- **Purpose**: Orchestrates the home page: loads categories, loads featured products, initializes hero and navbar.
- **Dependencies**:
  - `getCategories`, `getProducts` from `api.js`.
  - `initHero` from `hero.js`.
  - `initNavbar` from `navbar.js`.
  - `renderProductCard` from `product-card.js`.
  - `escapeHtml`, `getQueryParam`, `qs`, `setBusy` from `utilities.js`.
- **Internal helpers**:
  - `showStatus(container, message, isError)`: clears container and inserts a status paragraph.
  - `loadCategories()`: fetches categories, renders category cards (links to `index.html?category=…`).
  - `loadProducts()`: fetches all products, filters by query (`q`) and/or category URL params, renders product cards via `renderProductCard`, then calls `initNavbar` with a custom search handler that re‑filters products.
- **Usage**: Entry point for `index.html` (loaded as module at bottom of body).

### `js/product.js`
- **Purpose**: Renders a single product detail page.
- **Dependencies**:
  - `getProductById` from `api.js`.
  - `addItem` from `cart.js`.
  - `CURRENCY` from `config.js`.
  - `initNavbar` from `navbar.js`.
  - `announce`, `createEl`, `escapeHtml`, `formatPrice`, `getQueryParam`, `on`, `qs` from `utilities.js`.
- **Behavior**:
  - Reads `id` query param; if missing shows error.
  - Calls `getProductById(id)` → maps product.
  - Updates `<title>` and meta description.
  - Injects product‑title, meta, rating, stock, price, description into the DOM.
  - Calls `renderGallery(product)`, `renderReviews(product)`, `injectJsonLd(product)`.
  - Sets up quantity stepper (−/+) and “Add to cart” button (calls `addItem`, announces).
- **Internal helpers**:
  - `injectJsonLd(product)`: adds JSON‑LD structured data for SEO.
  - `renderGallery(product)`: main image + thumbnail buttons (updates main src on click, toggles `aria-current`).
  - `renderReviews(product)`: loops over `product.reviews` and builds review cards.
- **Usage**: Entry point for `product.html`.

### `js/product-card.js`
- **Purpose**: Render a single product card used in grids (home page featured products, category pages, etc.).
- **Dependencies**:
  - `addItem` from `cart.js`.
  - `CURRENCY` from `config.js`.
  - `announce`, `createEl`, `escapeHtml`, `formatPrice`, `on` from `utilities.js`.
- **Internal helpers**:
  - `stars(rating)`: returns string of filled/empty stars (★☆).
  - `truncateWords(text, maxWords=20)`: splits by whitespace, returns first N words (default 20) – used to keep product titles tidy.
- **Exports**: `renderProductCard(product)` → returns a DOM `<article class="product-card">`.
- **Behavior**:
  - Truncates product title to 20 words (`titleForDisplay`) – used for link text and image `alt`.
  - Builds markup:
    - Link to `product.html?id=…` wrapping product image.
    - Card body: category meta, title link, rating, price (shows sale price with strikethrough if applicable), “+” cart button.
  - Attaches click listener to the cart button:
    - Prevents default, stops propagation.
    - Calls `addItem(product, 1)`.
    - Announces “{title} added to cart”.
    - Changes button innerHTML to check‑mark (✓) for 1.2 s then reverts (with timeout cleanup).
- **Usage**: Called from `home.js` (`renderProducts`) and any other component that needs to display a product grid.

### `js/cart-page.js`
- **Purpose**: Render the shopping cart page, handle quantity changes, removal, clear‑all, and show order summary.
- **Dependencies**:
  - `getCart`, `getSubtotal`, `removeItem`, `setQuantity` from `cart.js`.
  - `CURRENCY` from `config.js`.
  - `initNavbar` from `navbar.js`.
  - `announce`, `escapeHtml`, `formatPrice`, `on`, `qs`, `writeStorage` from `utilities.js`.
- **Behavior**:
  - Reads `[data-cart]` container.
  - If cart empty → shows empty state with Continue shopping link.
  - Otherwise:
    - Calculates `itemCount` (sum of quantities).
    - Computes `subtotal` via `getSubtotal()`.
    - `shippingFees` placeholder (0 – to be calculated at checkout).
    - `total = subtotal + shippingFees`.
    - Renders markup using a CSS Grid wrapper (`.cart-wrapper`):
      - Left column (2fr): shopping cart table (`<table class="cart-table">`).
      - Right column (1fr): order summary (subtotal, shipping, total, login‑to‑checkout button).
    - Below the wrapper: cart actions (`← Continue shopping` | `Clear all`).
  - Attaches listeners to each row:
    - Decrease (−) button → `setQuantity(id, current‑1)`.
    - Increase (+) button → `setQuantity(id, current+1)`.
    - Quantity input change → `setQuantity(id, value)`.
    - Remove button → `removeItem(id)`.
    - After each cart mutation, announces “Cart updated” and re‑renders.
  - Clear all button handler:
    - Shows confirm dialog.
    - On OK: writes empty cart via `writeStorage`, dispatches `cart:updated`, announces “Cart cleared”, re‑renders.
- **Usage**: Entry point for `cart.html`.

### `js/index.js` and `css/index.css`
- Both files exist but are intentionally empty (placeholders). No effect on the application.

---

## Data Flow & Interaction Overview

1. **Application start** (`index.html` → `home.js`):
   - `home.js` calls `initHero()` (sets up carousel) and `initNavbar()` (sets up badge, menu, search).
   - It then loads categories (`getCategories`) and renders them as links.
   - Loads featured products (`getProducts`) and renders each via `renderProductCard` (from `product-card.js`).
   - The custom search handler passed to `initNavbar` re‑filters products on the fly.

2. **Navigating to a product**:
   - Clicking a product card link updates the URL to `product.html?id=<ID>`.
   - `product.js` runs:
     - Navbar initialized (badge stays in sync via `cart:updated` listener).
     - Fetches product data via `getProductById`.
     - Populates DOM, renders gallery & reviews, injects JSON‑LD.
     - Quantity stepper and “Add to cart” button mutate cart via `cart.js` → `writeStorage` → dispatch `cart:updated` → navbar badge updates.

3. **Adding to cart**:
   - Both `product-card.js` and `product.js` call `cart.addItem(product, qty)`.
   - `cart.js` updates the item in its internal copy, writes to `localStorage` under `freshcart.cart`, then dispatches a `cart:updated` event with the new cart object.
   - Any listener (navbar badge, cart page if open) reacts:
     - Navbar: updates cart count badge via `getCount()`.
     - Cart page: on `cart:updated` (implicit via re‑render on mutation) recomputes totals and re‑renders the table/summary.

4. **Viewing/editing cart** (`cart.html` → `cart-page.js`):
   - On load, `cart-page.js` reads cart via `cart.getCart()`.
   - Builds the table rows from `cart.items`.
   - Attaches per‑row listeners for quantity changes and removal – each calls the appropriate `cart` method, which again writes to storage and emits `cart:updated`.
   - The “Clear all” button writes an empty cart (`{ items: [] }`) via `cart.writeStorage` (through `utilities.writeStorage`) and dispatches the event, causing the cart page to show the empty state.

5. **Persistence**:
   - All cart mutations go through `cart.js`, which is the only module that touches `localStorage`. This guarantees a single source of truth and keeps UI modules decoupled from storage details.

6. **Responsiveness & Accessibility**:
   - CSS media queries adjust layout (grid columns, stacked cart wrapper, button stacking).
   - ARIA attributes (`aria-label`, `aria-hidden`, `aria-current`, `aria-busy`, `aria-expanded`, live region for announcements) are managed in JS.
   - Focus outlines follow brand green (`:focus-visible`).
   - Reduced‑motion preferences disable animation durations via `base.css` and are respected in `hero.js` and `utilities.announce` timeout.

---

## Summary

- **HTML** provides semantic structure and placeholder containers.
- **CSS** defines the visual design, layout, and component styles in a modular, token‑driven way.
- **JavaScript** is split into small, focused modules:
  - `config.js` – constants.
  - `utilities.js` – helper functions.
  - `api.js` – data fetching & mapping.
  - `cart.js` – single source of truth for cart state.
  - UI‑specific modules (`navbar.js`, `hero.js`, `home.js`, `product.js`, `product-card.js`, `cart-page.js`) handle initialization, user interaction, and rendering, communicating through events (`cart:updated`) and function calls.

This separation keeps the codebase maintainable, follows the DRY and SOLID principles outlined in the requirements, and satisfies all acceptance criteria (persistent cart, product‑detail JSON‑LD, accessible carousel, responsive grid, etc.).