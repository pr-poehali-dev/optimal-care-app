import { useState } from "react";
import Icon from "@/components/ui/icon";
import Modal from "@/components/Modal";

interface Diagnosis {
  id: string; patient: string; patientId: string; date: string;
  category: string; diagnosis: string; priority: string; status: string; goals: string;
}

const INITIAL_DIAGNOSES: Diagnosis[] = [
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

const emptyForm = { patient: "", patientId: "", category: "Дыхание", diagnosis: "", priority: "medium", goals: "" };

export default function DiagnosesPage() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(INITIAL_DIAGNOSES);
  const [category, setCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"active" | "resolved">("active");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Diagnosis | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [savedMsg, setSavedMsg] = useState("");

  const showMsg = (msg: string) => { setSavedMsg(msg); setTimeout(() => setSavedMsg(""), 2500); };

  const filtered = diagnoses.filter((d) => {
    const matchCat = category === "Все" || d.category === category;
    const matchSearch = d.patient.toLowerCase().includes(search.toLowerCase()) ||
      d.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchTab = d.status === tab;
    return matchCat && matchSearch && matchTab;
  });

  const handleAdd = () => {
    if (!form.patient || !form.diagnosis) return;
    const newId = `Д-${String(diagnoses.length + 1).padStart(3, "0")}`;
    const today = new Date().toLocaleDateString("ru-RU");
    setDiagnoses([...diagnoses, { id: newId, ...form, date: today, status: "active" }]);
    setForm(emptyForm);
    setAddOpen(false);
    showMsg("Диагноз добавлен");
  };

  const handleEdit = () => {
    if (!editItem) return;
    setDiagnoses(diagnoses.map((d) => d.id === editItem.id ? { ...d, ...form } : d));
    setEditItem(null);
    showMsg("Диагноз обновлён");
  };

  const handleResolve = (id: string) => {
    setDiagnoses(diagnoses.map((d) => d.id === id ? { ...d, status: d.status === "active" ? "resolved" : "active" } : d));
    showMsg("Статус диагноза изменён");
  };

  const openEdit = (d: Diagnosis) => {
    setForm({ patient: d.patient, patientId: d.patientId, category: d.category, diagnosis: d.diagnosis, priority: d.priority, goals: d.goals });
    setEditItem(d);
  };

  const f = (label: string, key: keyof typeof form, opts?: string[]) => (
    <div key={key}>
      <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>{label}</label>
      {opts ? (
        <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
      )}
    </div>
  );

  const DiagForm = ({ onSave, label }: { onSave: () => void; label: string }) => (
    <div className="p-5 space-y-4">
      {f("Пациент (ФИО) *", "patient")}
      {f("ID пациента", "patientId")}
      {f("Категория", "category", CATEGORIES.slice(1))}
      {f("Приоритет", "priority", ["high", "medium", "low"])}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Диагноз *</label>
        <textarea rows={2} value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Цель ухода</label>
        <textarea rows={2} value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
      </div>
      <button onClick={onSave} className="btn-primary w-full justify-center">{label}</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {savedMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-fade-in"
          style={{ background: "linear-gradient(135deg, hsl(var(--med-blue)), hsl(var(--med-green)))" }}>
          <div className="flex items-center gap-2"><Icon name="CheckCircle2" size={16} />{savedMsg}</div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Сестринские диагнозы</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Активных: {diagnoses.filter((d) => d.status === "active").length} · Разрешённых: {diagnoses.filter((d) => d.status === "resolved").length}
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(emptyForm); setAddOpen(true); }}>
          <Icon name="Plus" size={16} />
          Новый диагноз
        </button>
      </div>

      <div className="bg-white border-b px-6 py-3 space-y-3" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input type="text" placeholder="Поиск по пациенту или диагнозу..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }} />
          </div>
          <div className="flex gap-1">
            {["active", "resolved"].map((t) => (
              <button key={t} onClick={() => setTab(t as "active" | "resolved")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: tab === t ? "hsl(var(--primary))" : "hsl(var(--muted))", color: tab === t ? "white" : "hsl(var(--foreground))" }}>
                {t === "active" ? "Активные" : "Разрешённые"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: category === c ? "hsl(var(--med-light))" : "hsl(var(--muted))",
                color: category === c ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                border: category === c ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid transparent",
              }}>
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: PRIORITY_MAP[d.priority].bg, color: PRIORITY_MAP[d.priority].color }}>
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
                  {d.goals && (
                    <div className="mt-3 p-3 rounded-lg" style={{ background: "hsl(var(--background))" }}>
                      <p className="text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Цель ухода:</p>
                      <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{d.goals}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Поставлен: {d.date}</p>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => handleResolve(d.id)}>
                        <Icon name={d.status === "active" ? "CheckCircle2" : "RefreshCw"} size={12} />
                        {d.status === "active" ? "Закрыть" : "Активировать"}
                      </button>
                      <button className="btn-primary text-xs px-3 py-1.5" onClick={() => openEdit(d)}>
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Новый сестринский диагноз">
        <DiagForm onSave={handleAdd} label="Добавить диагноз" />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Редактировать диагноз">
        <DiagForm onSave={handleEdit} label="Сохранить изменения" />
      </Modal>
    </div>
  );
}
