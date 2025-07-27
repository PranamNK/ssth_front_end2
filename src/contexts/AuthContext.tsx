
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
}

interface Student {
  id: string;
  fullName: string;
  class: string;
  place: string;
  school: string;
}

interface Team {
  id: string;
  teamName: string;
  members: Student[];
}

interface AuthContextType {
  user: User | null;
  teams: Team[];
  signIn: (email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  createTeam: (teamData: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, teamData: Omit<Team, 'id'>) => void;
  deleteTeam: (id: string) => void;
  getTeam: (id: string) => Team | undefined;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load teams from localStorage
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
  }, []);

  const signIn = async (email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be a proper API call
      const newUser: User = {
        id: Date.now().toString(),
        email,
        phone,
        name: email.split('@')[0], // Extract name from email for demo
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      ...teamData,
    };
    
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  const updateTeam = (id: string, teamData: Omit<Team, 'id'>) => {
    const updatedTeams = teams.map(team => 
      team.id === id ? { ...teamData, id } : team
    );
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  const deleteTeam = (id: string) => {
    const updatedTeams = teams.filter(team => team.id !== id);
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  const getTeam = (id: string) => {
    return teams.find(team => team.id === id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      teams, 
      signIn, 
      logout, 
      createTeam, 
      updateTeam, 
      deleteTeam, 
      getTeam, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
