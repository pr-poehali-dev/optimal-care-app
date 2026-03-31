import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import DashboardPage from "@/pages/Dashboard";
import PatientsPage from "@/pages/Patients";
import DiagnosesPage from "@/pages/Diagnoses";
import InterventionsPage from "@/pages/Interventions";
import JournalPage from "@/pages/Journal";
import AssessmentPage from "@/pages/Assessment";
import StatisticsPage from "@/pages/Statistics";
import LoginPage from "@/pages/Login";

type Role = "nurse" | "doctor" | "admin";
type Page =
  | "dashboard"
  | "patients"
  | "diagnoses"
  | "interventions"
  | "journal"
  | "assessment"
  | "statistics";

export interface User {
  name: string;
  role: Role;
  department: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  nurse: "Медицинская сестра",
  doctor: "Врач",
  admin: "Администратор",
};

const NAV_ITEMS: { id: Page; label: string; icon: string; roles: Role[] }[] = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard", roles: ["nurse", "doctor", "admin"] },
  { id: "patients", label: "Пациенты", icon: "Users", roles: ["nurse", "doctor", "admin"] },
  { id: "diagnoses", label: "Сестринские диагнозы", icon: "Stethoscope", roles: ["nurse", "doctor", "admin"] },
  { id: "interventions", label: "Вмешательства", icon: "ClipboardList", roles: ["nurse", "doctor", "admin"] },
  { id: "journal", label: "Журнал событий", icon: "BookOpen", roles: ["nurse", "doctor", "admin"] },
  { id: "assessment", label: "Оценка эффективности", icon: "TrendingUp", roles: ["nurse", "doctor", "admin"] },
  { id: "statistics", label: "Статистика и отчёты", icon: "BarChart3", roles: ["admin", "doctor"] },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user) {
    return (
      <TooltipProvider>
        <LoginPage onLogin={(u) => setUser(u)} />
        <Toaster />
      </TooltipProvider>
    );
  }

  const availableNav = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <DashboardPage user={user} onNavigate={setCurrentPage} />;
      case "patients": return <PatientsPage />;
      case "diagnoses": return <DiagnosesPage />;
      case "interventions": return <InterventionsPage />;
      case "journal": return <JournalPage />;
      case "assessment": return <AssessmentPage />;
      case "statistics": return <StatisticsPage />;
      default: return <DashboardPage user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <aside
          className="flex flex-col transition-all duration-300 flex-shrink-0"
          style={{
            width: sidebarCollapsed ? "64px" : "260px",
            background: "hsl(var(--sidebar-background))",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(199 78% 55%), hsl(152 45% 50%))" }}>
              <Icon name="Heart" size={16} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="animate-fade-in overflow-hidden">
                <p className="text-white font-semibold text-sm leading-tight">Оптимальный уход</p>
                <p className="text-xs" style={{ color: "hsl(var(--sidebar-foreground))", opacity: 0.6 }}>
                  Метод Леоновой А.Ф.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {availableNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`sidebar-nav-item w-full ${currentPage === item.id ? "active" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon name={item.icon} size={18} className="flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="animate-fade-in truncate">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User info */}
          <div className="border-t p-3" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, hsl(199 78% 45%), hsl(152 45% 45%))" }}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-white text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs truncate" style={{ color: "hsl(var(--sidebar-foreground))", opacity: 0.6 }}>
                    {ROLE_LABELS[user.role]}
                  </p>
                </div>
                <button
                  onClick={() => setUser(null)}
                  className="p-1 rounded-md transition-colors hover:bg-white/10"
                  title="Выйти"
                >
                  <Icon name="LogOut" size={14} style={{ color: "hsl(var(--sidebar-foreground))" }} />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, hsl(199 78% 45%), hsl(152 45% 45%))" }}>
                  {user.name.charAt(0)}
                </div>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-center h-8 border-t transition-colors hover:bg-white/5"
            style={{ borderColor: "hsl(var(--sidebar-border))", color: "hsl(var(--sidebar-foreground))", opacity: 0.5 }}
          >
            <Icon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={14} />
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderPage()}
        </main>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
