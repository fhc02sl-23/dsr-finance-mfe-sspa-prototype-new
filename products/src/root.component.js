import React, { lazy, useEffect, useState } from 'react';
import { Router, Routes, Route, Navigate } from 'react-router-dom';
import { isSignedIn$ } from '@DSR/data-utility';
import { createBrowserHistory } from "history";
import Progress from '../../container/src/components/Progress';
import { Suspense } from 'react';
const ProductList = lazy(() => import('./components/ProductList'));
const history = createBrowserHistory();

export default function Root() {
  // Router v6 erwartet eine Location → spiegeln wir aus history
  const [location, setLocation] = useState(history.location);
  const isSignedIn = isSignedIn$.getValue();

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setLocation(location);
    });

    if (performance.getEntriesByName('navigate-to-shop-start').length > 0) {
      performance.mark('navigate-to-shop-end');
      performance.measure('navigate-to-shop-duration', 'navigate-to-shop-start', 'navigate-to-shop-end');
  
      const [measure] = performance.getEntriesByName('navigate-to-shop-duration');
      console.log(`🕒 Navigation Shop (Basket → Products): ${measure.duration.toFixed(2)} ms`);
  
      performance.clearMarks('navigate-to-shop-start');
      performance.clearMarks('navigate-to-shop-end');
      performance.clearMeasures('navigate-to-shop-duration');
    }

    return () => {
      unlisten();
    };

  }, []);

  return (
    <Router location={history.location} navigator={history}>
      <Routes>
        <Route
          path="*"
          element={
            isSignedIn ? (
              <Suspense fallback={<Progress />}>
                <ProductList />
              </Suspense>
            ) : (
              <Navigate to="auth/signin" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
