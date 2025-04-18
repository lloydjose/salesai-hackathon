"use client";

import Link from 'next/link';
import { SimulatorForm } from "@/components/call-simulator/simulator-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Phone } from "lucide-react";

interface SimulatorPageProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export function SimulatorPage({ showForm, setShowForm }: SimulatorPageProps) {
  if (showForm) {
    return (
      <div className="px-5">
        <section>
          <SimulatorForm />
        </section>
      </div>
    );
  }

  return (
    <div className="px-5">
      {/* Action Cards Section */}
      <div className="flex flex-col md:flex-row gap-6 max-w-4xl">
        {/* Card 1: Start New Simulation */}
        <Card 
          className="w-full md:w-[360px] h-[220px] hover:border-primary/50 hover:shadow-md transition-all cursor-pointer relative" 
          onClick={() => setShowForm(true)}
        > 
          <CardHeader>
            <Phone className="h-6 w-6 text-primary mb-2" />
            <div className="absolute bottom-6 left-6 right-6">
              <CardTitle className="text-lg font-semibold mb-1.5">Start New Simulation</CardTitle>
              <CardDescription className="text-sm">
                Configure the AI persona and scenario, then start your practice call.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Card 2: View Past Simulations */}
        <Link href="/dashboard/realtime-simulator/history" className="block w-full md:w-[360px]">
          <Card className="h-[220px] hover:border-primary/50 hover:shadow-md transition-all relative">
            <CardHeader>
              <History className="h-6 w-6 text-primary mb-2" />
              <div className="absolute bottom-6 left-6 right-6">
                <CardTitle className="text-lg font-semibold mb-1.5">View Past Simulations</CardTitle>
                <CardDescription className="text-sm">
                  Review the reports and feedback from your previous simulation sessions.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
} 