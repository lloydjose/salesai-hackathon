'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, Mail, History, Edit } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
// eslint-disable-next-line
import { coldEmailStyles, psychologyAngles, type ColdEmailFormInput } from '@/lib/ai/types';
import { type ColdEmailGeneratorResult } from '@/lib/ai/schemas'; // AI Response type
import { ReadOnlyTipTapViewer } from '@/components/shared/read-only-tiptap-viewer';

// --- Zod Schema for Frontend Form Validation ---
const formSchema = z.object({
    recipientName: z.string().optional().nullable(),
    recipientTitle: z.string().optional().nullable(),
    recipientCompany: z.string().optional().nullable(),
    prospectId: z.string().optional().nullable(), // Allow empty selection
    emailSubjectContext: z.string().min(10, "Email context must be at least 10 characters"),
    emailStyle: z.enum(coldEmailStyles, { required_error: "Email style is required" }),
    psychologyAngle: z.enum(psychologyAngles, { required_error: "Psychology angle is required" }),
    customInstructions: z.string().optional().nullable(),
}).refine(data => data.prospectId || data.recipientName, {
    message: "Either select a Prospect or provide a Recipient Name.",
    path: ["recipientName"],
});
type FormValues = z.infer<typeof formSchema>;

// --- Prospect Type (for dropdown) ---
type ProspectOption = {
    id: string;
    name: string;
};

// Type for the state holding the generated email result + ID
type GeneratedEmailState = {
    id: string;
    aiGeneratedEmail: ColdEmailGeneratorResult;
} | null;

// Helper to construct initial HTML body from AI data
const generateInitialHtmlBody = (aiData: ColdEmailGeneratorResult | null): string => {
    if (!aiData) return '';
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
};

export function EmailGeneratorView() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmailState>(null);
    const [prospects, setProspects] = useState<ProspectOption[]>([]);
    const [isLoadingProspects, setIsLoadingProspects] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipientName: "",
            recipientTitle: "",
            recipientCompany: "",
            prospectId: "",
            emailSubjectContext: "",
            emailStyle: coldEmailStyles[0], // Default to first style
            psychologyAngle: psychologyAngles[0], // Default to first angle
            customInstructions: "",
        },
    });

    // --- Data Fetching --- 
    const fetchProspects = useCallback(async () => {
        setIsLoadingProspects(true);
        try {
            const response = await fetch('/api/prospects'); // Assuming GET /api/prospects exists
            if (!response.ok) throw new Error('Failed to fetch prospects');
            const data: ProspectOption[] = await response.json();
            setProspects(data);
        } catch (error) {
            console.error("Error fetching prospects:", error);
            toast.error("Could not load prospects.");
        } finally {
            setIsLoadingProspects(false);
        }
    }, []);

    useEffect(() => {
        fetchProspects();
    }, [fetchProspects]);

    // --- Form Submission --- 
    async function onSubmit(values: FormValues) {
        setIsGenerating(true);
        setGeneratedEmail(null);
        setShowForm(false);
        const toastId = toast.loading('Generating email...');

        try {
            const response = await fetch('/api/cold-emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to generate email');
            }
            
            // Store the full result (ID + content)
            setGeneratedEmail(result as GeneratedEmailState); 
            toast.success('Email generated successfully!', { id: toastId });

        } catch (error) {
            console.error("Email generation error:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            toast.error(`Generation failed: ${message}`, { id: toastId });
            setShowForm(true);
        } finally {
            setIsGenerating(false);
        }
    }

    const handleCreateAnother = () => {
        setGeneratedEmail(null);
        setShowForm(true);
        form.reset();
    };

    const handleEditClick = () => {
        if (generatedEmail?.id) {
            router.push(`/dashboard/cold-emails/${generatedEmail.id}/edit`);
        }
    };

    return (
        <div className="space-y-8">
            {showForm ? (
                /* --- Generation Form --- */
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Generate Cold Email</CardTitle>
                            <CardDescription>Provide context or select a prospect to generate a personalized cold email.</CardDescription>
                        </div>
                        <Link href="/dashboard/cold-emails/history" passHref>
                             <Button variant="outline" size="sm" asChild>
                                <span> 
                                    <History className="mr-2 h-4 w-4" />
                                    View History
                                </span>
                             </Button>
                        </Link>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <CardContent className="space-y-6">
                                {/* Prospect Selection or Manual Input */} 
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    <FormField
                                        control={form.control}
                                        name="prospectId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Prospect (Optional)</FormLabel>
                                                <Select 
                                                    onValueChange={(value) => {
                                                        // Convert special value back to null for form state
                                                        const actualValue = value === "__NONE__" ? null : value;
                                                        field.onChange(actualValue); 
                                                        // Optionally clear manual fields if prospect selected
                                                        if (actualValue) {
                                                            form.setValue('recipientName', '');
                                                            form.setValue('recipientTitle', '');
                                                            form.setValue('recipientCompany', '');
                                                        }
                                                    }}
                                                    // Map null/undefined form value back to special value for Select
                                                    defaultValue={field.value || "__NONE__"} 
                                                    disabled={isLoadingProspects}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                             <SelectValue placeholder={isLoadingProspects ? "Loading..." : "Select existing prospect..."} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {/* Use special non-empty value for the 'None' option */}
                                                        <SelectItem value="__NONE__">-- None (Enter Manually) --</SelectItem>
                                                        {prospects.map(p => (
                                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Overrides manual recipient fields if selected.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    <p className="text-sm text-center text-muted-foreground md:col-span-2">OR enter recipient details manually:</p>
                                    
                                    <FormField
                                        control={form.control}
                                        name="recipientName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Recipient Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Jane Doe" {...field} value={field.value ?? ''} disabled={!!form.watch('prospectId')}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                     <FormField
                                        control={form.control}
                                        name="recipientTitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Recipient Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., VP of Marketing" {...field} value={field.value ?? ''} disabled={!!form.watch('prospectId')}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                      <FormField
                                        control={form.control}
                                        name="recipientCompany"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Recipient Company</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Acme Corporation" {...field} value={field.value ?? ''} disabled={!!form.watch('prospectId')}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <Separator />
                                {/* Email Details */} 
                                <FormField
                                    control={form.control}
                                    name="emailSubjectContext"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>What is the email about?</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Briefly describe the purpose or main topic of the email (e.g., introduce product X, follow up on meeting, offer resource Y)" {...field} />
                                            </FormControl>
                                             <FormDescription>Provide context for the subject line and value proposition.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="emailStyle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Style</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue placeholder="Select style..." /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {coldEmailStyles.map(style => (
                                                            <SelectItem key={style} value={style}>{style}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    <FormField
                                        control={form.control}
                                        name="psychologyAngle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Psychology Angle</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue placeholder="Select angle..." /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {psychologyAngles.map(angle => (
                                                            <SelectItem key={angle} value={angle}>{angle}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                 <FormField
                                    control={form.control}
                                    name="customInstructions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Instructions (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Any specific points to include or avoid? Mention a competitor? Focus on a particular pain point?" {...field} value={field.value ?? ''} rows={3} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate Email
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            ) : (
                /* --- Generated Email Result View --- */
                <div className="space-y-4">
                    {/* Action Buttons */} 
                    <div className="flex justify-between items-center flex-wrap gap-2">
                         {/* Group left buttons */} 
                         <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCreateAnother}>
                                <Mail className="mr-2 h-4 w-4" /> Create Another
                            </Button>
                            <Button 
                                variant="default"
                                size="sm" 
                                onClick={handleEditClick} 
                                disabled={!generatedEmail?.id}
                            >
                                <Edit className="mr-2 h-4 w-4" /> Edit this Email
                            </Button>
                        </div>
                        {/* Right button */} 
                         <Link href="/dashboard/cold-emails/history" passHref>
                            <Button variant="outline" size="sm" asChild>
                                 <span>
                                    <History className="mr-2 h-4 w-4" />
                                    View History
                                 </span>
                            </Button>
                        </Link>
                    </div>

                    {/* Loading State */} 
                    {isGenerating ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"> 
                                <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary"/> Generating...
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">AI is crafting your email...</p>
                            </CardContent>
                         </Card>
                    ) : (
                         /* Generated Content Display */
                        generatedEmail?.aiGeneratedEmail && (
                            <Card>
                                <CardHeader>
                                     <CardTitle className="flex items-center justify-between">
                                        <span>Generated Email Preview</span>
                                        <Badge variant="outline">Score: {generatedEmail.aiGeneratedEmail.emailScore?.overall ?? 'N/A'}/10</Badge>
                                    </CardTitle>
                                    {generatedEmail.aiGeneratedEmail.reasoning && (
                                        <CardDescription>AI Reasoning: {generatedEmail.aiGeneratedEmail.reasoning}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="font-semibold">Subject:</Label>
                                        <p className="text-sm p-2 border rounded bg-background mt-1">{generatedEmail.aiGeneratedEmail.subjectLine}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Body:</Label>
                                        <ReadOnlyTipTapViewer 
                                            value={generateInitialHtmlBody(generatedEmail.aiGeneratedEmail)} 
                                            className="mt-1" 
                                            contentClassName="min-h-[25vh]"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            )}
        </div>
    );
} 