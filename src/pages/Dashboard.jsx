import React from "react";
import { api as base44 } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Users, Dumbbell, CalendarDays, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";

const goalLabels = {
  emagrecimento: "Emagrecimento",
  hipertrofia: "Hipertrofia",
  condicionamento: "Condicionamento",
  reabilitacao: "Reabilitação",
  flexibilidade: "Flexibilidade",
  outro: "Outro",
};

const statusColors = {
  agendada: "bg-accent text-accent-foreground",
  concluida: "bg-primary/10 text-primary",
  cancelada: "bg-destructive/10 text-destructive",
};

export default function Dashboard() {
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => base44.entities.Student.list(),
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => base44.entities.Workout.list(),
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => base44.entities.Session.list("-date", 50),
  });

  const activeStudents = students.filter((s) => s.status === "ativo");
  const todaySessions = sessions.filter((s) => {
    try { return isToday(parseISO(s.date)); } catch { return false; }
  });
  const upcomingSessions = sessions
    .filter((s) => s.status === "agendada")
    .slice(0, 5);

  const formatSessionDate = (dateStr) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return "Hoje";
      if (isTomorrow(date)) return "Amanhã";
      return format(date, "dd MMM", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do seu dia e atividades"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Alunos Ativos" value={activeStudents.length} icon={Users} trend={`${students.length} total`} />
        <StatCard title="Treinos Criados" value={workouts.length} icon={Dumbbell} />
        <StatCard title="Sessões Hoje" value={todaySessions.length} icon={CalendarDays} />
        <StatCard title="Total Sessões" value={sessions.length} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Sessões */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Próximas Sessões</h2>
            <Link to="/agenda" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma sessão agendada</p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold mt-0.5">{session.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{session.student_name}</p>
                    <p className="text-xs text-muted-foreground">{session.workout_name || "Treino livre"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{formatSessionDate(session.date)}</p>
                    <Badge variant="secondary" className={`text-[10px] mt-1 ${statusColors[session.status] || ""}`}>
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Alunos Recentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Alunos Recentes</h2>
            <Link to="/alunos" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {students.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhum aluno cadastrado</p>
          ) : (
            <div className="space-y-3">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {student.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{goalLabels[student.goal] || "Sem objetivo"}</p>
                  </div>
                  <Badge variant="secondary" className={student.status === "ativo" ? "bg-primary/10 text-primary" : "bg-muted"}>
                    {student.status || "ativo"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}