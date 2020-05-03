import React from 'react';

import { AuthProvider } from './auth';

const ContextProvider: React.FC = ({children}) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

export default ContextProvider;
