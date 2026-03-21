// src/components/schedule/SessionForm.jsx

import React, { useState, useEffect } from "react";
import { 
  X, Save, Calendar, Clock, 
  User, Dumbbell, ClipboardList, Timer 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SessionForm({ open, onClose, onSave, students = [], workouts = [], session = null }) {
  // Estado inicial para novas sessões
  const initialState = {
    student_id: "",
    date: new Date().toISOString().split('T')[0], // Data de hoje como padrão
    time: "",
    workout_id: "",
    duration: "60",
    status: "agendada",
    notes: ""
  };

  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  // Sincroniza o formulário ao abrir ou ao editar uma sessão existente
  useEffect(() => {
    if (open) {
      setForm(session || initialState);
    }
  }, [open, session]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Busca os nomes para salvar o registro completo (denormalização para performance do Dashboard)
    const student = students.find(s => s.id === form.student_id);
    const workout = workouts.find(w => w.id === form.workout_id);
    
    const enrichedData = {
      ...form,
      student_name: student ? (student.nome || student.name) : "Aluno não encontrado",
      workout_name: workout ? workout.name : "Treino Geral"
    };

    try {
      await onSave(enrichedData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[32px] border-none shadow-2xl p-8 bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            {session ? "Editar Sessão" : "Nova Sessão"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SELETOR DE ALUNOS - CORRIGIDO */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <User className="w-3 h-3" /> Aluno *
            </Label>
            <select 
              required
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              value={form.student_id}
              onChange={(e) => handleChange("student_id", e.target.value)}
            >
              <option value="">Selecionar aluno</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome || s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DATA */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Data *
              </Label>
              <Input 
                type="date" 
                required
                className="h-12 rounded-xl border-slate-200 bg-slate-50 font-medium"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            {/* HORÁRIO */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Horário *
              </Label>
              <Input 
                type="time" 
                required
                className="h-12 rounded-xl border-slate-200 bg-slate-50 font-medium"
                value={form.time}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SELETOR DE TREINOS */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Dumbbell className="w-3 h-3" /> Treino
              </Label>
              <select 
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none appearance-none cursor-pointer"
                value={form.workout_id}
                onChange={(e) => handleChange("workout_id", e.target.value)}
              >
                <option value="">Selecionar treino</option>
                {workouts.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            {/* DURAÇÃO */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Timer className="w-3 h-3" /> Duração (min)
              </Label>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-slate-200 bg-slate-50 font-medium text-center"
                value={form.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <ClipboardList className="w-3 h-3" /> Status
            </Label>
            <select 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none appearance-none cursor-pointer"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="agendada">Agendada</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {/* OBSERVAÇÕES */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Observações</Label>
            <Textarea 
              placeholder="Anotações sobre a sessão..." 
              className="rounded-xl border-slate-200 bg-slate-50 min-h-[80px]"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-12 px-6 font-semibold text-slate-400">
              <X className="w-4 h-4 mr-2" /> Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saving} 
              className="rounded-xl h-12 px-8 bg-primary hover:bg-emerald-600 shadow-lg shadow-primary/20 font-bold gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? "Salvando..." : "Salvar Sessão"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}