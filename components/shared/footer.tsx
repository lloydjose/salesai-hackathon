"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// Simplified footer navigation
const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Product', href: '/product' },
  { name: 'Pricing', href: '/pricing' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <footer className="w-full bg-muted/30 border-t border-border/50 mt-12 md:mt-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-3">
            Ready to transform your sales?
          </h2>
          <p className="text-lg leading-8 text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get started with Scalaro today and experience the power of AI-driven sales intelligence.
          </p>
          {!session ? (
             <div className="relative z-10 flex flex-col sm:flex-row gap-3 max-w-md sm:max-w-lg mx-auto justify-center">
                <Input
                  type="email"
                  placeholder="Enter your company email"
                  className="h-11 w-full sm:min-w-[280px] bg-background/80 dark:bg-black/50 border-border/70"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  size="lg"
                  className="h-11 px-5 w-full sm:w-auto"
                  onClick={() => {
                    router.push(`/authentication?type=sign-up&email=${encodeURIComponent(email)}`)
                  }}
                >
                  Get Started Free
                </Button>
              </div>
          ) : (
            <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
            </Link>
          )}
        </div>

        <Separator className="bg-border/50" />

        {/* Updated Horizontal Footer Links Section */}
        <div className="flex flex-row justify-center items-center gap-6 md:gap-12 py-8">
          {footerLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs md:text-sm uppercase font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Separator className="bg-border/50" />

        <div className="relative text-center pt-8 pb-4">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-auto -mb-16 md:-mb-24 pointer-events-none">
             <Link href="/" className="inline-block">
                <Image
                    src="/mainlogo.svg"
                    alt="Scalaro Logo Large"
                    width={800}
                    height={206}
                    className="dark:invert opacity-10"
                    priority
                />
             </Link>
          </div>
          <p className="relative z-10 text-xs text-muted-foreground">
            &copy; {currentYear} Scalaro, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 