import { deleteProduct, updateProduct, validateProduct } from '../../../../lib/products';

export async function PATCH(request, { params }) {
	try {
		const validation = validateProduct(await request.json());
		if (validation.error) {
			return Response.json({ error: validation.error }, { status: 400 });
		}

		const product = await updateProduct((await params).id, validation.value);
		if (!product) {
			return Response.json({ error: 'Product not found.' }, { status: 404 });
		}

		return Response.json(product);
	} catch (error) {
		return Response.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	try {
		const deleted = await deleteProduct((await params).id);
		if (!deleted) {
			return Response.json({ error: 'Product not found.' }, { status: 404 });
		}

		return Response.json({ success: true });
	} catch (error) {
		return Response.json({ error: error.message }, { status: 500 });
	}
}
