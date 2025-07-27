import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Users, Edit, Eye, Trash2, Plus, UserPlus, UserMinus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

const TeamsPage: React.FC = () => {
  const { user, teams, deleteTeam } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not signed in
  React.useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    deleteTeam(teamId);
    toast({
      title: "Team Deleted",
      description: `${teamName} has been deleted successfully`,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-violet-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-orange-600 bg-clip-text text-transparent">
                Manage Teams
              </h1>
            </div>
          </div>
          <Button
            onClick={() => navigate('/create-team')}
            className="bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {teams.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-r from-violet-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No teams created yet</h3>
              <p className="text-muted-foreground mb-4">Create your first team to get started with managing students</p>
              <Button
                onClick={() => navigate('/create-team')}
                className="bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Teams ({teams.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">{team.teamName}</CardTitle>
                      <Badge variant="secondary" className="ml-2">
                        {team.members.length} members
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Members List */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">Members:</h4>
                      {team.members.map((member, index) => (
                        <div key={member.id} className="text-sm border-l-2 border-violet-200 pl-3">
                          <div className="font-medium">{member.fullName}</div>
                          <div className="text-muted-foreground">
                            {member.class} • {member.place}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/edit-team/${team.id}`)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Team</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{team.teamName}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTeam(team.id, team.teamName)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Member Management Hints */}
                    <div className="text-xs text-muted-foreground pt-2 border-t flex justify-between">
                      <span>
                        {team.members.length < 4 && (
                          <span className="text-green-600">Can add {4 - team.members.length} more</span>
                        )}
                        {team.members.length === 4 && (
                          <span className="text-amber-600">Team full</span>
                        )}
                      </span>
                      <span>
                        {team.members.length > 2 && (
                          <span className="text-blue-600">Can remove {team.members.length - 2}</span>
                        )}
                        {team.members.length === 2 && (
                          <span className="text-red-600">Minimum reached</span>
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeamsPage;