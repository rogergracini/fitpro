import React, { useState } from "react";
import { Dumbbell, Check, Star, Zap, Shield, ChevronRight, Instagram, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Básico",
    price: 197,
    period: "/mês",
    description: "Ideal para quem está começando a treinar",
    color: "border-border",
    badge: null,
    features: [
      "1 treino personalizado por semana",
      "Acompanhamento via WhatsApp",
      "Avaliação física inicial",
      "Planilha de treino em PDF",
      "Suporte em horário comercial",
    ],
    notIncluded: [
      "Consulta nutricional",
      "Revisão semanal de treino",
      "Acesso ao app exclusivo",
    ],
    cta: "Começar agora",
    ctaVariant: "outline",
  },
  {
    name: "Pro",
    price: 347,
    period: "/mês",
    description: "O mais escolhido para resultados consistentes",
    color: "border-primary",
    badge: "Mais Popular",
    features: [
      "3 treinos personalizados por semana",
      "Acompanhamento diário via WhatsApp",
      "Avaliação física mensal",
      "Planilha de treino atualizada",
      "Suporte prioritário",
      "Consulta nutricional básica",
      "Revisão semanal de treino",
    ],
    notIncluded: [
      "Acesso ao app exclusivo",
    ],
    cta: "Quero ser Pro",
    ctaVariant: "default",
  },
  {
    name: "Premium",
    price: 597,
    period: "/mês",
    description: "Experiência completa e transformação total",
    color: "border-border",
    badge: null,
    features: [
      "5 treinos personalizados por semana",
      "Acompanhamento diário via WhatsApp",
      "Avaliação física quinzenal",
      "Planilha de treino em tempo real",
      "Suporte 24/7",
      "Consultoria nutricional completa",
      "Revisão diária de treino",
      "Acesso ao app exclusivo",
    ],
    notIncluded: [],
    cta: "Quero o Premium",
    ctaVariant: "outline",
  },
];

const transformations = [
  {
    name: "Lucas Oliveira",
    period: "4 meses",
    result: "+8kg massa muscular",
    before: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&q=80",
    after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop&q=80",
  },
  {
    name: "Marina Santos",
    period: "3 meses",
    result: "-12kg de gordura",
    before: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop&q=80",
    after: "https://images.unsplash.com/photo-1609899537878-48e6cf60bbab?w=400&h=500&fit=crop&q=80",
  },
  {
    name: "Rafael Costa",
    period: "60 dias",
    result: "Condicionamento total",
    before: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop&q=80",
    after: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=500&fit=crop&q=80",
  },
];

const testimonials = [
  {
    name: "Lucas Oliveira",
    result: "Ganhou 8kg de massa em 4 meses",
    text: "Nunca pensei que conseguiria resultados tão rápidos. O acompanhamento personalizado faz toda a diferença!",
    plan: "Pro",
    initial: "L",
  },
  {
    name: "Marina Santos",
    result: "Perdeu 12kg em 3 meses",
    text: "O plano Premium mudou minha vida. Hoje me sinto mais disposta e confiante do que nunca.",
    plan: "Premium",
    initial: "M",
  },
  {
    name: "Rafael Costa",
    result: "Melhorou o condicionamento em 60 dias",
    text: "Treinamento eficiente, feedback constante e resultados reais. Vale cada centavo!",
    plan: "Pro",
    initial: "R",
  },
];

export default function Landing() {
  const [selected, setSelected] = useState(null);

  const handleCTA = (planName) => {
    setSelected(planName);
    const msg = encodeURIComponent(`Olá! Tenho interesse no plano ${planName}. Poderia me dar mais informações?`);
    window.open(`https://wa.me/5511999999999?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">FitPro</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#planos" className="hover:text-foreground transition-colors">Planos</a>
            <a href="#resultados" className="hover:text-foreground transition-colors">Resultados</a>
            <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
          </nav>
          <Button size="sm" onClick={() => handleCTA("Pro")} className="gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Falar no WhatsApp
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
            <Zap className="w-3 h-3 mr-1" /> Personal Trainer Especializado
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Transforme seu corpo com{" "}
            <span className="text-primary">treinos personalizados</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Metodologia comprovada, acompanhamento individualizado e resultados reais. Comece sua transformação hoje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => document.getElementById("planos").scrollIntoView({ behavior: "smooth" })} className="gap-2 text-base px-8">
              Ver planos e valores <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => handleCTA("Básico")} className="gap-2 text-base px-8">
              <Phone className="w-4 h-4" /> Tirar dúvidas
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            {[["200+", "Alunos atendidos"], ["98%", "Taxa de satisfação"], ["5 anos", "De experiência"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-foreground">{num}</p>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Planos e Valores</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Escolha o plano ideal para o seu objetivo e comece a transformação agora mesmo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card rounded-2xl border-2 ${plan.color} p-8 flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300 ${plan.badge ? "ring-2 ring-primary/30 scale-105 shadow-lg" : ""}`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold shadow-md">
                      <Star className="w-3 h-3 mr-1" /> {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold">R$ {plan.price}</span>
                    <span className="text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold">—</span>
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.ctaVariant}
                  size="lg"
                  className="w-full font-semibold"
                  onClick={() => handleCTA(plan.name)}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Sem fidelidade. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="resultados" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Resultados Reais</h2>
            <p className="text-muted-foreground text-lg">Veja o que nossos alunos conquistaram</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">{t.initial}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">{t.plan}</Badge>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary mb-2">✓ {t.result}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="flex gap-0.5 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Transformações Reais</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Antes & Depois</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Resultados conquistados por alunos reais com dedicação e o método certo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transformations.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={t.before} alt={`Antes - ${t.name}`} className="w-full h-52 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs font-bold text-center py-1.5 tracking-widest uppercase">
                      Antes
                    </div>
                  </div>
                  <div className="relative">
                    <img src={t.after} alt={`Depois - ${t.name}`} className="w-full h-52 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-xs font-bold text-center py-1.5 tracking-widest uppercase">
                      Depois
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-primary font-medium mt-0.5">✓ {t.result}</p>
                  <p className="text-xs text-muted-foreground mt-1">Em {t.period} de treino</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Entre em contato agora e dê o primeiro passo rumo à sua transformação.
          </p>
          <Button size="lg" variant="secondary" onClick={() => handleCTA("Pro")} className="gap-2 text-base px-10 font-semibold">
            <Phone className="w-4 h-4" /> Falar no WhatsApp agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="py-10 px-4 sm:px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">FitPro</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="mailto:contato@fitpro.com" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" /> contato@fitpro.com
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Instagram className="w-4 h-4" /> @fitpro
            </a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 FitPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}