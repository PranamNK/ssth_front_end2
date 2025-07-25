import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const projectSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters"),
  workingStatus: z.enum(["working", "not-working"]),
  problemStatement: z.string().min(10, "Problem statement must be at least 10 characters"),
  projectInfo: z.string().min(10, "Project information must be at least 10 characters"),
  budget: z.string().min(1, "Budget is required"),
});

const ProjectDetails = () => {
  const [projectData, setProjectData] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { language } = useLanguage();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      teamName: "",
      workingStatus: "working",
      problemStatement: "",
      projectInfo: "",
      budget: "",
    },
  });

  useEffect(() => {
    const storedProject = localStorage.getItem('projectDetails');
    if (storedProject) {
      const project = JSON.parse(storedProject);
      setProjectData(project);
      form.reset(project);
    }

    const storedFiles = localStorage.getItem('projectFiles');
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
  }, [form]);

  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    const projectDetails = {
      ...values,
      updatedAt: new Date().toISOString(),
    };
    
    setProjectData(projectDetails);
    localStorage.setItem('projectDetails', JSON.stringify(projectDetails));
    
    toast({
      title: language === 'en' ? "Project details saved" : "ಯೋಜನೆಯ ವಿವರಗಳು ಉಳಿಸಲಾಗಿದೆ",
      description: language === 'en' ? "Your project information has been updated" : "ನಿಮ್ಮ ಯೋಜನೆಯ ಮಾಹಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      const updatedFiles = [...uploadedFiles, ...fileNames];
      setUploadedFiles(updatedFiles);
      localStorage.setItem('projectFiles', JSON.stringify(updatedFiles));
      
      toast({
        title: language === 'en' ? "Files uploaded" : "ಫೈಲ್‌ಗಳು ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ",
        description: language === 'en' ? `${fileNames.length} file(s) uploaded successfully` : `${fileNames.length} ಫೈಲ್(ಗಳು) ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ`,
      });
    }
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = uploadedFiles.filter(file => file !== fileName);
    setUploadedFiles(updatedFiles);
    localStorage.setItem('projectFiles', JSON.stringify(updatedFiles));
    
    toast({
      title: language === 'en' ? "File removed" : "ಫೈಲ್ ತೆಗೆದುಹಾಕಲಾಗಿದೆ",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Project Details' : 'ಯೋಜನೆಯ ವಿವರಗಳು'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === 'en' ? 'Team Name' : 'ತಂಡದ ಹೆಸರು'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? 'Enter team name' : 'ತಂಡದ ಹೆಸರು ನಮೂದಿಸಿ'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === 'en' ? 'Working Status' : 'ಕೆಲಸದ ಸ್ಥಿತಿ'}
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'en' ? 'Select status' : 'ಸ್ಥಿತಿ ಆಯ್ಕೆಮಾಡಿ'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="working">
                        {language === 'en' ? 'Working' : 'ಕೆಲಸ ಮಾಡುತ್ತಿದೆ'}
                      </SelectItem>
                      <SelectItem value="not-working">
                        {language === 'en' ? 'Not Working' : 'ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problemStatement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === 'en' ? 'Problem Statement' : 'ಸಮಸ್ಯೆಯ ಹೇಳಿಕೆ'}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'en' ? 'Describe the problem your project solves' : 'ನಿಮ್ಮ ಯೋಜನೆ ಪರಿಹರಿಸುವ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === 'en' ? 'Project Information' : 'ಯೋಜನೆಯ ಮಾಹಿತಿ'}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'en' ? 'Provide detailed information about your project' : 'ನಿಮ್ಮ ಯೋಜನೆಯ ಬಗ್ಗೆ ವಿವರವಾದ ಮಾಹಿತಿ ನೀಡಿ'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === 'en' ? 'Budget' : 'ಬಜೆಟ್'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? 'Enter project budget' : 'ಯೋಜನೆಯ ಬಜೆಟ್ ನಮೂದಿಸಿ'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'en' ? 'Upload Pictures and Videos' : 'ಚಿತ್ರಗಳು ಮತ್ತು ವೀಡಿಯೊಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ'}
              </label>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
              />
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Uploaded files:' : 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೈಲ್‌ಗಳು:'}
                  </p>
                  {uploadedFiles.map((fileName, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{fileName}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(fileName)}
                      >
                        {language === 'en' ? 'Remove' : 'ತೆಗೆದುಹಾಕಿ'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              {language === 'en' ? 'Save Project Details' : 'ಯೋಜನೆಯ ವಿವರಗಳನ್ನು ಉಳಿಸಿ'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;