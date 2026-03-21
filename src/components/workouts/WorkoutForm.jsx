// src/components/workouts/WorkoutForm.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Save, X, Dumbbell } from "lucide-react";
import ExerciseList from "./ExerciseList";

const types = [
  { value: "musculacao", label: "Musculação" },
  { value: "funcional", label: "Funcional" },
  { value: "cardio", label: "Cardio" },
  { value: "hiit", label: "HIIT" },
  { value: "alongamento", label: "Alongamento" },
  { value: "outro", label: "Outro" },
];

const difficulties = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

export default function WorkoutForm({ workout, students = [], open, onClose, onSave }) {
  const initialState = {
    name: "",
    student_id: "",
    student_name: "",
    type: "musculacao",
    difficulty: "intermediario",
    exercises: [],
    status: "ativo"
  };

  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(workout || initialState);
    }
  }, [open, workout]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // CORREÇÃO: Busca o aluno usando 'id' e mapeia 'nome' ou 'name'
  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    setForm((prev) => ({ 
      ...prev, 
      student_id: studentId, 
      // Garante compatibilidade com 'nome' (novo) ou 'name' (antigo)
      student_name: student ? (student.nome || student.name) : "" 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            {workout ? "Editar Treino" : "Novo Treino"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Nome do Treino *</Label>
            <Input 
              value={form.name} 
              onChange={(e) => handleChange("name", e.target.value)} 
              placeholder="Ex: Treino A - Peito e Tríceps" 
              className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Aluno</Label>
              <Select value={form.student_id} onValueChange={handleStudentChange}>
                <SelectTrigger className="rounded-xl h-12 border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Selecionar aluno" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {students.length > 0 ? (
                    students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nome || s.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-slate-400 text-center">Nenhum aluno cadastrado</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Tipo</Label>
              <Select value={form.type} onValueChange={(v) => handleChange("type", v)}>
                <SelectTrigger className="rounded-xl h-12 border-slate-200 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {types.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Dificuldade</Label>
              <Select value={form.difficulty} onValueChange={(v) => handleChange("difficulty", v)}>
                <SelectTrigger className="rounded-xl h-12 border-slate-200 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {difficulties.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100">
            <ExerciseList 
              exercises={form.exercises || []} 
              onChange={(exs) => handleChange("exercises", exs)} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-12 px-6 font-semibold text-slate-500">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saving} 
              className="rounded-xl h-12 px-10 bg-primary hover:bg-emerald-600 shadow-lg shadow-primary/20 font-bold gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? "Salvando..." : "Salvar Treino"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}