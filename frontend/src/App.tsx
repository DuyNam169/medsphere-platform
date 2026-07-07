import { useEffect } from 'react';
import { AppRoutes } from './routes';
import { useAuthStore } from './core/store/authStore';
import ToastContainer from './core/components/ToastContainer';

function App() {
  const hydrateUser = useAuthStore((s) => s.hydrateUser);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;