// entities/Student.tsx

export interface Student {
  id: string;
  name: string; //
  email?: string; //
  phone?: string; //
  birth_date?: string; //
  goal?: 'emagrecimento' | 'hipertrofia' | 'condicionamento' | 'reabilitacao' | 'flexibilidade' | 'outro'; //
  status: 'ativo' | 'inativo' | 'em_avaliacao'; //
  weight?: number; //
  height?: number; //
  notes?: string; //
  photo_url?: string; //
}