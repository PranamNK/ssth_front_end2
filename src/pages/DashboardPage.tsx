import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Users, LogOut, UsersIcon as Team } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, teams, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not signed in
  React.useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-violet-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-orange-600 bg-clip-text text-transparent">
                Team Management
              </h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-violet-500 to-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
                  <p className="text-violet-100">Manage your student teams efficiently</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{teams.length}</div>
                  <div className="text-violet-100">Teams Created</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/create-team')}
              className="h-20 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white flex items-center justify-center space-x-3 rounded-xl"
            >
              <Plus className="w-6 h-6" />
              <span className="text-lg font-semibold">Create New Team</span>
            </Button>
            
            <Button
              onClick={() => navigate('/teams')}
              variant="outline"
              className="h-20 border-2 border-violet-200 hover:border-violet-300 flex items-center justify-center space-x-3 rounded-xl"
            >
              <Team className="w-6 h-6" />
              <span className="text-lg font-semibold">Manage Teams</span>
            </Button>
          </div>

          {/* Teams Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Team className="w-5 h-5" />
                <span>Recent Teams</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-violet-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Team className="w-12 h-12 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">No teams yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first team to get started</p>
                  <Button
                    onClick={() => navigate('/create-team')}
                    className="bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Team
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {teams.slice(0, 3).map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div>
                        <h4 className="font-semibold">{team.teamName}</h4>
                        <p className="text-sm text-muted-foreground">{team.members.length} members</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/edit-team/${team.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                  {teams.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => navigate('/teams')}
                    >
                      View All Teams ({teams.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;