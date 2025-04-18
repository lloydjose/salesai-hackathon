import { PageHeader } from "@/components/shared/page-header";
import { ConversationUploadView } from "@/components/conversation-intelligence/upload-view";

export default function ConversationIntelligencePage() {
  return (
    <>
      <PageHeader title="Conversation Intelligence" />
      <div className="p-4 md:p-6">
         <ConversationUploadView />
      </div>
    </>
  );
} 