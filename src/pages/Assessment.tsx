import Icon from "@/components/ui/icon";

const ASSESSMENTS = [
  {
    id: "О-001",
    patient: "Белова С.Ю.",
    patientId: "П-003",
    diagnosis: "Неэффективное очищение дыхательных путей",
    startDate: "20.03.2026",
    lastCheck: "31.03.2026",
    progress: 45,
    dynamics: "negative",
    indicators: [
      { name: "ЧДД", initial: "28/мин", current: "26/мин", target: "≤18/мин", trend: "stable" },
      { name: "SpO₂", initial: "88%", current: "91%", target: "≥95%", trend: "positive" },
      { name: "Оценка кашля", initial: "4/5", current: "3/5", target: "0/5", trend: "positive" },
    ],
  },
  {
    id: "О-002",
    patient: "Фёдоров В.П.",
    patientId: "П-002",
    diagnosis: "Риск снижения сердечного выброса",
    startDate: "25.03.2026",
    lastCheck: "31.03.2026",
    progress: 60,
    dynamics: "positive",
    indicators: [
      { name: "АД", initial: "195/110", current: "160/95", target: "130/80", trend: "positive" },
      { name: "Пульс", initial: "98/мин", current: "78/мин", target: "60-80/мин", trend: "positive" },
    ],
  },
  {
    id: "О-003",
    patient: "Кузнецова О.Н.",
    patientId: "П-005",
    diagnosis: "Нарушение питания: более потребностей",
    startDate: "15.03.2026",
    lastCheck: "31.03.2026",
    progress: 70,
    dynamics: "positive",
    indicators: [
      { name: "Гликемия натощак", initial: "14.2 ммоль/л", current: "11.2 ммоль/л", target: "≤6.1 ммоль/л", trend: "positive" },
      { name: "ИМТ", initial: "31.2", current: "30.8", target: "≤25", trend: "stable" },
    ],
  },
  {
    id: "О-004",
    patient: "Козлова Н.И.",
    patientId: "П-001",
    diagnosis: "Острая боль в грудной клетке",
    startDate: "22.03.2026",
    lastCheck: "30.03.2026",
    progress: 100,
    dynamics: "resolved",
    indicators: [
      { name: "Болевая шкала ВАШ", initial: "7/10", current: "0/10", target: "0/10", trend: "positive" },
    ],
  },
];

const DYNAMICS_MAP: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  positive: { label: "Улучшение", icon: "TrendingUp", color: "hsl(var(--med-green))", bg: "hsl(142 65% 92%)" },
  negative: { label: "Ухудшение", icon: "TrendingDown", color: "hsl(var(--med-danger))", bg: "hsl(0 72% 92%)" },
  stable: { label: "Без динамики", icon: "Minus", color: "hsl(38 90% 40%)", bg: "hsl(38 90% 92%)" },
  resolved: { label: "Проблема решена", icon: "CheckCircle2", color: "hsl(var(--med-success))", bg: "hsl(142 65% 92%)" },
};

const TREND_ICONS: Record<string, { icon: string; color: string }> = {
  positive: { icon: "ArrowUp", color: "hsl(var(--med-success))" },
  negative: { icon: "ArrowDown", color: "hsl(var(--med-danger))" },
  stable: { icon: "Minus", color: "hsl(38 90% 40%)" },
};

export default function AssessmentPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="page-header">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Оценка эффективности</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Динамическое наблюдение за сестринскими вмешательствами</p>
        </div>
        <button className="btn-primary">
          <Icon name="Plus" size={16} />
          Новая оценка
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-white border-b" style={{ borderColor: "hsl(var(--border))" }}>
        {[
          { label: "Всего под наблюдением", value: ASSESSMENTS.length, icon: "ClipboardList", color: "hsl(var(--primary))", bg: "hsl(var(--med-light))" },
          { label: "Положительная динамика", value: ASSESSMENTS.filter((a) => a.dynamics === "positive").length, icon: "TrendingUp", color: "hsl(var(--med-green))", bg: "hsl(142 65% 92%)" },
          { label: "Требуют внимания", value: ASSESSMENTS.filter((a) => a.dynamics === "negative").length, icon: "AlertCircle", color: "hsl(var(--med-danger))", bg: "hsl(0 72% 92%)" },
          { label: "Проблемы решены", value: ASSESSMENTS.filter((a) => a.dynamics === "resolved").length, icon: "CheckCircle2", color: "hsl(var(--med-success))", bg: "hsl(142 65% 92%)" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: s.bg }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/60">
              <Icon name={s.icon} size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: s.color, opacity: 0.8 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 animate-fade-in">
        {ASSESSMENTS.map((a) => {
          const dyn = DYNAMICS_MAP[a.dynamics];
          return (
            <div key={a.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{a.id}</span>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: dyn.bg, color: dyn.color }}
                      >
                        <Icon name={dyn.icon} size={10} />
                        {dyn.label}
                      </span>
                    </div>
                    <h3 className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>{a.diagnosis}</h3>
                    <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {a.patient} · {a.patientId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Начало: {a.startDate}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Последняя оценка: {a.lastCheck}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>Достижение цели</span>
                    <span className="text-xs font-bold" style={{ color: a.progress === 100 ? "hsl(var(--med-success))" : "hsl(var(--primary))" }}>
                      {a.progress}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${a.progress}%`,
                        background: a.progress === 100
                          ? "linear-gradient(90deg, hsl(var(--med-success)), hsl(var(--med-green)))"
                          : a.dynamics === "negative"
                          ? "linear-gradient(90deg, hsl(var(--med-danger)), hsl(38 90% 50%))"
                          : "linear-gradient(90deg, hsl(var(--med-blue)), hsl(var(--med-green)))",
                      }}
                    />
                  </div>
                </div>

                {/* Indicators table */}
                <div className="overflow-hidden rounded-xl border" style={{ borderColor: "hsl(var(--border))" }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "hsl(var(--muted))" }}>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Показатель</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Исходно</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Текущее</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Целевое</th>
                        <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Тренд</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.indicators.map((ind, i) => (
                        <tr key={i} className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                          <td className="px-4 py-2.5 text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{ind.name}</td>
                          <td className="px-4 py-2.5 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{ind.initial}</td>
                          <td className="px-4 py-2.5 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{ind.current}</td>
                          <td className="px-4 py-2.5 text-sm" style={{ color: "hsl(var(--med-green))" }}>{ind.target}</td>
                          <td className="px-4 py-2.5 text-center">
                            <Icon
                              name={TREND_ICONS[ind.trend].icon}
                              size={14}
                              className="mx-auto"
                              style={{ color: TREND_ICONS[ind.trend].color }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button className="btn-secondary text-xs px-3 py-1.5">
                    <Icon name="History" size={12} />
                    История динамики
                  </button>
                  <button className="btn-primary text-xs px-3 py-1.5">
                    <Icon name="PenLine" size={12} />
                    Добавить оценку
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
