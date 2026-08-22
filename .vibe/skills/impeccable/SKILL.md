# Impeccable Frontend Craft Skill

Use this skill as the visual-design and UX quality layer for the Pakistan Livestock Weight Calculator.

## Product context
- This is a practical livestock field calculator, not a marketing landing page.
- The original Zinda Wazan application is the incumbent visual/UX reference.
- Preserve its recognizable green/gold identity, compact workflow, card hierarchy, animal/breed selection, measurement flow, and result structure.
- Refine rather than replace.

## Non-negotiable product constraints
- NEVER change calculation formulas, breed profiles, divisors, units, meat estimate, trade-weight conversion, or business rules.
- Verified regression: Buffalo → Nili-Ravi / Kundi → Girth 180 cm → Length 160 cm → D 10400 → 498.46 KG, 12.46 Maunds, 249.23 KG meat estimate.
- `main` is the production baseline; work only on the redesign branch until explicitly approved.

## Visual direction
- Premium, modern, distinctive, practical, trustworthy.
- Avoid generic AI/SaaS/vibe-coded aesthetics.
- Avoid excessive whitespace, giant marketing typography, random gradients, excessive glassmorphism, and arbitrary decorative effects.
- Use a restrained deep-green foundation with warm gold accents and light neutral surfaces.
- Use layered depth, subtle texture/atmosphere, refined shadows, and purposeful state transitions only where they improve hierarchy.
- Animal and utility icons must feel like one coherent icon family. Prefer polished custom SVG/iconography with consistent stroke, proportions, optical weight, and active states.
- Cards must have clear hierarchy and meaningful grouping, not nested-card clutter.
- Buttons need clear primary/secondary hierarchy and recognizable icon + label combinations.

## Typography
- English display/UI: Space Grotesk where appropriate.
- Urdu: Noto Nastaliq Urdu.
- Dense numeric/data content may use Inter for readability.
- Never force Urdu and Latin text into one font.
- Never rely on page-level RTL for mixed content.
- Urdu labels and English labels should be separate spans/elements.
- IDs, phone numbers, formulas, decimal values, units, and measurements are always isolated LTR.
- Use bidi isolation (`dir="ltr"`, `unicode-bidi:isolate`, or equivalent) wherever mixed-script strings can reorder.

## Responsive/mobile rules
- Design for iPhone first, then scale up.
- Test 320–430px widths explicitly.
- Header must never collide or wrap awkwardly.
- Touch targets should be comfortable.
- Two-column layouts collapse cleanly.
- Animal cards remain visually balanced in a 2×2 mobile grid.
- Result tables must remain readable without horizontal scrolling.
- Long Urdu and breed names must wrap intentionally.

## Interaction quality
- Every interactive control needs hover, focus-visible, pressed, selected, disabled, and loading/error states where relevant.
- Use motion sparingly and purposefully; respect reduced-motion preferences.
- Preserve clear step progression: Profile → Animal → Breed → Measurements → Result.
- Make the result the strongest information hierarchy after calculation.
- Share/export actions should be grouped by importance rather than presented as equal generic buttons.

## Accessibility
- Semantic buttons/forms/labels.
- Keyboard accessible.
- Visible focus states.
- Sufficient contrast.
- Meaningful aria-labels for icon-only controls.
- Do not encode essential meaning by color alone.

## QA workflow
1. Inspect incumbent/original design and current implementation.
2. Critique information hierarchy, typography, layout, color, iconography, responsiveness, accessibility, and interaction states.
3. Fix structural problems before cosmetic polish.
4. Audit English and Urdu separately.
5. Audit 320, 375, 390, 430, tablet and desktop layouts.
6. Verify the exact livestock calculation regression case.
7. Verify Share Sheet/WhatsApp, image export, PDF/print, CSV and history.
8. Do not call the redesign final until the live branch is visually checked.

## Quality bar
The result should look like a deliberately designed professional livestock utility created by an experienced product designer—not an AI-generated dashboard or generic SaaS template.
