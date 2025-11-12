import { StyledEngineProvider } from '@mui/material';
import { createBrowserHistory } from "history";
import { Suspense } from 'react';
import { useEffect, useState, lazy } from 'react';
import { Router, Routes, Route, Navigate } from "react-router-dom";
import Progress from '../../container/src/components/Progress';
import {cartItems, removeFromCart, clearCart, isSignedIn$} from "@DSR/data-utility";

const BasketList = lazy(() => import('./components/BasketList'));
const history = createBrowserHistory();

export default function Root(props) {

  const [location, setLocation] = useState(history.location);
  const [localCartItems, setLocalCartItems] = useState([]);
  const isSignedIn = isSignedIn$.getValue();

  useEffect(() => {
    const subscription = cartItems.subscribe((items) => {
      setLocalCartItems(items);
    });

    return () => subscription.unsubscribe();
  },[])
  useEffect(() => {
    // Listen to history changes and update location state
    const unlisten = history.listen((update) => {
      setLocation(update.location);
    });

    return unlisten; // Clean up the listener on unmount
  }, [history]);

  
  return (
    <StyledEngineProvider injectFirst>
      <Router history={history} location={history.location} navigator={history}>
        <Routes>
          <Route path="*" element={
            isSignedIn ? (
              <Suspense fallback={<Progress />}>
                <BasketList items={localCartItems} onRemove={removeFromCart} onClear={clearCart} />
              </Suspense>
            ) : (
              <Navigate to="auth/signin" replace />
            )
            } 
          />
        </Routes>
      </Router>
    </StyledEngineProvider>
  );
}
