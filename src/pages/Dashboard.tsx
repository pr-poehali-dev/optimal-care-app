import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User, ROLE_LABELS } from "@/App";
import Modal from "@/components/Modal";

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

const STATS = [
  { label: "Пациентов на отделении", value: "24", change: "+2 сегодня", icon: "Users", color: "hsl(var(--med-blue))", bg: "hsl(var(--med-light))" },
  { label: "Плановых вмешательств", value: "47", change: "На сегодня", icon: "ClipboardList", color: "hsl(var(--med-green))", bg: "hsl(142 65% 92%)" },
  { label: "Выполнено процедур", value: "31", change: "65.9% плана", icon: "CheckCircle", color: "hsl(var(--med-teal))", bg: "hsl(175 60% 92%)" },
  { label: "Критических статусов", value: "3", change: "Требуют внимания", icon: "AlertTriangle", color: "hsl(var(--med-warning))", bg: "hsl(38 90% 92%)" },
];

const RECENT_PATIENTS = [
  { id: "П-001", name: "Козлова Наталья Ивановна", age: 67, ward: "204", diagnosis: "ИБС, стенокардия", status: "stable", priority: "medium" },
  { id: "П-002", name: "Фёдоров Виктор Петрович", age: 54, ward: "207", diagnosis: "Гипертоническая болезнь III ст.", status: "attention", priority: "high" },
  { id: "П-003", name: "Белова Светлана Юрьевна", age: 71, ward: "201", diagnosis: "ХОБЛ, обострение", status: "critical", priority: "critical" },
  { id: "П-004", name: "Новиков Игорь Александрович", age: 45, ward: "210", diagnosis: "Пневмония внебольничная", status: "stable", priority: "low" },
  { id: "П-005", name: "Кузнецова Ольга Николаевна", age: 58, ward: "203", diagnosis: "Сахарный диабет 2 тип", status: "stable", priority: "medium" },
];

const UPCOMING_INTERVENTIONS = [
  { time: "08:00", patient: "Белова С.Ю.", type: "Измерение АД, SpO₂", ward: "201", done: true },
  { time: "09:00", patient: "Фёдоров В.П.", type: "Введение гипотензивных препаратов", ward: "207", done: true },
  { time: "10:30", patient: "Козлова Н.И.", type: "ЭКГ-мониторинг", ward: "204", done: false },
  { time: "11:00", patient: "Новиков И.А.", type: "Внутримышечная инъекция", ward: "210", done: false },
  { time: "13:00", patient: "Кузнецова О.Н.", type: "Контроль гликемии", ward: "203", done: false },
  { time: "14:00", patient: "Белова С.Ю.", type: "Ингаляционная терапия", ward: "201", done: false },
];

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  stable: { label: "Стабильный", className: "med-badge-green" },
  attention: { label: "Наблюдение", className: "med-badge-warning" },
  critical: { label: "Критический", className: "med-badge-danger" },
};

const PRIORITY_DOT: Record<string, string> = {
  low: "hsl(var(--med-success))",
  medium: "hsl(var(--med-warning))",
  high: "hsl(38 90% 40%)",
  critical: "hsl(var(--med-danger))",
};

const NOTIFICATIONS = [
  { id: 1, text: "Белова С.Ю. — SpO₂ снизилось до 88%", time: "10:32", type: "critical" },
  { id: 2, text: "Плановое вмешательство Козлова Н.И. через 15 мин", time: "10:15", type: "warning" },
  { id: 3, text: "Фёдоров В.П. — АД снизилось после приёма препарата", time: "09:48", type: "info" },
];

export default function DashboardPage({ user, onNavigate }: DashboardProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const now = new Date();
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Рабочий стол</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {dateStr} · {timeStr}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{user.name}</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {ROLE_LABELS[user.role]} · {user.department}
            </p>
          </div>
          <button
            onClick={() => setNotifOpen(true)}
            className="p-2 rounded-lg border transition-colors hover:bg-muted relative"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <Icon name="Bell" size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "hsl(var(--med-danger))" }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-card cursor-pointer" onClick={() => {
              if (stat.icon === "Users") onNavigate("patients");
              else if (stat.icon === "ClipboardList") onNavigate("interventions");
            }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon name={stat.icon} size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{stat.value}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{stat.label}</p>
              <p className="text-xs mt-1" style={{ color: stat.color }}>{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patients table */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
              <h2 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Пациенты отделения</h2>
              <button onClick={() => onNavigate("patients")} className="text-xs flex items-center gap-1 transition-colors hover:opacity-70" style={{ color: "hsl(var(--primary))" }}>
                Все пациенты <Icon name="ChevronRight" size={12} />
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {RECENT_PATIENTS.map((p) => (
                <div
                  key={p.id}
                  className="data-table-row px-5 py-3 flex items-center gap-4 cursor-pointer"
                  onClick={() => onNavigate("patients")}
                >
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full" style={{ background: PRIORITY_DOT[p.priority] }} />
                    <span className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{p.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>{p.name}</p>
                    <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{p.diagnosis}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Пал. {p.ward}</div>
                    <span className={STATUS_STYLES[p.status].className}>{STATUS_STYLES[p.status].label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's interventions */}
          <div className="bg-white rounded-xl border shadow-sm" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
              <h2 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Вмешательства на сегодня</h2>
              <button onClick={() => onNavigate("interventions")} className="text-xs flex items-center gap-1 transition-colors hover:opacity-70" style={{ color: "hsl(var(--primary))" }}>
                Все <Icon name="ChevronRight" size={12} />
              </button>
            </div>
            <div className="divide-y overflow-y-auto" style={{ borderColor: "hsl(var(--border))", maxHeight: "320px" }}>
              {UPCOMING_INTERVENTIONS.map((item, idx) => (
                <div key={idx} className={`px-5 py-3 flex items-start gap-3 ${item.done ? "opacity-50" : ""}`}>
                  <div className="text-xs font-mono font-medium flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))", minWidth: "40px" }}>
                    {item.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>{item.patient}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{item.type}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>Палата {item.ward}</p>
                  </div>
                  <div className="flex-shrink-0 mt-0.5">
                    {item.done ? (
                      <Icon name="CheckCircle2" size={16} style={{ color: "hsl(var(--med-success))" }} />
                    ) : (
                      <Icon name="Clock" size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "hsl(var(--border))" }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: "hsl(var(--foreground))" }}>Быстрые действия</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Добавить пациента", icon: "UserPlus", page: "patients" },
              { label: "Новый диагноз", icon: "Stethoscope", page: "diagnoses" },
              { label: "Назначить вмешательство", icon: "ClipboardPlus", page: "interventions" },
              { label: "Запись в журнал", icon: "PenLine", page: "journal" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.page)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--med-light))" }}>
                  <Icon name={action.icon} size={20} style={{ color: "hsl(var(--primary))" }} />
                </div>
                <span className="text-xs font-medium text-center leading-tight" style={{ color: "hsl(var(--foreground))" }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications modal */}
      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Уведомления">
        <div className="p-5 space-y-3">
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl border" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: n.type === "critical" ? "hsl(0 72% 92%)" : n.type === "warning" ? "hsl(38 90% 92%)" : "hsl(var(--med-light))",
                }}>
                <Icon
                  name={n.type === "critical" ? "AlertCircle" : n.type === "warning" ? "AlertTriangle" : "Info"}
                  size={16}
                  style={{ color: n.type === "critical" ? "hsl(var(--med-danger))" : n.type === "warning" ? "hsl(38 90% 35%)" : "hsl(var(--primary))" }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{n.text}</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{n.time}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => setNotifOpen(false)}
            className="btn-secondary w-full justify-center mt-2"
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}
