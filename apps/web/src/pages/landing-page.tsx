import { useEffect, useState } from "react"
import AOS from "aos"
import { Button } from "@workspace/ui/components/button"
import {
  LandingLayout,
  openAuthModal,
} from "@/components/layout/landing-layout"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import {
  ShoppingCart,
  TrendingUp,
  Warehouse,
  Settings,
  ChevronRight,
  Star,
  Check,
  ArrowRight,
} from "lucide-react"

function DashboardMockup({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isDark = variant === "dark"
  return (
    <div
      className={`mx-auto overflow-hidden rounded-2xl ${
        isDark ? "bg-[#0d2818]" : "bg-white"
      } shadow-2xl ring-1 ${isDark ? "ring-[#145736]" : "ring-[#dcfce7]"} w-full max-w-4xl`}
      style={{ aspectRatio: "16/10" }}
    >
      <div className="relative h-full w-full">
        <img
          src="https://cdn.dribbble.com/userupload/17730954/file/original-1ca571d72aed46b341defcb0bf9a18e1.png?resize=2048x1536&vertical=center"
          alt="Dashboard Preview"
          className="h-full w-full object-contain"
        />
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-[#0d2818]/40" : "bg-white/10"
          } pointer-events-none`}
        />
      </div>
    </div>
  )
}

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function IntegrationLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-card p-1.5 shadow-sm sm:h-14 sm:w-14 sm:p-2 md:h-16 md:w-16">
      <img
        src={logo}
        alt={name}
        className="max-h-full max-w-full rounded-full object-contain"
      />
    </div>
  )
}

function FeatureCard({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image: string
}) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-card shadow-lg transition-shadow hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-base font-semibold text-card-foreground sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function LandingPage({ onLogin }: { onLogin?: () => void }) {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out",
      once: true,
      offset: 50,
    })
  }, [])

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [demoEmail, setDemoEmail] = useState("")

  return (
    <LandingLayout onLoginSuccess={onLogin}>
      <section
        id="hero"
        className="relative overflow-hidden bg-[var(--lavender)] px-4 sm:px-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lavender)] via-[var(--lavender)] to-[var(--lavender-dark)]" />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-[var(--lavender-dark)]/30 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-[var(--lavender-dark)]/20 blur-2xl sm:h-64 sm:w-64" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:py-20 md:py-32">
          <div className="text-center">
            <h1
              data-aos="fade-up"
              data-aos-delay="0"
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
            >
              AI Inventory to simplify
              <br className="hidden sm:block" />
              and scale your business
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="mx-auto mt-4 max-w-xl px-2 text-base text-muted-foreground sm:mt-6 sm:max-w-2xl sm:text-lg md:text-xl"
            >
              Automate your business numbers. Get
              real-time visibility of your stock, orders, and production in one
              intuitive platform.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
            >
              <Button
                variant="outline"
                size="lg"
                className="h-11 w-full px-6 text-sm font-medium sm:h-12 sm:w-auto sm:px-8 sm:text-base border-green-400 shadow-md"
                onClick={() => setIsDemoModalOpen(true)}
              >
                Book demo
              </Button>
              <Button
                size="lg"
                className="h-11 w-full gap-2 px-6 text-sm font-medium sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                onClick={openAuthModal}
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-10 px-2 sm:mt-16"
            >
              <DashboardMockup variant="dark" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="stats"
        className="border-t border-border bg-background px-4 py-12 sm:px-6 sm:py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div
              data-aos="fade-up"
              data-aos-delay="0"
              className="rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8"
            >
              <div className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
                60%
              </div>
              <div className="mt-2 px-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
                Higher return on average per order, per year
              </div>
            </div>
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8"
            >
              <div className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
                1.2x
              </div>
              <div className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
                Faster time-to-market
              </div>
            </div>
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8"
            >
              <div className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
                6 weeks
              </div>
              <div className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
                To fully implement vs 6–12 months for the usual ERPs
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-background px-4 py-12 sm:px-6 sm:py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-12">
            <h2
              data-aos="fade-up"
              className="text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl"
            >
              Tailored For Small Businesses To Manage Orders Faster
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:max-w-2xl sm:text-lg"
            >
              Managing orders across all channels has never been easier. From
              order creation to fulfillment, keep everything in sync.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="order-2 lg:order-1">
              <div className="space-y-6 sm:space-y-8">
                <div data-aos="fade-up" data-aos-delay="0">
                  <FeatureItem
                    icon={TrendingUp}
                    title="Real-time inventory tracking"
                    description="Monitor stock levels across multiple locations. Get instant alerts when items run low and auto-reorder to prevent stockouts."
                  />
                </div>
                <div data-aos="fade-up" data-aos-delay="100">
                  <FeatureItem
                    icon={ShoppingCart}
                    title="Seamless order management"
                    description="Process orders from multiple channels in one place. Sync inventory automatically and fulfill orders faster."
                  />
                </div>
                <div data-aos="fade-up" data-aos-delay="200">
                  <FeatureItem
                    icon={Warehouse}
                    title="Multi-location support"
                    description="Manage inventory across warehouses, stores, and third-party logistics. Transfer stock between locations with a few clicks."
                  />
                </div>
                <div data-aos="fade-up" data-aos-delay="300">
                  <FeatureItem
                    icon={Settings}
                    title="Production planning"
                    description="Track manufacturing processes from raw materials to finished goods. Optimize production schedules and reduce waste."
                  />
                </div>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="order-1 lg:order-2"
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                <div className="border-b border-border bg-muted/50 p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 sm:h-3 sm:w-3" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400 sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      Dashboard Overview
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {[
                      {
                        label: "Total Products",
                        value: "1,234",
                        trend: "+12%",
                      },
                      { label: "Low Stock Items", value: "23", trend: "-5%" },
                      { label: "Pending Orders", value: "89", trend: "+8%" },
                      {
                        label: "Today's Sales",
                        value: "$12.5k",
                        trend: "+23%",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-border bg-background p-3 sm:p-4"
                      >
                        <div className="truncate text-xs text-muted-foreground sm:text-sm">
                          {item.label}
                        </div>
                        <div className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
                          {item.value}
                        </div>
                        <div className="text-xs text-primary">{item.trend}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="integrations"
        className="bg-secondary px-4 py-12 sm:px-6 sm:py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl text-center">
          <h2
            data-aos="fade-up"
            className="text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl"
          >
            Integrate your tools and streamline your workflows
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:max-w-2xl sm:text-lg"
          >
            Connect Easivent with the tools you already use. Sync data
            automatically and eliminate manual entry.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-10 sm:gap-6 md:gap-8">
            {[
              {
                name: "Shopify",
                logo: "https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1776091655/Shopify-com_Logo_1_hpas4v.png",
              },
              {
                name: "Stripe",
                logo: "https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1776091544/Stripe_Logo_1_idjdhl.png",
              },
              {
                name: "Slack",
                logo: "https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1776091427/Icon_jfrzf2.jpg",
              },
              {
                name: "QuickBooks",
                logo: "https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1776091331/idFyhAFeIL_1776090324830_ms85zg.png",
              },
              {
                name: "API",
                logo: "https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1776091330/Icon_sp0giz.png",
              },
              {
                name: "Zapier",
                logo: "https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1776091331/idgA2tQJF0_1776091167588_ulkhda.jpg",
              },
              {
                name: "Xero",
                logo: "https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1776091330/xero-accounting_udxwkq.png",
              },
            ].map(({ name, logo }, i) => (
              <div key={name} data-aos="fade-up" data-aos-delay={200 + i * 50}>
                <IntegrationLogo name={name} logo={logo} />
              </div>
            ))}
          </div>

          <a
            href="#"
            data-aos="fade-up"
            data-aos-delay="600"
            className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline sm:mt-8 sm:text-base"
          >
            See all integrations
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section
        id="visibility"
        className="bg-background px-4 py-12 sm:px-6 sm:py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-12">
            <h2
              data-aos="fade-up"
              className="text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl"
            >
              Get the inventory visibility you need
              <br className="hidden sm:block" />
              <span className="hidden sm:inline"> </span>
              whether you are selling, manufacturing, or both
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div data-aos="fade-up" data-aos-delay="0">
              <FeatureCard
                image="https://res.cloudinary.com/dgbreoalg/image/upload/v1753713150/113607ef0b9e55ccebb249cd5cdfabb3_jiulfd.jpg"
                title="Trace every batch and every lot"
                description="Complete traceability from raw materials to finished goods. Meet compliance requirements with detailed audit trails."
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <FeatureCard
                image="https://res.cloudinary.com/dgbreoalg/image/upload/v1782160639/x9jB1_uswntj.jpg"
                title="Track production as it happens"
                description="Real-time production monitoring with instant feedback. Identify bottlenecks and optimize workflows on the fly."
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <FeatureCard
                image="https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1776097640/omnichannel-sales_koqhhb.webp"
                title="Sync sales across every channel"
                description="Unified inventory across all your sales channels. Prevent overselling with real-time stock updates everywhere."
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="support"
        className="bg-secondary px-4 py-12 sm:px-6 sm:py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            <div
              data-aos="fade-up"
              className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-card-foreground sm:text-xl md:text-2xl">
                Personalized implementation
              </h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Get up and running quickly with our guided onboarding process
              </p>

              <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-6">
                {[
                  "Kickoff call with your dedicated onboarding specialist",
                  "Data migration from your existing systems",
                  "Custom workflow configuration for your business",
                  "Team training sessions (live or recorded)",
                  "Go-live support for the first 30 days",
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground sm:h-6 sm:w-6 sm:text-sm">
                      {i + 1}
                    </span>
                    <span className="text-sm text-card-foreground sm:text-base">
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className="mt-5 inline-flex items-center gap-1 text-sm text-primary hover:underline sm:mt-6 sm:text-base"
              >
                Learn more
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div
              data-aos="fade-up"
              className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-card-foreground sm:text-xl md:text-2xl">
                Continued success
              </h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Ongoing support to help you grow and optimize
              </p>

              <div className="mt-8 space-y-6 sm:mt-8 sm:space-y-6">
                {[
                  "24/7 customer support via chat and email",
                  "Regular product updates with new features",
                  "Access to exclusive webinars and training content",
                  "Dedicated customer success manager",
                  "Priority feature requests and feedback loop",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 rounded-full bg-yellow-500 p-1" />
                    <span className="text-sm text-card-foreground sm:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className="mt-5 inline-flex items-center gap-1 text-sm text-primary hover:underline sm:mt-6 sm:text-base"
              >
                Learn more
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="testimonial"
        className="bg-background px-4 py-12 sm:px-6 sm:py-16 md:py-24"
      >
        <div className="mx-auto max-w-4xl">
          <div
            data-aos="fade-up"
            className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8 md:p-12"
          >
            <div className="mb-4 text-center sm:mb-6">
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Testimonials
              </span>
            </div>

            <blockquote className="px-2 text-center text-base font-medium text-card-foreground italic sm:text-xl md:text-2xl">
              "Easivent completely transformed how we manage our inventory. We
              went from spending hours on spreadsheets every week to having
              real-time visibility of our entire operation. The implementation
              was incredibly smooth, and the support team has been fantastic."
            </blockquote>

            <div className="mt-6 flex flex-col items-center sm:mt-8">
              <img
                src="https://mockmind-api.uifaces.co/content/human/209.jpg"
                alt="Evans Agunna"
                className="h-14 w-14 rounded-full object-cover sm:h-16 sm:w-16"
              />
              <div className="mt-3 text-center sm:mt-4">
                <div className="font-semibold text-card-foreground">
                  Evans Agunna
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">
                  Sales Director, Blessed Pharmacy
                </div>
              </div>
              <div className="mt-2 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b] sm:h-4 sm:w-4"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Demo</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll reach out to schedule a demo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="you@company.com"
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <Button
              onClick={() => {
                setIsDemoModalOpen(false)
                setDemoEmail("")
              }}
              disabled={!demoEmail.includes("@")}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LandingLayout>
  )
}
