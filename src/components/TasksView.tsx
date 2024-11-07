import React, { useState, useEffect } from 'react';
import { Plus, CheckSquare, Square, Calendar, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from './common/Badge';
import { useFirestore } from '../hooks/useFirestore';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'pending' | 'inProgress' | 'completed';
}

export const TasksView = () => {
  const { documents: tasks, add, update, remove, loading } = useFirestore('tasks');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    inProgress: true,
    completed: true
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as const,
    category: 'pending' as const,
    completed: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleTask = async (task: Task) => {
    try {
      const updatedTask = {
        ...task,
        completed: !task.completed,
        category: !task.completed ? 'completed' : 'pending'
      };
      await update(task.id, updatedTask);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await remove(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await update(editingTask.id, newTask);
      } else {
        await add(newTask);
      }
      setShowModal(false);
      setEditingTask(null);
      setNewTask({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        category: 'pending',
        completed: false
      });
    } catch (error) {
      console.error('Error saving task:', error);
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

  const renderTaskList = (category: Task['category'], title: string) => {
    const categoryTasks = tasks.filter(task => task.category === category);
    
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-slate-700">
        <button
          onClick={() => toggleSection(category)}
          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            {expandedSections[category] ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title} ({categoryTasks.length})
            </h3>
          </div>
        </button>
        
        {expandedSections[category] && (
          <div className="mt-4 space-y-4">
            {categoryTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <button
                  onClick={() => toggleTask(task)}
                  className="mt-1 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className={`text-lg font-semibold text-gray-900 dark:text-white ${
                        task.completed ? 'line-through' : ''
                      }`}>
                        {task.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setNewTask({
                            title: task.title,
                            description: task.description,
                            dueDate: task.dueDate,
                            priority: task.priority,
                            category: task.category,
                            completed: task.completed
                          });
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-slate-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-slate-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tarefas</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setNewTask({
              title: '',
              description: '',
              dueDate: new Date().toISOString().split('T')[0],
              priority: 'medium',
              category: 'pending',
              completed: false
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      <div className="space-y-4">
        {renderTaskList('pending', 'Tarefas Pendentes')}
        {renderTaskList('inProgress', 'Em Andamento')}
        {renderTaskList('completed', 'Concluídas')}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de Entrega
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridade
                </label>
                <select
                  value={newTask.priority}
                  onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
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
                  value={newTask.category}
                  onChange={e => setNewTask({ ...newTask, category: e.target.value as Task['category'] })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pendente</option>
                  <option value="inProgress">Em Andamento</option>
                  <option value="completed">Concluído</option>
                </select>
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
                  {editingTask ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};