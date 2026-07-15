import { BrowserRouter, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { appRoutes } from '@/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes}
      </Routes>
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
    </BrowserRouter>
  );
}


export default App;
