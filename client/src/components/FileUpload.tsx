import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onRemoveFile: () => void;
}

export const FileUpload = ({ onFileUpload, uploadedFile, onRemoveFile }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.includes('presentation')) {
        onFileUpload(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (uploadedFile) {
    return (
      <Card className="p-6 bg-gradient-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium text-foreground">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveFile}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer bg-gradient-card ${
        isDragOver
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="text-center">
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Upload Your Pitch Deck
        </h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your PDF or PowerPoint file here, or click to browse
        </p>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Choose File
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Supports PDF, PPT, PPTX files up to 50MB
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.ppt,.pptx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </Card>
  );
};
