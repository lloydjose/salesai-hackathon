import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { PreCallPlannerAnimation } from "@/components/ui/pre-call-planner-animation";

function Feature() {
  return (
    <section className="w-full py-4 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start max-w-2xl text-left">
          <div>
            <Badge>Platform Features</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="font-serif font-normal italic">Close Smarter</span> with Scalaro
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Everything you need to close deals faster and make sales predictable.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-muted/50 rounded-md h-full lg:col-span-2 p-6 flex flex-col justify-between">
            <AIVoiceInput demoMode={true} />
            <div className="flex flex-col self-start mt-4">
              <h3 className="text-xl tracking-tight font-semibold">Cold Calling Simulator</h3>
              <p className="text-muted-foreground max-w-xs text-base mt-1">
                Practice cold calling with realistic scenarios and get feedback on your performance.
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-md aspect-square p-6 flex flex-col">
            <div className="relative w-full h-32 mb-4 overflow-hidden rounded-md">
              <Image 
                src="/images/prospecting-feature.webp"
                alt="Prospect Analysis Feature"
                layout="fill" 
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col mt-auto">
              <h3 className="text-xl tracking-tight font-semibold">Prospect Analysis</h3>
              <p className="text-muted-foreground max-w-xs text-base mt-1">
                Analyze your prospects to understand their needs and tailor your calls and emails accordingly.
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-md aspect-square p-6 flex flex-col">
            <div className="relative w-full h-32 mb-4 overflow-hidden rounded-md">
              <Image 
                src="/images/conversation-intelligence.webp"
                alt="Conversation Intelligence Feature"
                layout="fill" 
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col mt-auto">
              <h3 className="text-xl tracking-tight font-semibold">Conversation Intelligence</h3>
              <p className="text-muted-foreground max-w-xs text-base mt-1">
                Upload your cold calls to understand extensive insights to perform better every time.
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-md h-full lg:col-span-2 p-6 flex flex-col justify-between">
            <PreCallPlannerAnimation demoMode={true} prospectImageUrl="/images/avatar-fallback.jpg" />
            <div className="flex flex-col self-start mt-4">
              <h3 className="text-xl tracking-tight font-semibold">Pre Call Planner</h3>
              <p className="text-muted-foreground max-w-xs text-base mt-1">
                Create a pre call plan to prepare for your sales call and get ready with a personalized plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Feature };
