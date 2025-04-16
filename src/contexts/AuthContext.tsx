
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: number;
  username: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  resetPassword: (email: string) => Promise<any>;
  signup: (userData: any) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
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
          } else {
            // If profile fetch fails with error, log the user out
            logout();
          }
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
          // If profile fetch fails, we should log the user out
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (userData) => {
    try {
      console.log("Signup with user data:", userData);
      const response = await authAPI.signup(userData);
      
      if (response.error) {
        toast({
          title: "Signup failed",
          description: response.message || "There was an error creating your account. Please try again.",
          variant: "destructive",
        });
        throw new Error(response.message || "Signup failed");
      }
      
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles || ['ROLE_USER']
      });
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created!",
      });
      
      return response;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log("Login attempt with:", { username, password });
      const response = await authAPI.login({ username, password });
      
      if (response.error) {
        toast({
          title: "Login failed",
          description: response.message || "Invalid username or password. Please try again.",
          variant: "destructive",
        });
        throw new Error(response.message || "Login failed");
      }
      
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles || ['ROLE_USER']
      });
      
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
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout, 
      resetPassword,
      signup 
    }}>
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
