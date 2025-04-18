import { EmailEditView } from "@/components/cold-emails/email-edit-view";
import { PageHeader } from "@/components/shared/page-header";

interface EditColdEmailPageProps {
    params: {
        id: string;
    };
}

// Keep component async
export default async function EditColdEmailPage({ params }: EditColdEmailPageProps) {
    // Explicitly extract id
    const { id } = params;

    if (!id) {
        return <div>Error: Email ID is missing.</div>;
    }

    return (
        <>
            <PageHeader title="Edit Cold Email">
                {/* Optional: Add action buttons or other elements here */}
            </PageHeader>
            <div className="p-4">
                <EmailEditView emailId={id} />
            </div>
        </>
    );
} 