import React, { useState, useEffect } from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

import Pricing from './components/Pricing';

export default function Root(props) {
  return (
    <StyledEngineProvider injectFirst>
      <Router basename='' location={history.location} navigator={history}>
        <Routes>
          <Route path="*" element={<Pricing />} />
        </Routes>
      </Router>
    </StyledEngineProvider>
  )
}
