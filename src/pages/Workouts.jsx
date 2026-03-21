// src/pages/Workouts.jsx
import React, { useState } from "react";
import { api as base44 } from "@/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dumbbell, Plus, Search, Trash2, Pencil, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import WorkoutForm from "@/components/workouts/WorkoutForm";

const typeLabels = {
  musculacao: "Musculação", funcional: "Funcional", cardio: "Cardio",
  hiit: "HIIT", alongamento: "Alongamento", outro: "Outro",
};
const difficultyLabels = {
  iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado",
};
const difficultyColors = {
  iniciante: "bg-primary/10 text-primary",
  intermediario: "bg-accent text-accent-foreground",
  avancado: "bg-destructive/10 text-destructive",
};

export default function Workouts() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  // Busca de treinos - Ajustado para usar a nova estrutura da API se necessário
  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => base44.entities?.Workout?.list("-created_date") || [],
  });

  // BUSCA DE ALUNOS - Sincronizado com o seu apiClient.js de Limeira
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => base44.students.list(), // Caminho corrigido para bater com o apiClient
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities?.Workout?.create(data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["workouts"] }); 
      setFormOpen(false); 
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities?.Workout?.update(id, data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["workouts"] }); 
      setFormOpen(false); 
      setEditing(null); 
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities?.Workout?.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  });

  const handleSave = async (data) => {
    // Busca o nome do aluno na lista para salvar junto ao treino (denormalização para performance)
    const selectedStudent = students.find(s => s.id === data.studentId);
    const enrichedData = {
      ...data,
      student_name: selectedStudent ? (selectedStudent.nome || selectedStudent.name) : ""
    };

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: enrichedData });
    } else {
      await createMutation.mutateAsync(enrichedData);
    }
  };

  const filtered = workouts.filter((w) =>
    w.name?.toLowerCase().includes(search.toLowerCase()) ||
    w.student_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <PageHeader title="Treinos" subtitle={`${workouts.length} treinos criados`}>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="gap-2 rounded-xl h-11">
          <Plus className="w-4 h-4" /> Novo Treino
        </Button>
      </PageHeader>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar treinos..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10 max-w-sm rounded-xl h-11" 
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Card key={i} className="h-48 animate-pulse bg-muted rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="Nenhum treino encontrado"
          description={search ? "Tente buscar com outro termo" : "Crie seu primeiro plano de treino"}
          actionLabel={!search ? "Criar Treino" : undefined}
          onAction={!search ? () => setFormOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((workout) => (
            <Card key={workout.id} className="p-5 hover:shadow-lg transition-all duration-300 group border-none shadow-sm rounded-2xl bg-white">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{workout.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px] rounded-full uppercase">
                      {typeLabels[workout.type] || workout.type}
                    </Badge>
                    <Badge variant="secondary" className={`text-[10px] rounded-full uppercase ${difficultyColors[workout.difficulty] || ""}`}>
                      {difficultyLabels[workout.difficulty] || workout.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => { setEditing(workout); setFormOpen(true); }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive rounded-full hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[32px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir treino?</AlertDialogTitle>
                        <AlertDialogDescription>Essa ação removerá o plano de treino permanentemente.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(workout.id)} className="bg-destructive hover:bg-red-600 rounded-xl">Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {workout.student_name && (
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{workout.student_name}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{workout.exercises?.length || 0} exercícios</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400">ID: {workout.id.slice(-4)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {formOpen && (
        <WorkoutForm
          workout={editing}
          students={students} // Agora passando a lista de alunos sincronizada
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}