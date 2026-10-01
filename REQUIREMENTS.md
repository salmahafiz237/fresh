# FreshCart — Project Requirements

Vanilla HTML, CSS, and JavaScript e-commerce storefront. Brand: **FreshCart**.

## 1. Scope

In scope:

- Home page (`index.html`)
- Product details page (`product.html?id=`)
- Cart page (`cart.html`)
- Shared navbar, footer, and live cart badge
- Cart persistence in Local Storage

Out of scope:

- User authentication / real login
- Payment checkout
- Wishlist backend
- Server-side rendering or a build toolchain

## 2. Functional requirements

### 2.1 Navbar

- Three-row header: utility links, main bar (logo, search, account, cart), category links.
- Logo links to home.
- Cart control shows item count and links to `cart.html`.
- Search is labeled and usable with keyboard (client-side filter of featured products on home; on other pages it may navigate home with a query).
- Mobile: collapsible navigation.

### 2.2 Hero

- Paginated carousel (prev/next + dots).
- Autoplay pauses on hover, focus, and when `prefers-reduced-motion: reduce`.
- Accessible carousel semantics (`aria-roledescription`, slide labels, live announcement of the active slide).

### 2.3 Service KPIs

Four items:

1. Free Shipping
2. Secure Payments
3. Easy Returns
4. 24/7 Support

### 2.4 Categories

- Load from `GET https://ecommerce.routemisr.com/api/v1/categories`.
- Show loading, empty, and error states.

### 2.5 Featured products

- Load from `GET https://ecommerce.routemisr.com/api/v1/products`.
- Card shows image, title, rating, price, sale price when present, add-to-cart.
- Title or card primary link opens `product.html?id={id}`.
- Add to cart does not navigate away.

### 2.6 Product details

- Load from `GET https://ecommerce.routemisr.com/api/v1/products/{id}`.
- Gallery, title, brand, category, rating, stock, price, description, reviews.
- Quantity stepper and add to cart.
- Error / missing-id state.

### 2.7 Cart

- Dedicated cart page.
- Local Storage key: `freshcart.cart`.
- Shape:

```json
{
  "items": [
    {
      "id": "6428ebc6dc1175abc65ca0b9",
      "title": "Woman Shawl",
      "image": "https://…",
      "price": 149,
      "quantity": 2
    }
  ]
}
```

- Unit price is stored at add time.
- User can change quantity, remove items, and see subtotal.
- Empty state when there are no items.
- Navbar badge updates on `cart:updated`.

## 3. API contracts

### Products list

`GET https://ecommerce.routemisr.com/api/v1/products`

Response includes `results`, `metadata`, and `data[]` with `_id` / `id`, `title`, `imageCover`, `price`, `priceAfterDiscount` (optional), `ratingsAverage`, `sold`, nested `category` and `brand`.

### Product by id

`GET https://ecommerce.routemisr.com/api/v1/products/{id}`

Response includes `data` with `images`, `description`, `quantity`, `reviews[]` (`review`, `rating`, `user.name`).

### Categories

`GET https://ecommerce.routemisr.com/api/v1/categories`

Response includes `data[]` with `_id`, `name`, `image`.

## 4. Architecture (separation of concerns)

| Layer | Responsibility |
| --- | --- |
| HTML | Structure, landmarks, SEO meta |
| CSS | Presentation only |
| `js/config.js` | API base URL, storage key |
| `js/utilities.js` | Generic helpers (no product/cart rules) |
| `js/api.js` | HTTP and DTO mapping |
| `js/cart.js` | Sole writer of cart storage |
| Page scripts | Orchestration of a single page |

Pages must not call `fetch` or `localStorage` directly.

## 5. DRY and SOLID (vanilla JS)

- **DRY:** shared utilities, shared navbar/footer markup pattern, one product-card renderer.
- **S:** one module per domain.
- **O:** new pages add modules; they do not rewrite utilities.
- **I:** small exports; pages import only what they need.
- **D:** pages depend on `api` / `cart` / `utilities`, not on browser storage or HTTP primitives.

## 6. Accessibility (WCAG 2.2 AA target)

- Skip link to `#main`.
- Landmarks: `header`, `nav`, `main`, `footer`.
- One `h1` per page; logical heading order.
- Visible `:focus-visible`.
- Accessible names on icon buttons and search.
- Meaningful image `alt` text.
- Labels on quantity and search.
- `aria-live` announcements for cart add/remove and hero slide changes.
- Respect `prefers-reduced-motion`.

## 7. SEO

- Unique `<title>` and meta description per page.
- Canonical URL, Open Graph, Twitter cards.
- `lang="en"`, charset, viewport.
- Product JSON-LD on the details page.
- Descriptive link text.

## 8. Visual system

- Brand green: `#0aad0a`
- Page background: `#f8f9fa`
- Cards: white, 12–16px radius
- Wordmark: **Fresh** + green **Cart**
- Responsive: 1 column mobile, 2 tablet, 4–6 product columns desktop

## 9. Acceptance criteria

### Home

- [ ] Navbar, hero pagination, four KPIs, categories, featured products, and footer render.
- [ ] Products and categories load from the APIs (or show a usable error).
- [ ] Clicking a product opens details with the correct id.
- [ ] Add to cart updates the badge without leaving the page.

### Product

- [ ] Valid id shows gallery, details, reviews, and add to cart.
- [ ] Invalid/missing id shows an error, not a blank page.
- [ ] JSON-LD is injected for a successful product.

### Cart

- [ ] Items persist after refresh.
- [ ] Quantity and remove update storage and subtotal.
- [ ] Empty cart is explained and offers a path back to shopping.

### Quality

- [ ] Keyboard can reach search, carousel, product links, and cart actions.
- [ ] No page script talks to `fetch` or `localStorage` except through shared modules.
