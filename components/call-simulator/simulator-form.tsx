"use client";

import { useState } from "react";
import { CallSimulatorForm, INDUSTRIES, PAIN_POINTS } from "@/lib/data/call-simulator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SimulatorForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CallSimulatorForm>({
    arroganceLevel: "Medium",
    objectionLevel: "Moderate",
    talkativeness: "Balanced",
    confidenceLevel: "Confident",
    trustLevel: "Neutral",
    emotionalTone: "Neutral",
    decisionMakingStyle: "Logical",
    problemAwareness: "Somewhat aware",
    currentSolution: "Using a competitor",
    urgencyLevel: "Some urgency",
    budgetConstraints: "Flexible",
    painPoints: ["Efficiency"],
    prospectName: "Jane Doe",
    jobTitle: "Marketing Manager",
    industry: "Technology",
  });

  const handleChange = (field: keyof CallSimulatorForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.info("Please wait preparing");

    try {
      // Convert formData to a plain object and stringify it to ensure proper JSON format
      const personaDetails = JSON.parse(JSON.stringify(formData));

      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personaDetails }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to create simulation" }));
        throw new Error(errorData.message || "Failed to start simulation");
      }

      const result = await response.json();
      const simulationId = result.id;

      if (!simulationId) {
        throw new Error("Simulation ID not returned from server.");
      }

      // Redirect to the dynamic simulation page
      router.push(`/dashboard/realtime-simulator/${simulationId}`);

    } catch (error) {
      console.error("Simulation creation failed:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred.");
      setIsLoading(false); // Reset loading state only on error
    }
    // No need to reset loading state on success because we redirect
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm md:text-base">Simulate a realistic sales call and train your sales skills and get clear insights on how to improve your sales skills</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="simulator-form" onSubmit={handleSubmit} className="space-y-8">
          {/* 3-column grid for fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Row 1: Prospect Info */}
            <div>
              <Label htmlFor="prospectName">Name</Label>
              <Input
                id="prospectName"
                value={formData.prospectName}
                onChange={e => handleChange("prospectName", e.target.value)}
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={e => handleChange("jobTitle", e.target.value)}
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={val => handleChange("industry", val)}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(ind => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 2: Personality & Disposition */}
            <div>
              <Label htmlFor="arroganceLevel">Arrogance Level</Label>
              <Select value={formData.arroganceLevel} onValueChange={val => handleChange("arroganceLevel", val)}>
                <SelectTrigger id="arroganceLevel">
                  <SelectValue placeholder="Select arrogance level" />
                </SelectTrigger>
                <SelectContent>
                  {['Low', 'Medium', 'High'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="objectionLevel">Objection Level</Label>
              <Select value={formData.objectionLevel} onValueChange={val => handleChange("objectionLevel", val)}>
                <SelectTrigger id="objectionLevel">
                  <SelectValue placeholder="Select objection level" />
                </SelectTrigger>
                <SelectContent>
                  {['Passive', 'Moderate', 'Aggressive'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="talkativeness">Talkativeness</Label>
              <Select value={formData.talkativeness} onValueChange={val => handleChange("talkativeness", val)}>
                <SelectTrigger id="talkativeness">
                  <SelectValue placeholder="Select talkativeness" />
                </SelectTrigger>
                <SelectContent>
                  {['Quiet', 'Balanced', 'Very Talkative'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 3: More Personality */}
            <div>
              <Label htmlFor="confidenceLevel">Confidence Level</Label>
              <Select value={formData.confidenceLevel} onValueChange={val => handleChange("confidenceLevel", val)}>
                <SelectTrigger id="confidenceLevel">
                  <SelectValue placeholder="Select confidence level" />
                </SelectTrigger>
                <SelectContent>
                  {['Unsure', 'Confident', 'Overconfident'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="trustLevel">Trust Level</Label>
              <Select value={formData.trustLevel} onValueChange={val => handleChange("trustLevel", val)}>
                <SelectTrigger id="trustLevel">
                  <SelectValue placeholder="Select trust level" />
                </SelectTrigger>
                <SelectContent>
                  {['Skeptical', 'Neutral', 'Trusting'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emotionalTone">Emotional Tone</Label>
              <Select value={formData.emotionalTone} onValueChange={val => handleChange("emotionalTone", val)}>
                <SelectTrigger id="emotionalTone">
                  <SelectValue placeholder="Select emotional tone" />
                </SelectTrigger>
                <SelectContent>
                  {['Friendly', 'Neutral', 'Cold', 'Hostile'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 4: Decision Making & Pain Points */}
            <div>
              <Label htmlFor="decisionMakingStyle">Decision Making Style</Label>
              <Select value={formData.decisionMakingStyle} onValueChange={val => handleChange("decisionMakingStyle", val)}>
                <SelectTrigger id="decisionMakingStyle">
                  <SelectValue placeholder="Select decision making style" />
                </SelectTrigger>
                <SelectContent>
                  {['Emotional', 'Logical', 'Indecisive', 'Fast-Action Taker'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="painPoints">Pain Points (Pick up to 3)</Label>
              <Select
                value={formData.painPoints[0]}
                onValueChange={val => handleChange("painPoints", [val])}
              >
                <SelectTrigger id="painPoints">
                  <SelectValue placeholder="Select pain point" />
                </SelectTrigger>
                <SelectContent>
                  {PAIN_POINTS.map(point => (
                    <SelectItem key={point} value={point}>{point}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* For simplicity, only single select shown. For multi-select, a custom component would be needed. */}
            </div>
            <div>
              <Label htmlFor="problemAwareness">Problem Awareness</Label>
              <Select value={formData.problemAwareness} onValueChange={val => handleChange("problemAwareness", val)}>
                <SelectTrigger id="problemAwareness">
                  <SelectValue placeholder="Select problem awareness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unaware">Unaware</SelectItem>
                  <SelectItem value="Somewhat aware">Somewhat aware</SelectItem>
                  <SelectItem value="Very aware">Very aware</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Row 5: Buying Situation */}
            <div>
              <Label htmlFor="currentSolution">Current Solution</Label>
              <Select value={formData.currentSolution} onValueChange={val => handleChange("currentSolution", val)}>
                <SelectTrigger id="currentSolution">
                  <SelectValue placeholder="Select current solution" />
                </SelectTrigger>
                <SelectContent>
                  {['Using a competitor', 'DIY', 'Nothing in place'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <Select value={formData.urgencyLevel} onValueChange={val => handleChange("urgencyLevel", val)}>
                <SelectTrigger id="urgencyLevel">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {['Not urgent', 'Some urgency', 'Urgent now'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budgetConstraints">Budget Constraints</Label>
              <Select value={formData.budgetConstraints} onValueChange={val => handleChange("budgetConstraints", val)}>
                <SelectTrigger id="budgetConstraints">
                  <SelectValue placeholder="Select budget constraints" />
                </SelectTrigger>
                <SelectContent>
                  {['Tight', 'Flexible', 'No budget limit'].map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Centered button below form */}
          <div className="flex justify-center pt-4 col-span-full">
            <Button type="submit" size="lg" className="gap-2 px-8" form="simulator-form" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Phone className="w-5 h-5" />
              )}
              {isLoading ? "Preparing..." : "Start Call With Prospect"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
