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
