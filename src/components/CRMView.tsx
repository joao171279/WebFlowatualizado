import React, { useState } from 'react';
import { Plus, Edit2, Trash2, UserPlus } from 'lucide-react';
import { Card } from './common/Card';
import { Badge } from './common/Badge';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  stage: string;
  status: string;
  value: number;
  lastContact: string;
}

interface Stage {
  id: string;
  name: string;
  clients: Client[];
}

const initialStages: Stage[] = [
  {
    id: 'lead',
    name: 'Leads',
    clients: [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        company: 'Tech Corp',
        stage: 'lead',
        status: 'Novo',
        value: 5000,
        lastContact: '2024-03-15'
      }
    ]
  },
  {
    id: 'contact',
    name: 'Em Contato',
    clients: []
  },
  {
    id: 'proposal',
    name: 'Proposta',
    clients: []
  },
  {
    id: 'negotiation',
    name: 'Negociação',
    clients: []
  },
  {
    id: 'closed',
    name: 'Fechado',
    clients: []
  }
];

export const CRMView = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    value: 0
  });

  const handleDelete = (clientId: number) => {
    setStages(stages.map(stage => ({
      ...stage,
      clients: stage.clients.filter(client => client.id !== clientId)
    })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      setStages(currentStages => 
        currentStages.map(stage => ({
          ...stage,
          clients: stage.clients.map(client => 
            client.id === editingClient.id 
              ? { ...client, ...newClient }
              : client
          )
        }))
      );
    } else {
      const newClientData: Client = {
        id: Math.max(0, ...stages.flatMap(s => s.clients.map(c => c.id))) + 1,
        ...newClient,
        stage: 'lead',
        status: 'Novo',
        lastContact: new Date().toISOString().split('T')[0]
      };

      setStages(currentStages => 
        currentStages.map(stage => 
          stage.id === 'lead'
            ? { ...stage, clients: [...stage.clients, newClientData] }
            : stage
        )
      );
    }

    setShowModal(false);
    setEditingClient(null);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      value: 0
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CRM</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            setNewClient({
              name: '',
              email: '',
              phone: '',
              company: '',
              value: 0
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {stage.name}
              </h2>
              <Badge variant="info">{stage.clients.length}</Badge>
            </div>
            
            <div className="space-y-4">
              {stage.clients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {client.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingClient(client);
                            setNewClient({
                              name: client.name,
                              email: client.email,
                              phone: client.phone,
                              company: client.company,
                              value: client.value
                            });
                            setShowModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {client.company}
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>{client.email}</p>
                      <p>{client.phone}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Valor: R$ {client.value.toLocaleString()}
                      </span>
                      <Badge variant="info">{client.status}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={e => setNewClient({ ...newClient, company: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor Estimado
                </label>
                <input
                  type="number"
                  value={newClient.value}
                  onChange={e => setNewClient({ ...newClient, value: Number(e.target.value) })}
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
                  {editingClient ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};