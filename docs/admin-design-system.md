# Enterprise Admin Design System

## 1. Atomic Design Layers

### Tokens (Foundation)
- Spacing scale: `--admin-space-1` to `--admin-space-6`
- Radius scale: `--admin-radius-sm|md|lg`
- Semantic surfaces:
  - `--admin-header-bg`
  - `--admin-row-hover`
  - `--admin-border`
  - `--admin-text-muted`

### Components
- Buttons:
  - `.btn-primary`
  - `.btn-secondary`
  - `.btn-tertiary`
  - `.btn-danger`
  - `.btn-success`
  - `.btn-gold`
- Table primitives (within `.admin-shell`):
  - Header sizing/weight/spacing
  - Row hover feedback
  - Uniform cell vertical rhythm
- Status chips:
  - `.status-pill.pending|confirmed|cancelled|completed|read`
- Utility semantics:
  - `.admin-ref` for booking/reference IDs
  - `.admin-subtext` for metadata
  - `.admin-actions` for non-overlapping action clusters

### Patterns
- Filter toolbar card + action row
- List card with scroll-safe table container
- Grouped list blocks (hotel-wise, role-wise)
- Status + metadata stacked cell pattern

## 2. Grid and Spacing Baseline
- Admin root shell: `.admin-shell`
- Card internal spacing:
  - Desktop: `p-4`/`p-5`
  - Compact mobile: `p-3`/`p-4`
- Table cell rhythm:
  - Header/body paddings standardized in global CSS

## 3. Interactive States
- Hover: row highlight and button color shifts
- Focus: `:focus-visible` ring for all button variants
- Disabled: opacity + cursor for all button variants
- Loading: existing spinner preserved and aligned with cards
- Error: red bordered alert blocks in list pages
- Success/action confirmation: distinct `.btn-success` for payment approval

## 4. Responsiveness Rules
- Shared table behavior for admin pages under `.admin-shell`
- Horizontal safety with `.overflow-x-auto`
- Mobile typography/button compaction in media queries (`<=768px`)
- Minimum table width adjusted for readability (`980px`, `860px` on smaller screens)

## 5. Date/Reference Readability
- Booking and enquiry dates now formatted to `DD Mon YYYY` / local datetime style
- Booking references rendered in monospace pill (`.admin-ref`) for quick scan and copy

## 6. Consistency Guarantees
- All admin list tables now follow one visual language:
  - consistent header hierarchy
  - consistent action grouping
  - consistent status semantics
  - consistent spacing and touch target behavior
