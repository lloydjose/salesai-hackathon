"use client";

import { useState } from 'react';
import { SimulatorPage } from "@/components/call-simulator/simulator-page";
import { PageHeader } from "@/components/shared/page-header";

export default function RealtimeSimulatorPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <PageHeader title={showForm ? "New Call Simulation" : "Real-time Call Simulator"} />
      <p className="text-sm text-muted-foreground -mt-4 mb-6 px-5">
        {showForm 
          ? "Configure and start your practice session."
          : "Practice your sales calls with an AI persona or review past sessions."
        }
      </p>
      <SimulatorPage showForm={showForm} setShowForm={setShowForm} />
    </>
  );
} 