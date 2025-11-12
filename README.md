
# dsr-finance-mfe

This repository is a microfrontend (MFE) workspace for a finance application, orchestrated using [single-spa](https://single-spa.js.org/) and [webpack module federation](https://webpack.js.org/concepts/module-federation/) for legacy MFEs. Each subfolder is a standalone SPA or shell, integrated via single-spa layout and import maps.

## How to run the project
- Make sure you are in the root folder of the project
- Type `npm install` to install all the libraries and dependencies.
- Type `npm run start` to run all the projects concurrently. (Wait for some time to load all the projects)
- You can also type `npm run start` to run each project in its respective folder

## Architecture Overview

### Microfrontends (MFEs)
- Each folder (`auth`, `products`, `marketing`, `dashboard`, `container`, `basket`, `data-utility`, `root-config`) is a separate SPA, built and run independently.
- MFEs are integrated at runtime using single-spa, which mounts/unmounts apps based on the route layout defined in `root-config/src/microfrontend-layout.html`.


### root-config
- Used command create-single-spa -> Root Config
- The entrypoint for the workspace. Handles layout, import maps, and shared state.
- Registers all MFEs and handles them at single port.
- `DSR` used as organization name to register all MFE under a common name.
- See `root-config/src/DSR-root-config.js` for registration and store logic.

### container
- Used command create-single-spa -> Application/Parcel -> React
- Always mounted. Provides the global header, navigation, and manages cross-MFE state (auth, cart).
- Reads and updates shared state via the store passed from root-config or via RxJS observables from `data-utility`.
- See `container/src/root.component.js` and `container/src/components/Header.js`.

### data-utility
- Used command create-single-spa -> Data Utility
- Provides shared RxJS observables for state (`isSignedIn$`, `cartItems`) and API functions (`addToCart`, `removeFromCart`, `clearCart`).
- Used by all MFEs for cross-app state management.
- See `data-utility/src/DSR-data-utility.js`.

### dashboard
- Used command create-single-spa -> Application/Parcel -> Vue
- Built with Vue and integrated via single-spa-vue.
- See `dashboard/src/App.vue` and `dashboard/src/main.js`.

### basket
- Used command create-single-spa -> Application/Parcel -> React
- React MFE for managing/viewing cart items.
- Uses shared state from `data-utility`.

### products, auth, marketing
- Used command create-single-spa -> Application/Parcel -> React
- React MFEs for product listing, authentication, and marketing(Pricing) pages.
- Use shared state and routing conventions.

## Data Sharing & State Management

- **Shared State:**
  - Implemented in `data-utility/src/DSR-data-utility.js` using RxJS `BehaviorSubject`.
  - State includes `isSignedIn$` (auth status) and `cartItems` (array of products with unique `cartItemId`).
  - API functions: `addToCart(item)`, `removeFromCart(itemId)`, `clearCart()`.
  - MFEs subscribe to these observables and call API functions for cross-app state changes.

#### Example: Using Shared State in an MFE
```js
import { isSignedIn$, cartItems, addToCart, removeFromCart, clearCart } from '@DSR/data-utility';

// Subscribe to state
useEffect(() => {
  const sub = cartItems.subscribe(items => setCartCount(items.length));
  return () => sub.unsubscribe();
}, []);

// Add to cart
addToCart(product);
```

## Routing & Integration

- **Route Layout:**
  - Defined in `root-config/src/microfrontend-layout.html`.
  - Example routes:
    - `/auth` → Auth MFE
    - `/basket` → Basket MFE
    - `/container` → Navbar and Home Page MFE
    - `/dashboard` → Dashboard MFE (Vue)
    - `/data-utility` → Utility Application to serve as data container
    - `/products` or `/shop` → Products MFE
    - `/marketing` or `/pricing` → Marketing MFE
    - Container shell is always mounted for header/state.

- **Import Maps:**
  - Defined in `root-config/src/index.ejs` for local development.
  - Each MFE runs on its own port; update URLs in the import map to match running servers.

## Key Files & Directories

- `root-config/src/DSR-root-config.js`: App registration, layout, import maps
- `root-config/src/microfrontend-layout.html`: Route layout
- `container/src/root.component.js`: Container shell, header, routing, state wiring
- `container/src/components/Header.js`: Navigation and auth/cart UI
- `auth/src/root.component.js`, `products/src/root.component.js`, `basket/src/root.component.js`: Example MFEs using shared state
- `data-utility/src/DSR-data-utility.js`: RxJS shared state and API
- `dashboard/src/App.vue`, `dashboard/src/main.js`: Vue dashboard MFE

## Example: Passing Shared State
```js
// In data-utility/src/DSR-data-utility.js
export const isSignedIn$ = new BehaviorSubject(false);
export const cartItems = new BehaviorSubject([]);
export const addToCart = (item) => { ... };
```

## Example: Consuming Shared State in an MFE
```js
import { isSignedIn$, cartItems, addToCart } from '@DSR/data-utility';
addToCart(product);
cartItems.subscribe(items => ...);
```

## External Dependencies
- React 19.x (see import map and package.json)
- Vue 3.x (dashboard)
- single-spa, single-spa-react, single-spa-vue
- RxJS (shared state)
- Jest (testing)
- MUI (Material UI for components)

