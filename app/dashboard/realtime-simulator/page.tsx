import { SimulatorForm } from "@/components/call-simulator/simulator-form";
import { PageHeader } from "@/components/shared/page-header";
export default function SimulatorPage() {
  return (
    <>
      <PageHeader title="Sales Call Simulator" />
      <div className="flex gap-4 flex-col p-4">
        <SimulatorForm />
      </div>
    </>
  );
} 