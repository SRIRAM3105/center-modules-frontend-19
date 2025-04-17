
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Registration from "@/pages/Registration";
import Community from "@/pages/Community";
import ElectricityUsage from "@/pages/ElectricityUsage";
import DataCollection from "@/pages/DataCollection";
import ProviderMatching from "@/pages/ProviderMatching";
import CostSharing from "@/pages/CostSharing";
import Payment from "@/pages/Payment";
import Monitoring from "@/pages/Monitoring";
import NotFound from "@/pages/NotFound";
import ProviderDashboard from "@/pages/ProviderDashboard";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Set the document title
document.title = "Ray Unity - Community Solar Platform";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/registration" element={<Registration />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/community" element={<Community />} />
                <Route path="/electricity-usage" element={<ElectricityUsage />} />
                <Route path="/data-collection" element={<DataCollection />} />
                <Route path="/provider-matching" element={<ProviderMatching />} />
                <Route path="/cost-sharing" element={<CostSharing />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/monitoring" element={<Monitoring />} />
                <Route path="/provider-dashboard" element={<ProviderDashboard />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
