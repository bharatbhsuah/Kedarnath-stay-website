# Navbar Component Library

## Base Component
- Component: `NavbarComponent`
- Path: `frontend/src/app/shared/components/navbar/navbar.component.ts`
- Style namespace: `.site-nav*`

## Link Variants
- `nav-tone-stay`: Core discovery paths (`Home`, `Rooms`, `Tents`)
- `nav-tone-support`: Support/info paths (`About Us`, `Enquiry`)
- `nav-tone-account`: User account paths (`My Bookings`)
- `nav-tone-admin`: Admin access (`Admin`)

## Interaction States
- Default: transparent border, semantic text color by tone
- Hover: white background and tone-specific border color
- Active (current page): `is-active` class with bottom indicator bar (`::after`)
- Focus: `:focus-visible` with blue accessible ring (`2px`, offset `2px`)

## Action Controls
- `Login`: `btn-primary`
- `Logout`: `btn-gold`
- Welcome label: `.site-nav__welcome`

## Prototype Preview
- Route: `/design/navbar-prototype`
- Component: `NavbarPrototypeComponent`
- Path: `frontend/src/app/pages/navbar-prototype/navbar-prototype.component.ts`
