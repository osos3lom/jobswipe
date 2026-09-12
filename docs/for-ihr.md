# A Note for the iHR Team (ihr.sa)

> **Live Demo:** [https://osos3lom.github.io/jobswipe/](https://osos3lom.github.io/jobswipe/)  
> **Source Code:** [https://github.com/osos3lom/jobswipe](https://github.com/osos3lom/jobswipe)

---

## 1. Why this exists

We built this concept demo specifically for **iHR** ([ihr.sa](https://ihr.sa)). 

The Saudi HR software market is currently fragmented between complex enterprise legacy ERPs (SAP, Oracle) and generic global software (Gusto, Deel) that lacks deep, native adaptation to Saudi Labor Law and ministry integrations (Qiwa, GOSI, Muqeem, Mudad/WPS, Nitaqat).

This project demonstrates how a modern, fast, localized HR & Recruitment suite can deliver a world-class user experience tailored specifically for the Kingdom.

---

## 2. Product Mapping to iHR's Suite

The demo bridges employer management, candidate discovery, and employee self-service in a unified ecosystem:

| iHR Product Line | Implementation in Demo | Key Capabilities |
| :--- | :--- | :--- |
| **iHR Platform** | `/console`<br>`/console/people`<br>`/console/payroll`<br>`/console/compliance`<br>`/console/time-off`<br>`/console/onboarding`<br>`/console/benefits` | • Company command center & real-time KPIs<br>• 3-step payroll wizard with GOSI deductions & bilingual payslips<br>• Nitaqat Saudization band meter & What-If simulator<br>• WPS SIF banking export (.csv)<br>• Qiwa contract & Iqama expiry tracking<br>• Article 109 tenure leave accrual (21 vs 30 days)<br>• Article 84/85 End-of-Service Benefit (EOSB) calculator<br>• CCHI health insurance tiers |
| **iHR Recruiter** | `/console/hiring`<br>`/console/hiring/[jobId]`<br>`/console/hiring/[jobId]/review` | • Visual candidate pipeline with drag-and-drop & keyboard accessible controls<br>• Recruiter swipe card deck to evaluate candidates<br>• One-click hire action that creates new onboarding employee records |
| **iHR Jobs** | `/jobs`<br>`/discover`<br>`/matches`<br>`/chat`<br>`/interviews` | • Candidate mobile app with swipe-to-apply card deck<br>• Transparent AI match scoring breakdown<br>• AI Career Coach interactive advisor<br>• Interview scheduler & in-app chat |
| **iHR Vision** | `/console/reports` | • Executive workforce analytics & headcount growth timeline<br>• Monthly department payroll cost breakdown & unit economics<br>• Saudization progression tracker towards Platinum tier<br>• Leave utilization KPIs |
| **Employee Self-Service** | `/me`<br>`/me/payslips`<br>`/me/leave`<br>`/me/letters`<br>`/me/assistant` | • Mobile employee portal with next payday countdown & take-home pay<br>• Self-service leave request connected directly to HR approval queue<br>• Instant certified HR letter generation (Salary, Experience, Embassy)<br>• Scripted AI HR Assistant answering policy & social insurance questions |

---

## 3. Saudi Labor Law & Regulatory Calculations

All calculations in the demo are implemented with mathematical rigor reflecting official Kingdom standards:

1. **GOSI Contributory Deductions (Social Insurance):**
   - Saudi nationals: 9.75% employee contribution, 11.75% employer contribution.
   - Non-Saudi residents: 0.0% employee, 2.0% employer occupational hazard contribution.
   - Contributory ceiling capped at SAR 45,000.
2. **Wages Protection System (WPS SIF):**
   - Standard 16-field SIF format compliant with Saudi Central Bank (SAMA) and corporate payroll banking standards.
3. **End of Service Award (Articles 84 & 85):**
   - Contributory base: Basic salary + Housing allowance.
   - Article 84: 0.5 month's wage per year for the first 5 years; 1.0 month's wage per year thereafter.
   - Article 85 Resignation Multiplier: $< 2$ yrs = 0; $2–5$ yrs = $1/3$; $5–10$ yrs = $2/3$; $\ge 10$ yrs = full award.
4. **Annual Leave Tenure Accrual (Article 109):**
   - 21 days default; automatically escalates to 30 days upon completing 5 consecutive years of service.
5. **Ramadan Reduced Working Hours (Article 98):**
   - 6 hours per day / 36 hours weekly schedule toggle.

---

## 4. Technical Architecture

- **Framework:** Next.js 16 (Turbopack, Static Export `output: 'export'`)
- **UI & Animation:** React 19, Tailwind CSS v4, Framer Motion, Base UI
- **Typography:** **Zain** Google Font (Arabic + Latin) matching ihr.sa's typography
- **Localization:** Full Arabic-first (RTL default) and English (LTR) with dynamic language switcher
- **State & Storage:** Client-side reactive stores (`ihr.hr.v5`, `ihr.store.v2`) persisting seamlessly in `localStorage` with deterministic SSR fallback
- **Accessibility:** Color-contrast validated palettes (WCAG AAA/AA compliant in both dark and light themes), full keyboard navigation, ARIA landmarks
- **Zero Server Overhead:** 100% static client-side compilation (90 static routes) with zero runtime server costs.

---

## 5. Contact & Collaboration

If you are expanding iHR's front-end engineering, design systems, or client-side product architecture, I'd love to connect.

- **Author:** Osama
- **Repository:** [https://github.com/osos3lom/jobswipe](https://github.com/osos3lom/jobswipe)
- **Live Concept Demo:** [https://osos3lom.github.io/jobswipe/](https://osos3lom.github.io/jobswipe/)
