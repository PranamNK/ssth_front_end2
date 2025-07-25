
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, Users, FileText, LogOut, Globe } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import TeammateManagement from './TeammateManagement';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('documents');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
            <span className="text-muted-foreground">Welcome, {user.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>{t('documents')}</span>
            </TabsTrigger>
            <TabsTrigger value="teammates" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{t('teammates')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-6">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="teammates" className="mt-6">
            <TeammateManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
