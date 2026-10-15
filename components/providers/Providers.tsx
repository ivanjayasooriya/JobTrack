'use client';

import React from 'react';
import { AuthProvider } from '@/src/context/AuthContext.tsx';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
