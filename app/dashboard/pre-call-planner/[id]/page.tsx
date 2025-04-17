 'use client'; // Needed for useParams

import { useParams } from 'next/navigation';
import { BriefDetailView } from '@/components/pre-call-planner/brief-detail-view'; // Import the new view component

export default function PreCallBriefDetailPage() {
  const params = useParams();
  const briefId = params.id as string;

  // Basic check if ID is missing
  if (!briefId) {
    return <div className="p-6 text-center text-red-500">Error: Brief ID is missing from the URL.</div>;
  }

  // Render the view component, passing the ID
  return (
      <BriefDetailView briefId={briefId} />
  );
}
