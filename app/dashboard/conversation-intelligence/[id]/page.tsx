import { AnalysisPageClient } from '@/components/conversation-intelligence/analysis-page-client';
import { PageHeader } from '@/components/shared/page-header';

// Update props interface to reflect params being a Promise
interface ConversationAnalysisPageProps {
    params: Promise<{
        id: string;
    }>;
    // searchParams might also be available if needed
}

// Make the Page component async
export default async function ConversationAnalysisPage({ params }: ConversationAnalysisPageProps) {
    // Await the params Promise before destructuring
    const { id: analysisId } = await params;

    if (!analysisId) {
        // Handle the case where ID might be missing
        return <div>Error: Analysis ID not found.</div>;
    }

    // Render the client component, passing the ID as a prop
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader title="Conversation Analysis" />
            <AnalysisPageClient analysisId={analysisId} />
        </div>
    );
} 