import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Words from "./pages/Words";
import WordDetail from "./pages/WordDetail";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./providers/AuthProvider";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner 
            position="top-right"
            theme="system"         
            richColors                     
            expand
            duration={2500}     
          />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Words />} />
              <Route path="/login" element={<Login />} />
              <Route path="/word/:term" element={<WordDetail />} />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
  
);

export default App;
