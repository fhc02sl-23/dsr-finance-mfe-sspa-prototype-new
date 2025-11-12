// Anything exported from this file is importable by other in-browser modules.
import {BehaviorSubject} from 'rxjs';
export function publicApiFunction() {}

export const isSignedIn$ = new BehaviorSubject(false);

export const cartItems = new BehaviorSubject([]); // Example cart items observable

export const getCartItems = () => cartItems.asObservable();

const genCartItemId = () =>
  (globalThis.crypto?.randomUUID?.()    // moderne Browser
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`);

export const addToCart = (item) => {
  console.log("Adding Current Item",item);
  const currentItems = cartItems.getValue();
  const id = genCartItemId();
   performance.mark(`cart-update-${id}-start`);
  cartItems.next([...currentItems, {...item, cartItemId: id}]);
};

export const removeFromCart = (itemId) => {
  const currentItems = cartItems.getValue();
  cartItems.next(currentItems.filter(item => item.cartItemId !== itemId));
};

export const clearCart = () => {
  cartItems.next([]);
}