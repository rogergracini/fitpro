// src/api/apiClient.js

// Dados de teste para visualização local (Mock Data)
const MOCK_STUDENTS = [
  { id: "1", name: "Rogério Gracini", status: "ativo", goal: "hipertrofia", email: "rogerio@exemplo.com.br" },
  { id: "2", name: "Ana Silva", status: "ativo", goal: "emagrecimento", phone: "(19) 99999-8888" },
  { id: "3", name: "Carlos Andrade", status: "em_avaliacao", goal: "condicionamento" }
];

const MOCK_WORKOUTS = [
  { 
    id: "w1", 
    name: "Treino A - Hipertrofia", 
    student_id: "1", 
    student_name: "Rogério Gracini",
    type: "musculacao", 
    difficulty: "avancado",
    status: "ativo",
    exercises: [
      { name: "Supino Reto", sets: 4, reps: "10", rest: "60s" },
      { name: "Desenvolvimento Militar", sets: 3, reps: "12", rest: "45s" }
    ]
  }
];

const MOCK_SESSIONS = [
  { 
    id: "s1", 
    student_id: "1", 
    student_name: "Rogério Gracini", 
    date: new Date().toISOString().split('T')[0], // Hoje
    time: "08:30", 
    duration: 60, 
    status: "agendada",
    workout_name: "Treino A - Hipertrofia"
  }
];

// Simulador de cliente de API desacoplado da Base44
export const api = {
  entities: {
    Student: { 
      list: async (...args) => MOCK_STUDENTS, 
      create: async (data) => ({ id: Math.random().toString(), ...data }),
      // Ajustado para receber um objeto com id e data, ou argumentos separados
      update: async (arg1, arg2) => {
        const id = typeof arg1 === 'object' ? arg1.id : arg1;
        const data = typeof arg1 === 'object' ? arg1.data : arg2;
        console.log(`Atualizando ${id}`, data);
        return data;
      },
      delete: async (id) => id 
    },
    Workout: { 
      list: async (...args) => MOCK_WORKOUTS, 
      create: async (data) => ({ id: Math.random().toString(), ...data }),
      update: async (arg1, arg2) => {
        const id = typeof arg1 === 'object' ? arg1.id : arg1;
        const data = typeof arg1 === 'object' ? arg1.data : arg2;
        return data;
      },
      delete: async (id) => id 
    },
    Session: { 
      list: async (...args) => MOCK_SESSIONS, 
      create: async (data) => ({ id: Math.random().toString(), ...data }),
      update: async (arg1, arg2) => {
        // Esta lógica trata tanto Session.update(id, data) quanto Session.update({id, data})
        const id = typeof arg1 === 'object' ? arg1.id : arg1;
        const data = typeof arg1 === 'object' ? arg1.data : arg2;
        return data;
      },
      delete: async (id) => id 
    },
  },



  auth: {
    me: async () => ({ name: "Rogério", role: "admin" }), //
    logout: () => { 
      console.log("Logout local executado");
      window.location.href = "/"; 
    },
    redirectToLogin: (url) => { 
      console.log("Simulando redirecionamento de login para:", url); 
    }
  }
};

// Mantemos o export 'base44' para compatibilidade com os arquivos existentes
export const base44 = api;