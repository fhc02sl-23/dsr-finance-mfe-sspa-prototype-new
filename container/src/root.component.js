import { StyledEngineProvider } from '@mui/material';
import App from './App.js';
import { createBrowserHistory } from "history";
import { useEffect, useState } from 'react';
import { Router, Routes, Route } from "react-router-dom";
const history = createBrowserHistory();

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
    <StyledEngineProvider injectFirst>
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </Router>
    </StyledEngineProvider>
  );
}
