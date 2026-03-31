import Icon from "@/components/ui/icon";

const MONTHLY_DATA = [
  { month: "Янв", interventions: 312, completed: 289, patients: 18 },
  { month: "Фев", interventions: 298, completed: 271, patients: 21 },
  { month: "Мар", interventions: 341, completed: 318, patients: 24 },
];

const TOP_INTERVENTIONS = [
  { name: "Измерение АД", count: 142, percent: 42 },
  { name: "Введение препаратов", count: 98, percent: 29 },
  { name: "Контроль гликемии", count: 67, percent: 20 },
  { name: "Смена повязок", count: 54, percent: 16 },
  { name: "Ингаляционная терапия", count: 48, percent: 14 },
];

const DIAGNOSIS_STATS = [
  { category: "Дыхание", count: 8, color: "hsl(199 78% 38%)" },
  { category: "Кровообращение", count: 6, color: "hsl(152 45% 40%)" },
  { category: "Боль", count: 5, color: "hsl(175 60% 38%)" },
  { category: "Питание", count: 4, color: "hsl(38 90% 45%)" },
  { category: "Двигательная активность", count: 3, color: "hsl(270 60% 55%)" },
];

const totalDiagnoses = DIAGNOSIS_STATS.reduce((sum, d) => sum + d.count, 0);

const REPORTS = [
  { name: "Отчёт по выполнению вмешательств", period: "Март 2026", icon: "ClipboardList", type: "monthly" },
  { name: "Статистика сестринских диагнозов", period: "Март 2026", icon: "Stethoscope", type: "monthly" },
  { name: "Оценка эффективности ухода", period: "Q1 2026", icon: "TrendingUp", type: "quarterly" },
  { name: "Журнал процедур и манипуляций", period: "31.03.2026", icon: "BookOpen", type: "daily" },
];

const maxInterventions = Math.max(...MONTHLY_DATA.map((d) => d.interventions));

export default function StatisticsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="page-header">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Статистика и отчёты</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Аналитика сестринской деятельности</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Icon name="Filter" size={14} />
            Период
          </button>
          <button className="btn-primary">
            <Icon name="Download" size={14} />
            Экспорт
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Пациентов за месяц", value: "24", sub: "↑ 14% vs предыдущий", icon: "Users", positive: true },
            { label: "Вмешательств", value: "341", sub: "↑ 14% vs предыдущий", icon: "ClipboardList", positive: true },
            { label: "Выполнение плана", value: "93.3%", sub: "318 из 341", icon: "CheckCircle", positive: true },
            { label: "Ср. время на процедуру", value: "12 мин", sub: "↓ 2 мин vs предыдущий", icon: "Timer", positive: true },
          ].map((kpi) => (
            <div key={kpi.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--med-light))" }}>
                  <Icon name={kpi.icon} size={18} style={{ color: "hsl(var(--primary))" }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{kpi.value}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{kpi.label}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--med-green))" }}>{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart - interventions */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: "hsl(var(--border))" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: "hsl(var(--foreground))" }}>Вмешательства по месяцам</h3>
            <div className="space-y-4">
              {MONTHLY_DATA.map((d) => (
                <div key={d.month}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{d.month} 2026</span>
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {d.completed}/{d.interventions} · {Math.round((d.completed / d.interventions) * 100)}%
                    </span>
                  </div>
                  <div className="relative h-8 rounded-lg overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700"
                      style={{
                        width: `${(d.interventions / maxInterventions) * 100}%`,
                        background: "hsl(var(--med-light))",
                      }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700"
                      style={{
                        width: `${(d.completed / maxInterventions) * 100}%`,
                        background: "linear-gradient(90deg, hsl(var(--med-blue)), hsl(var(--med-teal)))",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-xs font-medium text-white z-10">{d.patients} пациентов</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--med-blue)), hsl(var(--med-teal)))" }}></div>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Выполнено</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--med-light))" }}></div>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Запланировано</span>
              </div>
            </div>
          </div>

          {/* Diagnosis distribution */}
          <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: "hsl(var(--border))" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: "hsl(var(--foreground))" }}>Диагнозы по категориям</h3>
            <div className="space-y-3">
              {DIAGNOSIS_STATS.map((d) => (
                <div key={d.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: "hsl(var(--foreground))" }}>{d.category}</span>
                    <span className="text-xs font-semibold" style={{ color: d.color }}>{d.count}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.count / totalDiagnoses) * 100}%`,
                        background: d.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top interventions */}
          <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: "hsl(var(--border))" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: "hsl(var(--foreground))" }}>Топ вмешательств</h3>
            <div className="space-y-3">
              {TOP_INTERVENTIONS.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs font-mono w-5 text-right" style={{ color: "hsl(var(--muted-foreground))" }}>{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: "hsl(var(--foreground))" }}>{item.name}</span>
                      <span className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>{item.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.percent}%`,
                          background: `linear-gradient(90deg, hsl(var(--med-blue)), hsl(var(--med-green)))`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: "hsl(var(--border))" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: "hsl(var(--foreground))" }}>Сформировать отчёт</h3>
            <div className="space-y-2">
              {REPORTS.map((r) => (
                <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm hover:border-primary/30 cursor-pointer" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--med-light))" }}>
                    <Icon name={r.icon} size={16} style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>{r.name}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{r.period}</p>
                  </div>
                  <button className="p-2 rounded-lg transition-colors hover:bg-muted flex-shrink-0">
                    <Icon name="Download" size={14} style={{ color: "hsl(var(--primary))" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
