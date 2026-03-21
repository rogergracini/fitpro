// src/pages/Students.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { 
  Users, Search, Plus, Weight, Ruler, Activity, 
  Target, X, Pencil, Trash2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";

// IMPORTAÇÃO DAS IMAGENS DE IMC
import tabelaImc from "../assets/imc/tabela-imc.png"; // Certifique-se que é .png ou .jpg conforme você colocou
import imcAbaixo from "../assets/imc/imc1.png";
import imcNormal from "../assets/imc/imc2.png";
import imcSobrepeso from "../assets/imc/imc3.png";
import imcObesidade1 from "../assets/imc/imc4.png";
import imcObesidade2 from "../assets/imc/imc5.png";
import imcObesidade3 from "../assets/imc/imc6.png";

// Função para obter a imagem, texto e cor correspondente ao IMC
const getImcInfo = (imcValue) => {
  if (!imcValue) return { img: null, label: "--", color: "text-slate-400" };
  const imc = parseFloat(imcValue);

  if (imc < 18.5) {
    return { img: imcAbaixo, label: "Abaixo do peso", color: "text-yellow-600" };
  } else if (imc < 25) {
    return { img: imcNormal, label: "Peso normal", color: "text-emerald-600" };
  } else if (imc < 30) {
    return { img: imcSobrepeso, label: "Sobrepeso", color: "text-orange-600" };
  } else if (imc < 35) {
    return { img: imcObesidade1, label: "Obesidade Grau I", color: "text-red-600" };
  } else if (imc < 40) {
    return { img: imcObesidade2, label: "Obesidade Grau II", color: "text-red-700" };
  } else {
    return { img: imcObesidade3, label: "Obesidade Grau III", color: "text-red-900" };
  }
};

export default function Students() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    peso: "",
    altura: "",
    objetivo: "Hipertrofia",
    status: "Ativo"
  });

  // Busca de alunos
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => api.students.list(),
  });

  // Lógica de cálculo de IMC em tempo real
  const p = parseFloat(formData.peso?.toString().replace(",", "."));
  const h = parseFloat(formData.altura?.toString().replace(",", "."));
  const imcResult = (p > 0 && h > 1) ? (p / (h * h)).toFixed(2) : null;
  const currentImcInfo = getImcInfo(imcResult);

  const handleOpenModal = (student = null) => {
    if (student) {
      setFormData({ ...student });
      setEditingId(student.id);
    } else {
      setFormData({ nome: "", peso: "", altura: "", objetivo: "Hipertrofia", status: "Ativo" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...formData, imc: imcResult };
    
    if (editingId) {
      await api.students.update(editingId, data);
    } else {
      await api.students.create(data);
    }
    
    queryClient.invalidateQueries(["students"]);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      await api.students.delete(id);
      queryClient.invalidateQueries(["students"]);
    }
  };

  const filtered = students.filter(s => s.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 space-y-8 h-full bg-slate-50/50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alunos</h1>
          <p className="text-slate-500">Gestão e acompanhamento biométrico.</p>
        </div>
        <div className="flex gap-3">
          {/* Botão para visualizar a Tabela Geral de IMC */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl h-12 px-5 border-slate-300">
                <Activity className="w-5 h-5 text-primary" /> Tabela IMC
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl rounded-[32px] p-6 border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Tabela de Classificação IMC</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={tabelaImc} alt="Tabela Geral IMC" className="max-h-[70vh] rounded-lg shadow-sm" />
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={() => handleOpenModal()} className="gap-2 rounded-xl h-12 px-6 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" /> Novo Aluno
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Buscar aluno..." 
          className="pl-10 h-12 bg-white rounded-xl border-slate-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              {editingId ? "Editar Aluno" : "Novo Aluno"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="h-12 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Objetivo</Label>
                <select 
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  value={formData.objetivo}
                  onChange={e => setFormData({...formData, objetivo: e.target.value})}
                >
                  <option>Hipertrofia</option>
                  <option>Emagrecimento</option>
                  <option>Condicionamento</option>
                  <option>Definição</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Peso (kg)</Label>
                  <Input value={formData.peso} placeholder="Ex: 80.5" onChange={e => setFormData({...formData, peso: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Altura (m)</Label>
                  <Input value={formData.altura} placeholder="Ex: 1.75" onChange={e => setFormData({...formData, altura: e.target.value})} className="h-12 rounded-xl" />
                </div>
              </div>

              {/* Pré-visualização do IMC e Imagem correspondente no modal */}
              {imcResult && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${currentImcInfo.color} bg-slate-50 border-slate-100`}>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">IMC Calculado</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black">{imcResult}</span>
                      <span className="text-sm font-bold flexitems-center gap-1">• {currentImcInfo.label}</span>
                    </div>
                  </div>
                  {currentImcInfo.img && (
                    <img src={currentImcInfo.img} alt={currentImcInfo.label} className="h-14 w-auto drop-shadow-md" />
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="flex-1 rounded-xl h-12 bg-primary">Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid de Alunos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((student) => {
          const studentImcInfo = getImcInfo(student.imc);
          return (
            <Card key={student.id} className="border-none shadow-sm rounded-[24px] hover:shadow-md transition-all bg-white overflow-hidden group border border-slate-100">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">{student.nome}</CardTitle>
                  <div className="flex items-center gap-2 text-primary text-xs font-semibold mt-1">
                    <Target className="w-3 h-3" /> {student.objetivo}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(student)} className="h-8 w-8 rounded-full hover:bg-slate-100">
                    <Pencil className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)} className="h-8 w-8 rounded-full hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-4">
                {/* Visualização de Peso e Altura */}
                <div className="flex justify-between items-center text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  <div className="flex gap-1.5 items-center">
                    <Weight className="w-4 h-4 text-slate-300"/> 
                    <span className="font-semibold text-slate-800">{student.peso}</span> kg
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-200" />
                  <div className="flex gap-1.5 items-center">
                    <Ruler className="w-4 h-4 text-slate-300"/> 
                    <span className="font-semibold text-slate-800">{student.altura}</span> m
                  </div>
                </div>

                {/* VISUALIZAÇÃO DO IMC COM IMAGEM DINÂMICA (NOVO) */}
                {student.imc && (
                  <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${studentImcInfo.color} bg-white border-slate-100`}>
                    {studentImcInfo.img && (
                      <img src={studentImcInfo.img} alt={studentImcInfo.label} className="h-16 w-auto drop-shadow-md shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">IMC Atual</p>
                      <p className="text-2xl font-black">{student.imc}</p>
                      <p className="text-xs font-bold truncate">• {studentImcInfo.label}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${student.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {student.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}