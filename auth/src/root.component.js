import React, { useState, useEffect } from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

export default function Root(props) {
    const [location, setLocation] = useState(history.location);
    useEffect(() => {
      // Listen to history changes and update location state
      const unlisten = history.listen((update) => {
        setLocation(update.location);
      });
  
      return unlisten; // Clean up the listener on unmount
    }, [history]);

  return (
    <div>
      <StyledEngineProvider injectFirst>
        <Router basename='auth' location={history.location} navigator={history}>
          <Routes >
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </StyledEngineProvider>
    </div>
  );
};
