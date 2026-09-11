import { Hero } from '@/components/marketing/hero'
import { ComplianceBand } from '@/components/marketing/compliance-band'
import { FeatureSection } from '@/components/marketing/feature-section'
import { SocialProof } from '@/components/marketing/social-proof'
import { PricingTable } from '@/components/marketing/pricing-table'
import { DemoHubSection } from '@/components/marketing/demo-hub-section'
import { CtaBand } from '@/components/marketing/cta-band'

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero: Maroon full-bleed */}
      <Hero />

      {/* 2. Saudi Compliance Capability Chips */}
      <ComplianceBand />

      {/* 3. Product Modules: Alternating Light & Blush Sections */}
      <FeatureSection />

      {/* 4. Social Proof / Case Study (Fictional: Wadi Al-Noor) */}
      <SocialProof />

      {/* 5. Gusto-Style 3-Tier Pricing (SAR / employee / month) */}
      <PricingTable />

      {/* 6. Try the Interactive Demo (Phase 0 Role Picker) */}
      <DemoHubSection />

      {/* 7. Full-bleed Maroon CTA Band */}
      <CtaBand />
    </div>
  )
}
