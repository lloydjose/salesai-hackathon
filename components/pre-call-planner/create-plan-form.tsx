'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

// Zod schema for form validation (client-side)
const formSchema = z.object({
  prospectId: z.string().cuid({ message: "Please select a prospect." }),
  callType: z.enum(['Discovery', 'Demo', 'Follow-up', 'Cold Outreach', 'Upsell', 'Renewal'], { required_error: "Call type is required."}),
  productPitchContext: z.string().optional(),
  callObjective: z.string().min(5, { message: "Objective must be at least 5 characters." }),
  customNotes: z.string().optional(),
  knownPainPoints: z.array(z.string()).optional(),
  competitorMentioned: z.array(z.string()).optional(),
  priorityLevel: z.enum(['Low', 'Medium', 'High']).optional(),
});

type FormData = z.infer<typeof formSchema>;

// Type for prospects fetched for the dropdown
type ProspectOption = {
  id: string;
  name: string;
};

export function CreatePlanForm() {
  const router = useRouter();
  const [prospects, setProspects] = useState<ProspectOption[]>([]);
  const [isLoadingProspects, setIsLoadingProspects] = useState(true);
  const [prospectsError, setProspectsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch prospects for the dropdown
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProspects(true);
    setProspectsError(null);

    fetch('/api/prospects') // Fetch all prospects (might need adjustment if many)
      .then(res => {
          if (!isMounted) return Promise.reject(new Error("Component unmounted"));
          if (!res.ok) return res.json().then(err => Promise.reject(err));
          return res.json();
      })
      .then((data: ProspectOption[]) => {
        if (!isMounted) return;
        // Filter or ensure prospects have linkedinData if necessary for AI?
        // For now, list all prospects
        setProspects(data.map(p => ({ id: p.id, name: p.name }))); // Only need id and name
      })
      .catch(err => {
        if (!isMounted) return;
        console.error("Failed to fetch prospects:", err);
        setProspectsError(err.message || "Could not load prospects for selection.");
      })
      .finally(() => {
        if (isMounted) setIsLoadingProspects(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Initialize react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prospectId: "",
      callType: undefined,
      productPitchContext: "",
      callObjective: "",
      customNotes: "",
      knownPainPoints: [],
      competitorMentioned: [],
      priorityLevel: undefined,
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    toast.loading('Generating AI Pre-Call Plan...', { id: 'create-plan-toast' });

    try {
      const response = await fetch('/api/pre-call-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create plan');
      }

      toast.success('Pre-call plan created successfully!', { id: 'create-plan-toast' });
      // Redirect to the newly created brief's page (assuming API returns briefId)
      if (result.briefId) {
          router.push(`/dashboard/pre-call-planner/${result.briefId}`);
      } else {
          router.push('/dashboard/pre-call-planner'); // Fallback redirect
      }

    } catch (error) {
      console.error("Failed to create pre-call plan:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(`Error: ${message}`, { id: 'create-plan-toast' });
      setIsSubmitting(false);
    }
    // Don't set isSubmitting to false on success due to redirect
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Prospect Selection */}
        <FormField
          control={form.control}
          name="prospectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prospect *</FormLabel>
              <Select
                 onValueChange={field.onChange}
                 defaultValue={field.value}
                 disabled={isLoadingProspects || isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingProspects ? "Loading prospects..." : "Select a prospect"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingProspects && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                  {prospectsError && <SelectItem value="error" disabled>{prospectsError}</SelectItem>}
                  {!isLoadingProspects && prospects.length === 0 && <SelectItem value="no-prospects" disabled>No prospects found</SelectItem>}
                  {prospects.map((prospect) => (
                    <SelectItem key={prospect.id} value={prospect.id}>
                      {prospect.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the prospect you are planning this call for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Call Type */}
        <FormField
          control={form.control}
          name="callType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select call type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {formSchema.shape.callType.options.map((type) => (
                     <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Call Objective */}
        <FormField
          control={form.control}
          name="callObjective"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call Objective *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Secure a pilot project commitment" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                What is the primary goal for this specific call?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

         {/* Product Pitch Context */}
        <FormField
          control={form.control}
          name="productPitchContext"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product/Service Context (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Briefly describe the product/service angle, e.g., 'AI-powered data access layer for OT security'" {...field} disabled={isSubmitting} />
              </FormControl>
               <FormDescription>
                Provide context if the AI needs to know what you&apos;re selling.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Advanced Options Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-options">
            <AccordionTrigger>Advanced Options</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
                {/* Custom Notes */}
                <FormField
                  control={form.control}
                  name="customNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any specific notes, e.g., 'Mentioned interest in decentralized access in last webinar'" {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Known Pain Points (Using Input as fallback) */}
                <FormField
                  control={form.control}
                  name="knownPainPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Known Pain Points</FormLabel>
                      <FormControl>
                          {/* Using Input for comma-separated values */}
                          <Input
                              placeholder="Enter pain points separated by commas"
                              // Convert array to string for input value
                              value={(field.value ?? []).join(', ')}
                              // Convert string back to array on change
                              onChange={(e) => field.onChange(e.target.value.split(',').map(t => t.trim()).filter(t => t !== ''))}
                              disabled={isSubmitting}
                           />
                      </FormControl>
                      <FormDescription>Enter values separated by commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Competitor Mentioned (Using Input as fallback) */}
                <FormField
                  control={form.control}
                  name="competitorMentioned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitors Mentioned</FormLabel>
                      <FormControl>
                          {/* Using Input for comma-separated values */}
                          <Input
                              placeholder="Enter competitors separated by commas"
                              // Convert array to string for input value
                              value={(field.value ?? []).join(', ')}
                              // Convert string back to array on change
                              onChange={(e) => field.onChange(e.target.value.split(',').map(t => t.trim()).filter(t => t !== ''))}
                              disabled={isSubmitting}
                           />
                      </FormControl>
                      <FormDescription>Enter values separated by commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 {/* Priority Level */}
                <FormField
                  control={form.control}
                  name="priorityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Set a priority (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Low">Low</SelectItem>
                           <SelectItem value="Medium">Medium</SelectItem>
                           <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Submission Button */}
        <Button type="submit" disabled={isSubmitting || isLoadingProspects || !!prospectsError}>
          {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
              <Sparkles className="mr-2 h-4 w-4" />
          )}
          Prepare Pre-Call Plan
        </Button>
      </form>
    </Form>
  );
} 