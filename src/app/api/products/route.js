export async function GET() {
  try {
    const response = await fetch('https://dummyjson.com/products', {
      headers: {
        'Content-Type': 'application/json',
      },  
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch data from external provider' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the array directly from data.products
    return Response.json(data.products || []);
  } catch (error) {
    return Response.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}