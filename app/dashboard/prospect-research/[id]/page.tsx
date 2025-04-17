'use client';

import { useParams } from 'next/navigation';
import { ProspectDetailView } from '@/components/prospects/prospect-detail-view';

export default function ProspectDetailPage() {
  const params = useParams();
  const prospectId = params.id as string;

  // Basic check if ID is missing, render simple message
  if (!prospectId) {
     // You might want a more robust error display here, maybe a dedicated component
    return <div className="p-6 text-center text-red-500">Error: Prospect ID is missing from the URL.</div>;
  }

  // Render the new component, passing the ID. It handles everything else.
  return (
      <ProspectDetailView prospectId={prospectId} />
  );
} 