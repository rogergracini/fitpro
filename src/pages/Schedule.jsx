import React, { useState } from "react";
import { api as base44 } from "@/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Plus, Trash2, Pencil, Clock, User, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format, parseISO, isToday, isTomorrow, isPast, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import SessionForm from "@/components/schedule/SessionForm";

const statusConfig = {
  agendada: { label: "Agendada", class: "bg-accent text-accent-foreground", icon: Clock },
  concluida: { label: "Concluída", class: "bg-primary/10 text-primary", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", class: "bg-destructive/10 text-destructive", icon: XCircle },
  remarcada: { label: "Remarcada", class: "bg-muted text-muted-foreground", icon: AlertCircle },
};

export default function Schedule() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("todas");
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => base44.entities.Session.list("-date"),
  });

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => base44.entities.Student.list(),
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => base44.entities.Workout.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Session.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["sessions"] }); setFormOpen(false); },
  });

  const updateMutation = useMutation({
    //mutationFn: ({ id, data }) => base44.entities.Session.update(id, data),
    mutationFn: (variables) => base44.entities.Session.update(variables.id, variables.data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["sessions"] }); setFormOpen(false); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Session.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });

  const handleSave = async (data) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const filtered = sessions.filter((s) => {
    if (filter === "todas") return true;
    if (filter === "hoje") { try { return isToday(parseISO(s.date)); } catch { return false; } }
    if (filter === "proximas") { 
      try { return !isPast(startOfDay(parseISO(s.date))) || isToday(parseISO(s.date)); } catch { return false; }
    }
    return s.status === filter;
  });

  const groupByDate = (list) => {
    const groups = {};
    list.forEach((s) => {
      const key = s.date || "sem-data";
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  };

  const formatDateLabel = (dateStr) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return "Hoje";
      if (isTomorrow(date)) return "Amanhã";
      return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  const grouped = groupByDate(filtered);

  return (
    <div>
      <PageHeader title="Agenda" subtitle={`${sessions.length} sessões registradas`}>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Sessão
        </Button>
      </PageHeader>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="proximas">Próximas</TabsTrigger>
          <TabsTrigger value="concluida">Concluídas</TabsTrigger>
          <TabsTrigger value="cancelada">Canceladas</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <Card key={i} className="h-20 animate-pulse bg-muted" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhuma sessão encontrada"
          description="Agende a primeira sessão com seu aluno"
          actionLabel="Agendar Sessão"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, dateSessions]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 first-letter:uppercase">
                {formatDateLabel(date)}
              </h3>
              <div className="space-y-3">
                {dateSessions.sort((a, b) => (a.time || "").localeCompare(b.time || "")).map((session) => {
                  const config = statusConfig[session.status] || statusConfig.agendada;
                  const StatusIcon = config.icon;
                  return (
                    <Card key={session.id} className="p-4 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-primary mt-0.5">{session.time}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <p className="font-medium text-sm truncate">{session.student_name}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            {session.workout_name && <span>{session.workout_name}</span>}
                            {session.duration && <span>{session.duration} min</span>}
                          </div>
                        </div>
                        <Badge variant="secondary" className={`text-[10px] flex items-center gap-1 ${config.class}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(session); setFormOpen(true); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir sessão?</AlertDialogTitle>
                                <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(session.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <SessionForm
          session={editing}
          students={students}
          workouts={workouts}
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}