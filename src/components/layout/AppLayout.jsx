import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Importa a sidebar profissional que já fizemos

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* 1. Sidebar Fixa na Esquerda */}
      <Sidebar />

      {/* 2. Área de Conteúdo da Direita */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-50/50">
        <div className="container mx-auto max-w-7xl">
          {/* O Outlet é o que faz o Dashboard, Alunos, etc. aparecerem aqui! */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}