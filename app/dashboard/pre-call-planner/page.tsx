'use client'; // Needed for Link/Button

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { BriefList } from '@/components/pre-call-planner/brief-list'; // Import the new component

export default function PreCallPlannerPage() {
  return (
    <>
      <PageHeader title="Pre-Call Planner">
         <Link href="/dashboard/pre-call-planner/new">
             <Button>
                 <PlusCircle className="mr-2 h-4 w-4" />
                 Create New Plan
             </Button>
         </Link>
      </PageHeader>
      <div className="p-4 md:p-6">
         <BriefList />
      </div>
    </>
  );
} 