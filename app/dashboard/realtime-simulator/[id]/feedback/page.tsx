'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from "@/components/shared/page-header"; // Assuming you have this
import { FeedbackDisplay } from '@/components/call-simulator/feedback-display';

export default function FeedbackPage() {
  const params = useParams();
  const simulationId = params.id as string;

  return (
    <>
    <PageHeader 
          title="Call Simulation Feedback"/>
    <div className="flex gap-4 flex-col p-4">
       
       {simulationId ? (
         <FeedbackDisplay simulationId={simulationId} />
       ) : (
          <p className="text-center text-muted-foreground">Invalid Simulation ID.</p> 
       )}
    </div>
    </>
  );
} 