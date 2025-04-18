'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Import Form components
import { Loader2 } from 'lucide-react';

// Schema for LinkedIn URL input
const linkedinSchema = z.object({
  linkedinUrl: z.string().url({ message: "Please enter a valid LinkedIn profile URL." }),
});

// Placeholder schema for manual input (expand as needed)
const manualSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    // Add other manual fields: jobTitle, companyName, email, customData (Textarea)
    // ...
});

type LinkedinFormValues = z.infer<typeof linkedinSchema>;
type ManualFormValues = z.infer<typeof manualSchema>;

export function AddProspectForm() {
  // eslint-disable-next-line
  const router = useRouter();
  const [sourceType, setSourceType] = useState<'linkedin' | 'manual'>('linkedin');
  const [isLoading, setIsLoading] = useState(false);

  // Form setup for LinkedIn
  const linkedinForm = useForm<LinkedinFormValues>({
    resolver: zodResolver(linkedinSchema),
    defaultValues: {
      linkedinUrl: "",
    },
  });

  // Form setup for Manual (initially basic)
  const manualForm = useForm<ManualFormValues>({
       resolver: zodResolver(manualSchema),
       defaultValues: {
         name: "",
         // ... default values for other manual fields
       },
  });

  // Handler for LinkedIn form submission
  const handleLinkedInSubmit = async (values: LinkedinFormValues) => {
    setIsLoading(true);
    console.log("Submitting LinkedIn URL:", values.linkedinUrl);
    try {
      const response = await fetch('/api/prospects/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl: values.linkedinUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to research prospect (${response.status})`);
      }

      toast.success(`Prospect "${result.name || 'Unknown'}" added successfully!`);
      linkedinForm.reset();
      // Optionally redirect back to the main prospect list page
      // router.push('/dashboard/prospect-research');

    } catch (error: any) {
      console.error("LinkedIn research error:", error);
      toast.error(`Error: ${error.message || 'Could not add prospect.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder handler for Manual form submission
   const handleManualSubmit = async (values: ManualFormValues) => {
     setIsLoading(true);
     console.log("Submitting Manual Data:", values);
     toast.info("Manual prospect creation not implemented yet.");
     // TODO: Implement fetch call to a new API route (e.g., /api/prospects/manual)
     // ... fetch logic ...
     setIsLoading(false);
     // manualForm.reset();
     // router.push('/dashboard/prospect-research');
   };

  return (
    <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Add Prospect</CardTitle>
            <CardDescription>Choose how to add your prospect information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Source Type Selection */}
            <RadioGroup
                defaultValue="linkedin"
                value={sourceType}
                onValueChange={(value: 'linkedin' | 'manual') => setSourceType(value)}
                className="flex space-x-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="linkedin" id="linkedin" />
                    <Label htmlFor="linkedin">From LinkedIn URL</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">Manually</Label>
                </div>
            </RadioGroup>

            {/* LinkedIn Form */}
            {sourceType === 'linkedin' && (
                <Form {...linkedinForm}>
                    <form onSubmit={linkedinForm.handleSubmit(handleLinkedInSubmit)} className="space-y-4">
                         <FormField
                            control={linkedinForm.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>LinkedIn Profile URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://www.linkedin.com/in/..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Add to Prospect List
                        </Button>
                    </form>
                 </Form>
            )}

            {/* Manual Input Form */}
            {sourceType === 'manual' && (
                <Form {...manualForm}>
                    <form onSubmit={manualForm.handleSubmit(handleManualSubmit)} className="space-y-4">
                         <FormField
                             control={manualForm.control}
                             name="name"
                             render={({ field }) => (
                                 <FormItem>
                                 <FormLabel>Prospect Name</FormLabel>
                                 <FormControl>
                                     <Input placeholder="Enter full name" {...field} />
                                 </FormControl>
                                 <FormMessage />
                                 </FormItem>
                             )}
                         />
                        {/* TODO: Add inputs for jobTitle, companyName, email, customData */}
                        <p className="text-sm text-muted-foreground">Manual entry form fields to be added.</p>
                        <Button type="submit" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                             Add Prospect Manually
                        </Button>
                    </form>
                 </Form>
            )}
        </CardContent>
    </Card>
  );
}
