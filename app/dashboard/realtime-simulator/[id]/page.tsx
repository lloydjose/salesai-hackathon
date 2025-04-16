"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useParams } from 'next/navigation';
import { SimulationCallUI } from '@/components/call-simulator/simulation';

export default function SimulationCallPage() {
  const params = useParams();
  const simulationId = params.id as string;

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Call Simulation" />
      <div className="flex-grow p-4 md:p-6">
        {simulationId ? (
          <SimulationCallUI simulationId={simulationId} />
        ) : (
          <p className="text-center text-muted-foreground">Loading simulation...</p>
        )}
      </div>
    </div>
  );
} 