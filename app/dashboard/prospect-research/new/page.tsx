import { AddProspectForm } from "@/components/prospects/add-prospect-form";
import { PageHeader } from "@/components/shared/page-header";

export default function AddProspectPage() {
  return (
    <>
      <PageHeader title="Add New Prospect" />
      <div className="p-4 md:p-6">
         <AddProspectForm />
      </div>
    </>
  );
} 