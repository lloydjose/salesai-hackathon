import { PageHeader } from "@/components/shared/page-header";
import { EmailGeneratorView } from "@/components/cold-emails/email-generator-view";
import { Toaster } from 'react-hot-toast'; // Add toaster for notifications

export default function ColdEmailsPage() {
  return (
    <>
      {/* Add Toaster here or in the layout if not already present */}
      <Toaster position="bottom-right" /> 
      <PageHeader 
        title="Cold Email Generator"
      />
      <p className="p-4 md:px-6 md:pb-0 text-muted-foreground text-sm">
          Generate personalized cold emails using AI based on prospect details or manual input.
      </p>
      <div className="p-4 md:p-6 pt-4 md:pt-4">
         <EmailGeneratorView />
      </div>
    </>
  );
} 