import { PageHeader } from "@/components/shared/page-header";
import { BillingView } from "@/components/account/billing-view"; // We will create this next

export default function BillingPage() {
  return (
    <>
      <PageHeader 
        title="Billing & Plans"
        // Optional: Add description if needed
        // description="Manage your subscription plan and view billing history." 
      />
      <div className="p-4 md:p-6">
        {/* Client component handling subscription data and plan interaction */}
        <BillingView /> 
      </div>
    </>
  );
} 