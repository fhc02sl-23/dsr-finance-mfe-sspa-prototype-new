import React, { lazy, Suspense, useState, useCallback } from 'react';
import { isSignedIn$, cartItems } from '@DSR/data-utility';

import Progress from './components/Progress';
import Header from './components/Header';
import { useEffect } from 'react';
import { navigateToUrl } from 'single-spa';
import { useNavigate } from 'react-router-dom';
const LandingPage = lazy(() => import('./components/Landing'));

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  useEffect(() => {
    const subscription1 = isSignedIn$.subscribe(value => {
      setIsSignedIn(value);
    });

    const subscription2 = cartItems.subscribe(items => {
      const last = items[items.length - 1];
      if (last?.cartItemId) {
      const id = last.cartItemId;
      const startMark = performance.getEntriesByName(`cart-update-${id}-start`);
      if (startMark.length > 0) {
        performance.mark(`cart-update-${id}-end`);
        performance.measure(
          `cart-update-${id}-duration`,
          `cart-update-${id}-start`,
          `cart-update-${id}-end`
        );

        const [measure] = performance.getEntriesByName(
          `cart-update-${id}-duration`
        );
        console.log(`🕒 Cart update latency: ${measure.duration.toFixed(2)} ms`);
        
        performance.clearMarks(`cart-update-${id}-start`);
        performance.clearMarks(`cart-update-${id}-end`);
        performance.clearMeasures(`cart-update-${id}-duration`);
      }
    }
      setCartCount(items.length);
    });

    return () => {
      subscription1.unsubscribe();
      subscription2.unsubscribe();
    };
  }, []);

  const onSignOut = useCallback(() => {
    isSignedIn$.next(false);
  }, []);

  // Logout-Click (nur aktiv, wenn isSignedIn === true)
  const onClick = () => {
    if (isSignedIn) {
      onSignOut();
    }
  };

  const onBasketClick = () => {
    performance.mark('navigate-to-basket-start');
    navigateToUrl('/cart');
  };

  const onShopClick = () => {
    performance.mark('navigate-to-shop-start');
    navigateToUrl('/shop');
  };
  

  useEffect(() => {
    if(window.location.pathname === '/dashboard' && !isSignedIn$.value) {
      navigate('/');
    }
  },[window.location.pathname])

  return (
      <div>
        {/* Header erhält optional cartCount, zeigt Badge bei /cart */}
        <Header
          isSignedIn={isSignedIn}
          onClick={onClick}
          cartCount={cartCount}
          onBasketClick={onBasketClick}
          onShopClick={onShopClick}
        />
        {
          pathname === '/' && (
            <Suspense fallback={<Progress />}>
              <LandingPage />
            </Suspense>
          )
        }
      </div>
  )
}

export default App;