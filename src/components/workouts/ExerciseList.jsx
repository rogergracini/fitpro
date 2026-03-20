import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical } from "lucide-react";

export default function ExerciseList({ exercises = [], onChange }) {
  const addExercise = () => {
    onChange([...exercises, { name: "", sets: 3, reps: "12", rest: "60s", notes: "" }]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExercise = (index) => {
    onChange(exercises.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Exercícios ({exercises.length})</p>
        <Button type="button" variant="outline" size="sm" onClick={addExercise} className="gap-1">
          <Plus className="w-3 h-3" /> Adicionar
        </Button>
      </div>

      {exercises.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 bg-muted/50 rounded-lg">
          Nenhum exercício adicionado
        </p>
      )}

      {exercises.map((ex, i) => (
        <div key={i} className="flex gap-2 items-start p-3 bg-muted/50 rounded-lg group">
          <GripVertical className="w-4 h-4 mt-2.5 text-muted-foreground/50 shrink-0" />
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Input
              placeholder="Nome do exercício"
              value={ex.name}
              onChange={(e) => updateExercise(i, "name", e.target.value)}
              className="col-span-2 sm:col-span-4 text-sm"
            />
            <Input
              placeholder="Séries"
              type="number"
              value={ex.sets}
              onChange={(e) => updateExercise(i, "sets", Number(e.target.value))}
              className="text-sm"
            />
            <Input
              placeholder="Reps"
              value={ex.reps}
              onChange={(e) => updateExercise(i, "reps", e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Descanso"
              value={ex.rest}
              onChange={(e) => updateExercise(i, "rest", e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Obs"
              value={ex.notes}
              onChange={(e) => updateExercise(i, "notes", e.target.value)}
              className="text-sm"
            />
          </div>
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8 shrink-0 mt-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExercise(i)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}