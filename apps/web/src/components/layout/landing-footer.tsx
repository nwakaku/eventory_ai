import { Package } from "lucide-react"

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="text-sm text-gray-400 transition-colors hover:text-white"
    >
      {children}
    </a>
  )
}

export function LandingFooter() {
  return (
    <footer className="bg-[var(--footer-bg)] px-4 pt-12 pb-6 sm:px-6 sm:pt-16 sm:pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-12">
          <div className="lg:w-64">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary sm:h-10 sm:w-10">
                <Package className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <span className="text-xl font-semibold text-white sm:text-2xl">
                Enventory
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-gray-400 sm:mt-4">
              Cloud inventory management for modern businesses. Track, manage,
              and optimize your stock from anywhere.
            </p>
            <div className="mt-5 flex gap-3 sm:mt-6 sm:gap-4">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-primary hover:text-white sm:h-10 sm:w-10"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-primary hover:text-white sm:h-10 sm:w-10"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-primary hover:text-white sm:h-10 sm:w-10"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div>
              <h4 className="text-sm font-semibold text-white sm:text-base">
                Product
              </h4>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                <li>
                  <FooterLink href="#">Features</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Pricing</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Integrations</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Changelog</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Roadmap</FooterLink>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white sm:text-base">
                Solutions
              </h4>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                <li>
                  <FooterLink href="#">Manufacturing</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">E-commerce</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Wholesale</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Retail</FooterLink>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white sm:text-base">
                Resources
              </h4>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                <li>
                  <FooterLink href="#">Documentation</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">API Reference</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Blog</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Webinars</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Community</FooterLink>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white sm:text-base">
                Company
              </h4>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                <li>
                  <FooterLink href="#">About</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Careers</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Press</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Contact</FooterLink>
                </li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="text-sm font-semibold text-white sm:text-base">
                Integrations
              </h4>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                <li>
                  <FooterLink href="#">Shopify</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Xero</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">QuickBooks</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Stripe</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Slack</FooterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:mt-12 sm:flex-row sm:pt-8">
          <div className="text-center text-sm text-gray-400 sm:text-left">
            © 2026 Enventory. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">
                G2 Leader
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
