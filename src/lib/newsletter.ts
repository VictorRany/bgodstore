import "server-only";

/** A newsletter só aparece quando há um webhook configurado (ex.: Mailchimp/Brevo via Zapier/Make). */
export function isNewsletterEnabled() {
  return Boolean(process.env.NEWSLETTER_WEBHOOK_URL);
}
