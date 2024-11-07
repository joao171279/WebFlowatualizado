import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { StatCard } from './StatCard';
import { ClientsView } from './ClientsView';
import { DeadlinesView } from './DeadlinesView';
import { CashFlowView } from './CashFlowView';
import { TasksView } from './TasksView';
import { SettingsView } from './SettingsView';
import { TrafficView } from './TrafficView';
import { CRMView } from './CRMView';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './common/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Clock, CheckSquare, ArrowUp, ArrowDown } from 'lucide-react';

// Initialize with empty data
const initialTransactions = [];
const emptyMonthlyData = [
  { month: 'Jan', income: 0, expense: 0, profit: 0 },
  { month: 'Fev', income: 0, expense: 0, profit: 0 },
  { month: 'Mar', income: 0, expense: 0, profit: 0 },
  { month: 'Abr', income: 0, expense: 0, profit: 0 },
  { month: 'Mai', income: 0, expense: 0, profit: 0 },
  { month: 'Jun', income: 0, expense: 0, profit: 0 }
];
const initialProjectStatus = [
  { name: 'Em Andamento', value: 0 },
  { name: 'Concluídos', value: 0 },
  { name: 'Em Pausa', value: 0 },
  { name: 'Cancelados', value: 0 }
];

// Helper function to safely parse JSON from localStorage
const getStorageData = (key: string, defaultValue: any) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to safely save data to localStorage
const setStorageData = (key: string, value: any) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => getStorageData('darkMode', false));
  const [transactions, setTransactions] = useState(() => getStorageData('transactions', initialTransactions));
  const [monthlyData, setMonthlyData] = useState(() => getStorageData('monthlyData', emptyMonthlyData));
  const [projectStatus, setProjectStatus] = useState(() => getStorageData('projectStatus', initialProjectStatus));
  
  const { logout } = useAuth();

  // Persist dark mode and update document class
  useEffect(() => {
    setStorageData('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Persist transactions
  useEffect(() => {
    setStorageData('transactions', transactions);
  }, [transactions]);

  // Persist monthly data
  useEffect(() => {
    setStorageData('monthlyData', monthlyData);
  }, [monthlyData]);

  // Persist project status
  useEffect(() => {
    setStorageData('projectStatus', projectStatus);
  }, [projectStatus]);

  // Sync data across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'transactions') {
        setTransactions(getStorageData('transactions', initialTransactions));
      } else if (e.key === 'monthlyData') {
        setMonthlyData(getStorageData('monthlyData', emptyMonthlyData));
      } else if (e.key === 'projectStatus') {
        setProjectStatus(getStorageData('projectStatus', initialProjectStatus));
      } else if (e.key === 'darkMode') {
        setDarkMode(getStorageData('darkMode', false));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleUpdateTransactions = (newTransactions) => {
    setTransactions(newTransactions);
    // Update monthly data based on new transactions
    const updatedMonthlyData = calculateMonthlyData(newTransactions);
    setMonthlyData(updatedMonthlyData);
  };

  const calculateMonthlyData = (transactionList) => {
    const monthData = {};
    
    transactionList.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!monthData[month]) {
        monthData[month] = { month, income: 0, expense: 0, profit: 0 };
      }
      
      if (transaction.type === 'income') {
        monthData[month].income += transaction.amount;
      } else {
        monthData[month].expense += transaction.amount;
      }
      monthData[month].profit = monthData[month].income - monthData[month].expense;
    });

    return Object.values(monthData);
  };

  const renderDashboard = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    return (
      <div className="space-y-6 animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Receitas Totais"
            value={`R$ ${totalIncome.toLocaleString()}`}
            change="Total acumulado"
            icon={TrendingUp}
            changeColor="text-emerald-600"
            trend="up"
          />
          <StatCard
            title="Despesas Totais"
            value={`R$ ${totalExpenses.toLocaleString()}`}
            change="Total acumulado"
            icon={TrendingDown}
            changeColor="text-red-600"
            trend="down"
          />
          <StatCard
            title="Projetos Ativos"
            value={projectStatus.find(s => s.name === 'Em Andamento')?.value.toString() || '0'}
            change="Projetos em andamento"
            icon={Target}
            changeColor="text-blue-600"
            trend="up"
          />
          <StatCard
            title="Saldo Atual"
            value={`R$ ${(totalIncome - totalExpenses).toLocaleString()}`}
            change="Saldo disponível"
            icon={DollarSign}
            changeColor="text-emerald-600"
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fluxo Financeiro</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" name="Receitas" fill="#22c55e" />
                  <Bar dataKey="expense" name="Despesas" fill="#ef4444" />
                  <Bar dataKey="profit" name="Lucro" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Status dos Projetos</h2>
            </div>
            <div className="space-y-4">
              {projectStatus.map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status.name === 'Em Andamento' ? 'bg-blue-500' :
                      status.name === 'Concluídos' ? 'bg-green-500' :
                      status.name === 'Em Pausa' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-gray-700 dark:text-gray-300">{status.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{status.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeRoute) {
      case 'clients':
        return <ClientsView />;
      case 'deadlines':
        return <DeadlinesView />;
      case 'cashflow':
        return <CashFlowView transactions={transactions} onUpdateTransactions={handleUpdateTransactions} />;
      case 'tasks':
        return <TasksView />;
      case 'traffic':
        return <TrafficView />;
      case 'crm':
        return <CRMView />;
      case 'settings':
        return <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeRoute={activeRoute}
          onRouteChange={setActiveRoute}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main 
          className={`
            flex-1 p-4 md:p-8 
            ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} 
            transition-all duration-300 ease-in-out
          `}
        >
          <div className="max-w-[1920px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};