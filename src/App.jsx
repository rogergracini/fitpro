// src/App.jsx
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Landing from './pages/Landing';
import Login from './pages/Login'; // <--- IMPORTANTE: Importamos a nova tela
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Workouts from './pages/Workouts';
import Schedule from './pages/Schedule';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Pegamos o estado do LocalStorage que definimos na tela de Login
  const isAuthenticated = localStorage.getItem("fitpro_admin_logged") === "true";

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota Pública: Sua página de marketing */}
      <Route path="/" element={<Landing />} />

      {/* Rota de Login: Onde o administrador acessa */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Protegidas: Só acessa se estiver logado */}
      <Route 
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alunos" element={<Students />} />
        <Route path="/treinos" element={<Workouts />} />
        <Route path="/agenda" element={<Schedule />} />
      </Route>

      {/* Fallback para páginas não encontradas */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App