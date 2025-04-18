"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"

// Testimonial data
const testimonials = [
  {
    quote:
      "Our sales team is now able to see the entire customer journey in one place. This has helped us to identify opportunities and close deals faster.",
    author: "Marcus Maximus",
    location: "California",
    position: "Director of Sales",
    company: "Procore",
  },
  {
    quote:
      "From sales training to customer success, Scalaro has everything we need to track our customers and close deals faster.",
    author: "Jane Johnson",
    location: "New York",
    position: "Sales Manager",
    company: "Opus Telecom",
  },
  {
    quote: "A great tool to understand your sales pipeline and make sure you're always on top of your game!",
    author: "John Smith",
    location: "Texas",
    position: "Sales Director",
    company: "Active",
  },
]

// Carousel images and captions
// eslint-disable-next-line
const carouselItems = [
  {
    id: 1,
    title: "Prospect Intelligence Hub",
    description: "Before outreach — know exactly who they are, if they're worth it, and how to approach them.",
  },
  {
    id: 2,
    title: "AI-Powered Outreach Engine",
    description: "For crafting smart, hyper-personalized outreach at scale — and reactivating lost leads.",
  },
  {
    id: 3,
    title: "Call Training & Simulation Suite",
    description: "Make every rep perform like a top closer — without burning real leads.",
  },
  {
    id: 4,
    title: "Call Intelligence & Deal Coaching",
    description: "After the call — find what you missed, what you nailed, and how to close.",
  },
  {
    id: 5,
    title: "Sales Knowledge Loop",
    description: "Learn from every deal, and build organizational intelligence that compounds.",
  },
]

export default function Hero() {
  // eslint-disable-next-line
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const { data: session } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-white dark:bg-black overflow-hidden relative">
      {/* Gradient SVG background */}
      <svg
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-full min-w-[80rem] h-auto"
        width="1171"
        height="741"
        viewBox="0 0 1171 741"
        fill="none"
      >
        <g opacity=".175" filter="url(#filter0_f)">
          <path
            d="M731.735 -179.55C596.571 -157.762 516.36 -74.1815 552.576 7.13199C588.793 88.4455 727.724 136.701 862.887 114.913C998.051 93.1247 1078.26 9.54454 1042.05 -71.769C1005.83 -153.082 866.898 -201.337 731.735 -179.55Z"
            fill="url(#paint0_linear)"
          />
          <path
            d="M378 114.106C520.489 114.106 636 45.8883 636 -38.2623C636 -122.413 520.489 -190.63 378 -190.63C235.511 -190.63 120 -122.413 120 -38.2623C120 45.8883 235.511 114.106 378 114.106Z"
            fill="url(#paint1_linear)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f"
            x="0"
            y="-310.63"
            width="1170.74"
            height="550.775"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
          </filter>
          <linearGradient
            id="paint0_linear"
            x1="567.5"
            y1="1.03997"
            x2="1029.02"
            y2="64.6468"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3B9A" />
            <stop offset="1" stopColor="#7000FF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear"
            x1="155"
            y1="-11.0234"
            x2="511.855"
            y2="-162.127"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3B9A" />
            <stop offset="0.504191" stopColor="#FF008A" />
            <stop offset="1" stopColor="#7000FF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Adjusted padding for mobile */}
      <div className="w-full pt-28 pb-12 md:pt-40 md:pb-24 relative">
        {/* New badge */}
        <div className="flex justify-center mb-6 md:mb-8 px-4">
          <div className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-sm text-center">
            <span className="mr-2 text-xs font-semibold">NEW</span>
            <span>AI Cold Call Simulation Training</span>
            <ArrowRight className="ml-2 h-3 w-3" />
          </div>
        </div>

        {/* Main content - Added padding for mobile */}
        <div className="text-center max-w-4xl mx-auto mb-4 md:mb-4 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight text-black dark:text-white mb-4 md:mb-6">
            Close More <span className="font-serif font-normal italic">Sales</span> with
            <br />
            AI on your side
          </h1>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From prospecting, training how to close, and
            <br />
            learning from every call & email. Intelligent AI tools to help you grow sales.
          </p>
        </div>

        {/* Render email signup only if user is not logged in */}
        {!session && (
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 max-w-md sm:max-w-xl mx-auto px-4 justify-center">
            <Input
              type="email"
              placeholder="Enter your company email"
              className="h-12 w-full sm:min-w-[300px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              size="lg"
              className="h-12 px-6 w-full sm:w-auto bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              onClick={() => {
                router.push(`/authentication?type=sign-up&email=${encodeURIComponent(email)}`)
              }}
            >
              Close More Sales From Today
            </Button>
          </div>
        )}

        {/* Ratings - Adjusted spacing for mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 py-4 text-sm text-gray-600 dark:text-gray-400 text-center px-4">
          <div className="flex items-center mb-1 sm:mb-0">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
            ))}
          </div>
          <span>
            Top Sellers In Your Industry Use <span className="font-semibold text-black dark:text-white">Scalaro</span>
          </span>
        </div>

		{/* Nextjs badge */}
        <div className="flex justify-center"> {/* Centered, minimal bottom margin */}
           <span className="text-[12px] font-medium bg-muted/50 text-muted-foreground/80 border border-border/50 rounded px-1.5 pb-4"> 
                Built For Next.js Global Hackathon
           </span>
        </div>

        {/* Dashboard image - Full width, no styling */}
        <div className="relative mx-auto w-full -mt-24 md:-mt-60 bg-transparent">
          <div className="overflow-hidden">
            <Image
              src="/images/featurehero.webp"
              width={1200}
              height={600}
              alt="Sales dashboard interface"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
