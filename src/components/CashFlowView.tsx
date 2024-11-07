import React, { useState, useMemo } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, Edit2, Trash2, Filter, Download } from 'lucide-react';
import { Card } from './common/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Badge } from './common/Badge';

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  recurring: boolean;
  paymentMethod?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface CashFlowViewProps {
  transactions: Transaction[];
  onUpdateTransactions: (transactions: Transaction[]) => void;
}

const categories = {
  income: [
    { id: 'services', name: 'Serviços' },
    { id: 'consulting', name: 'Consultoria' },
    { id: 'projects', name: 'Projetos' },
    { id: 'maintenance', name: 'Manutenção' },
    { id: 'income-other', name: 'Outros' }
  ],
  expense: [
    { id: 'marketing', name: 'Marketing' },
    { id: 'infrastructure', name: 'Infraestrutura' },
    { id: 'personnel', name: 'Pessoal' },
    { id: 'software', name: 'Software' },
    { id: 'hardware', name: 'Hardware' },
    { id: 'office', name: 'Escritório' },
    { id: 'expense-other', name: 'Outros' }
  ]
};

const paymentMethods = ['Dinheiro', 'Cartão', 'Transferência', 'Pix', 'Boleto'];

export const CashFlowView: React.FC<CashFlowViewProps> = ({ transactions, onUpdateTransactions }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState<Transaction['status'] | ''>('');
  
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    type: 'income',
    description: '',
    amount: 0,
    date: '',
    category: '',
    recurring: false,
    paymentMethod: 'Transferência',
    status: 'completed'
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (filterType !== 'all' && transaction.type !== filterType) return false;
      if (filterDate && transaction.date !== filterDate) return false;
      if (filterCategory && transaction.category !== filterCategory) return false;
      if (filterStatus && transaction.status !== filterStatus) return false;
      return true;
    });
  }, [transactions, filterType, filterDate, filterCategory, filterStatus]);

  const handleDelete = (id: number) => {
    onUpdateTransactions(transactions.filter(t => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedTransactions: Transaction[];
    
    if (editingTransaction) {
      updatedTransactions = transactions.map(t => 
        t.id === editingTransaction.id ? {
          ...newTransaction,
          id: editingTransaction.id
        } as Transaction : t
      );
    } else {
      const newId = Math.max(0, ...transactions.map(t => t.id)) + 1;
      updatedTransactions = [...transactions, { ...newTransaction, id: newId } as Transaction];
    }

    onUpdateTransactions(updatedTransactions);
    setShowModal(false);
    setEditingTransaction(null);
    setNewTransaction({
      type: 'income',
      description: '',
      amount: 0,
      date: '',
      category: '',
      recurring: false,
      paymentMethod: 'Transferência',
      status: 'completed'
    });
  };

  const totalIncome = useMemo(() => 
    filteredTransactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const totalExpenses = useMemo(() => 
    filteredTransactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const monthlyData = useMemo(() => {
    const data: Record<string, { month: string; income: number; expense: number; profit: number }> = {};
    
    filteredTransactions.forEach(transaction => {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      if (!data[month]) {
        data[month] = { month, income: 0, expense: 0, profit: 0 };
      }
      
      if (transaction.status === 'completed') {
        if (transaction.type === 'income') {
          data[month].income += transaction.amount;
        } else {
          data[month].expense += transaction.amount;
        }
        data[month].profit = data[month].income - data[month].expense;
      }
    });

    return Object.values(data).sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fluxo de Caixa</h1>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setNewTransaction({
              type: 'income',
              description: '',
              amount: 0,
              date: '',
              category: '',
              recurring: false,
              paymentMethod: 'Transferência',
              status: 'completed'
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Transação</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Total Receitas</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                R$ {totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-200 dark:bg-green-700 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-700 dark:text-green-300" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">Total Despesas</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                R$ {totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-200 dark:bg-red-700 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-700 dark:text-red-300" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Saldo</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                R$ {(totalIncome - totalExpenses).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-200 dark:bg-blue-700 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-700 dark:text-blue-300" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Análise Mensal</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
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
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2"
          >
            <option value="all">Todos os Tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2"
          >
            <option value="">Todas as Categorias</option>
            {[...categories.income, ...categories.expense].map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Transaction['status'] | '')}
            className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2"
          >
            <option value="">Todos os Status</option>
            <option value="completed">Concluído</option>
            <option value="pending">Pendente</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {transaction.description}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    <Badge variant={
                      transaction.status === 'completed' ? 'success' :
                      transaction.status === 'pending' ? 'warning' : 'danger'
                    }>
                      {transaction.status === 'completed' ? 'Concluído' :
                       transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{transaction.category}</span>
                    {transaction.paymentMethod && (
                      <>
                        <span>•</span>
                        <span>{transaction.paymentMethod}</span>
                      </>
                    )}
                    {transaction.recurring && (
                      <>
                        <span>•</span>
                        <span>Recorrente</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setNewTransaction({
                        type: transaction.type,
                        description: transaction.description,
                        amount: transaction.amount,
                        date: transaction.date,
                        category: transaction.category,
                        recurring: transaction.recurring,
                        paymentMethod: transaction.paymentMethod,
                        status: transaction.status
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={newTransaction.type}
                  onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={e => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={newTransaction.category}
                  onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories[newTransaction.type].map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Método de Pagamento
                </label>
                <select
                  value={newTransaction.paymentMethod}
                  onChange={e => setNewTransaction({ ...newTransaction, paymentMethod: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newTransaction.status}
                  onChange={e => setNewTransaction({ ...newTransaction, status: e.target.value as Transaction['status'] })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="completed">Concluído</option>
                  <option value="pending">Pendente</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newTransaction.recurring}
                  onChange={e => setNewTransaction({ ...newTransaction, recurring: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700 dark:text-gray-300">
                  Transação Recorrente
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTransaction ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};