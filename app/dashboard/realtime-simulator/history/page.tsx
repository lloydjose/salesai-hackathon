import { PageHeader } from "@/components/shared/page-header";
import { PastSimulationsList } from "@/components/call-simulator/past-simulations-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Re-exporting the component for clarity in routing if needed, or can be used directly
export default function PastSimulationsPage() {
  return (
    <div className="p-4 md:p-6">
      <PageHeader title="Past Simulation Reports" />
      <p className="text-sm text-muted-foreground -mt-4 mb-6 px-1">
         Review details and feedback from your previous simulations.
      </p>
      <Card> 
        <CardHeader>
          <CardTitle>Simulation History</CardTitle>
          <CardDescription>Select a report to view details.</CardDescription>
        </CardHeader>
        <CardContent>
          <PastSimulationsList />
        </CardContent>
      </Card>
    </div>
  );
} 