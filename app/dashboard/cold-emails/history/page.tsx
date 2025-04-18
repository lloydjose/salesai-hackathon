'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Eye, Trash2, AlertCircle, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { type ColdEmailGeneratorResult } from '@/lib/ai/schemas';
import { EmailRenderer } from '@/components/cold-emails/email-renderer';

// Type for the fetched email list
type PreviousEmail = {
    id: string;
    createdAt: Date | string;
    recipientName: string;
    subjectContext: string;
    aiGeneratedEmail: ColdEmailGeneratorResult | null;
    editedContent?: string | null; // Add editedContent from schema
    userInput?: any | null; // Keep userInput if needed for context
};

export default function ColdEmailHistoryPage() {
    const [previousEmails, setPreviousEmails] = useState<PreviousEmail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEmailForView, setSelectedEmailForView] = useState<PreviousEmail | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track deleting state by ID
    const router = useRouter();

    const fetchPreviousEmails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/cold-emails');
            if (!response.ok) {
                 const errData = await response.json();
                 throw new Error(errData.message || 'Failed to fetch previous emails');
            }
            const data: PreviousEmail[] = await response.json();
            setPreviousEmails(data);
        } catch (err) {
            console.error("Error fetching previous emails:", err);
            const message = err instanceof Error ? err.message : "Could not load previous emails.";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPreviousEmails();
    }, [fetchPreviousEmails]);

    const handleDelete = async (emailId: string) => {
        if (!emailId || isDeleting) return;
        
        if (!confirm("Are you sure you want to delete this generated email? This cannot be undone.")) {
            return;
        }
        
        setIsDeleting(emailId);
        const toastId = toast.loading('Deleting email...');
        try {
             const response = await fetch(`/api/cold-emails/${emailId}`, { // Assuming DELETE endpoint exists
                 method: 'DELETE',
             });
             if (!response.ok) {
                 const errData = await response.json();
                 throw new Error(errData.message || 'Failed to delete email');
             }
             toast.success('Email deleted', { id: toastId });
             // Refresh list by removing the deleted item
             setPreviousEmails(prev => prev.filter(email => email.id !== emailId));
        } catch (err) {
             console.error("Error deleting email:", err);
             const message = err instanceof Error ? err.message : "Could not delete email.";
             toast.error(message, { id: toastId });
        } finally {
            setIsDeleting(null);
        }
    };

    // Helper function for navigation
    const handleEditClick = (emailId: string) => {
        router.push(`/dashboard/cold-emails/${emailId}/edit`);
    };

    // Skeleton Row Component (Optional: could be a separate component)
    const SkeletonRow = () => (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell className="text-right space-x-1">
                <Skeleton className="h-8 w-8 inline-block" />
                <Skeleton className="h-8 w-8 inline-block" />
            </TableCell>
        </TableRow>
    );

    return (
        <>
            <PageHeader 
                title="Cold Email History"
                // description="Review previously generated cold emails."
            />
             <p className="p-4 md:px-6 md:pb-0 text-muted-foreground text-sm">
                Review previously generated cold emails.
             </p>
            <div className="p-4 md:p-6 pt-4 md:pt-4">
                 <Card>
                    <CardHeader>
                        {/* Optional: Add filtering or search here later */}
                    </CardHeader>
                    <CardContent>
                        {/* Remove simple text loader */} 
                        {/* {isLoading && <p className="text-muted-foreground"><Loader2 className="inline-block mr-2 h-4 w-4 animate-spin"/>Loading history...</p>} */} 
                        
                        {/* Keep error display */} 
                        {error && (
                             <Alert variant="destructive">
                               <AlertCircle className="h-4 w-4" />
                               <AlertTitle>Error Loading History</AlertTitle>
                               <AlertDescription>{error}</AlertDescription>
                             </Alert>
                        )}
                        
                        {/* Keep empty state display */} 
                        {!isLoading && !error && previousEmails.length === 0 && <p className="text-muted-foreground">No emails generated yet.</p>}
                        
                        {/* Table rendering logic */} 
                        {(!error && previousEmails.length > 0) || isLoading ? ( // Show table structure even during loading
                            <ScrollArea className="h-[60vh]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Recipient</TableHead>
                                            <TableHead>Subject Context</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            // Show Skeleton Rows when loading
                                            <>
                                                <SkeletonRow />
                                                <SkeletonRow />
                                                <SkeletonRow />
                                                <SkeletonRow /> 
                                            </>
                                        ) : (
                                            // Show actual data when loaded
                                            previousEmails.map((email) => (
                                                <TableRow key={email.id}>
                                                    <TableCell className="text-xs">{new Date(email.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell>{email.recipientName}</TableCell>
                                                    <TableCell className="truncate max-w-xs">{email.subjectContext}</TableCell>
                                                    <TableCell className="text-right space-x-1">
                                                        {/* View Dialog */}
                                                        <Dialog 
                                                            open={selectedEmailForView?.id === email.id} 
                                                            onOpenChange={(isOpen) => {
                                                                if (!isOpen) setSelectedEmailForView(null);
                                                            }}
                                                        >
                                                            <DialogTrigger asChild>
                                                                 <Button variant="ghost" size="icon" title="View Email" onClick={() => setSelectedEmailForView(email)} disabled={isDeleting === email.id}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[600px] md:max-w-[800px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Generated Email Details</DialogTitle>
                                                                    <DialogDescription>
                                                                         Generated on {new Date(email.createdAt).toLocaleString()} for {email.recipientName}.
                                                                        {email.editedContent && <span className="block text-orange-600 text-xs mt-1">(Edited version shown)</span>} 
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <ScrollArea className="max-h-[60vh] pr-4">
                                                                    {/* Use the EmailRenderer component */}
                                                                    <EmailRenderer 
                                                                         emailData={email.aiGeneratedEmail} 
                                                                    /> 
                                                                </ScrollArea>
                                                                <DialogFooter className="sm:justify-between">
                                                                    {/* Edit button with onClick navigation */}
                                                                     <Button 
                                                                        variant="outline" 
                                                                        size="sm" 
                                                                        onClick={() => handleEditClick(email.id)}
                                                                     >
                                                                        <Edit className="mr-2 h-4 w-4" /> 
                                                                        Edit Email
                                                                    </Button>
                                                                    <DialogClose asChild>
                                                                        <Button type="button" variant="secondary">Close</Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                         {/* Delete Button */}
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            title="Delete Email"
                                                            onClick={() => handleDelete(email.id)} 
                                                            disabled={isDeleting === email.id}
                                                            className="text-destructive hover:text-destructive/80"
                                                        >
                                                            {isDeleting === email.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        ) : (
                            // Only show if not loading, no error, and empty
                            !isLoading && !error && previousEmails.length === 0 && <p className="text-muted-foreground">No emails generated yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
} 