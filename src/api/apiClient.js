// src/api/apiClient.js
const STORAGE_KEY = 'fitpro_storage_v1';

// Função para ler do navegador
const getDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { students: [], workouts: [], sessions: [] };
};

// Função para salvar no navegador
const saveDB = (db) => localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

export const api = {
  entities: {
    Student: {
      list: async () => getDB().students,
      create: async (data) => {
        const db = getDB();
        const newItem = { ...data, id: Date.now().toString() };
        db.students.push(newItem);
        saveDB(db);
        return newItem;
      },
      update: async (arg1, arg2) => {
        const id = typeof arg1 === 'object' ? arg1.id : arg1;
        const data = typeof arg1 === 'object' ? arg1.data : arg2;
        const db = getDB();
        db.students = db.students.map(s => s.id === id ? { ...s, ...data } : s);
        saveDB(db);
        return data;
      },
      delete: async (id) => {
        const db = getDB();
        db.students = db.students.filter(s => s.id !== id);
        saveDB(db);
        return id;
      }
    },
    Workout: {
      list: async () => getDB().workouts,
      create: async (data) => {
        const db = getDB();
        const newItem = { ...data, id: Date.now().toString() };
        db.workouts.push(newItem);
        saveDB(db);
        return newItem;
      },
      update: async (arg1, arg2) => {
        const id = typeof arg1 === 'object' ? arg1.id : arg1;
        const data = typeof arg1 === 'object' ? arg1.data : arg2;
        const db = getDB();
        db.workouts = db.workouts.map(w => w.id === id ? { ...w, ...data } : w);
        saveDB(db);
        return data;
      },
      delete: async (id) => {
        const db = getDB();
        db.workouts = db.workouts.filter(w => w.id !== id);
        saveDB(db);
        return id;
      }
    },
    Session: {
      list: async () => getDB().sessions,
      create: async (data) => {
        const db = getDB();
        const newItem = { ...data, id: Date.now().toString() };
        db.sessions.push(newItem);
        saveDB(db);
        return newItem;
      },
      update: async (arg1, arg2) => {
        const id = typeof arg1 === 'object' ? arg1.id : arg1;
        const data = typeof arg1 === 'object' ? arg1.data : arg2;
        const db = getDB();
        db.sessions = db.sessions.map(s => s.id === id ? { ...s, ...data } : s);
        saveDB(db);
        return data;
      },
      delete: async (id) => {
        const db = getDB();
        db.sessions = db.sessions.filter(s => s.id !== id);
        saveDB(db);
        return id;
      }
    }
  },
  auth: {
    me: async () => ({ name: "Rogério", role: "admin" }),
    logout: () => { localStorage.removeItem(STORAGE_KEY); window.location.href = "/"; }
  }
};

export const base44 = api;