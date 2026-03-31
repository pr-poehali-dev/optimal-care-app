import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User } from "@/App";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const DEMO_USERS = [
  { name: "Иванова Мария Сергеевна", role: "nurse" as const, department: "Терапевтическое отделение", password: "nurse123" },
  { name: "Петров Андрей Николаевич", role: "doctor" as const, department: "Терапевтическое отделение", password: "doctor123" },
  { name: "Смирнова Елена Викторовна", role: "admin" as const, department: "Администрация", password: "admin123" },
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const found = DEMO_USERS.find(
        (u) => u.password === password && (
          login === u.role ||
          u.name.toLowerCase().includes(login.toLowerCase())
        )
      );
      if (found) {
        onLogin({ name: found.name, role: found.role, department: found.department });
      } else {
        setError("Неверный логин или пароль");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, hsl(215 35% 13%), hsl(199 60% 18%), hsl(152 40% 15%))" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(199 78% 55%), hsl(152 45% 50%))" }}>
            <Icon name="Heart" size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg leading-tight">Оптимальный уход</p>
            <p className="text-xs text-white/50">Метод Леоновой А.Ф.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Автоматизация<br />
              сестринского<br />
              <span style={{ color: "hsl(199 78% 65%)" }}>ухода</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Комплексная система для организации и оптимизации работы среднего медицинского персонала
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "Users", label: "Управление пациентами" },
              { icon: "ClipboardList", label: "Планирование вмешательств" },
              { icon: "TrendingUp", label: "Оценка эффективности" },
              { icon: "BarChart3", label: "Аналитика и отчёты" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(199 78% 38% / 0.3)" }}>
                  <Icon name={item.icon} size={16} style={{ color: "hsl(199 78% 70%)" }} />
                </div>
                <span className="text-white/70 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-sm">© 2026 Оптимальный уход. Медицинская информационная система.</p>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <div className="lg:hidden flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(199 78% 38%), hsl(152 45% 40%))" }}>
                  <Icon name="Heart" size={16} className="text-white" />
                </div>
                <p className="font-semibold text-sm">Оптимальный уход</p>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>Вход в систему</h2>
              <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Введите учётные данные для доступа
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(var(--foreground))" }}>
                  Логин
                </label>
                <div className="relative">
                  <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="nurse / doctor / admin"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
                    style={{
                      borderColor: "hsl(var(--border))",
                      background: "hsl(var(--background))",
                      color: "hsl(var(--foreground))",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "hsl(var(--primary))"}
                    onBlur={(e) => e.target.style.borderColor = "hsl(var(--border))"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(var(--foreground))" }}>
                  Пароль
                </label>
                <div className="relative">
                  <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
                    style={{
                      borderColor: "hsl(var(--border))",
                      background: "hsl(var(--background))",
                      color: "hsl(var(--foreground))",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "hsl(var(--primary))"}
                    onBlur={(e) => e.target.style.borderColor = "hsl(var(--border))"}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "hsl(0 72% 92%)", color: "hsl(var(--med-danger))" }}>
                  <Icon name="AlertCircle" size={14} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 mt-2"
              >
                {loading ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name="LogIn" size={16} />
                )}
                {loading ? "Вход..." : "Войти в систему"}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Демо-доступ:</p>
              <div className="space-y-1.5">
                {[
                  { login: "nurse", pass: "nurse123", label: "Медсестра" },
                  { login: "doctor", pass: "doctor123", label: "Врач" },
                  { login: "admin", pass: "admin123", label: "Администратор" },
                ].map((d) => (
                  <button
                    key={d.login}
                    onClick={() => { setLogin(d.login); setPassword(d.pass); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <span className="font-medium">{d.label}</span>
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>{d.login} / {d.pass}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
