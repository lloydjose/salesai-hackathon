'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, BrainCircuit, Target, PhoneCall, Mail, Users, BarChart } from "lucide-react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { motion } from "framer-motion";

// Extracted Features/Modules from Hero
const features = [
  {
    id: 1,
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Prospect Intelligence Hub",
    description: "Know exactly who to target, why they're a good fit, and the best angle for outreach before you even start.",
  },
  {
    id: 2,
    icon: <Mail className="h-8 w-8 text-primary" />,
    title: "AI-Powered Outreach Engine",
    description: "Craft hyper-personalized emails and follow-ups at scale, reactivating cold leads and warming up new ones.",
  },
  {
    id: 3,
    icon: <PhoneCall className="h-8 w-8 text-primary" />,
    title: "Call Training & Simulation Suite",
    description: "Practice handling objections, pitching value, and closing deals in realistic scenarios without risking live leads.",
  },
  {
    id: 4,
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "Call Intelligence & Deal Coaching",
    description: "Analyze past calls to identify winning patterns, pinpoint areas for improvement, and get AI-driven coaching tips.",
  },
  {
    id: 5,
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Sales Knowledge Loop",
    description: "Continuously learn from every interaction, building a compounding organizational intelligence system.",
  },
  {
    id: 6,
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Team Collaboration Features",
    description: "Share playbooks, successful call snippets, and effective email templates across your entire sales team.",
  },
];

// Trust elements from Trusted Section
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

// Key stats from Trusted Section
const stats = [
  {
    value: "87%",
    label: "Increase in Cold Calling Confidence",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
  },
  {
    value: "8-10x",
    label: "Faster Deal Qualification",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
  },
  {
    value: "45%",
    label: "Improvement in Conversion Rates",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
];

export function ProductSection() {
  return (
    <div className="w-full bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900/50 dark:to-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-28 text-center container mx-auto px-4">
        <Badge variant="outline" className="mb-4 py-1 px-3">The Scalaro Platform</Badge>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
        >
          The AI Copilot for <span className="text-primary">High-Performing</span> Sales Teams
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
        >
          Scalaro integrates prospecting intelligence, AI-powered outreach, realistic call training, and deep conversation analysis into a single platform designed to help you close more deals, faster.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button size="lg" asChild className="bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            <Link href="/authentication">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
         {/* Floating Image - uncomment and replace src if you have an image */}
         {/* 
         <motion.div 
           initial={{ opacity: 0, scale: 0.8, y: 50 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 50 }}
           className="relative mt-16 md:mt-24 max-w-5xl mx-auto"
         >
           <Image 
             src="/images/product-dashboard.png" 
             alt="Scalaro Product Dashboard"
             width={1200}
             height={700}
             className="rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
           />
         </motion.div>
         */}
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Everything Your Sales Team Needs</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">From finding the right leads to closing the deal and learning from every interaction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="h-full flex flex-col p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800/50 rounded-xl">
                  <CardHeader className="p-0 mb-4 flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow">
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

       {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-black">
         <div className="container mx-auto px-4">
           <div className="text-center mb-12 md:mb-16">
             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Measurable Performance Improvements</h2>
             <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">See the tangible impact Scalaro has on sales effectiveness and confidence.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
             {stats.map((stat, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.5, delay: index * 0.15 }}
                 viewport={{ once: true, amount: 0.5 }}
                 className={`${stat.bgColor} rounded-xl p-6 text-center shadow-md`} 
               >
                 <div className={`${stat.textColor} text-6xl font-bold mb-3`}>{stat.value}</div>
                 <div className={`${stat.textColor} text-sm font-medium tracking-wider uppercase`}>{stat.label}</div>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

      {/* Trusted By Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-8">Trusted by Forward-Thinking Sales Teams</h2>
          <InfiniteSlider gap={40} className="w-full h-full">
            {logos.map((logo, index) => (
              <div
                key={`${logo.filename}-${index}`}
                className="flex-shrink-0 w-32 h-12 mx-4 md:mx-6 relative grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
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
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-t from-white via-gray-50 to-white dark:from-black dark:via-gray-900/50 dark:to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             viewport={{ once: true }}
             className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            Ready to Elevate Your Sales Game?
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             viewport={{ once: true }}
             className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8"
           >
             Join top-performing teams using Scalaro to close more deals and build lasting customer relationships.
           </motion.p>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             viewport={{ once: true }}
           >
             <Button size="lg" asChild className="bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <Link href="/authentication">
                   Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
           </motion.div>
        </div>
       </section>
    </div>
  );
} 