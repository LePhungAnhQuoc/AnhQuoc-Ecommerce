import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
        return NextResponse.json(
            { success: false, error: 'Invalid request body.' },
            { status: 400 }
        );
    }
    const items = Array.isArray(body?.items) ? body.items : [];
    const customer = body.customer;

    if (!items.length) {
      return NextResponse.json(
        { success: false, error: 'Your cart is empty.' },
        { status: 400 }
      );
    }

    const requiredFields = ['fullName', 'email', 'address', 'city', 'postalCode'];
    const missingField = requiredFields.find((field) => !String(customer[field] || '').trim());

    if (missingField) {
      return NextResponse.json(
        { success: false, error: 'Please complete your shipping information.' },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );


    const shippingFee = body.shippingFee !== undefined ? Number(body.shippingFee) : -1;
    const total = body.total !== undefined ? Number(body.total) : -1;
    const orderNumber = `AQ-${Date.now().toString().slice(-8)}`;

    if (shippingFee < 0 || total < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid shipping fee or total amount.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber,
        subtotal: Number(subtotal.toFixed(2)),
        shippingFee: Number(shippingFee.toFixed(2)),
        total: Number(total.toFixed(2)),
        items,
        customer,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong while placing your order.' },
      { status: 500 }
    );
  }
}
