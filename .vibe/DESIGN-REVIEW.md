# Impeccable Design Review — Pakistan Livestock Weight Calculator

## Design objective
Refine the original Zinda Wazan product into a premium, modern, highly usable livestock field tool. Do not replace its personality with a generic SaaS or AI landing-page aesthetic.

## Reference hierarchy
1. Original Zinda Wazan live app and supplied screenshots — visual and UX incumbent.
2. Original source code — calculation/data/business-rule authority.
3. DESIGN.md — project visual system and constraints.
4. Impeccable craft principles — quality, accessibility, responsive and interaction refinement.

## Required review sequence
### Shape
- Identify the primary user task and the visual hierarchy for each step.
- Keep the workflow compact and obvious.

### Typeset
- English and Urdu must have separate typographic systems.
- Mixed bidi strings must never depend on accidental browser ordering.
- Numbers/units/formulas/IDs remain LTR.

### Layout
- Establish consistent container, grid, card, spacing and alignment rules.
- Remove accidental whitespace.
- Avoid nested-card clutter.

### Color
- Deep green is the dominant brand color.
- Gold is a controlled accent for breed/profile emphasis.
- Neutral surfaces support legibility.
- Do not add arbitrary neon/gradient colors.

### Icons
- All animal and action icons must share one visual language.
- Use optical sizing, consistent stroke/fill treatment, clear active states and accessible labels.
- Never use mismatched emoji as core product iconography.

### Adapt
- Verify 320, 375, 390 and 430px mobile widths.
- Verify tablet and desktop.
- Verify both English and Urdu at every width.

### Harden
- Validate forms, long names, empty history, failed exports, unavailable native sharing, reduced motion and dark mode.

### Polish
- Refine shadows, borders, radii, micro-spacing, transitions and pressed/focus states only after structural issues are solved.

## Acceptance criteria
- No visible Urdu/English baseline collisions.
- No reversed numbers, units, formulas or phone/Tag IDs.
- No clipped or overlapping header controls.
- Animal/breed icons feel premium and cohesive.
- Result hierarchy is immediately scannable.
- Share/export controls are visually grouped and functionally reliable.
- Original calculation regression passes exactly.
- Main branch is untouched until explicit approval.
