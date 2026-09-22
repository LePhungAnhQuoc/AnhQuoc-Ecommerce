import { createProduct, getProducts, validateProduct } from '../../../lib/products';

export async function GET() {
  try {
    return Response.json(await getProducts());
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const validation = validateProduct(await request.json());
    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    return Response.json(await createProduct(validation.value), { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}