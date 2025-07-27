import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Users, Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreateTeamPage: React.FC = () => {
  const { user, createTeam } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [teamName, setTeamName] = useState('');
  const [studentCount, setStudentCount] = useState<number>(2);
  const [students, setStudents] = useState<Array<{
    fullName: string;
    class: string;
    place: string;
    school: string;
  }>>([
    { fullName: '', class: '', place: '', school: '' },
    { fullName: '', class: '', place: '', school: '' }
  ]);

  // Redirect if not signed in
  React.useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleStudentCountChange = (count: string) => {
    const newCount = parseInt(count);
    setStudentCount(newCount);
    
    const newStudents = [...students];
    if (newCount > students.length) {
      // Add more student forms
      for (let i = students.length; i < newCount; i++) {
        newStudents.push({ fullName: '', class: '', place: '', school: '' });
      }
    } else {
      // Remove excess student forms
      newStudents.splice(newCount);
    }
    setStudents(newStudents);
  };

  const handleStudentChange = (index: number, field: string, value: string) => {
    const newStudents = [...students];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setStudents(newStudents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    // Create team
    const teamData = {
      teamName: teamName.trim(),
      members: students.map((student, index) => ({
        id: `${Date.now()}-${index}`,
        fullName: student.fullName.trim(),
        class: student.class.trim(),
        place: student.place.trim(),
        school: student.school.trim(),
      }))
    };

    createTeam(teamData);
    toast({
      title: "Success!",
      description: "Team created successfully",
    });
    navigate('/dashboard');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-violet-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
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
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-orange-600 bg-clip-text text-transparent">
              Create New Team
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

              <div className="space-y-2">
                <Label htmlFor="studentCount">Number of Students (2-4)</Label>
                <Select value={studentCount.toString()} onValueChange={handleStudentCountChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Students</SelectItem>
                    <SelectItem value="3">3 Students</SelectItem>
                    <SelectItem value="4">4 Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Student Details */}
          <div className="space-y-6">
            {students.map((student, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">Student {index + 1}</CardTitle>
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white px-8"
            >
              Create Team
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateTeamPage;