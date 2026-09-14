import { Hero } from '@/components/marketing/hero'
import { AppleMetrics } from '@/components/marketing/apple-metrics'
import { AppleBentoGrid } from '@/components/marketing/apple-bento-grid'
import { InteractiveProductShowcase } from '@/components/marketing/interactive-product-showcase'
import { SocialProof } from '@/components/marketing/social-proof'
import { PricingTable } from '@/components/marketing/pricing-table'
import { CtaBand } from '@/components/marketing/cta-band'

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden">
      {/* 1. Apple Hero with Interactive Live Stage */}
      <Hero />

      {/* 2. Apple Typographic Metrics */}
      <AppleMetrics />

      {/* 3. Engineered for the Kingdom: Apple Bento Grid */}
      <AppleBentoGrid />

      {/* 4. Three Worlds, One Platform: Interactive Role Showcase */}
      <InteractiveProductShowcase />

      {/* 5. Social Proof / Enterprise Case Study */}
      <SocialProof />

      {/* 6. Refined Pricing with Interactive Team Slider */}
      <PricingTable />

      {/* 7. Cinematic Apple Closing CTA */}
      <CtaBand />
    </div>
  )
}
