
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
}

const DocumentUpload: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Load documents from localStorage
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const newDocuments: Document[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const doc: Document = {
          id: Date.now().toString() + i,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
        };
        newDocuments.push(doc);
      }

      const updatedDocuments = [...documents, ...newDocuments];
      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      toast({
        title: 'Upload successful',
        description: `${newDocuments.length} document(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    
    toast({
      title: 'Document deleted',
      description: 'Document has been removed successfully',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>{t('uploadDocument')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select documents to upload</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              />
            </div>
            {uploading && (
              <p className="text-sm text-muted-foreground">Uploading documents...</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{t('documents')} ({documents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No documents uploaded yet. Upload your first document above.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
