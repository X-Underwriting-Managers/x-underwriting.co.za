# Broker Recruitment Landing Page: Copy Deck

Page: `become-a-broker.html` (standalone, not in the site menu)
Primary goal: broker leaves contact details for the broker team.
Secondary goal: broker books an Xcelerate demo on Calendly.

**How to read this deck.** Variation 1 in every table is live on the page. The rest are held for A/B testing. Headline and subheadline variations are already wired into the page and can be switched with a URL parameter (see section 15).

**Rules applied to every line.** British English. No em or en dashes. Sentences of 15 words or fewer where possible, 2 sentences per paragraph at most. Only facts from the brief. No invented statistics, commission rates or testimonials.

---

## 1. Hero headline (H1)

Structure: [Emotional Dream Outcome] [Functional Benefit] in [Timeframe] Using [Unique Mechanism] ([Proof Element])

| # | Headline |
|---|---|
| 1 | Grow a Book Clients Trust & Win Back Selling Time Using Xcelerate (4 Plans From R113) |
| 2 | Earn More From Every Medical Aid Client by Quoting Gap Cover Online in Minutes Using Xcelerate (Underwritten by Compass) |
| 3 | Spend Less Time on Admin & More Time Selling by Onboarding Clients Online in Minutes Using Xcelerate (FSP 55527) |
| 4 | Become the Adviser Clients Thank When Specialist Bills Arrive, Fit Every Budget Today Using 4 Gap Cover Plans (500% Gap Benefit) |
| 5 | Sell Gap Cover With Confidence From Your First Client Using Structured Xcelerate Training (Underwritten by Compass, FSP 12148) |
| 6 | Stop Chasing Insurers & Track Every Claim in Real Time Using Xcelerate (4 Plans From R113) |
| 7 | Keep Clients for Longer by Covering Their Medical Shortfalls From R113 a Month Using 4 Gap Cover Plans (R223,000 Annual Limit) |
| 8 | Add a New Income Stream to Your Brokerage & Start Quoting as Soon as You're Accredited Using Xcelerate (FSP 55527) |
| 9 | Give Every Client the Right Plan & Get a Dedicated Broker Team Behind You Using Xcelerate (4 Plans, 2 Rating Models) |
| 10 | Build a Book You're Proud Of, Go From Enquiry to Accredited Broker in 3 Simple Steps Using Xcelerate (Compass Underwritten) |

Why variation 1 is live: it leads with the strongest broker outcomes (a growing book, client trust and time back for selling), and the R113 entry price gives instant proof.

Note: the page makes no response time promise. "Within one business day" was removed everywhere at the business's request.

Note: variations 2 and 3 say "in minutes". The brief uses this as an example, but it is not a measured figure. Confirm it before running either variation.

## 2. Hero subheadline

| # | Subheadline | Words |
|---|---|---|
| A (main, live) | Tired of paper forms and chasing insurers for claim updates? Xcelerate puts quoting, onboarding and live claims tracking in one digital platform, so you get faster placements, fewer admin hours and more time to sell. | 35 |
| B (benefit variant) | Losing clients when a specialist bill lands that their medical aid doesn't fully cover? Offer 4 gap cover plans from R113 a month and become the adviser they thank, with a dedicated broker team behind you. | 35 |

Compliance note: the brief's template says "The only ... to guarantee". We left out "the only" and "guarantee". Both are claims we cannot prove, and FAIS advertising rules treat them as misleading unless they are substantiated. The order (pain, mechanism, how it works, time bound benefit) is unchanged.

## 3. Primary CTA

| # | Button text | Microcopy under the button |
|---|---|---|
| 1 | Get a Walkthrough | No obligation. |
| 2 | Show Me How to Earn on Gap Cover | A quick, no obligation call. |
| 3 | Book an Xcelerate Demo Call | See quoting, onboarding & claims tracking live. No obligation. |
| 4 | Request a Quick, No Pressure Chat | Ten minutes, zero obligation. |
| 5 | Learn How Brokers Keep Clients With Gap Cover | Get the insights our broker team shares on every call. No obligation. |

The live page uses CTA 1 throughout. The sticky mobile bar shortens it to "Get in touch". The form heading reads "Get a broker walkthrough" and the submit button reads "Get a Walkthrough". The word "free" is not used on the page.

Note: CTA 4 says "Ten minutes". Confirm that the typical call length matches before you use it.

### Form

Fields: First name, Surname, Mobile number, Email, Brokerage name, FSP number (if handy), Province (dropdown), Best time to call (optional).

Under the button: "No obligation." then a divider and "Ready to register? Register on Xcelerate →".

Submission: the form posts to the lead capture API (`POST /public/broker/prospect`), which records the lead and creates or enriches the Freshsales prospect. Asking for the FSP number matters because the CRM uses it to match brokers who are already on record instead of creating a duplicate. The thank you state shows the submission ID as "Your reference".

POPIA consent (required): "I agree that X Underwriting Managers may use these details to contact me about becoming an accredited broker, as set out in the Privacy Policy."

Error messages:

| Field | Message |
|---|---|
| First name | Please enter your first name. |
| Surname | Please enter your surname. |
| Mobile | Please enter a South African mobile number, e.g. 082 123 4567. |
| Email | Please enter a valid email address, e.g. name@brokerage.co.za. |
| Brokerage | Please enter your brokerage name. If you trade under your own name, use that. |
| FSP number | FSP numbers are 3 to 10 digits. Leave it blank if you don't have it handy. |
| Province | Please choose your province. |
| Consent | Please tick the box so we may contact you. |
| Send failure | Sorry, something went wrong. Please call us on (018) 004 0206 or email info@x-underwriting.co.za. |
| API unavailable (500) | We could not record your enquiry. Please try again shortly. Or call us on (018) 004 0206 or email info@x-underwriting.co.za. |

Thank you state:
> **Thank you, {first name}. Your details are with our broker team.**
> We'll contact you to walk you through our plans and Xcelerate.
> Can't wait? Book a time that suits you.
> [Book a demo of Xcelerate]

Auto confirmation email to the broker:
> Subject: We've received your details, {first name}
> Thank you for your interest in becoming an accredited X Underwriting broker.
> Our broker team will be in touch soon.
> On the call we'll walk you through our 4 gap cover plans, the Xcelerate platform and how accreditation works.
> Prefer to pick a time? Book a demo of Xcelerate: {Calendly link}
> Questions in the meantime? Call (018) 004 0206 or reply to info@x-underwriting.co.za.

### Register now (for brokers who are ready)

Links to https://xcelerate.x-underwriting.co.za/register in a new tab. It is tracked as `register_click`, with the location.

| Location | Text |
|---|---|
| Hero, under the trust line | Ready to register? Register on Xcelerate → |
| Under the form button |  Ready to register? Register on Xcelerate → |
| After How it works | [Ready to register? Register now] + "Already decided? Register directly on Xcelerate." |
| Thank you state, under Book a demo | [Ready to register? Register now] (outline button) |
| Final CTA contact list | Ready to register? Register on Xcelerate |

## 4. Pain section headline

| # | Format | Headline |
|---|---|---|
| 1 | Empathy question with fix | Frustrated by chasing insurers for claim updates? Here's the fix. |
| 2 | Pain callout with reframe | Feeling buried in admin? It's not your workload, it's your provider's paperwork. |
| 3 | Direct warning or guidance | Avoid losing clients to a medical shortfall by adding gap cover to every medical aid conversation. |
| 4 | Bold claim | Medical aid alone leaves your clients exposed, and the call comes to you. |
| 5 | Validates pain, promises resolution | You work hard for your clients, and you deserve a provider that works just as hard for you. |

2 of the 5 are questions.

## 5. Pain section body (Problem, Agitate, Solve)

✓ Do you lose hours chasing insurers for claim updates?
✓ Are you still onboarding clients on paper forms?
✓ Have you watched a client pay a specialist shortfall out of their own pocket?

You know your clients. You know their medical aid **doesn't cover everything.**

When a specialist charges above scheme rates, the call comes to **YOU.**

And too many providers make that moment harder than it should be:

✓ Paper applications that bounce back for one missing signature
✓ Claim updates that only arrive when you phone and ask
✓ Support lines that leave you waiting days for an answer
✓ Products you're expected to sell without proper training
✓ Admin that eats into the hours you should spend selling

**Every delay costs you.**

A client hit with a shortfall loses trust. A client who waits too long moves to a competitor.

And every hour on admin is **commission you didn't earn.**

**There's a better way.**

You **DON'T** need to change your whole business.
You **DON'T** need to learn a complex system on your own.
You **DON'T** need to chase claims by phone.

What you **DO** need is a gap cover partner built for brokers.

X Underwriting gives you **4 gap cover plans**, the **Xcelerate digital platform** and a **dedicated broker team** behind you.

Underwritten by Compass Insurance Company Limited, a licensed non life insurer (FSP 12148).

## 6. Value propositions

There are 7, not 8. The brief listed 9 candidates, and 2 merges plus 1 removal took it to 7:

- **"Rated per life & per policy" is merged into "4 plans for every budget".** The two ratings are what let 4 plans fit every client, so on their own they would repeat that point.
- **"One business day response" is dropped.** The business asked for no response time promise on the page.
- **"Simple claims process" is merged into "Real time claims tracking".** Both promise the same outcome: less claims admin and fewer surprises.

| # | Core differentiator | Headline | Words |
|---|---|---|---|
| 1 | Xcelerate digital platform | Quote, onboard and manage every client on Xcelerate, and win back hours for selling | 14 |
| 2 | Real time claims tracking | Track every claim in real time with minimal paperwork and know the answer before your client asks | 17 |
| 3 | 4 plans, 2 rating models | Confidently fit every client's budget with 4 plans from R113, rated per life or per policy | 16 |
| 4 | Strong shared benefits | Offer a R223,000 annual limit and 500% in hospital gap benefit on every plan for peace of mind | 18 |
| 5 | Structured training | Master every benefit, limit and exclusion through structured training, and sell with complete confidence | 14 |
| 6 | Dedicated broker support | Never feel alone with a dedicated team behind every query, new business application & claim | 15 |
| 7 | Compass underwriting | Recommend cover with long term security, underwritten by Compass Insurance, a licensed non life insurer | 15 |

Each one has a supporting line under it on the page:

| # | Supporting line |
|---|---|
| 1 | One platform for quotes, applications, policy changes and documents. No paper forms. |
| 2 | See each claim's status and outstanding documents from the moment it's registered. |
| 3 | Nexus 1 & Nexus 2 are rated per life. Vertex & Apex are rated per policy. |
| 4 | Gap cover is not a medical scheme and is not a substitute for medical scheme membership. |
| 5 | Train on the Xcelerate training portal before you sell, at your own pace. |
| 6 | Real people help with queries, new business applications and claims at every step. |
| 7 | Compass Insurance Company Limited, FSP 12148. X Underwriting Managers, FSP 55527. |

## 7. How it works

Section headline: **From enquiry to selling in 3 simple steps**

| Step | Title | Body |
|---|---|---|
| 1 | Leave your details | Our broker team will be in touch to take you through the next steps. |
| 2 | Get trained & accredited | Complete structured training on the Xcelerate training portal. You'll know every benefit, limit and exclusion. |
| 3 | Start selling on Xcelerate | Quote, onboard clients and track claims in one digital platform. |

## 8. Product snapshot

Headline: **4 plans, so every client fits**
Intro: Two rating models, one strong foundation. Match the plan to your client's budget and family.

| Plan | Benefits | From | Rating | Badge |
|---|---|---|---|---|
| Nexus 1 | 15 | R113 per month | Per life | |
| Nexus 2 | 20 | R130 per month | Per life | Most Popular |
| Vertex | 11 | R450 per month | Per policy | |
| Apex | 19 | R550 per month | Per policy | |

Shared band: **Every plan includes a R223,000 overall annual limit & a 500% in hospital gap benefit.**
Disclaimer: Gap cover is not a medical scheme and is not a substitute for medical scheme membership.
Link: Compare all 4 plans

## 9. Xcelerate showcase

Headline: **See Xcelerate in action**
Intro: Everything you need to place and service gap cover, in one place.
Video: the Xcelerate highlights reel, about 1 minute long, muted and looping.

| # | Screenshot | Caption title | Caption |
|---|---|---|---|
| 1 | Group application link | Onboard without paper | Capture a client yourself or send an application link they complete online. |
| 2 | Policy view | Manage every policy | Request dependant, option and banking changes in a few clicks. |
| 3 | Claims list | Track claims live | See each claim's status from the moment it's registered. |

Secondary CTA: **Book a demo of Xcelerate**

## 10. Trust and social proof

Slim strip under the hero: Authorised FSP 55527 · Underwritten by Compass (FSP 12148) · Dedicated broker support · 4 plans from R113

Fuller section headline: **A partner you can check**

| # | Trust point |
|---|---|
| 1 | X Underwriting Managers (Pty) Ltd is an Authorised Financial Services Provider, FSP 55527. |
| 2 | Underwritten by Compass Insurance Company Limited, a licensed non life insurer, FSP 12148. |
| 3 | We are based at 102 Peter Mokaba Avenue, Potchefstroom. Call us on (018) 004 0206. |

Testimonials: **[CONFIRM]**. The page has a hidden testimonial block, ready to switch on once real, approved quotes are supplied.

## 11. FAQ

| # | Question | Answer |
|---|---|---|
| 1 | Who can become an X Underwriting broker? | Independent brokers, financial advisers and brokerages in South Africa. It suits you if you advise on medical aid, health or short term products. |
| 2 | Do I need an FSP number? | Add your FSP number to the form if you have one. Our broker team will take you through the accreditation requirements on the call. **[CONFIRM exact requirement]** |
| 3 | How long does accreditation take? | It depends on how quickly you complete the training on the Xcelerate training portal. We'll give you a clear timeline when we call. **[CONFIRM typical duration]** |
| 4 | What support do I get? | A dedicated team helps with queries, new business applications and claims at every step. |
| 5 | How are commissions paid? | Your broker consultant walks you through commission and payment on the call. **[CONFIRM structure]** |
| 6 | Is gap cover a medical scheme? | No. Gap cover is not a medical scheme and is not a substitute for medical scheme membership. It pays the shortfall between what the scheme pays and what specialists and hospitals charge. |
| 7 | What happens after I submit my details? | Our broker team will contact you or you can book a demo of Xcelerate at a time that suits you. |

## 12. Final CTA block

| # | Dream outcome line |
|---|---|
| 1 | Become the adviser your clients call first. |
| 2 | Grow your book with a dedicated broker team behind you. |
| 3 | Protect your clients from shortfalls and grow your income at the same time. |

Sub line: Leave your details and our broker team will contact you. No obligation.

## 13. Footer

- Contact: info@x-underwriting.co.za | (018) 004 0206 | 102 Peter Mokaba Avenue, Potchefstroom, 2531
- Links: Privacy Policy (POPIA) · Complaints Procedure · Conflict of Interest Policy · PAIA Manual
- Disclosure: X Underwriting Managers (Pty) Ltd is an Authorised Financial Services Provider, FSP 55527. Underwritten by Compass Insurance Company Limited ("Compass Insure"), a licensed non life insurer and authorised financial services provider, FSP 12148.
- Statement: Gap cover is not a medical scheme and is not a substitute for medical scheme membership.

## 14. [CONFIRM] register

Nothing below appears on the live page until it has been confirmed.

| # | Item | Where it would go | Current handling |
|---|---|---|---|
| 1 | Commission structure / earning potential | Value props, FAQ 5 | FAQ defers to the call |
| 2 | Average claims turnaround (days) | Value prop 2, hero variant 6 | Not stated |
| 3 | Number of accredited brokers / members covered | Trust strip | Not stated |
| 4 | Broker testimonials (name, brokerage, quote) | Trust section | Hidden block, ready |
| 5 | FSP number requirement | FAQ 2 | Defers to the call |
| 6 | Accreditation duration | FAQ 3 | Defers to the call |
| 7 | "In minutes" quoting claim | Hero variations 2 & 3 | Held back from the live page |
| 8 | GA4, Meta Pixel & LinkedIn Insight IDs | `js/broker-landing.js` config | Empty, so no tags load |
| 9 | Cookie consent for pixels | Site wide | Not built yet; needed before pixels go live |

---

## 15. Wireframes

### Desktop (1280px)

```
+--------------------------------------------------------------------------+
| [LOGO]                                  (018) 004 0206   [Get in touch]  |
+--------------------------------------------------------------------------+
| HERO (dark, grid background)                                              |
|  FOR BROKERS & ADVISERS              +--------------------------------+  |
|  H1 Grow a Book Clients Trust,       | Get a broker walkthrough       |  |
|  With Answers Within One Business    | [First name]   [Surname]       |  |
|  Day Using Xcelerate                 | [Mobile]       [Email]         |  |
|  (4 Plans From R113)                 | [Brokerage]    [FSP no.]       |  |
|                                      | [Province v]   [Time v]        |  |
|  Subheadline (35 words)              | [x] POPIA consent              |  |
|                                      | [ GET A WALKTHROUGH ]          |  |
|  ✓ FSP 55527 · Compass FSP 12148     | No obligation.                 |  |
|                                      +--------------------------------+  |
+--------------------------------------------------------------------------+
| TRUST STRIP  FSP 55527 | [shield] Compass | Support      | 4 plans R113  |
+--------------------------------------------------------------------------+
| PAIN  (single column, 68ch)                                              |
|  H2 Frustrated by chasing insurers...?                                   |
|  ✓ ✓ ✓ / problem / agitate ✓✓✓✓✓ / solve                                 |
+--------------------------------------------------------------------------+
| VALUE PROPS  2 x 4 grid, icon + headline + line          [CTA 2 button]  |
+--------------------------------------------------------------------------+
| TRUST  3 checkable facts + Compass logo   (testimonial slot hidden)      |
+--------------------------------------------------------------------------+
| HOW IT WORKS   [1] -----> [2] -----> [3]                                 |
+--------------------------------------------------------------------------+
| PRODUCT SNAPSHOT  Per life: [Nexus 1] [Nexus 2*]  Per policy: [Vertex] [Apex] |
|  ==== R223,000 annual limit & 500% gap benefit on every plan ====        |
+--------------------------------------------------------------------------+
| XCELERATE (dark)  [ video 16:9 ]                                         |
|  [shot 1 + caption] [shot 2 + caption] [shot 3 + caption]  [Book a demo] |
+--------------------------------------------------------------------------+
| FAQ accordion (7)                                                        |
+--------------------------------------------------------------------------+
| FINAL CTA (dark)  dream line + second form  |  call / email              |
+--------------------------------------------------------------------------+
| FOOTER  logo, disclosures, contact, legal links                          |
+--------------------------------------------------------------------------+
```

### Mobile (360 to 414px)

```
+--------------------------+
| [LOGO]      [call icon]  |  slim header, 56px
+--------------------------+
| FOR BROKERS & ADVISERS   |
| H1 (5 to 6 lines)        |  ABOVE THE FOLD:
| Subheadline              |  H1, subheadline,
| [GET A WALKTHROUGH]      |  CTA button and
| No obligation...         |  trust line
| ✓ FSP 55527 · Compass    |
+--------------------------+
| Lead form (stacked)      |  CTA button scrolls here
+--------------------------+
| Trust strip (2 x 2)      |
| Pain (single column)     |
| Value props (1 column)   |
| [CTA 2]                  |
| Trust                    |
| How it works (stacked)   |
| Plans (1 column cards)   |
| Video + 3 screenshots    |
| [Book a demo]            |
| FAQ                      |
| Final CTA + form         |
| Footer                   |
+--------------------------+
| [Get in touch] [Call]    |  sticky bar, shows after the hero
+--------------------------+
```

---

## 16. What to A/B test first, and why

1. **Hero headline first: variation 1 against variation 6.** The headline drives most of the bounce or stay decision for cold LinkedIn and WhatsApp traffic. Variation 1 sells an outcome (a trusted, growing book). Variation 6 names a sharp pain (chasing insurers). Testing outcome against pain tells you which frame this audience responds to. That answer then guides every other section. Use `?h=1` and `?h=6` in ad URLs, or let the page split visitors randomly.
2. **Subheadline next: A (mechanism) against B (benefit).** Run this after the headline winner is clear, so the two tests don't muddy each other. It shows whether brokers want to hear how Xcelerate works or what they gain. Use `?s=a` and `?s=b`.
3. **Then the CTA wording: CTA 1 against CTA 3.** This tests "walkthrough" against "demo". It also shows whether brokers prefer a person or a product tour.

Run one test at a time with at least 100 form submissions per arm before calling a winner. Every lead email and analytics event records the `h` and `s` variant, so results can be read from the CRM even before analytics IDs are added.
