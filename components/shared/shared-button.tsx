"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface SharedButtonProps {
  className?: string;
  text?: string;
  withShadow?: boolean;
}

export const SharedButton = ({
  className = "flex items-center justify-center w-full md:w-36 h-10 rounded-xl border border-purple-700 text-base font-semibold text-purple-600",
  text,
  withShadow = false,
}: SharedButtonProps) => {
  const { data: session } = useSession();

  const buttonText = session ? "Dashboard" : text || "Sign In";
  const buttonLink = session ? "/dashboard" : "/authentication?type=sign-in";

  return (
    <Link
      href={buttonLink}
      style={withShadow ? { boxShadow: "0px 4px 14.8px rgba(0, 0, 0, 0.2)" } : {}}
      className={className}
    >
      {buttonText}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}; 