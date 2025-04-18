import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { type ColdEmailGeneratorResult } from '@/lib/ai/schemas';

interface EmailRendererProps {
  emailData: ColdEmailGeneratorResult | null;
  showSaveButton?: boolean; // Option to show/hide save button
  onSave?: (editedContent: string) => void; // Callback for save (if implemented)
}

export function EmailRenderer({ emailData, showSaveButton = false, onSave }: EmailRendererProps) {
    if (!emailData) return null;

    // Combine parts into a readable format for display/editor
    const fullBody = [
        emailData.openingHook,
        emailData.valueProposition,
        emailData.bodyConnector,
        emailData.callToAction,
    ].filter(Boolean).join('\n\n');

    const fullEmailText = `${emailData.greeting}\n\n${fullBody}\n\n${emailData.closing}`;

    // TODO: Implement state and handler for WYSIWYG content if editing is enabled

    return (
        <Card className="mt-6 bg-muted/30 border-none shadow-none">
            <CardHeader className="pt-0">
                <CardTitle className="flex items-center justify-between">
                    <span>Generated Email</span>
                    <Badge variant="outline">Overall Score: {emailData.emailScore?.overall ?? 'N/A'}/10</Badge>
                </CardTitle>
                {emailData.reasoning && (
                    <CardDescription>AI Reasoning: {emailData.reasoning}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label className="font-semibold">Subject:</Label>
                        <p className="text-sm p-2 border rounded bg-background">{emailData.subjectLine}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Body:</Label>
                        <div 
                            className="text-sm p-3 border rounded bg-background min-h-[200px] whitespace-pre-wrap font-sans"
                            aria-label="Generated email body preview"
                        >
                           {fullEmailText}
                        </div>
                        {showSaveButton && (
                            <p className="text-xs text-muted-foreground mt-1">
                                TODO: Implement WYSIWYG editor and save functionality on Edit page.
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
            {showSaveButton && (
                <CardFooter className="justify-end">
                    <Button size="sm" disabled onClick={() => onSave?.('')}>
                        <Save className="mr-2 h-4 w-4"/> Save Edits (Not Implemented)
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
} 