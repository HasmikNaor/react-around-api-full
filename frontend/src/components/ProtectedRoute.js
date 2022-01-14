import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

function ProtectedRoute({ component: Component, path, ...props }) {
  const component = props.loggedIn ? <Component {...props} /> : <Navigate repalace to={"/signup"} />
  return (
    <Routes>
      <Route {...props} path="*" element={component} />
    </Routes>
  );
}

export default ProtectedRoute; 