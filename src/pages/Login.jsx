// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Dumbbell, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  // Estados para o formulário
  const [email, setEmail] = useState("fatordesigner@gmail.com"); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  // Lógica de Engenharia: Validação simples para o seu MVP
  // Usuário: fatordesigner@gmail.com | Senha: ewdfh1k7
  setTimeout(() => {

  // Lógica de Validação
      if (email === "fatordesigner@gmail.com" && password === "ewdfh1k7") {
      // 1. Grava a permissão no navegador
      localStorage.setItem("fitpro_admin_logged", "true");

      // 2. Redirecionamento forçado (Garante que o App.jsx leia o novo status)
      window.location.href = "/dashboard"; 
    } else {
        setError("E-mail ou senha incorretos. Tente novamente.");
        setIsLoading(false);
      }
    }, 800); // Pequeno delay para simular processamento
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background overflow-hidden">
      <div className="grid h-full w-full lg:grid-cols-2">
        
        {/* LADO ESQUERDO: Painel de Branding (Visível apenas em Desktop) */}
        <div className="relative hidden flex-col justify-between bg-emerald-950 p-12 text-white lg:flex border-r border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Dumbbell className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FitPro</h1>
              <p className="text-xs text-emerald-400 font-medium tracking-widest uppercase">Management System</p>
            </div>
          </div>

          <div className="space-y-8 max-w-md">
            <h2 className="text-5xl font-extrabold tracking-tighter leading-[1.1]">
              Painel de Controle de <span className="text-primary">Alta Performance</span>
            </h2>
            <div className="space-y-5 text-emerald-100/80 text-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <p>Gestão Inteligente de Alunos</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <p>Dashboards em Tempo Real</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <p>Agenda de Treinos Sincronizada</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-emerald-500 font-medium">© 2026 FitPro Ecosystem</p>
            <p className="text-xs text-emerald-700">Desenvolvido por Rogério Gracini - Engenharia de Computação</p>
          </div>
          
          {/* Efeito Visual de Fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full -mr-32 -mt-32" />
        </div>

        {/* LADO DIREITO: Formulário de Login */}
        <div className="flex flex-col items-center justify-center p-6 lg:p-12 bg-slate-50/30">
          <Card className="w-full max-w-[420px] border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="space-y-2 p-10 pb-6 text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FitPro</span>
              </div>
              <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                Bem-vindo, Administrador!
              </CardTitle>
              <CardDescription className="text-base text-slate-500 font-medium">
                Por favor, acesse sua conta para continuar.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-10 pt-0">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">Nome de Usuário (E-mail)</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="exemplo@gmail.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" title="Senha" className="text-slate-700 font-semibold">Senha</Label>
                    <Link to="#" className="text-xs font-bold text-primary hover:text-emerald-700 transition-colors">Esqueceu a senha?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Sua senha de acesso" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary transition-all"
                    />

                    {/* Lógica de Exibir Senha */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-emerald-600 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isLoading ? "Acessando..." : "Entrar no Painel FitPro"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}