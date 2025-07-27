import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Users, Plus, Trash2, Save } from 'lucide-react';
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

interface Student {
  id: string;
  fullName: string;
  class: string;
  place: string;
  school: string;
}

const EditTeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, getTeam, updateTeam } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [teamName, setTeamName] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not signed in
  React.useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Load team data
  useEffect(() => {
    if (id && user) {
      const team = getTeam(id);
      if (team) {
        setTeamName(team.teamName);
        setStudents(team.members);
        setLoading(false);
      } else {
        toast({
          title: "Team Not Found",
          description: "The requested team could not be found",
          variant: "destructive",
        });
        navigate('/teams');
      }
    }
  }, [id, getTeam, navigate, toast, user]);

  const handleStudentChange = (index: number, field: keyof Student, value: string) => {
    const newStudents = [...students];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setStudents(newStudents);
  };

  const handleAddStudent = () => {
    if (students.length >= 4) {
      toast({
        title: "Maximum Reached",
        description: "A team can have maximum 4 students",
        variant: "destructive",
      });
      return;
    }

    const newStudent: Student = {
      id: `${Date.now()}-${students.length}`,
      fullName: '',
      class: '',
      place: '',
      school: '',
    };
    setStudents([...students, newStudent]);
  };

  const handleRemoveStudent = (index: number) => {
    if (students.length <= 2) {
      toast({
        title: "Minimum Required",
        description: "A team must have at least 2 students",
        variant: "destructive",
      });
      return;
    }

    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
    toast({
      title: "Student Removed",
      description: "Student has been removed from the team",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    // Validation
    if (!teamName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyFields = students.some(student => 
      !student.fullName.trim() || !student.class.trim() || !student.place.trim() || !student.school.trim()
    );

    if (hasEmptyFields) {
      toast({
        title: "Validation Error",
        description: "Please fill in all student details",
        variant: "destructive",
      });
      return;
    }

    // Update team
    const teamData = {
      teamName: teamName.trim(),
      members: students.map(student => ({
        ...student,
        fullName: student.fullName.trim(),
        class: student.class.trim(),
        place: student.place.trim(),
        school: student.school.trim(),
      }))
    };

    updateTeam(id, teamData);
    toast({
      title: "Success!",
      description: "Team updated successfully",
    });
    navigate('/teams');
  };

  if (!user || loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-violet-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/teams')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Teams</span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-orange-600 bg-clip-text text-transparent">
              Edit Team
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Team Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Team Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Student Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Students ({students.length}/4)</CardTitle>
              <Button
                type="button"
                onClick={handleAddStudent}
                disabled={students.length >= 4}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {students.map((student, index) => (
                  <Card key={student.id} className="border border-violet-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-lg">Student {index + 1}</CardTitle>
                      {students.length > 2 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {student.fullName || 'this student'} from the team?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveStudent(index)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`fullName-${index}`}>Full Name</Label>
                        <Input
                          id={`fullName-${index}`}
                          value={student.fullName}
                          onChange={(e) => handleStudentChange(index, 'fullName', e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`class-${index}`}>Class</Label>
                        <Input
                          id={`class-${index}`}
                          value={student.class}
                          onChange={(e) => handleStudentChange(index, 'class', e.target.value)}
                          placeholder="e.g., 10th, 12th"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`place-${index}`}>Place</Label>
                        <Input
                          id={`place-${index}`}
                          value={student.place}
                          onChange={(e) => handleStudentChange(index, 'place', e.target.value)}
                          placeholder="Enter place/city"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`school-${index}`}>School Name</Label>
                        <Input
                          id={`school-${index}`}
                          value={student.school}
                          onChange={(e) => handleStudentChange(index, 'school', e.target.value)}
                          placeholder="Enter school name"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teams')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditTeamPage;