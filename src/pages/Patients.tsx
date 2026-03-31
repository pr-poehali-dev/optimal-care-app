import { useState } from "react";
import Icon from "@/components/ui/icon";
import Modal from "@/components/Modal";

interface Patient {
  id: string; name: string; age: number; gender: string;
  ward: string; bed: string; admitDate: string; diagnosis: string;
  status: string; doctor: string; nurse: string;
}

const INITIAL_PATIENTS: Patient[] = [
  { id: "П-001", name: "Козлова Наталья Ивановна", age: 67, gender: "Ж", ward: "204", bed: "1", admitDate: "22.03.2026", diagnosis: "ИБС, стенокардия напряжения II ФК", status: "stable", doctor: "Петров А.Н.", nurse: "Иванова М.С." },
  { id: "П-002", name: "Фёдоров Виктор Петрович", age: 54, gender: "М", ward: "207", bed: "3", admitDate: "25.03.2026", diagnosis: "Гипертоническая болезнь III ст., криз", status: "attention", doctor: "Петров А.Н.", nurse: "Иванова М.С." },
  { id: "П-003", name: "Белова Светлана Юрьевна", age: 71, gender: "Ж", ward: "201", bed: "2", admitDate: "20.03.2026", diagnosis: "ХОБЛ, тяжёлое обострение", status: "critical", doctor: "Петров А.Н.", nurse: "Иванова М.С." },
  { id: "П-004", name: "Новиков Игорь Александрович", age: 45, gender: "М", ward: "210", bed: "1", admitDate: "28.03.2026", diagnosis: "Внебольничная пневмония, средней тяжести", status: "stable", doctor: "Петров А.Н.", nurse: "Иванова М.С." },
  { id: "П-005", name: "Кузнецова Ольга Николаевна", age: 58, gender: "Ж", ward: "203", bed: "4", admitDate: "15.03.2026", diagnosis: "Сахарный диабет 2 типа, декомпенсация", status: "stable", doctor: "Петров А.Н.", nurse: "Иванова М.С." },
  { id: "П-006", name: "Соколов Дмитрий Вячеславович", age: 62, gender: "М", ward: "206", bed: "2", admitDate: "29.03.2026", diagnosis: "Острый инфаркт миокарда", status: "critical", doctor: "Петров А.Н.", nurse: "Иванова М.С." },
  { id: "П-007", name: "Морозова Татьяна Сергеевна", age: 49, gender: "Ж", ward: "205", bed: "1", admitDate: "27.03.2026", diagnosis: "Ревматоидный артрит, активность II", status: "stable", doctor: "Петров А.Н.", nurse: "Иванова М.С." },
];

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  stable: { label: "Стабильный", className: "med-badge-green" },
  attention: { label: "Наблюдение", className: "med-badge-warning" },
  critical: { label: "Критический", className: "med-badge-danger" },
};

const emptyForm = { name: "", age: "", gender: "Ж", ward: "", bed: "", admitDate: "", diagnosis: "", status: "stable", doctor: "", nurse: "" };

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [interventionOpen, setInterventionOpen] = useState(false);
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [interventionText, setInterventionText] = useState("");
  const [diagnosisText, setDiagnosisText] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const filtered = patients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const selectedPatient = patients.find((p) => p.id === selected);

  const showMsg = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const handleAdd = () => {
    if (!form.name || !form.diagnosis || !form.ward) return;
    const newId = `П-${String(patients.length + 1).padStart(3, "0")}`;
    const today = new Date().toLocaleDateString("ru-RU");
    setPatients([...patients, {
      id: newId, name: form.name, age: Number(form.age) || 0, gender: form.gender,
      ward: form.ward, bed: form.bed || "1", admitDate: form.admitDate || today,
      diagnosis: form.diagnosis, status: form.status,
      doctor: form.doctor || "Не назначен", nurse: form.nurse || "Не назначена",
    }]);
    setForm(emptyForm);
    setAddOpen(false);
    showMsg(`Пациент ${form.name} добавлен`);
  };

  const handleEdit = () => {
    if (!selectedPatient || !form.name || !form.diagnosis) return;
    setPatients(patients.map((p) => p.id === selectedPatient.id
      ? { ...p, name: form.name, age: Number(form.age) || p.age, gender: form.gender, ward: form.ward || p.ward, bed: form.bed || p.bed, diagnosis: form.diagnosis, status: form.status, doctor: form.doctor || p.doctor, nurse: form.nurse || p.nurse }
      : p
    ));
    setEditOpen(false);
    showMsg("Данные пациента обновлены");
  };

  const handleDischarge = () => {
    if (!selectedPatient) return;
    setPatients(patients.filter((p) => p.id !== selectedPatient.id));
    setSelected(null);
    showMsg("Пациент выписан");
  };

  const openEdit = () => {
    if (!selectedPatient) return;
    setForm({ name: selectedPatient.name, age: String(selectedPatient.age), gender: selectedPatient.gender, ward: selectedPatient.ward, bed: selectedPatient.bed, admitDate: selectedPatient.admitDate, diagnosis: selectedPatient.diagnosis, status: selectedPatient.status, doctor: selectedPatient.doctor, nurse: selectedPatient.nurse });
    setEditOpen(true);
  };

  const field = (label: string, key: keyof typeof form, type = "text", opts?: string[]) => (
    <div key={key}>
      <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>{label}</label>
      {opts ? (
        <select
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
        >
          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
        />
      )}
    </div>
  );

  const PatientForm = ({ onSave, saveLabel }: { onSave: () => void; saveLabel: string }) => (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">{field("ФИО пациента *", "name")}</div>
        {field("Возраст", "age", "number")}
        {field("Пол", "gender", "text", ["Ж", "М"])}
        {field("Палата *", "ward")}
        {field("Койка", "bed")}
        {field("Дата поступления", "admitDate")}
        {field("Статус", "status", "text", ["stable", "attention", "critical"])}
        <div className="col-span-2">{field("Диагноз *", "diagnosis")}</div>
        {field("Лечащий врач", "doctor")}
        {field("Мед. сестра", "nurse")}
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={onSave} className="btn-primary flex-1 justify-center">{saveLabel}</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toast */}
      {savedMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-fade-in"
          style={{ background: "linear-gradient(135deg, hsl(var(--med-blue)), hsl(var(--med-green)))" }}>
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle2" size={16} />
            {savedMsg}
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Пациенты</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Всего: {patients.length} пациентов</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(emptyForm); setAddOpen(true); }}>
          <Icon name="UserPlus" size={16} />
          Добавить пациента
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col overflow-hidden transition-all ${selected ? "w-2/3" : "w-full"}`}>
          {/* Filters */}
          <div className="flex items-center gap-3 px-6 py-3 border-b bg-white" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="relative flex-1 max-w-sm">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input
                type="text"
                placeholder="Поиск по имени, ИД, диагнозу..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border outline-none transition-colors"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
              />
            </div>
            <div className="flex gap-1">
              {[
                { id: "all", label: "Все" },
                { id: "stable", label: "Стабильные" },
                { id: "attention", label: "Наблюдение" },
                { id: "critical", label: "Критические" },
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

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: "hsl(var(--border))" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>ИД / ФИО</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Диагноз</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Палата</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Поступление</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(selected === p.id ? null : p.id)}
                    className="data-table-row cursor-pointer"
                    style={{ background: selected === p.id ? "hsl(var(--accent))" : undefined }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                          style={{ background: "linear-gradient(135deg, hsl(var(--med-blue)), hsl(var(--med-teal)))" }}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{p.name}</p>
                          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{p.id} · {p.age} лет · {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm" style={{ color: "hsl(var(--foreground))", maxWidth: "200px" }}>{p.diagnosis}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="med-badge-blue">Пал. {p.ward} / Кой. {p.bed}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{p.admitDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={STATUS_MAP[p.status]?.className ?? "med-badge-blue"}>{STATUS_MAP[p.status]?.label ?? p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient detail panel */}
        {selectedPatient && (
          <div className="w-1/3 border-l overflow-y-auto animate-slide-in" style={{ borderColor: "hsl(var(--border))", background: "white" }}>
            <div className="sticky top-0 bg-white border-b flex items-center justify-between px-5 py-4 z-10" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Карточка пациента</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-muted">
                <Icon name="X" size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: "linear-gradient(135deg, hsl(var(--med-blue)), hsl(var(--med-teal)))" }}>
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>{selectedPatient.name}</p>
                  <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{selectedPatient.id} · {selectedPatient.age} лет · {selectedPatient.gender}</p>
                  <span className={`mt-1 ${STATUS_MAP[selectedPatient.status]?.className ?? "med-badge-blue"}`}>
                    {STATUS_MAP[selectedPatient.status]?.label ?? selectedPatient.status}
                  </span>
                </div>
              </div>

              {[
                { label: "Диагноз", value: selectedPatient.diagnosis },
                { label: "Палата / Койка", value: `Палата ${selectedPatient.ward}, Койка ${selectedPatient.bed}` },
                { label: "Дата поступления", value: selectedPatient.admitDate },
                { label: "Лечащий врач", value: selectedPatient.doctor },
                { label: "Палатная медсестра", value: selectedPatient.nurse },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg" style={{ background: "hsl(var(--background))" }}>
                  <p className="text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{item.label}</p>
                  <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{item.value}</p>
                </div>
              ))}

              <div className="space-y-2 pt-1">
                <button className="btn-primary w-full justify-center" onClick={() => { setInterventionText(""); setInterventionOpen(true); }}>
                  <Icon name="ClipboardList" size={14} />
                  Назначить вмешательство
                </button>
                <button className="btn-secondary w-full justify-center" onClick={() => { setDiagnosisText(""); setDiagnosisOpen(true); }}>
                  <Icon name="Stethoscope" size={14} />
                  Поставить диагноз
                </button>
                <button className="btn-secondary w-full justify-center" onClick={openEdit}>
                  <Icon name="Edit2" size={14} />
                  Редактировать
                </button>
                <button
                  className="w-full justify-center inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
                  style={{ borderColor: "hsl(0 72% 80%)", color: "hsl(var(--med-danger))", background: "hsl(0 72% 97%)" }}
                  onClick={handleDischarge}
                >
                  <Icon name="LogOut" size={14} />
                  Выписать пациента
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добавить пациента">
        <PatientForm onSave={handleAdd} saveLabel="Добавить пациента" />
      </Modal>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Редактировать данные пациента">
        <PatientForm onSave={handleEdit} saveLabel="Сохранить изменения" />
      </Modal>

      {/* Intervention modal */}
      <Modal open={interventionOpen} onClose={() => setInterventionOpen(false)} title={`Вмешательство: ${selectedPatient?.name ?? ""}`}>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Тип вмешательства</label>
            <select
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
              onChange={(e) => setInterventionText(e.target.value)}
            >
              <option value="">— выберите —</option>
              <option>Измерение АД и пульса</option>
              <option>Внутримышечная инъекция</option>
              <option>Постановка капельницы</option>
              <option>Ингаляционная терапия</option>
              <option>Контроль гликемии</option>
              <option>Смена повязки</option>
              <option>ЭКГ-мониторинг</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Время</label>
            <input type="time" className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Примечания</label>
            <textarea rows={3} value={interventionText} onChange={(e) => setInterventionText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
          </div>
          <button className="btn-primary w-full justify-center" onClick={() => { setInterventionOpen(false); showMsg("Вмешательство назначено"); }}>
            <Icon name="Check" size={14} />
            Назначить вмешательство
          </button>
        </div>
      </Modal>

      {/* Diagnosis modal */}
      <Modal open={diagnosisOpen} onClose={() => setDiagnosisOpen(false)} title={`Сестринский диагноз: ${selectedPatient?.name ?? ""}`}>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Категория</label>
            <select className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
              <option>Дыхание</option>
              <option>Кровообращение</option>
              <option>Боль</option>
              <option>Питание</option>
              <option>Двигательная активность</option>
              <option>Тревога</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Диагноз</label>
            <input type="text" value={diagnosisText} onChange={(e) => setDiagnosisText(e.target.value)}
              placeholder="Опишите проблему пациента..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Приоритет</label>
            <select className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Цель ухода</label>
            <textarea rows={3} placeholder="Ожидаемый результат..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }} />
          </div>
          <button className="btn-primary w-full justify-center" onClick={() => { setDiagnosisOpen(false); showMsg("Диагноз поставлен"); }}>
            <Icon name="Check" size={14} />
            Поставить диагноз
          </button>
        </div>
      </Modal>
    </div>
  );
}
