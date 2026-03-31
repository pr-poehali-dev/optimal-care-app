import { useState } from "react";
import Icon from "@/components/ui/icon";

const DIAGNOSES = [
  { id: "Д-001", patient: "Белова С.Ю.", patientId: "П-003", date: "20.03.2026", category: "Дыхание", diagnosis: "Неэффективное очищение дыхательных путей", priority: "high", status: "active", goals: "Восстановление проходимости дыхательных путей в течение 48 ч" },
  { id: "Д-002", patient: "Фёдоров В.П.", patientId: "П-002", date: "25.03.2026", category: "Кровообращение", diagnosis: "Риск снижения сердечного выброса", priority: "high", status: "active", goals: "Стабилизация АД на уровне 130/80 мм рт. ст." },
  { id: "Д-003", patient: "Козлова Н.И.", patientId: "П-001", date: "22.03.2026", category: "Боль", diagnosis: "Острая боль в грудной клетке", priority: "medium", status: "resolved", goals: "Купирование болевого синдрома в течение 30 мин" },
  { id: "Д-004", patient: "Кузнецова О.Н.", patientId: "П-005", date: "15.03.2026", category: "Питание", diagnosis: "Нарушение питания: более потребностей организма", priority: "medium", status: "active", goals: "Нормализация уровня глюкозы крови" },
  { id: "Д-005", patient: "Соколов Д.В.", patientId: "П-006", date: "29.03.2026", category: "Двигательная активность", diagnosis: "Нарушение физической мобильности", priority: "high", status: "active", goals: "Предотвращение осложнений иммобилизации" },
  { id: "Д-006", patient: "Белова С.Ю.", patientId: "П-003", date: "21.03.2026", category: "Тревога", diagnosis: "Тревога, связанная с состоянием здоровья", priority: "low", status: "active", goals: "Снижение тревожности, улучшение психоэмоционального состояния" },
];

const CATEGORIES = ["Все", "Дыхание", "Кровообращение", "Боль", "Питание", "Двигательная активность", "Тревога"];

const PRIORITY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: "Высокий", color: "hsl(var(--med-danger))", bg: "hsl(0 72% 92%)" },
  medium: { label: "Средний", color: "hsl(38 90% 35%)", bg: "hsl(38 90% 92%)" },
  low: { label: "Низкий", color: "hsl(var(--med-green))", bg: "hsl(142 65% 92%)" },
};

export default function DiagnosesPage() {
  const [category, setCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"active" | "resolved">("active");

  const filtered = DIAGNOSES.filter((d) => {
    const matchCat = category === "Все" || d.category === category;
    const matchSearch = d.patient.toLowerCase().includes(search.toLowerCase()) ||
      d.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchTab = d.status === tab;
    return matchCat && matchSearch && matchTab;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="page-header">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Сестринские диагнозы</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Активных: {DIAGNOSES.filter((d) => d.status === "active").length} · Разрешённых: {DIAGNOSES.filter((d) => d.status === "resolved").length}
          </p>
        </div>
        <button className="btn-primary">
          <Icon name="Plus" size={16} />
          Новый диагноз
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-6 py-3 space-y-3" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="text"
              placeholder="Поиск по пациенту или диагнозу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
            />
          </div>
          <div className="flex gap-1">
            {["active", "resolved"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as "active" | "resolved")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: tab === t ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  color: tab === t ? "white" : "hsl(var(--foreground))",
                }}
              >
                {t === "active" ? "Активные" : "Разрешённые"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: category === c ? "hsl(var(--med-light))" : "hsl(var(--muted))",
                color: category === c ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                border: category === c ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid transparent",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3 animate-fade-in">
          {filtered.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-all" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--med-light))" }}>
                    <Icon name="Stethoscope" size={18} style={{ color: "hsl(var(--primary))" }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{d.id}</span>
                        <span className="med-badge-blue">{d.category}</span>
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: PRIORITY_MAP[d.priority].bg, color: PRIORITY_MAP[d.priority].color }}
                        >
                          {PRIORITY_MAP[d.priority].label} приоритет
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>{d.diagnosis}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{d.patient}</p>
                      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{d.patientId}</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-lg" style={{ background: "hsl(var(--background))" }}>
                    <p className="text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Цель ухода:</p>
                    <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{d.goals}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Поставлен: {d.date}</p>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-xs px-3 py-1.5">
                        <Icon name="ClipboardList" size={12} />
                        Вмешательства
                      </button>
                      <button className="btn-primary text-xs px-3 py-1.5">
                        <Icon name="Edit2" size={12} />
                        Редактировать
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Stethoscope" size={32} className="mx-auto mb-3" style={{ color: "hsl(var(--muted-foreground))" }} />
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Диагнозы не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
