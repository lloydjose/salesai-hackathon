'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileAudio, X, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import toast from 'react-hot-toast';

const ACCEPTED_AUDIO_TYPES = {
  'audio/mpeg': ['.mp3'], // MP3
  'audio/wav': ['.wav'],   // WAV
  'audio/x-m4a': ['.m4a'], // M4A (common MIME type)
  'audio/m4a': ['.m4a'],   // Another possible M4A MIME type
};
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB limit (adjust as needed)

export function ConversationUploadView() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File | null): boolean => {
    setError(null);
    if (!file) return false;

    // Validate type
    const fileType = file.type;
    if (!Object.keys(ACCEPTED_AUDIO_TYPES).includes(fileType)) {
      setError(`Invalid file type. Accepted types: ${Object.values(ACCEPTED_AUDIO_TYPES).flat().join(', ')}`);
      return false;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
       setError(`File size exceeds limit (${MAX_FILE_SIZE / 1024 / 1024}MB).`);
       return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (validateFile(file || null)) {
      setSelectedFile(file || null);
    }
    // Reset input value to allow uploading the same file again if removed
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (validateFile(file)) {
      setSelectedFile(file || null);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedFile || isSubmitting) return;

      setIsSubmitting(true);
      setError(null);
      const toastId = toast.loading('Uploading audio file...');

      const formData = new FormData();
      formData.append('audioFile', selectedFile);
      formData.append('description', description);

      try {
          const response = await fetch('/api/conversation-intelligence/upload', {
              method: 'POST',
              body: formData,
              // Don't set Content-Type header, browser does it for FormData
          });

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result.message || 'Upload failed');
          }

          toast.success('Upload successful! Starting analysis...', { id: toastId });

          // Redirect to the detail page for the newly created analysis
          router.push(`/dashboard/conversation-intelligence/${result.analysisId}`);

      } catch (err) {
          console.error("Upload failed:", err);
          const message = err instanceof Error ? err.message : "An unknown error occurred during upload.";
          setError(message); // Show error in the component alert
          toast.error(`Upload failed: ${message}`, { id: toastId });
          setIsSubmitting(false); // Allow retry on error
      }
      // No finally block to set isSubmitting=false on success because we redirect
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Audio for Analysis</CardTitle>
        <CardDescription>
          Upload an audio recording (MP3, WAV, M4A) of a sales call. The AI will analyze the conversation
          and provide a comprehensive intelligence report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dropzone */}
            <div
                className={cn(
                    "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer",
                    isDragging ? "border-primary bg-primary/10" : "border-muted hover:border-primary/50",
                    error ? "border-destructive" : "",
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
            >
                <UploadCloud className={cn("w-12 h-12 mb-4", isDragging ? "text-primary" : "text-muted-foreground")} />
                <p className="mb-2 text-sm font-semibold">
                    {isDragging ? "Drop the file here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                    MP3, WAV, or M4A (Max {MAX_FILE_SIZE / 1024 / 1024}MB)
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={Object.keys(ACCEPTED_AUDIO_TYPES).join(',')}
                    onChange={handleFileChange}
                    className="hidden"
                    id="audio-upload"
                    disabled={isSubmitting}
                />
            </div>

            {/* Selected File Display */}
            {selectedFile && (
                <div className="mt-4 p-3 border rounded-md flex items-center justify-between bg-muted/50">
                    <div className="flex items-center gap-3">
                        <FileAudio className="w-6 h-6 text-primary" />
                        <div>
                            <p className="text-sm font-medium truncate max-w-xs sm:max-w-sm md:max-w-md">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} aria-label="Remove file" disabled={isSubmitting}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Upload Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Description Input */}
            <div className="space-y-2">
                <Label htmlFor="description">Short Description (Optional)</Label>
                <Textarea
                    id="description"
                    placeholder="e.g., Discovery call with ACME Corp about Project X"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                />
                 <p className="text-xs text-muted-foreground">
                    Provide brief context about the call for more accurate analysis.
                 </p>
            </div>

            {/* Submit Button with Loading State */}
            <Button type="submit" disabled={!selectedFile || isSubmitting} className="w-full sm:w-auto">
               {isSubmitting ? (
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                   <Sparkles className="mr-2 h-4 w-4" />
               )}
               {isSubmitting ? 'Uploading & Processing...' : 'Start Conversation Intelligence'}
            </Button>
        </form>
      </CardContent>
    </Card>
  );
} 