# Navbar Responsive States

## Breakpoints
- Mobile: `< 768px`
- Tablet/Desktop: `>= 768px`

## Mobile Behavior
- Compact sticky top bar with brand and menu toggle button
- Toggle opens collapsible panel (`.site-nav__mobile-panel`)
- Navigation appears as stacked links with clear tap targets
- Account actions moved below links in `.site-nav__mobile-actions`
- Menu closes on link click

## Desktop Behavior
- Three-zone layout:
- Brand on left
- Primary/support links in center
- Account/actions on right
- Links are inline and wrap gracefully if required

## State Handling
- Current page indicator via `routerLinkActive="is-active"` + underline bar
- Focus-visible rings for keyboard navigation on links and menu button
- Hover styles only enhance color/border and do not remove readable contrast

## Test Checklist
- Keyboard tab order is logical and visible
- Current route always highlights exactly one nav item
- Mobile menu opens/closes consistently across navigation changes
- No overlap/clipping for long names on narrow devices
