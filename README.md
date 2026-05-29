# Central Park Investors

Standalone static site migrated from Shopify.

## Vercel Environment Variables

Set these in the Vercel project before using the forms.

### Authorized Users

- `CPI_ACCESS_PIN`: the PIN users enter on `/pages/authorized-users/`
- `CPI_ACCESS_REDIRECT_URL`: the URL users are sent to after a valid PIN

The PIN is checked by `/api/cpi-access` and is not stored in public browser code.

### Contact Us

The contact form posts to `/api/contact` and sends email through Resend.

- `RESEND_API_KEY`: Resend API key used by the serverless function
- `CONTACT_FROM_EMAIL`: verified sender address, for example `Central Park Investors <no-reply@centralparkinvestors.com>`
- `CONTACT_TO_EMAIL`: recipient address; defaults to `ops@centralparkinvestors.com` if omitted
