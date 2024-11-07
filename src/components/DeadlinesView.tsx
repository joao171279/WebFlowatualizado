import React, { useState } from 'react';
import { Plus, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { Badge } from './common/Badge';
import { useFirestore } from '../hooks/useFirestore';

interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  assignedTo: string;
}

export const DeadlinesView = () => {
  const { documents: deadlines, add, update, remove, loading } = useFirestore('deadlines');
  const [showModal, setShowModal] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [newDeadline, setNewDeadline] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as const,
    status: 'Pendente',
    assignedTo: ''
  });

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
    } catch (error) {
      console.error('Error deleting deadline:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDeadline) {
        await update(editingDeadline.id, newDeadline);
      } else {
        await add(newDeadline);
      }
      setShowModal(false);
      setEditingDeadline(null);
      setNewDeadline({
        title: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        status: 'Pendente',
        assignedTo: ''
      });
    } catch (error) {
      console.error('Error saving deadline:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prazos e Vencimentos</h1>
        <button
          onClick={() => {
            setEditingDeadline(null);
            setNewDeadline({
              title: '',
              dueDate: new Date().toISOString().split('T')[0],
              priority: 'medium',
              status: 'Pendente',
              assignedTo: ''
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Prazo</span>
        </button>
      </div>

      <div className="grid gap-4">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-slate-700 group hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{deadline.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(deadline.dueDate).toLocaleDateString()}</span>
                  </div>
                  <Badge variant={getPriorityColor(deadline.priority)}>
                    {deadline.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="info">{deadline.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Responsável: {deadline.assignedTo}
                </p>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingDeadline(deadline);
                    setNewDeadline({
                      title: deadline.title,
                      dueDate: deadline.dueDate,
                      priority: deadline.priority,
                      status: deadline.status,
                      assignedTo: deadline.assignedTo
                    });
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-slate-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(deadline.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-slate-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingDeadline ? 'Editar Prazo' : 'Novo Prazo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newDeadline.title}
                  onChange={e => setNewDeadline({ ...newDeadline, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de Entrega
                </label>
                <input
                  type="date"
                  value={newDeadline.dueDate}
                  onChange={e => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridade
                </label>
                <select
                  value={newDeadline.priority}
                  onChange={e => setNewDeadline({ ...newDeadline, priority: e.target.value as Deadline['priority'] })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newDeadline.status}
                  onChange={e => setNewDeadline({ ...newDeadline, status: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option>Pendente</option>
                  <option>Em Progresso</option>
                  <option>Concluído</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={newDeadline.assignedTo}
                  onChange={e => setNewDeadline({ ...newDeadline, assignedTo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
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
                  {editingDeadline ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};