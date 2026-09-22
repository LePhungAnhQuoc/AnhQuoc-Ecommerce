const PRODUCTS_URL = 'https://dummyjson.com/products?limit=100';

let products = null;
let nextProductId = 101;

export function validateProduct(body) {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const category = typeof body?.category === 'string' ? body.category.trim() : '';
  const brand = typeof body?.brand === 'string' ? body.brand.trim() : '';
  const thumbnail = typeof body?.thumbnail === 'string' ? body.thumbnail.trim() : '';
  const price = Number(body?.price);
  const stock = Number(body?.stock);

  if (!title || !description || !category || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    return {
      error: 'Please complete all required fields and enter a valid stock quantity.'
    };
  }

  return { value: { title, description, category, brand, thumbnail, price, stock } };
}

async function loadProducts() {
  if (products) {
    return products;
  }

  const response = await fetch(PRODUCTS_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Unable to load products');
  }

  const data = await response.json();
  products = Array.isArray(data.products) ? data.products : [];
  nextProductId = products.reduce((maxId, product) => Math.max(maxId, Number(product.id) || 0), 100) + 1;
  return products;
}

export async function getProducts() {
  return loadProducts();
}

export async function getProduct(id) {
  const catalog = await loadProducts();
  return catalog.find((product) => String(product.id) === String(id)) || null;
}

export async function createProduct(input) {
  const catalog = await loadProducts();
  const product = {
    id: nextProductId++,
    title: input.title,
    description: input.description,
    category: input.category,
    price: input.price,
    stock: input.stock,
    brand: input.brand,
    thumbnail: input.thumbnail,
    images: [input.thumbnail],
    rating: 0,
    discountPercentage: 0,
    reviews: [],
  };

  catalog.unshift(product);
  return product;
}

export async function updateProduct(id, input) {
  const catalog = await loadProducts();
  const index = catalog.findIndex((product) => String(product.id) === String(id));

  if (index === -1) {
    return null;
  }

  catalog[index] = { ...catalog[index], ...input, images: [input.thumbnail || catalog[index].thumbnail] };
  return catalog[index];
}

export async function deleteProduct(id) {
  const catalog = await loadProducts();
  const index = catalog.findIndex((product) => String(product.id) === String(id));

  if (index === -1) {
    return false;
  }

  catalog.splice(index, 1);
  return true;
}
