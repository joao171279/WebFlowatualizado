export interface Client {
  id: number;
  name: string;
  email: string;
  project: string;
  status: string;
  stage: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  status: string;
  date: string;
}

export interface TrafficCampaign {
  id: number;
  name: string;
  platform: string;
  status: string;
  budget: number;
  roi: number;
  startDate: string;
  endDate: string;
}

export interface Deadline {
  id: number;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  assignedTo: string;
}

export interface CashFlow {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  recurring: boolean;
}

export interface CRMStage {
  id: string;
  name: string;
  clients: Client[];
}