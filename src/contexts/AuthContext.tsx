
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (userData: any) => Promise<any>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => ({}),
  signup: async () => ({}),
  logout: () => {},
  error: null
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if the user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch the user profile from the API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await authAPI.getProfile();
      
      if (userData.error) {
        setError(userData.message);
        logout(); // Clear invalid tokens
      } else {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
      logout(); // Clear invalid tokens
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login({ email, password });
      
      if (response.error) {
        setError(response.message);
        toast({
          title: "Login Failed",
          description: response.message || "Invalid email or password",
          variant: "destructive",
        });
        return { success: false, error: response.message };
      }
      
      // Set the token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Set the user data
        setUser({
          id: response.id,
          username: response.username,
          email: response.email,
          roles: response.roles
        });
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        return { success: true };
      } else {
        setError('Invalid response from server');
        toast({
          title: "Login Failed",
          description: "Invalid response from server",
          variant: "destructive",
        });
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      setError(errorMessage);
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.signup(userData);
      
      if (response.error) {
        setError(response.message);
        toast({
          title: "Signup Failed",
          description: response.message || "Could not create account",
          variant: "destructive",
        });
        return { success: false, error: response.message };
      }
      
      // Set the token in localStorage if it's returned
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Set the user data
        setUser({
          id: response.id,
          username: response.username,
          email: response.email,
          roles: response.roles
        });
        
        toast({
          title: "Signup Successful",
          description: "Your account has been created!",
        });
        
        return { success: true };
      } else {
        // If account was created but no automatic login
        toast({
          title: "Signup Successful",
          description: "Please login with your new account",
        });
        
        return { success: true, requireLogin: true };
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
      setError(errorMessage);
      
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    authAPI.logout();
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
