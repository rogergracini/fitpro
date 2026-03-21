// src/api/apiClient.js

// Chaves de persistência no LocalStorage
const STUDENTS_KEY = 'fitpro_students_v1';
const WORKOUTS_KEY = 'fitpro_workouts_v1';
const SESSIONS_KEY = 'fitpro_sessions_v1';

// Funções auxiliares para leitura segura (Parse)
const getStudents = () => JSON.parse(localStorage.getItem(STUDENTS_KEY)) || [
  { id: "1", nome: "Rogério Gracini", peso: "85.5", altura: "1.75", imc: "27.92", objetivo: "Hipertrofia", status: "Ativo" }
];
const getWorkouts = () => JSON.parse(localStorage.getItem(WORKOUTS_KEY)) || [];
const getSessions = () => JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];

// Funções auxiliares para escrita (Stringify)
const saveStudents = (data) => localStorage.setItem(STUDENTS_KEY, JSON.stringify(data));
const saveWorkouts = (data) => localStorage.setItem(WORKOUTS_KEY, JSON.stringify(data));
const saveSessions = (data) => localStorage.setItem(SESSIONS_KEY, JSON.stringify(data));

export const api = {
  // GESTÃO DE ALUNOS
  students: {
    list: async () => {
      return new Promise((resolve) => setTimeout(() => resolve(getStudents()), 200));
    },
    create: async (data) => {
      const current = getStudents();
      const newItem = { ...data, id: Date.now().toString() };
      saveStudents([...current, newItem]);
      return newItem;
    },
    update: async (id, data) => {
      const current = getStudents();
      const updated = current.map(s => s.id === id ? { ...s, ...data } : s);
      saveStudents(updated);
      return data;
    },
    delete: async (id) => {
      const current = getStudents();
      saveStudents(current.filter(s => s.id !== id));
    }
  },

  // GESTÃO DE ENTIDADES (Treinos e Sessões)
  entities: {
    // TREINOS
    Workout: {
      list: async () => {
        return new Promise((resolve) => setTimeout(() => resolve(getWorkouts()), 200));
      },
      create: async (data) => {
        const current = getWorkouts();
        const newItem = { ...data, id: `wkt_${Date.now()}`, created_at: new Date().toISOString() };
        saveWorkouts([...current, newItem]);
        return newItem;
      },
      update: async (id, data) => {
        const current = getWorkouts();
        const updated = current.map(w => w.id === id ? { ...w, ...data } : w);
        saveWorkouts(updated);
        return data;
      },
      delete: async (id) => {
        const current = getWorkouts();
        saveWorkouts(current.filter(w => w.id !== id));
      }
    },

    // SESSÕES / AGENDA
    Session: {
      list: async () => {
        return new Promise((resolve) => setTimeout(() => resolve(getSessions()), 200));
      },
      create: async (data) => {
        const current = getSessions();
        const newItem = { ...data, id: `ses_${Date.now()}` };
        saveSessions([...current, newItem]);
        return newItem;
      },
      update: async (id, data) => {
        const current = getSessions();
        const updated = current.map(s => s.id === id ? { ...s, ...data } : s);
        saveSessions(updated);
        return data;
      },
      delete: async (id) => {
        const current = getSessions();
        saveSessions(current.filter(s => s.id !== id));
      }
    },

    // Alias para compatibilidade com o Dashboard
    Student: { 
      list: async () => getStudents() 
    }
  }
};