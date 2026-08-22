# Pakistan Livestock Weight Calculator — Design System

> Persistent design context for Codex and future contributors. Read this before changing UI, typography, layout, icons, or interaction design.

## 1. Product character

This is a **professional Pakistani livestock field tool**, not a generic SaaS dashboard.

Design goals, in order:
1. Preserve the clarity and trust of the original Zinda Wazan / Livestock Weight Calculator.
2. Make the interface feel premium, modern, calm, and deliberately designed.
3. Make bilingual English + Urdu content feel native rather than translated.
4. Make every screen immediately usable on an iPhone in a farm/field context.
5. Never sacrifice calculation readability or input usability for visual effects.

Visual references: restrained Swiss editorial hierarchy, Apple-level spacing discipline, Stripe-level component polish, and modern agricultural/field-tool practicality. Do **not** copy any reference literally.

## 2. Brand direction

Primary identity: deep livestock green with warm gold as a restrained premium accent.

```css
--ink: #14231e;
--muted: #65736d;
--paper: #f5f3ed;
--surface: #fffdfa;
--green: #155b49;
--green-2: #1e735c;
--green-soft: #e8f1ec;
--gold: #b58a42;
--gold-soft: #f8f1df;
--line: #dfe4de;
```

Use green for identity, primary actions, selected states, and positive weight emphasis. Use gold for breed/profile emphasis and small premium accents. Avoid rainbow UI and avoid excessive gradients.

Backgrounds may use **subtle atmospheric layering** (very soft radial/linear light, grain-like depth, or tonal surfaces) but must remain quiet. The original clean pale background is a core part of the product identity; do not replace it with a noisy hero background.

## 3. Typography

### English
- Primary UI/display: **Space Grotesk**.
- Body/data fallback: **Inter** only where Space Grotesk harms readability.
- Avoid Arial, Roboto, default system UI, and generic template typography.
- Strong headings should have intentional tracking and compact line-height.

### Urdu
- Primary Urdu: **Noto Nastaliq Urdu**.
- Urdu must never be forced into an English sans-serif font.
- Urdu line-height must be generous enough to prevent glyph collision.
- Never vertically center mixed English/Urdu by guessing with transforms.

### Mixed bilingual labels
Use separate inline spans for English and Urdu whenever possible. English and Urdu are independent typographic systems:

```html
<span class="label-en">Heart Girth (G) in CM</span>
<span class="label-ur">سینٹی میٹر میں دل کی گھیرائی</span>
```

Do not put long bilingual strings into a single flex item and expect browser bidi handling to produce perfect visual alignment.

## 4. RTL rules

- Toggle `dir="rtl"` at the screen/container level for Urdu screens.
- Keep numeric values, formulas, phone numbers, IDs, dates, and units in LTR isolation.
- Use `unicode-bidi: isolate` for mixed-value spans where appropriate.
- Tables must have deliberate RTL column order and text alignment; never rely on accidental browser bidi behavior.
- Urdu labels should visually align to the same baseline/edge as their English counterpart.
- Never mirror icons that communicate universal actions (download, PDF, share, image, CSV) unless the icon itself is directional.

## 5. Layout system

Use a disciplined spacing scale: **4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64**.

Desktop:
- Comfortable max content width around 1120–1180px.
- Large editorial whitespace is allowed on the landing/profile screen.
- Functional screens should prioritize the calculator card rather than oversized decorative hero space.

Mobile/iPhone:
- Treat 320–430px as first-class layouts.
- Never allow horizontal scrolling.
- Minimum touch target: **44×44px**.
- Side padding: normally 16–20px.
- Do not create huge vertical gaps between a label and its input.
- Keep related controls visually grouped.
- Result/action stacks should fit naturally without requiring excessive scrolling.

## 6. Component rules

### Header
Compact, persistent, premium. Brand mark + product name + profile metadata + language/theme controls. Controls must remain readable at 320px width.

### Screen headings
Every functional screen uses:
- small step eyebrow (`Step 1 · Profile`, etc.)
- strong bilingual heading
- one concise explanatory sentence

Do not repeat the same information three times.

### Animal cards
Animal cards are a major visual component. They must look intentional:
- distinctive animal illustration/icon
- consistent icon container
- clear English/Urdu hierarchy
- selected state with green border + subtle green surface
- hover/press feedback
- no childish emoji as primary iconography

Icons should share one visual language: same stroke weight, optical size, corner character, and baseline.

### Breed cards
Breed cards should feel more specialized than animal cards. Use the warm gold accent sparingly. Show:
- breed name
- Urdu name
- divisor/profile value (`D`)

The divisor is technical metadata and should never visually overpower the breed name.

### Inputs
Large, calm, obvious input fields. Labels sit close to fields. Helper text is secondary. Numeric inputs must remain LTR even on Urdu screens.

### Primary buttons
One dominant primary action per screen. Use a clear action icon only when it adds recognition. Do not use decorative arrows everywhere.

### Result card
The result is the product's most important visual artifact.
- Strong green report header.
- Farm/animal metadata in a compact information block.
- Table with disciplined columns.
- Live Weight is the visual focal point.
- Trade Weight and Meat Estimate are secondary but clearly readable.
- Calculation/profile note is a quiet technical callout.

The result must look good both on-screen and when exported as an image/PDF.

### Export/share actions
Use a consistent icon system and action hierarchy:
- Share: share icon
- Copy: copy icon
- Image: image/download icon
- PDF: PDF/document icon
- WhatsApp: WhatsApp mark where licensing/assets permit, otherwise a clean share icon + label
- CSV: spreadsheet/table icon

Buttons must actually work. A beautiful disabled/non-functional action is a defect.

## 7. Iconography

Use one coherent professional icon family throughout the application. Prefer clean SVG icons with consistent stroke width and optical sizing. Animal illustrations may be custom SVGs but must share the same visual grammar.

Do not mix emoji, Font Awesome, random inline SVG styles, and unrelated icon libraries on the same screen.

Icon containers may use subtle tinted circles/squares to establish hierarchy. Avoid oversized decorative icons.

## 8. Motion

Motion must communicate state, not decorate the page.

Allowed:
- 120–220ms hover/press transitions
- subtle card elevation on hover
- selected-state transition
- screen-entry fade/translate of 8–12px
- success feedback after copy/share/export

Avoid:
- perpetual animation
- bouncing controls
- excessive parallax
- animation that delays field entry or calculation

Respect `prefers-reduced-motion`.

## 9. Accessibility

- Text/background contrast should meet WCAG AA where practical.
- Visible keyboard focus states.
- Buttons must be real `<button>` elements.
- Inputs need associated labels.
- Icon-only buttons need accessible names.
- Never communicate status by color alone.
- Touch targets >= 44px.
- Urdu must remain legible at increased text size.

## 10. Field-tool UX

Assume the user may be standing beside an animal with one hand occupied.

Therefore:
- Keep steps obvious.
- Keep labels short.
- Make inputs forgiving and easy to tap.
- Preserve entered profile data.
- Provide clear back navigation.
- Prevent accidental destructive actions with confirmation.
- Give immediate, human-readable validation.
- Never hide the formula/profile used for a result.

## 11. Calculation integrity

**Visual redesign must never change the original calculation logic, formulas, breed profiles, divisors, units, or fiqh/business rules.**

The exact original formula/profile data is authoritative. UI work must consume the calculation layer rather than duplicate or approximate formulas.

For the reference Buffalo example:
- Animal: Buffalo
- Breed: Nili-Ravi / Kundi
- Girth: 180 cm
- Length: 160 cm
- D: 10400
- Expected live weight: **498.46 KG**

Any visual refactor must regression-test this exact case.

## 12. Export integrity

Exported image/PDF must preserve:
- correct bilingual typography
- correct RTL ordering
- correct numbers and units
- no clipped text
- no missing icons
- consistent brand colors
- readable table columns

Test on iPhone Safari/WebKit as well as desktop Chromium.

## 13. Design-first workflow

Before implementing a substantial visual change:
1. Inspect the original live app and screenshots.
2. Identify the information hierarchy and interaction goal.
3. Write a short visual/UX plan.
4. Implement tokens/components rather than one-off CSS.
5. Check English.
6. Check Urdu.
7. Check 320/375/390/430px mobile widths.
8. Test the 180×160 Buffalo calculation.
9. Test copy/share/image/PDF/CSV actions.
10. Only then call the screen finished.

## 14. Anti-patterns — do not ship

- Generic AI/SaaS landing-page styling.
- Huge empty spaces on functional mobile screens.
- Inter-only UI with Urdu forced into it.
- Mixed-direction strings that reorder punctuation or numbers.
- Emoji used as core product icons.
- Random icon styles.
- Decorative gradients that reduce readability.
- Buttons that look functional but do nothing.
- Changing the original formula because a newer-looking implementation seems simpler.
- Claiming a screen is final without testing the actual deployed build.
