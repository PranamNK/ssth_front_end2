
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';

const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userId: z.string().min(3, 'User ID must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  organization: z.string().min(1, 'Organization is required'),
  role: z.string().min(1, 'Role is required'),
});

const AuthPage: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      userId: '',
      password: '',
      phone: '',
      email: '',
      organization: '',
      role: '',
    },
  });

  const onLogin = async (data: any) => {
    const success = await login(data.userId, data.password);
    if (success) {
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
    }
  };

  const onRegister = async (data: any) => {
    const success = await register(data);
    if (success) {
      toast({
        title: 'Registration successful',
        description: 'Welcome to the team!',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Registration failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Team Management</CardTitle>
          <CardDescription className="text-center">
            Access your team dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="login">{t('login')}</TabsTrigger>
              <TabsTrigger value="register">{t('register')}</TabsTrigger>
              <TabsTrigger value="forgot-id">ID</TabsTrigger>
              <TabsTrigger value="forgot-password">Pass</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">{t('userId')}</Label>
                  <Input
                    id="userId"
                    {...loginForm.register('userId')}
                    placeholder="Enter your user ID"
                  />
                  {loginForm.formState.errors.userId && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.userId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    {...loginForm.register('password')}
                    placeholder="Enter your password"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : t('login')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    {...registerForm.register('name')}
                    placeholder="Enter your full name"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-userId">{t('userId')}</Label>
                  <Input
                    id="reg-userId"
                    {...registerForm.register('userId')}
                    placeholder="Choose a user ID"
                  />
                  {registerForm.formState.errors.userId && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.userId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('password')}</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    {...registerForm.register('password')}
                    placeholder="Choose a password"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    {...registerForm.register('phone')}
                    placeholder="Enter your phone number"
                  />
                  {registerForm.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerForm.register('email')}
                    placeholder="Enter your email"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">{t('organization')}</Label>
                  <Input
                    id="organization"
                    {...registerForm.register('organization')}
                    placeholder="Enter your organization"
                  />
                  {registerForm.formState.errors.organization && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.organization.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('role')}</Label>
                  <Input
                    id="role"
                    {...registerForm.register('role')}
                    placeholder="Enter your role"
                  />
                  {registerForm.formState.errors.role && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.role.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Registering...' : t('register')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="forgot-id">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">{t('email')}</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email to recover User ID"
                  />
                </div>
                <Button className="w-full">
                  Recover User ID
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="forgot-password">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-userId">{t('userId')}</Label>
                  <Input
                    id="forgot-userId"
                    placeholder="Enter your User ID"
                  />
                </div>
                <Button className="w-full">
                  Reset Password
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
