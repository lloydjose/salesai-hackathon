import { CreatePlanForm } from "@/components/pre-call-planner/create-plan-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddPreCallPlanPage() {
  return (
    <>
      <PageHeader title="Create New Pre-Call Plan" />
      <div className="p-4 md:p-6">
         <CreatePlanForm />
      </div>
    </>
  );
} 