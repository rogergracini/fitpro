// src/pages/Dashboard.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api as base44 } from "@/api/apiClient";
import StatCard from "@/components/shared/StatCard";
import { Users, Calendar, Activity, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { data: allStudents = [] } = useQuery({ queryKey: ["students"], queryFn: api.entities.Student.list });
  const { data: allSessions = [] } = useQuery({ queryKey: ["sessions"], queryFn: api.entities.Session.list });
  
  const totalStudents = allStudents.length;
  
  // Lógica de Engenharia: Processamento de dados para o Dashboard
  const activeStudents = allStudents.filter(s => s.status === "ativo").length;
  const todaySessions = allSessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, Rogério</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Alunos" value={students.length} icon={<Users className="w-4 h-4" />} description="+2 desde o último mês" />
        <StatCard title="Alunos Ativos" value={activeStudents} icon={<Activity className="w-4 h-4" />} />
        <StatCard title="Sessões Hoje" value={sessionsToday} icon={<Calendar className="w-4 h-4" />} />
        <StatCard title="Concluídas (Mês)" value="24" icon={<CheckCircle className="w-4 h-4" />} />
      </div>

      {/* Aqui você pode inserir componentes de Gráficos (Recharts) usando os dados processados */}
    </div>
  );
}