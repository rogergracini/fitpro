import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, X } from "lucide-react";

const statuses = [
  { value: "agendada", label: "Agendada" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
  { value: "remarcada", label: "Remarcada" },
];

export default function SessionForm({ session, students = [], workouts = [], open, onClose, onSave }) {
  // Estado inicial padrão
  const initialState = {
    student_id: "",
    student_name: "",
    date: "",
    time: "",
    duration: 60,
    workout_id: "",
    workout_name: "",
    status: "agendada",
    notes: ""
  };

  const [form, setForm] = useState(session || initialState);
  const [saving, setSaving] = useState(false);

  // Sincroniza o formulário quando abre/fecha ou muda a sessão selecionada
  useEffect(() => {
    if (open) {
      setForm(session || initialState);
    }
  }, [open, session]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    setForm((prev) => ({ 
      ...prev, 
      student_id: studentId, 
      student_name: student?.name || "",
      workout_id: "", // Reseta o treino se mudar o aluno
      workout_name: "" 
    }));
  };

  const handleWorkoutChange = (workoutId) => {
    const workout = workouts.find((w) => w.id === workoutId);
    setForm((prev) => ({ 
      ...prev, 
      workout_id: workoutId, 
      workout_name: workout?.name || "" 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, duration: Number(form.duration) });
    } finally {
      setSaving(false);
    }
  };

  const studentWorkouts = form.student_id
    ? workouts.filter((w) => w.student_id === form.student_id)
    : workouts;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{session ? "Editar Sessão" : "Nova Sessão"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Aluno *</Label>
            <Select value={form.student_id} onValueChange={handleStudentChange}>
              <SelectTrigger><SelectValue placeholder="Selecionar aluno" /></SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Input 
                type="date" 
                value={form.date} 
                onChange={(e) => handleChange("date", e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Horário *</Label>
              <Input 
                type="time" 
                value={form.time} 
                onChange={(e) => handleChange("time", e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Treino</Label>
              <Select value={form.workout_id} onValueChange={handleWorkoutChange}>
                <SelectTrigger><SelectValue placeholder="Selecionar treino" /></SelectTrigger>
                <SelectContent>
                  {studentWorkouts.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duração (min)</Label>
              <Input 
                type="number" 
                value={form.duration} 
                onChange={(e) => handleChange("duration", e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea 
              value={form.notes} 
              onChange={(e) => handleChange("notes", e.target.value)} 
              placeholder="Anotações sobre a sessão..." 
              rows={3} 
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}