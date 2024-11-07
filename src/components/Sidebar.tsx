import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Wallet, 
  Settings, 
  CheckSquare,
  Target,
  UserSquare2,
  Menu,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeRoute: string;
  onRouteChange: (route: string) => void;
  onToggle: () => void;
}

const routes = [
  { icon: LayoutDashboard, text: "Dashboard", id: "dashboard" },
  { icon: Users, text: "Clientes", id: "clients" },
  { icon: Clock, text: "Prazos", id: "deadlines" },
  { icon: Wallet, text: "Fluxo de Caixa", id: "cashflow" },
  { icon: Target, text: "Tráfego", id: "traffic" },
  { icon: UserSquare2, text: "CRM", id: "crm" },
  { icon: CheckSquare, text: "Tarefas", id: "tasks" },
  { icon: Settings, text: "Configurações", id: "settings" }
];

export const Sidebar = ({ isOpen, activeRoute, onRouteChange, onToggle }: SidebarProps) => {
  return (
    <aside 
      className={`
        ${isOpen ? 'w-64' : 'w-20'} 
        glass-effect
        fixed h-full z-30
        transition-all duration-300 ease-in-out
      `}
    >
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4 mb-8`}>
        <div className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}>
          <div className="relative">
            <Boxes className="w-8 h-8 text-primary-500 animate-float" />
            <div className="absolute inset-0 bg-primary-500/20 blur-xl -z-10"></div>
          </div>
          {isOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-transparent bg-clip-text animate-fadeIn">
              TechFlow
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="px-4 space-y-2">
        {routes.map((route) => (
          <a
            key={route.id}
            onClick={() => onRouteChange(route.id)}
            className={`
              flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center'} 
              p-3 rounded-lg cursor-pointer
              transition-all duration-300
              ${
                activeRoute === route.id 
                  ? 'bg-primary-500 text-white shadow-neon' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-dark-700'
              }
            `}
          >
            <route.icon className={`w-5 h-5 flex-shrink-0 transition-transform ${activeRoute === route.id ? 'scale-110' : ''}`} />
            {isOpen && (
              <span className="ml-3 animate-fadeIn whitespace-nowrap">
                {route.text}
              </span>
            )}
          </a>
        ))}
      </nav>
    </aside>
  );
};