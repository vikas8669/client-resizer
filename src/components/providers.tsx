'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering theme provider on client
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem={true}
        disableTransitionOnChange
      >
        {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
