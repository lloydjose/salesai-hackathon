import Image from "next/image"
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { Badge } from "@/components/ui/badge";

const logos = [
  { name: "Coca-Cola", filename: "cocacola.svg" },
  { name: "Ferrari", filename: "ferrari.svg" },
  { name: "Gucci", filename: "gucci.svg" },
  { name: "Honda", filename: "honda.svg" },
  { name: "Jaguar", filename: "jaguar.svg" },
  { name: "LinkedIn", filename: "linkedin.svg" },
  { name: "Microsoft", filename: "microsoft.svg" },
  { name: "Oracle", filename: "oracle.svg" },
  { name: "Slack", filename: "slack.svg" },
  { name: "Yamaha", filename: "yamaha.svg" },
];

export default function TrustedBySection() {
  return (
    <section className="w-full py-16 px-4 max-w-6xl mx-auto">
      <div className="max-w-2xl text-left lg:text-left">
          <div>
            <Badge>Trusted by sales teams, enterprise and startups.</Badge>
          </div>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          For improving sales <span className="font-serif font-normal italic">performance</span>
        </p>
        <p className="text-lg leading-8 text-muted-foreground">
          We help large companies and startups sales teams to be proactive and efficient.
        </p>
      </div>

      <InfiniteSlider gap={24} className="w-full h-full">
        {logos.map((logo, index) => (
          <div
            key={`${logo.filename}-${index}`}
            className="flex-shrink-0 w-24 h-16 mx-4 md:mx-6 relative grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={`/images/clients/${logo.filename}`}
              alt={logo.name}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </InfiniteSlider>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-[#fff8f3] rounded-xl p-4 text-center">
          <div className="text-[#874621] text-6xl font-bold mb-4">87%</div>
          <div className="text-[#874621] text-sm font-medium tracking-wider uppercase">Increase in Confidence for Cold Calling</div>
        </div>

        <div className="bg-[#fff4fc] rounded-xl p-4 text-center">
          <div className="text-[#732065] text-6xl font-bold mb-4">8-10x</div>
          <div className="text-[#732065] text-sm font-medium tracking-wider uppercase">
            Faster Deal Qualification than Manual Research
          </div>
        </div>

        <div className="bg-[#fff4f6] rounded-xl p-4 text-center">
          <div className="text-[#933349] text-6xl font-bold mb-4">45%</div>
          <div className="text-[#933349] text-sm font-medium tracking-wider uppercase">
            Improvement in Sales Conversion Rates With Better Prep
          </div>
        </div>
      </div>
    </section>
  )
}
