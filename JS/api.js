import { API_BASE } from "./config.js";
import { fetchJson } from "./utilities.js";

function unitPrice(product) {
  return product.priceAfterDiscount ?? product.price;
}

export function mapProduct(product) {
  return {
    id: product.id || product._id,
    title: product.title,
    slug: product.slug,
    description: product.description || "",
    image: product.imageCover,
    images: product.images || [],
    price: product.price,
    salePrice: product.priceAfterDiscount ?? null,
    unitPrice: unitPrice(product),
    rating: product.ratingsAverage ?? 0,
    ratingsQuantity: product.ratingsQuantity ?? 0,
    sold: product.sold ?? 0,
    quantity: product.quantity ?? 0,
    categoryName: product.category?.name || "",
    categoryId: product.category?._id || "",
    brandName: product.brand?.name || "",
    brandImage: product.brand?.image || "",
    reviews: product.reviews || [],
  };
}

export function mapCategory(category) {
  return {
    id: category._id || category.id,
    name: category.name,
    image: category.image,
    slug: category.slug,
  };
}

export async function getProducts() {
  const payload = await fetchJson(`${API_BASE}/products`);
  return (payload.data || []).map(mapProduct);
}

export async function getProductById(id) {
  const payload = await fetchJson(`${API_BASE}/products/${id}`);
  return mapProduct(payload.data);
}

export async function getCategories() {
  const payload = await fetchJson(`${API_BASE}/categories`);
  return (payload.data || []).map(mapCategory);
}
