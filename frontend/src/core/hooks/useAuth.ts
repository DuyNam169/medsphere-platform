import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService, LoginCredentials } from '../services/authService';

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout, setLoading, user, isAuthenticated, isLoading } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      login(response.user, response.token);
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };
};
