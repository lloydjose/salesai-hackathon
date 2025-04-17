import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";
import { PlusCircle } from "lucide-react"; // Removed Loader2
// Removed ProspectCard, Alert, Terminal imports
import { ProspectList } from '@/components/prospects/prospect-list'; // Import the new component

// Removed ProspectListData type definition

export default function ProspectResearchPage() {
  // Removed state and useEffect hooks

  return (
    <>
      <PageHeader title="Prospect Research">
         <Link href="/dashboard/prospect-research/new">
             <Button>
                 <PlusCircle className="mr-2 h-4 w-4" />
                 Add New Prospect
             </Button>
         </Link>
      </PageHeader>
      <div className="p-4 md:p-6">
         {/* Render the new component which handles its own loading/error/data states */}
         <ProspectList />
      </div>
    </>
  );
} 