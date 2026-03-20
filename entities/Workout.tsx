// entities/Workout.tsx

export interface Workout {
  id: string;
  name: string; //
  student_id?: string; //
  student_name?: string; //
  type: 'musculacao' | 'funcional' | 'cardio' | 'hiit' | 'alongamento' | 'outro'; //
  difficulty: 'iniciante' | 'intermediario' | 'avancado'; //
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: string;
    notes?: string;
  }>; //
  status: 'ativo' | 'inativo' | 'rascunho'; //
}