# Central Park Investors

Standalone static site migrated from Shopify.

## Vercel Environment Variables

Set these in the Vercel project before using Private Access:

- `CPI_ACCESS_PIN`: the PIN users enter on `/pages/authorized-users/`
- `CPI_ACCESS_REDIRECT_URL`: the URL users are sent to after a valid PIN

The PIN is checked by `/api/cpi-access` and is not stored in public browser code.
