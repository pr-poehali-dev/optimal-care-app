import { useState } from "react";
import Icon from "@/components/ui/icon";
import Modal from "@/components/Modal";

interface Intervention {
  id: string; patient: string; ward: string; type: string;
  time: string; date: string; status: string; nurse: string; notes: string;
}

const INITIAL: Intervention[] = [
  { id: "В-001", patient: "Белова С.Ю.", ward: "201", type: "Ингаляционная терапия", time: "10:00", date: "31.03.2026", status: "completed", nurse: "Иванова М.С.", notes: "Выполнено без осложнений" },
  { id: "В-002", patient: "Фёдоров В.П.", ward: "207", type: "Измерение АД", time: "10:30", date: "31.03.2026", status: "pending", nurse: "Иванова М.С.", notes: "" },
  { id: "В-003", patient: "Козлова Н.И.", ward: "204", type: "ЭКГ-мониторинг", time: "11:00", date: "31.03.2026", status: "pending", nurse: "Иванова М.С.", notes: "" },
  { id: "В-004", patient: "Кузнецова О.Н.", ward: "203", type: "Контроль гликемии", time: "13:00", date: "31.03.2026", status: "pending", nurse: "Иванова М.С.", notes: "" },
  { id: "В-005", patient: "Соколов Д.В.", ward: "206", type: "Смена повязки", time: "14:30", date: "31.03.2026", status: "in_progress", nurse: "Иванова М.С.", notes: "Перевязочный материал приготовлен" },
  { id: "В-006", patient: "Новиков И.А.", ward: "210", type: "Постановка капельницы", time: "15:00", date: "31.03.2026", status: "pending", nurse: "Иванова М.С.", notes: "" },
];

const TEMPLATES = [
  { id: "Ш-001", name: "Измерение АД и пульса", category: "Мониторинг", duration: "5 мин", frequency: "Каждые 2 часа" },
  { id: "Ш-002", name: "Инъекция внутримышечная", category: "Манипуляция", duration: "10 мин", frequency: "По назначению" },
  { id: "Ш-003", name: "Постановка капельницы", category: "Манипуляция", duration: "30 мин", frequency: "По назначению" },
  { id: "Ш-004", name: "Ингаляционная терапия", category: "Процедура", duration: "15 мин", frequency: "3 раза в день" },
  { id: "Ш-005", name: "Контроль гликемии", category: "Мониторинг", duration: "5 мин", frequency: "Перед едой" },
  { id: "Ш-006", name: "Смена повязки", category: "Процедура", duration: "20 мин", frequency: "Ежедневно" },
];

const STATUS_MAP: Record<string, { label: string; className: string; icon: string }> = {
  completed: { label: "Выполнено", className: "med-badge-green", icon: "CheckCircle2" },
  pending: { label: "Запланировано", className: "med-badge-blue", icon: "Clock" },
  in_progress: { label: "Выполняется", className: "med-badge-warning", icon: "Loader2" },
  cancelled: { label: "Отменено", className: "med-badge-danger", icon: "XCircle" },
};

const emptyForm = { patient: "", ward: "", type: "", time: "", notes: "" };

export default function InterventionsPage() {
  const [items, setItems] = useState<Intervention[]>(INITIAL);
  const [view, setView] = useState<"list" | "templates">("list");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [completeItem, setCompleteItem] = useState<Intervention | null>(null);
  const [notesText, setNotesText] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [savedMsg, setSavedMsg] = useState("");

  const showMsg = (msg: string) => { setSavedMsg(msg); setTimeout(() => setSavedMsg(""), 2500); };

  const filtered = items.filter(
    (i) => i.patient.toLowerCase().includes(search.toLowerCase()) || i.type.toLowerCase().includes(search.toLowerCase())
  );

  const completed = items.filter((i) => i.status === "completed").length;
  const total = items.length;

  const handleComplete = () => {
    if (!completeItem) return;
    setItems(items.map((i) => i.id === completeItem.id ? { ...i, status: "completed", notes: notesText || i.notes } : i));
    setCompleteItem(null);
    showMsg("Вмешательство выполнено");
  };

  const handleAdd = () => {
    if (!form.patient || !form.type || !form.time) return;
    const newId = `В-${String(items.length + 1).padStart(3, "0")}`;
    const today = new Date().toLocaleDateString("ru-RU");
    setItems([...items, { id: newId, ...form, date: today, status: "pending", nurse: "Иванова М.С." }]);
    setForm(emptyForm);
    setAddOpen(false);
    showMsg("Вмешательство назначено");
  };

  const handleCancel = (id: string) => {
    setItems(items.map((i) => i.id === id ? { ...i, status: "cancelled" } : i));
    showMsg("Вмешательство отменено");
  };

  const applyTemplate = (name: string) => {
    setForm({ ...emptyForm, type: name });
    setView("list");
    setAddOpen(true);
  };

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
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Вмешательства</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Выполнено: {completed} из {total} на сегодня</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: "hsl(var(--muted))" }}>
            {(["list", "templates"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{ background: view === v ? "white" : "transparent", color: "hsl(var(--foreground))", boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                <Icon name={v === "list" ? "List" : "LayoutTemplate"} size={14} />
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => { setForm(emptyForm); setAddOpen(true); }}>
            <Icon name="Plus" size={16} />
            Назначить
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3 bg-white border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>Выполнение плана на сегодня</span>
          <span className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>{Math.round((completed / total) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%`, background: "linear-gradient(90deg, hsl(var(--med-blue)), hsl(var(--med-green)))" }} />
        </div>
      </div>

      {view === "list" ? (
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-3 border-b bg-white" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="relative max-w-sm">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input type="text" placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border outline-none"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }} />
            </div>
          </div>
          <div className="p-6 space-y-2 animate-fade-in">
            {filtered.map((item) => {
              const s = STATUS_MAP[item.status];
              return (
                <div key={item.id}
                  className={`bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition-all ${item.status === "cancelled" ? "opacity-50" : ""}`}
                  style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="w-14 text-center flex-shrink-0">
                    <p className="text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>{item.time}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{item.date}</p>
                  </div>
                  <div className="w-px h-10 flex-shrink-0" style={{ background: "hsl(var(--border))" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{item.type}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {item.patient} · Палата {item.ward} · {item.nurse}
                    </p>
                    {item.notes && <p className="text-xs mt-1 italic" style={{ color: "hsl(var(--muted-foreground))" }}>{item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={s.className}><Icon name={s.icon} size={10} />{s.label}</span>
                    {item.status === "pending" && (
                      <>
                        <button className="btn-primary text-xs px-3 py-1.5" onClick={() => { setCompleteItem(item); setNotesText(""); }}>
                          <Icon name="Check" size={12} />Выполнить
                        </button>
                        <button className="btn-secondary text-xs px-2 py-1.5" onClick={() => handleCancel(item.id)} title="Отменить">
                          <Icon name="X" size={12} />
                        </button>
                      </>
                    )}
                    {item.status === "in_progress" && (
                      <button className="btn-primary text-xs px-3 py-1.5" onClick={() => { setCompleteItem(item); setNotesText(item.notes); }}>
                        <Icon name="CheckCircle2" size={12} />Завершить
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {TEMPLATES.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-all"
                style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--med-light))" }}>
                    <Icon name="ClipboardList" size={18} style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <span className="med-badge-blue">{t.category}</span>
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "hsl(var(--foreground))" }}>{t.name}</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <Icon name="Clock" size={12} />{t.duration}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <Icon name="RefreshCw" size={12} />{t.frequency}
                  </div>
                </div>
                <button className="btn-primary w-full justify-center mt-4 text-xs" onClick={() => applyTemplate(t.name)}>
                  <Icon name="Plus" size={12} />
                  Использовать шаблон
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Назначить вмешательство">
        <div className="p-5 space-y-4">
          {(["patient", "ward"] as const).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>
                {key === "patient" ? "Пациент (ФИО) *" : "Палата"}
              </label>
              <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Тип вмешательства *</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
              <option value="">— выберите —</option>
              {TEMPLATES.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Время *</label>
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Примечания</label>
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
          </div>
          <button className="btn-primary w-full justify-center" onClick={handleAdd}>
            <Icon name="Check" size={14} />Назначить вмешательство
          </button>
        </div>
      </Modal>

      {/* Complete modal */}
      <Modal open={!!completeItem} onClose={() => setCompleteItem(null)} title="Отметить выполнение">
        <div className="p-5 space-y-4">
          {completeItem && (
            <div className="p-3 rounded-xl" style={{ background: "hsl(var(--med-light))" }}>
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>{completeItem.type}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{completeItem.patient} · Палата {completeItem.ward}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Примечания по выполнению</label>
            <textarea rows={3} value={notesText} onChange={(e) => setNotesText(e.target.value)}
              placeholder="Опишите как прошло вмешательство..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
          </div>
          <button className="btn-primary w-full justify-center" onClick={handleComplete}>
            <Icon name="CheckCircle2" size={14} />Подтвердить выполнение
          </button>
        </div>
      </Modal>
    </div>
  );
}