
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  resetPassword: (email: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch user data when we have a token
      authAPI.getProfile()
        .then(userData => {
          if (!userData.error) {
            setUser(userData);
          }
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
          // If profile fetch fails, we should log the user out
          logout();
        });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.error) {
        toast({
          title: "Login failed",
          description: response.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        throw new Error(response.message || "Login failed");
      }
      
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      setUser(response);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await authAPI.resetPassword(email);
      
      if (response.error) {
        toast({
          title: "Password reset failed",
          description: response.message || "Could not send password reset email. Please try again.",
          variant: "destructive",
        });
        throw new Error(response.message || "Password reset failed");
      }
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      return response;
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
