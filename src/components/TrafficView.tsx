import React, { useState } from 'react';
import { Plus, Target, Edit2, Trash2 } from 'lucide-react';
import { Card } from './common/Card';
import { Badge } from './common/Badge';
import { useFirestore } from '../hooks/useFirestore';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  budget: number;
  spent: number;
  roi: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  status: string;
}

export const TrafficView = () => {
  const { documents: campaigns, add, update, remove, loading } = useFirestore('campaigns');
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: '',
    budget: 0,
    spent: 0,
    roi: 0,
    clicks: 0,
    conversions: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'Ativo'
  });

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCampaign) {
        await update(editingCampaign.id, newCampaign);
      } else {
        await add(newCampaign);
      }
      
      setShowModal(false);
      setEditingCampaign(null);
      setNewCampaign({
        name: '',
        platform: '',
        budget: 0,
        spent: 0,
        roi: 0,
        clicks: 0,
        conversions: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        status: 'Ativo'
      });
    } catch (error) {
      console.error('Error saving campaign:', error);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Tráfego</h1>
        <button
          onClick={() => {
            setEditingCampaign(null);
            setNewCampaign({
              name: '',
              platform: '',
              budget: 0,
              spent: 0,
              roi: 0,
              clicks: 0,
              conversions: 0,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              status: 'Ativo'
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Campanha</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {campaign.name}
                  </h3>
                  <Badge variant={campaign.status === 'Ativo' ? 'success' : 'warning'}>
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{campaign.platform}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Orçamento</p>
                    <p className="text-lg font-semibold">R$ {campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gasto</p>
                    <p className="text-lg font-semibold">R$ {campaign.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ROI</p>
                    <p className="text-lg font-semibold">{campaign.roi}x</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversões</p>
                    <p className="text-lg font-semibold">{campaign.conversions}</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingCampaign(campaign);
                    setNewCampaign({
                      name: campaign.name,
                      platform: campaign.platform,
                      budget: campaign.budget,
                      spent: campaign.spent,
                      roi: campaign.roi,
                      clicks: campaign.clicks,
                      conversions: campaign.conversions,
                      startDate: campaign.startDate,
                      endDate: campaign.endDate,
                      status: campaign.status
                    });
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Campanha
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plataforma
                </label>
                <input
                  type="text"
                  value={newCampaign.platform}
                  onChange={e => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Orçamento
                </label>
                <input
                  type="number"
                  value={newCampaign.budget}
                  onChange={e => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gasto Atual
                </label>
                <input
                  type="number"
                  value={newCampaign.spent}
                  onChange={e => setNewCampaign({ ...newCampaign, spent: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ROI
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newCampaign.roi}
                  onChange={e => setNewCampaign({ ...newCampaign, roi: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cliques
                </label>
                <input
                  type="number"
                  value={newCampaign.clicks}
                  onChange={e => setNewCampaign({ ...newCampaign, clicks: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conversões
                </label>
                <input
                  type="number"
                  value={newCampaign.conversions}
                  onChange={e => setNewCampaign({ ...newCampaign, conversions: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={newCampaign.startDate}
                  onChange={e => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de Término
                </label>
                <input
                  type="date"
                  value={newCampaign.endDate}
                  onChange={e => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newCampaign.status}
                  onChange={e => setNewCampaign({ ...newCampaign, status: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Pausado">Pausado</option>
                  <option value="Concluído">Concluído</option>
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
                  {editingCampaign ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};