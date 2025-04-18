'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import { type ColdEmailGeneratorResult } from '@/lib/ai/schemas';
import Link from 'next/link';
import { TipTapEditor } from '@/components/shared/tiptap-editor';

// Type for the fetched email data
type EmailEditData = {
    id: string;
    userInput?: any | null;
    aiGeneratedEmail: ColdEmailGeneratorResult | null;
    editedContent?: string | null;
    createdAt?: Date | string;
    prospect?: { name: string | null } | null;
};

interface EmailEditViewProps {
    emailId: string;
}

// Helper to reconstruct initial body from AI data if needed
const getInitialBody = (aiData: ColdEmailGeneratorResult | null): string => {
    if (!aiData) return '';
    // Combine parts into a basic HTML structure for TipTap
    const parts = [
        aiData.greeting,
        aiData.openingHook,
        aiData.valueProposition,
        aiData.bodyConnector,
        aiData.callToAction,
        aiData.closing,
    ].filter(Boolean);
    // Wrap each part in a paragraph tag
    return parts.map(part => `<p>${part}</p>`).join(''); 
}

export function EmailEditView({ emailId }: EmailEditViewProps) {
    const [emailData, setEmailData] = useState<EmailEditData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchEmailData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/cold-emails/${emailId}`);
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to fetch email data');
            }
            const data: EmailEditData = await response.json();
            setEmailData(data);
            // Initialize editor state
            setSubject(data.aiGeneratedEmail?.subjectLine || '');
            // Use editedContent if available, otherwise generate initial HTML
            setBody(data.editedContent || getInitialBody(data.aiGeneratedEmail)); 
        } catch (err) {
            console.error("Error fetching email data:", err);
            const message = err instanceof Error ? err.message : "Could not load email data.";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [emailId]);

    useEffect(() => {
        fetchEmailData();
    }, [fetchEmailData]);

    const handleSave = async () => {
        setIsSaving(true);
        const toastId = toast.loading('Saving email...');
        try {
            // Call the PATCH API endpoint
            const response = await fetch(`/api/cold-emails/${emailId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    editedContent: body 
                    // If saving subject separately, add: 
                    // editedSubject: subject
                }),
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Failed to save email (HTTP ${response.status})`);
            }

            // Update local state if needed (optional, as user might navigate away)
            setEmailData(prev => prev ? { ...prev, editedContent: body } : null);
            toast.success('Email saved successfully!', { id: toastId }); 
            // Consider redirecting back to history or showing a persistent confirmation
            // Example: router.push('/dashboard/cold-emails/history'); (needs useRouter hook)

        } catch (err) {
            console.error("Error saving email:", err);
            const message = err instanceof Error ? err.message : "Could not save email.";
            toast.error(message, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const recipientName = emailData?.prospect?.name || (emailData?.userInput as any)?.recipientName || 'Unknown Recipient';

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="m-4">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Error Loading Email</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
        );
    }

    if (!emailData) {
        return <p className="p-4">Email not found.</p>;
    }

    return (
         <Card>
            <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <CardTitle>Edit Cold Email</CardTitle>
                        <CardDescription>Editing email generated for {recipientName} on {new Date(emailData.createdAt || Date.now()).toLocaleDateString()}.</CardDescription>
                    </div>
                    <Link href="/dashboard/cold-emails/history"> 
                         <Button variant="outline" size="sm" asChild>
                             <span> 
                                 <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
                             </span>
                         </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                 {/* Simple Subject Editor (using input now) */}
                 <div>
                    <Label htmlFor="subject">Subject</Label>
                    <input 
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter email subject"
                    />
                </div>
                {/* TipTap Editor Integration */}
                <div>
                    <Label htmlFor="body">Body</Label>
                    <TipTapEditor 
                        value={body}
                        onChange={(newContent: string) => setBody(newContent)}
                        placeholder="Enter email body..."
                        className="mt-1"
                        contentClassName="min-h-[40vh]" // Control editor height via content class
                    />
                    {/* <p className="text-xs text-muted-foreground mt-1">Basic WYSIWYG editor.</p> */}
                </div>
            </CardContent>
            <CardFooter className="justify-end border-t pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardFooter>
        </Card>
    );
} 