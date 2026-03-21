// src/components/shared/StatCard.jsx

import React from "react";
import { Card } from "@/components/ui/card";

export default function StatCard({ title, value, icon: Icon, trend, color = "primary" }) {
  return (
    <Card className="relative overflow-hidden p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className="text-xs text-primary font-medium">{trend}</p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary/10" />
    </Card>
  );
}