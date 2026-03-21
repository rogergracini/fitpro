// src/components/layout/Sidebar.jsx

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, Dumbbell, CalendarDays, 
  Menu, X, ChevronRight, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Alunos", path: "/alunos", icon: Users },
  { label: "Treinos", path: "/treinos", icon: Dumbbell },
  { label: "Agenda", path: "/agenda", icon: CalendarDays },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    localStorage.removeItem("fitpro_admin_logged");
    window.location.href = "/login"; // Redirecionamento limpo
  };

  const NavContent = () => (
    <div className="flex flex-col h-full min-h-screen">
      {/* 1. Header com Logo */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-white tracking-tight truncate">FitPro</h1>
            <p className="text-xs text-sidebar-foreground/60 truncate">Personal Trainer</p>
          </div>
        </div>
      </div>

      {/* 2. Navegação Principal (O que estava sumindo) */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent"
                }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${active ? "" : "group-hover:scale-110 transition-transform"}`} />
              <span className="truncate">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* 3. Rodapé fixo no fundo */}
      <div className="p-4 px-3 mt-auto border-t border-sidebar-border/50 space-y-2">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10 gap-3 px-4 py-3 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="font-medium">Sair do Painel</span>
        </Button>

        <div className="p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50">
          <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-widest mb-1 font-bold">FitPro v1.0</p>
          <p className="text-[9px] text-sidebar-foreground/30 uppercase">© Rogério Gracini</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão Mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card shadow-md border border-border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-[260px] min-h-screen bg-sidebar border-r border-sidebar-border sticky top-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-sidebar z-50 lg:hidden shadow-2xl border-r border-sidebar-border"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}