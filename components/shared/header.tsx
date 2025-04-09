"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"

// Navigation structure with dropdowns
const navigationItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Features",
    path: "/features",
  },
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "Blog",
    path: "/blog",
  },
  {
    name: "About",
    path: "/about",
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const headerRef = useRef<HTMLElement>(null)
  const navbarWidth = useRef<number>(0)

  // Handle scroll effect with a threshold
  useEffect(() => {
    const handleScroll = () => {
      // Simple threshold-based transition
      setScrolled(window.scrollY > 80)
    }

    // Store the navbar width for mobile menu
    if (headerRef.current) {
      const updateNavbarWidth = () => {
        if (headerRef.current) {
          const navElement = headerRef.current.querySelector("[data-navbar]")
          if (navElement) {
            navbarWidth.current = navElement.getBoundingClientRect().width
          }
        }
      }

      updateNavbarWidth()
      window.addEventListener("resize", updateNavbarWidth)
      window.addEventListener("scroll", handleScroll)

      return () => {
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", updateNavbarWidth)
      }
    }
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="w-full h-20 z-50">
      <header
        ref={headerRef}
        className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "pt-3" : "pt-0")}
        style={{
          paddingLeft: scrolled ? "1rem" : "0",
          paddingRight: scrolled ? "1rem" : "0",
        }}
      >
        <div
          data-navbar
          className={cn(
            "mx-auto transition-all duration-300",
            scrolled ? "bg-background/70 backdrop-blur-md shadow-lg" : "bg-transparent",
          )}
          style={{
            width: scrolled ? "80%" : "100%",
            borderRadius: scrolled ? "9999px" : "0",
            maxWidth: scrolled ? "1400px" : "100%",
          }}
        >
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              scrolled ? "px-6 py-2.5" : "px-8 py-3",
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              className="relative z-10 transition-transform duration-300"
              style={{ transform: scrolled ? "scale(0.9)" : "scale(1)" }}
            >
              <Image
                src="/logomain.svg"
                alt="Scalaro"
                width={120}
                height={30}
                className="dark:invert"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              className={cn(
                "hidden lg:flex items-center transition-all duration-300",
                scrolled ? "ml-4 gap-0.5" : "ml-12 gap-2",
              )}
            >
              {navigationItems.map((item) =>
                  <Link
                    key={item.name}
                    href={item.path}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.path
                        ? "text-primary"
                        : "text-foreground/80 hover:text-foreground hover:bg-accent/50",
                    )}
                  >
                    {item.name}
                  </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div
              className={cn("hidden lg:flex items-center transition-all duration-300", scrolled ? "gap-1" : "gap-2")}
            >
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-accent/50 transition-colors"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {session ? (
                <Link href="/dashboard">
                  <Button size="sm" className="ml-1">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/authentication?type=sign-in">
                  <Button size="sm" className="ml-1">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-accent/50 transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Bottom Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden flex items-end justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="absolute inset-0 backdrop-blur-md" aria-hidden="true" />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300,
                  mass: 0.8,
                }}
                className="relative w-full bg-background/80 backdrop-blur-xl shadow-xl rounded-t-3xl max-h-[80vh] flex flex-col overflow-hidden"
                style={{
                  maxWidth: "100%",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Handle/Pill for drag indication */}
                <div className="w-full flex justify-center">
                  <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
                </div>

                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-base">W</span>
                    </div>
                    <span className="font-semibold text-lg">Scalaro</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-accent/50 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-2 px-6">
                  <nav className="flex flex-col space-y-1">
                    {navigationItems.map((item) => (
                      <div key={item.name} className="py-1">
                          <Link
                            href={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                              "flex items-center rounded-md px-3 py-3 font-medium hover:bg-accent/50",
                              pathname === item.path && "text-primary",
                            )}
                          >
                            {item.name}
                          </Link>
                      </div>
                    ))}
                  </nav>
                </div>

                <div className="px-6 py-6 mt-2">
                  <div className="flex items-center justify-between mb-5">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent/50"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-5 w-5" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {session ? (
                      <Link href="/dashboard" className="w-full">
                        <Button variant="outline" className="w-full justify-center py-6 text-base">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/authentication?type=sign-in" className="w-full">
                        <Button variant="outline" className="w-full justify-center py-6 text-base">
                          <User className="mr-2 h-4 w-4" />
                          Sign In
                        </Button>
                      </Link>
                    )}
                    <Button className="w-full justify-center py-6 text-base">Get Started</Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}

