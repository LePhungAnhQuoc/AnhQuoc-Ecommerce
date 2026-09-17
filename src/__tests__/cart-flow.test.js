import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import Home from '../app/page';
import { CartProvider, useCart } from '../context/CartContext';

jest.mock('../context/CartContext', () => {
  const actual = jest.requireActual('../context/CartContext');
  return {
    ...actual,
    useCart: jest.fn(),
  };
});

describe('CartProvider Unit Tests', () => {
  it('adds a new product to the cart with quantity 1', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 1, title: 'Laptop', price: 999 });
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toMatchObject({
      id: 1,
      title: 'Laptop',
      price: 999,
      quantity: 1,
    });
  });

  it('increases quantity when the same product is added again', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 2, title: 'Mouse', price: 25 });
      result.current.addToCart({ id: 2, title: 'Mouse', price: 25 });
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('removes a product from the cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 3, title: 'Keyboard', price: 60 });
      result.current.removeFromCart(3);
    });

    expect(result.current.cart).toEqual([]);
  });

  it('clears the cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 4, title: 'Monitor', price: 300 });
      result.current.clearCart();
    });

    expect(result.current.cart).toEqual([]);
  });
});

describe('Home Component Test', () => {
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    mockAddToCart.mockClear();
    useCart.mockReturnValue({ addToCart: mockAddToCart });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 101, title: 'Gaming Laptop', price: 1499, description: 'Powerful device' },
        { id: 102, title: 'Mechanical Keyboard', price: 120, description: 'Fast typing' },
      ],
    });
  });

  it('loads and renders product cards from the API', async () => {
    render(<Home />);

    expect(screen.getByText(/Loading Store/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
      expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
    });
  });

  it('calls addToCart when the user clicks Add to Cart', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: /Add to Cart/i })[0]);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 101,
        title: 'Gaming Laptop',
        price: 1499,
      })
    );
  });
});
