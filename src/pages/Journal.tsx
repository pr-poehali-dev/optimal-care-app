import { useState } from "react";
import Icon from "@/components/ui/icon";

const EVENTS = [
  { id: "Ж-001", date: "31.03.2026", time: "09:15", patient: "Белова С.Ю.", ward: "201", type: "observation", category: "Наблюдение", text: "Состояние тяжёлое. ЧДД 26/мин, SpO₂ 91%. Одышка в покое. Кашель с трудноотделяемой мокротой. Назначена ингаляционная терапия.", nurse: "Иванова М.С.", vital: { bp: "140/85", pulse: "92", temp: "37.8", spo2: "91%" } },
  { id: "Ж-002", date: "31.03.2026", time: "09:45", patient: "Фёдоров В.П.", ward: "207", type: "procedure", category: "Процедура", text: "Введён метопролол 50 мг перорально. Через 30 мин АД снизилось до 160/95 мм рт. ст. Самочувствие пациента улучшилось.", nurse: "Иванова М.С.", vital: { bp: "160/95", pulse: "78", temp: "36.6", spo2: "97%" } },
  { id: "Ж-003", date: "31.03.2026", time: "10:00", patient: "Козлова Н.И.", ward: "204", type: "observation", category: "Наблюдение", text: "АД 135/80 мм рт. ст., пульс ритмичный 74/мин. Болей нет. Настроение удовлетворительное. Аппетит снижен.", nurse: "Иванова М.С.", vital: { bp: "135/80", pulse: "74", temp: "36.4", spo2: "98%" } },
  { id: "Ж-004", date: "31.03.2026", time: "11:30", patient: "Кузнецова О.Н.", ward: "203", type: "assessment", category: "Оценка", text: "Гликемия до завтрака: 11.2 ммоль/л. Введено 8 ЕД инсулина короткого действия. Обучение по технике самоконтроля.", nurse: "Иванова М.С.", vital: { bp: "128/78", pulse: "71", temp: "36.5", spo2: "98%" } },
  { id: "Ж-005", date: "30.03.2026", time: "15:00", patient: "Соколов Д.В.", ward: "206", type: "procedure", category: "Процедура", text: "Первичная перевязка послеоперационной раны. Рана чистая, края сведены, признаков воспаления нет. Наложена асептическая повязка.", nurse: "Иванова М.С.", vital: { bp: "120/75", pulse: "68", temp: "37.2", spo2: "99%" } },
  { id: "Ж-006", date: "30.03.2026", time: "14:30", patient: "Новиков И.А.", ward: "210", type: "observation", category: "Наблюдение", text: "Температура тела 38.2°C. Назначен жаропонижающий препарат. Пациенту рекомендовано обильное питьё. Повторное измерение через 1 час.", nurse: "Иванова М.С.", vital: { bp: "118/72", pulse: "88", temp: "38.2", spo2: "97%" } },
];

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  observation: { icon: "Eye", color: "hsl(var(--med-blue))", bg: "hsl(var(--med-light))", label: "Наблюдение" },
  procedure: { icon: "Syringe", color: "hsl(var(--med-green))", bg: "hsl(142 65% 92%)", label: "Процедура" },
  assessment: { icon: "TrendingUp", color: "hsl(var(--med-teal))", bg: "hsl(175 60% 92%)", label: "Оценка" },
  incident: { icon: "AlertTriangle", color: "hsl(var(--med-danger))", bg: "hsl(0 72% 92%)", label: "Инцидент" },
};

export default function JournalPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = EVENTS.filter((e) => {
    const matchType = filter === "all" || e.type === filter;
    const matchSearch =
      e.patient.toLowerCase().includes(search.toLowerCase()) ||
      e.text.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const groupedByDate = filtered.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, typeof filtered>);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="page-header">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Журнал событий</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Записей: {EVENTS.length}</p>
        </div>
        <button className="btn-primary">
          <Icon name="PenLine" size={16} />
          Новая запись
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 bg-white border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="relative flex-1 max-w-sm">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Поиск в журнале..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
          />
        </div>
        <div className="flex gap-1">
          {[
            { id: "all", label: "Все" },
            { id: "observation", label: "Наблюдения" },
            { id: "procedure", label: "Процедуры" },
            { id: "assessment", label: "Оценки" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filter === f.id ? "hsl(var(--primary))" : "hsl(var(--muted))",
                color: filter === f.id ? "white" : "hsl(var(--foreground))",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in">
        {Object.entries(groupedByDate).map(([date, events]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "hsl(var(--med-light))", color: "hsl(var(--primary))" }}>
                {date}
              </div>
              <div className="flex-1 h-px" style={{ background: "hsl(var(--border))" }}></div>
              <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{events.length} записей</span>
            </div>

            <div className="space-y-2">
              {events.map((event) => {
                const cfg = TYPE_CONFIG[event.type];
                const isExpanded = expanded === event.id;
                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-sm"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <button
                      className="w-full flex items-start gap-4 p-4 text-left"
                      onClick={() => setExpanded(isExpanded ? null : event.id)}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: cfg.bg }}>
                          <Icon name={cfg.icon} size={16} style={{ color: cfg.color }} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{event.id}</span>
                          <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>·</span>
                          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{event.time}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                            {event.patient} <span className="font-normal text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>· Пал. {event.ward}</span>
                          </p>
                        </div>
                        <p className="text-sm mt-1 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>{event.text}</p>
                      </div>
                      <Icon
                        name={isExpanded ? "ChevronUp" : "ChevronDown"}
                        size={16}
                        className="flex-shrink-0 mt-1 transition-transform"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 animate-fade-in">
                        <div className="ml-13 pl-13">
                          <div className="p-4 rounded-xl space-y-3" style={{ background: "hsl(var(--background))", marginLeft: "52px" }}>
                            <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{event.text}</p>

                            {event.vital && (
                              <div className="grid grid-cols-4 gap-2 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                                {[
                                  { label: "АД", value: event.vital.bp, unit: "мм рт. ст." },
                                  { label: "Пульс", value: event.vital.pulse, unit: "уд/мин" },
                                  { label: "Темп.", value: event.vital.temp, unit: "°C" },
                                  { label: "SpO₂", value: event.vital.spo2, unit: "" },
                                ].map((v) => (
                                  <div key={v.label} className="p-2 rounded-lg text-center" style={{ background: "hsl(var(--med-light))" }}>
                                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{v.label}</p>
                                    <p className="text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>{v.value}</p>
                                    {v.unit && <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{v.unit}</p>}
                                  </div>
                                ))}
                              </div>
                            )}

                            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Записала: {event.nurse}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
