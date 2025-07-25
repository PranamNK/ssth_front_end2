
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Users, Plus, Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from './ui/use-toast';

interface Teammate {
  id: string;
  name: string;
  userId: string;
  phone: string;
  email: string;
  organization: string;
  role: string;
  addedDate: string;
}

const teammateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userId: z.string().min(3, 'User ID must be at least 3 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  organization: z.string().min(1, 'Organization is required'),
  role: z.string().min(1, 'Role is required'),
});

const TeammateManagement: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeammate, setEditingTeammate] = useState<Teammate | null>(null);

  const form = useForm({
    resolver: zodResolver(teammateSchema),
    defaultValues: {
      name: '',
      userId: '',
      phone: '',
      email: '',
      organization: user?.organization || '',
      role: '',
    },
  });

  useEffect(() => {
    // Load teammates from localStorage
    const storedTeammates = localStorage.getItem('teammates');
    if (storedTeammates) {
      setTeammates(JSON.parse(storedTeammates));
    }
  }, []);

  useEffect(() => {
    // Auto-fill organization from team leader
    if (user?.organization) {
      form.setValue('organization', user.organization);
    }
  }, [user, form]);

  const onSubmit = (data: any) => {
    if (editingTeammate) {
      // Update existing teammate
      const updatedTeammates = teammates.map(teammate =>
        teammate.id === editingTeammate.id
          ? { ...teammate, ...data }
          : teammate
      );
      setTeammates(updatedTeammates);
      localStorage.setItem('teammates', JSON.stringify(updatedTeammates));
      
      toast({
        title: 'Teammate updated',
        description: `${data.name} has been updated successfully`,
      });
    } else {
      // Add new teammate
      const newTeammate: Teammate = {
        id: Date.now().toString(),
        ...data,
        addedDate: new Date().toISOString(),
      };
      
      const updatedTeammates = [...teammates, newTeammate];
      setTeammates(updatedTeammates);
      localStorage.setItem('teammates', JSON.stringify(updatedTeammates));
      
      toast({
        title: 'Teammate added',
        description: `${data.name} has been added to your team`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingTeammate(null);
    form.reset({
      name: '',
      userId: '',
      phone: '',
      email: '',
      organization: user?.organization || '',
      role: '',
    });
  };

  const handleDeleteTeammate = (id: string) => {
    const teammate = teammates.find(t => t.id === id);
    const updatedTeammates = teammates.filter(t => t.id !== id);
    setTeammates(updatedTeammates);
    localStorage.setItem('teammates', JSON.stringify(updatedTeammates));
    
    toast({
      title: 'Teammate removed',
      description: `${teammate?.name} has been removed from your team`,
    });
  };

  const handleEditTeammate = (teammate: Teammate) => {
    setEditingTeammate(teammate);
    form.reset({
      name: teammate.name,
      userId: teammate.userId,
      phone: teammate.phone,
      email: teammate.email,
      organization: teammate.organization,
      role: teammate.role,
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTeammate(null);
    form.reset({
      name: '',
      userId: '',
      phone: '',
      email: '',
      organization: user?.organization || '',
      role: '',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>{t('teammates')} ({teammates.length})</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>{t('addTeammate')}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTeammate ? 'Edit Teammate' : t('addTeammate')}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      placeholder="Enter teammate's name"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userId">{t('userId')}</Label>
                    <Input
                      id="userId"
                      {...form.register('userId')}
                      placeholder="Enter user ID"
                    />
                    {form.formState.errors.userId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.userId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      placeholder="Enter phone number"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="Enter email address"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">{t('organization')}</Label>
                    <Input
                      id="organization"
                      {...form.register('organization')}
                      placeholder="Enter organization"
                    />
                    {form.formState.errors.organization && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.organization.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('role')}</Label>
                    <Input
                      id="role"
                      {...form.register('role')}
                      placeholder="Enter role"
                    />
                    {form.formState.errors.role && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.role.message}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      {editingTeammate ? t('save') : t('addTeammate')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teammates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No teammates added yet. Add your first teammate above.
            </p>
          ) : (
            <div className="space-y-3">
              {teammates.map((teammate) => (
                <div
                  key={teammate.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{teammate.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {teammate.role} • {teammate.organization}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {teammate.phone} • {teammate.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTeammate(teammate)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTeammate(teammate.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeammateManagement;
