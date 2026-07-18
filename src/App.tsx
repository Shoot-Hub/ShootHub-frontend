import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/features/auth';
import { appRoutes } from '@/routes';
import { CustomCursor } from '@/components/CustomCursor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CustomCursor />
          <Routes>{appRoutes}</Routes>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500,
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
