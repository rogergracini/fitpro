// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import StatCard from "@/components/shared/StatCard";
import { 
  Users, CalendarDays, Activity, CheckCircle, 
  ChevronRight, Mail, Dumbbell, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Chamadas de API sincronizadas com seu apiClient
  const { data: allStudents = [] } = useQuery({ 
    queryKey: ["students"], 
    queryFn: () => api.students.list() 
  });
  
  const { data: allSessions = [] } = useQuery({ 
    queryKey: ["sessions"], 
    queryFn: () => api.entities?.Session?.list() || [] 
  });

  const todayStr = new Date().toISOString().split('T')[0];
  
  // 1. Cálculos dos StatCards
  const totalStudents = allStudents.length;
  const activeStudents = allStudents.filter(s => s.status?.toLowerCase() === "ativo").length;
  const sessionsToday = allSessions.filter(s => s.date === todayStr).length;

  // 2. Próximas Sessões
  const nextSessions = allSessions
    .filter(s => s.date === todayStr && s.status !== "cancelada")
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3);

  // 3. Alunos Recentes (Ordenados pelo ID ou data de criação se disponível)
  const recentStudents = [...allStudents]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 3);

  return (
    <div className="p-6 space-y-8 bg-background h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bem-vindo, Rogério Gracini</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Seção 1: StatCards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Alunos" 
          value={totalStudents} 
          icon={Users} 
          trend="+2 este mês" 
        />
        <StatCard 
          title="Alunos Ativos" 
          value={activeStudents} 
          icon={Activity} 
          color="emerald" 
        />
        <StatCard 
          title="Sessões Hoje" 
          value={sessionsToday} 
          icon={CalendarDays} 
          color="sky" 
        />
        <StatCard 
          title="Concluídas (Mês)" 
          value="24" 
          icon={CheckCircle} 
          color="amber" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Próximas Sessões */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Próximas Sessões</h2>
            <Link to="/agenda">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Ver agenda completa <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {nextSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">Nenhuma sessão agendada para hoje.</p>
            ) : (
              nextSessions.map(session => (
                <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center border border-sky-200 shrink-0">
                    <Clock className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="font-semibold text-lg truncate">{session.student_name || "Aluno Independente"}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {session.time}</span>
                      <span className="flex items-center gap-1"><Dumbbell className="w-4 h-4" /> {session.workout_name || "Geral"}</span>
                    </div>
                  </div>
                  <Link to="/agenda">
                    <Button size="sm" variant="outline" className="rounded-xl">Detalhes</Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alunos Recentes */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Alunos Recentes</h2>
            <Link to="/alunos">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Ver todos <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">Nenhum aluno cadastrado.</p>
            ) : (
              recentStudents.map(student => (
                <div key={student.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200 shrink-0">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="font-semibold text-lg truncate">{student.nome || student.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${student.status?.toLowerCase() === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {student.status || 'Ativo'}
                      </span>
                      {student.email && <span className="truncate flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {student.email}</span>}
                    </div>
                  </div>
                  <Link to="/alunos">
                    <Button size="sm" variant="outline" className="rounded-xl">Perfil</Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}