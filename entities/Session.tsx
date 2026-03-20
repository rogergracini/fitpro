// entities/Session.tsx

export interface Session {
  id?: string;
  student_id: string; //
  student_name: string; //
  date: string; // Formato YYYY-MM-DD
  time: string; // Ex: "08:00"
  duration: number; //
  workout_id?: string; //
  workout_name?: string; //
  status: 'agendada' | 'concluida' | 'cancelada' | 'remarcada'; //
  notes?: string; //
}