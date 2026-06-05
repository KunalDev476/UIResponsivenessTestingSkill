# Platform Adapters (optional fallbacks)

Detect first; apply only matching adapter. Generic selectors always win.

## Detection

| Platform | Signals |
|----------|---------|
| WordPress | `wp-content`, `wp-json`, `#wpadminbar` (must be hidden for anonymous) |
| Elementor | `.elementor`, `.elementor-section`, elementor assets |
| Astra | `astra-theme`, `.ast-*`, astra styles |
| Gutenberg | `.wp-block-*` |

## Elementor media (important)

Many Elementor pages have **no** `main img`. Include:

`.elementor-section img`, `.elementor-widget-image img`, `.elementor-widget-image img`

## Exclusion

Platform adapters do not override header/footer exclusion rules.
