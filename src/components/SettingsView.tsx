import React, { useState } from 'react';
import { Moon, Sun, Bell, Lock, User, LogOut, Mail, Shield, Globe, Smartphone } from 'lucide-react';
import { Card } from './common/Card';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  loginAlerts: boolean;
  deviceHistory: boolean;
}

export const SettingsView = ({ 
  darkMode, 
  setDarkMode,
  onLogout
}: { 
  darkMode: boolean; 
  setDarkMode: (value: boolean) => void;
  onLogout: () => void;
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Administrator'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    desktop: false
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    loginAlerts: true,
    deviceHistory: true
  });

  const [language, setLanguage] = useState('pt-BR');
  const [timeZone, setTimeZone] = useState('America/Sao_Paulo');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(tempProfile);
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-transparent bg-clip-text">
          Configurações
        </h1>
        <button
          onClick={onLogout}
          className="tech-button px-4 py-2 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Perfil</h2>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              {isEditingProfile ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-dark-600 p-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={tempProfile.email}
                  onChange={e => setTempProfile({ ...tempProfile, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-dark-600 p-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="tech-button px-4 py-2 w-full"
              >
                Salvar Alterações
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Theme & Appearance */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tema & Aparência</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-primary-500" />
                ) : (
                  <Sun className="w-5 h-5 text-primary-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Tema</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {darkMode ? 'Modo Escuro' : 'Modo Claro'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: darkMode ? 'rgb(0, 153, 255)' : 'rgb(203, 213, 225)'
                }}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    transition-transform duration-300
                    ${darkMode ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Idioma
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-dark-600 p-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fuso Horário
                </label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-dark-600 p-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">New York (GMT-4)</option>
                  <option value="Europe/London">London (GMT+1)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notificações</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receber notificações por email</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  notifications.email ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
                }`}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    transition-transform duration-300
                    ${notifications.email ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notificações push no dispositivo</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  notifications.push ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
                }`}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    transition-transform duration-300
                    ${notifications.push ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Desktop</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notificações no navegador</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, desktop: !notifications.desktop })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  notifications.desktop ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
                }`}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    transition-transform duration-300
                    ${notifications.desktop ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Segurança</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Autenticação em 2 Fatores</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Adicionar uma camada extra de segurança</p>
                </div>
              </div>
              <button
                onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  security.twoFactor ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
                }`}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    transition-transform duration-300
                    ${security.twoFactor ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Alertas de Login</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notificar sobre novos acessos</p>
                </div>
              </div>
              <button
                onClick={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  security.loginAlerts ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
                }`}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    transition-transform duration-300
                    ${security.loginAlerts ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            <button
              className="w-full mt-4 tech-button px-4 py-2 flex items-center justify-center space-x-2"
              onClick={() => {/* Implement password change */}}
            >
              <Lock className="w-4 h-4" />
              <span>Alterar Senha</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};