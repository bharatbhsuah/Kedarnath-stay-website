# Navbar Implementation Specifications

## File Changes
- Updated: `frontend/src/app/shared/components/navbar/navbar.component.ts`
- Updated: `frontend/src/styles.scss`
- Added: `frontend/src/app/pages/navbar-prototype/navbar-prototype.component.ts`
- Updated: `frontend/src/app/app-routing.module.ts`
- Updated: `frontend/src/app/app.module.ts`

## Structural Spec
- Root container: `<header class="site-nav">`
- Desktop layout container: `.site-nav__desktop`
- Desktop link group: `.site-nav__links`
- Mobile menu container: `.site-nav__mobile-panel`
- Mobile links: `.site-nav__mobile-links`
- Action zone: `.site-nav__actions` / `.site-nav__mobile-actions`

## Data Spec
- Navbar links are defined in `links: NavLink[]` with fields:
- `label: string`
- `route: string`
- `tone: 'stay' | 'support' | 'account' | 'admin'`
- `requiresAuth?: boolean`
- `requiresAdmin?: boolean`
- Rendering filter: `visibleLinks` getter

## Accessibility Spec
- Menu button has `aria-label`, `aria-expanded`, and `aria-controls`
- Active links set `aria-current="page"`
- Focus-visible styles are explicit and high-contrast

## Styling Spec
- Sticky and layered: `position: sticky; top: 0; z-index: 50;`
- Semantic variant classes:
- `.nav-tone-stay`
- `.nav-tone-support`
- `.nav-tone-account`
- `.nav-tone-admin`
- Active indicator uses pseudo-element with animated scale

## Prototype Spec
- Route path: `/design/navbar-prototype`
- Purpose: review variant styles, active state, and keyboard focus behavior before production updates
