<div align="center">

  # منصة iHR | iHR Platform
  ### عرض تجريبي لمنصة موارد بشرية ورواتب وتوظيف للشركات السعودية
  ### A concept demo of an HR, payroll & hiring platform for Saudi companies

  <p align="center">
    <a href="https://osos3lom.github.io/jobswipe/"><strong>🚀 تجربة العرض المباشر • Live Demo</strong></a>
  </p>

  <p align="center">
    <a href="#-العربية"><strong>العربية</strong></a> •
    <a href="#-english"><strong>English</strong></a> •
    <a href="docs/for-ihr.md"><strong>For iHR Team</strong></a> •
    <a href="docs/phases/README.md"><strong>Build phases</strong></a>
  </p>

  <p align="center">
    <a href="https://osos3lom.github.io/jobswipe/"><img src="https://img.shields.io/badge/Live_Demo-Online-7A0C0C?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/RTL_first-Arabic-B62B46?style=for-the-badge" alt="RTL first" />
  </p>

</div>

> [!IMPORTANT]
> **عرض تجريبي غير رسمي.** هذا المشروع غير تابع لشركة iHR ولا معتمد منها، ولا يستخدم شعارها. جميع الشركات والأشخاص والرواتب والأسعار الواردة فيه **وهمية**، والقواعد النظامية السعودية معروضة **لأغراض التوضيح والمحاكاة فقط** وليست استشارة نظامية.
>
> **Unofficial concept demo.** Not affiliated with, endorsed by, or using the logo of iHR. Every company, person, salary, and price here is **fictional**, and the Saudi regulatory rules shown are **illustrative only** — not legal advice.

---

# 🇸🇦 العربية

## 📌 نبذة عن المشروع

**منصة iHR** عرض تجريبي لمنصة موارد بشرية متكاملة مصممة للسوق السعودي، بهوية بصرية مستوحاة من ألوان iHR. المنصة تجمع ثلاثة أدوار تفاعلية في تطبيق واحد:

| الجانب | الوصف | المسار |
| :--- | :--- | :--- |
| **لوحة تحكم صاحب العمل** | إدارة الموظفين، مسيرات الرواتب، التوظيف، الامتثال، الإجازات، المزايا، والأداء | `/console` |
| **بوابة الموظف الذاتية** | كشوفات الرواتب، طلبات الإجازة، إصدار الخطابات الرسمية المعتمدة، والمساعد الذكي | `/me` |
| **تطبيق الباحث عن عمل** | استعراض الوظائف بالسحب مع تقييم المطابقة الذكي والمدرب المهني | `/jobs` |
| **الموقع التسويقي** | الصفحة التعريفية، شرائح التسعير، ومحاكي القيمة المضافة | `/` |

كل وحدة في العرض تقابل منتجًا حقيقيًا من باقة منتجات iHR: منصة iHR، وiHR Recruiter، وiHR Jobs، وiHR Vision.

---

## ✨ الوحدات المكتملة في العرض

### 1. لوحة تحكم صاحب العمل (`/console`)
- **لوحة المؤشرات:** مؤشرات فورية لعدد الموظفين، وكتلة الأجور، ونسبة التوطين، وتنبيهات الوثائق المنتهية، مع التاريخ الهجري.
- **دليل الموظفين (`/console/people`):** ملفات شاملة للموظفين توضح هيكل الراتب (أساسي + سكن + نقل) وسجل الخدمة والوثائق.
- **مسيرات الرواتب (`/console/payroll`):** معالج رواتب من ٣ خطوات مع احتساب اشتراكات التأمينات الاجتماعية (GOSI)، واستخراج قسائم رواتب ثنائية اللغة.
- **مركز الامتثال ونطاقات (`/console/compliance`):** مؤشر نطاقات فوري، ومحاكي أثر التوظيف، وسجل متابعة الإقامات وعقود قوى، وتصدير ملف حماية الأجور (WPS SIF CSV).
- **إدارة الإجازات (`/console/time-off`):** تدرج الإجازة السنوية وفق المادة ١٠٩ (٢١ يوماً تزداد إلى ٣٠ يوماً بعد ٥ سنوات)، وساعات عمل رمضان المخفضة (المادة ٩٨)، وتقويم العطلات الرسمية، وسجل موافقات تفاعلي.
- **تأهيل الموظفين الجدد (`/console/onboarding`):** قوائم مهام المباشرة مقسمة حسب الأقسام، ومعاينة خطاب العرض الوظيفي مع محاكاة التوقيع الرقمي، واعتماد المباشرة.
- **المزايا ومكافأة نهاية الخدمة (`/console/benefits`):** فئات التأمين الطبي المعتمدة من مجلس الضمان الصحي (CCHI)، وحاسبة مكافأة نهاية الخدمة النظامية للمادتين ٨٤ و ٨٥.
- **إدارة الأداء والأهداف (`/console/performance`):** دورة التقييم نصف السنوية، وأهداف OKRs الذكية، ومقياس التقييم من ١ إلى ٥ مع تعليقات المدير.
- **التحليلات ورؤية iHR Vision (`/console/reports`):** رسم بياني لنمو الكادر البشري، وتوزيع تكاليف الرواتب حسب الإدارات، وتتبع مسار التوطين نحو النطاق البلاتيني.

### 2. بوابة الموظف الذاتية (`/me`)
- **الصفحة الرئيسية:** عداد الأيام لموعد الراتب القادم، وصافي الراتب المتوقع، ورصيد الإجازة المتبقي، وحالة صلاحية الإقامة.
- **كشوف الرواتب (`/me/payslips`):** تفاصيل الراتب والاستقطاعات الشهرية مع إمكانية الطباعة.
- **الإجازات (`/me/leave`):** تقديم طلب إجازة جديد يظهر فورياً في لوحة تحكم الإدارة.
- **الشهادات والخطابات (`/me/letters`):** توليد خطابات تعريف بالراتب وشهادات خبرة معتمدة ثنائية اللغة برمز QR رسمي فورياً.
- **المساعد الذكي للموظف (`/me/assistant`):** مساعد مبرمج يجيب على استفسارات الموظف المتعلقة بالراتب والإجازات والتأمينات.

### 3. تطبيق الباحث عن عمل (`/jobs`)
- بطاقات الوظائف بالسحب يميناً ويساراً مع أسباب المطابقة الذكية.
- محادثات ومقابلات مجدولة مع مدرب المسار المهني التفاعلي.

### 4. الجولة الإرشادية التفاعلية
- جولة من ٥ خطوات تأخذ الزائر في استعراض لأهم مميزات المنصة، مع إمكانية إعادة التشغيل من قائمة العرض.

---

## 🛠️ التقنيات المستخدمة

- **Next.js 16** (App Router، تصدير ثابت `output: 'export'`)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **Framer Motion**
- **Base UI**
- **Lucide Icons**
- خط **Zain** عبر Google Fonts (نفس الخط المستخدم في ihr.sa)

جميع البيانات تحفظ محلياً في `localStorage` داخل المتصفح دون الحاجة لخادم خارجي.

---

# 🇬🇧 English

## 📌 Project Overview

**iHR Platform** is an interactive concept demo of an end-to-end HR, payroll, and recruitment suite tailored specifically for Saudi Arabia. It unifies three distinct roles into one seamless experience:

| Role / Surface | Purpose | Route |
| :--- | :--- | :--- |
| **Employer Console** | Full-suite HR management, GOSI payroll, WPS, compliance, and hiring | `/console` |
| **Employee Self-Service** | Mobile portal for payslips, leave requests, and certified HR letters | `/me` |
| **Candidate App** | Swipe-to-apply job matching with transparent AI scoring and coach | `/jobs` |
| **Marketing Homepage** | Product overview, feature showcases, and 3-tier pricing table | `/` |

---

## ✨ Features Implemented

1. **Employer Console (`/console`)**:
   - Live KPI dashboard with Hijri calendar and urgent HR todos.
   - People Directory with full compensation packages (Basic, Housing, Transport).
   - 3-step payroll wizard with GOSI deductions and bilingual payslips.
   - Compliance Hub with live Nitaqat band meter, What-If simulator, and 16-field WPS SIF export.
   - Time Off management with Labor Law Article 109 tenure scaling (21 vs 30 days) and Ramadan hours toggle.
   - Onboarding checklists with bilingual offer letter & e-sign simulation.
   - CCHI health insurance tiers and Article 84/85 End-of-Service Benefit (EOSB) calculator.
   - Performance review cycles and quarterly SMART goals.
   - iHR Vision analytics for headcount growth, department payroll costs, and Saudization trajectories.

2. **Employee Self-Service Portal (`/me`)**:
   - Payday countdown and take-home pay estimate.
   - Monthly payslip viewer with print support.
   - Time off request form synced directly to the employer approval queue.
   - Certified bilingual HR letters (Salary certificate, Experience letter, Embassy visa letter) with QR validation seal.
   - Scripted AI HR Assistant answering employee queries from their live record.

3. **Candidate Experience (`/jobs`)**:
   - Mobile card swipe interface with transparent AI matching rationale.
   - In-app messaging, interview scheduling, and AI Career Coach.

4. **Guided Tour**:
   - 5-step interactive walkthrough guiding first-time reviewers through the core highlights.

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/osos3lom/jobswipe.git
cd jobswipe

# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run typecheck

# Build static production export
npm run build
```

---

## 📄 License & Disclaimer

This project is an independent concept demo created for demonstration purposes and is not affiliated with or endorsed by iHR.
