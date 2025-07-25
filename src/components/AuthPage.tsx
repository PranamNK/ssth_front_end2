
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  leadName: z.string().min(2, "Lead name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  class: z.string().min(1, "Class is required"),
  schoolName: z.string().min(2, "School name is required"),
  schoolAddress: z.string().min(2, "School address is required"),
});

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { login, register, isLoading } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      leadName: "",
      email: "",
      phone: "",
      password: "",
      class: "",
      schoolName: "",
      schoolAddress: "",
    },
  });

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    const success = await login(values.email, values.password);
    if (success) {
      toast({
        title: language === 'en' ? "Login successful" : "ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ",
        description: language === 'en' ? "Welcome back!" : "ಮತ್ತೆ ಸ್ವಾಗತ!",
      });
    } else {
      toast({
        title: language === 'en' ? "Login failed" : "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ",
        description: language === 'en' ? "Invalid email or password" : "ತಪ್ಪು ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್",
        variant: "destructive",
      });
    }
  };

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    const success = await register(values);
    if (success) {
      toast({
        title: language === 'en' ? "Registration successful" : "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
        description: language === 'en' ? "Account created successfully!" : "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!",
      });
    } else {
      toast({
        title: language === 'en' ? "Registration failed" : "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ",
        description: language === 'en' ? "Please try again" : "ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {language === 'en' ? 'Team Registration Portal' : 'ತಂಡ ನೋಂದಣಿ ಪೋರ್ಟಲ್'}
          </CardTitle>
          <CardDescription className="text-center">
            {language === 'en' ? 'Create your account or sign in' : 'ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ ಅಥವಾ ಸೈನ್ ಇನ್ ಮಾಡಿ'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="login">
                {language === 'en' ? 'Login' : 'ಲಾಗಿನ್'}
              </TabsTrigger>
              <TabsTrigger value="register">
                {language === 'en' ? 'Register' : 'ನೋಂದಣಿ'}
              </TabsTrigger>
              <TabsTrigger value="forgot-id">
                {language === 'en' ? 'Forgot ID' : 'ಐಡಿ ಮರೆತಿದ್ದೀರಾ'}
              </TabsTrigger>
              <TabsTrigger value="forgot-password">
                {language === 'en' ? 'Reset Pass' : 'ಪಾಸ್ ರೀಸೆಟ್'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'Email' : 'ಇಮೇಲ್'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter your email' : 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'Password' : 'ಪಾಸ್‌ವರ್ಡ್'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={language === 'en' ? 'Enter your password' : 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (language === 'en' ? 'Signing in...' : 'ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...') 
                      : (language === 'en' ? 'Sign In' : 'ಸೈನ್ ಇನ್')
                    }
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="leadName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'Lead Name' : 'ಮುಖ್ಯಸ್ಥರ ಹೆಸರು'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter lead name' : 'ಮುಖ್ಯಸ್ಥರ ಹೆಸರು ನಮೂದಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'Email' : 'ಇಮೇಲ್'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter your email' : 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'Phone Number' : 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter phone number' : 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'Password' : 'ಪಾಸ್‌ವರ್ಡ್'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={language === 'en' ? 'Create a password' : 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'Class' : 'ವರ್ಗ'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter class' : 'ವರ್ಗ ನಮೂದಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'School Name' : 'ಶಾಲೆಯ ಹೆಸರು'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter school name' : 'ಶಾಲೆಯ ಹೆಸರು ನಮೂದಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="schoolAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'en' ? 'School Address (City)' : 'ಶಾಲೆಯ ವಿಳಾಸ (ನಗರ)'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter city name' : 'ನಗರದ ಹೆಸರು ನಮೂದಿಸಿ'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (language === 'en' ? 'Creating Account...' : 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...') 
                      : (language === 'en' ? 'Create Account' : 'ಖಾತೆ ರಚಿಸಿ')
                    }
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="forgot-id" className="space-y-4">
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'Enter your phone number to recover your email' 
                    : 'ನಿಮ್ಮ ಇಮೇಲ್ ಮರುಪಡೆಯಲು ನಿಮ್ಮ ದೂರವಾಣಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ'
                  }
                </p>
                <Input 
                  placeholder={language === 'en' ? 'Phone number' : 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ'} 
                  className="mt-4" 
                />
                <Button className="w-full mt-4">
                  {language === 'en' ? 'Recover Email' : 'ಇಮೇಲ್ ಮರುಪಡೆಯಿರಿ'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="forgot-password" className="space-y-4">
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'Enter your email to reset password' 
                    : 'ಪಾಸ್‌ವರ್ಡ್ ರೀಸೆಟ್ ಮಾಡಲು ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ'
                  }
                </p>
                <Input 
                  placeholder={language === 'en' ? 'Email address' : 'ಇಮೇಲ್ ವಿಳಾಸ'} 
                  className="mt-4" 
                />
                <Button className="w-full mt-4">
                  {language === 'en' ? 'Reset Password' : 'ಪಾಸ್‌ವರ್ಡ್ ರೀಸೆಟ್ ಮಾಡಿ'}
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
