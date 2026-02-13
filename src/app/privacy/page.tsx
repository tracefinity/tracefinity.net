import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Tracefinity. GDPR-compliant.",
  alternates: { canonical: "https://tracefinity.net/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="pt-12 prose-custom">
      <h1>Privacy Policy</h1>
      <p className="text-text-muted text-sm">Last updated: 13 February 2026</p>

      <p>
        This policy explains how Tracefinity (&quot;we&quot;, &quot;us&quot;) collects, uses,
        and protects your personal data. We are based in Ireland and comply with the
        General Data Protection Regulation (GDPR).
      </p>

      <h2>1. Data we collect</h2>

      <h3>Account data</h3>
      <p>
        When you sign up we collect your email address and an optional display name.
        Your password is hashed with bcrypt and never stored in plain text.
      </p>

      <h3>Uploaded content</h3>
      <p>
        Images you upload, traced outlines, and generated 3D model files (STL/3MF).
        These are stored on DigitalOcean Spaces, isolated per user account.
      </p>

      <h3>Billing data</h3>
      <p>
        Payment details are handled entirely by Stripe. We store your Stripe customer ID
        and subscription status but never see or store your card number.
      </p>

      <h3>Usage data</h3>
      <p>
        We track the number of AI traces you make per month to enforce plan limits.
        We do not use third-party analytics or tracking scripts.
      </p>

      <h2>2. How we use your data</h2>
      <ul>
        <li>To provide and maintain the Service</li>
        <li>To process your images via the Google Gemini API</li>
        <li>To manage your subscription and billing via Stripe</li>
        <li>To enforce usage limits</li>
        <li>To communicate with you about your account (e.g. password resets)</li>
      </ul>

      <h2>3. Third-party processors</h2>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Purpose</th>
            <th>Data shared</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google Gemini API</td>
            <td>AI image processing</td>
            <td>Your uploaded images (processed, not stored by Google)</td>
          </tr>
          <tr>
            <td>Stripe</td>
            <td>Payment processing</td>
            <td>Email, payment method, billing address</td>
          </tr>
          <tr>
            <td>DigitalOcean</td>
            <td>Hosting and file storage</td>
            <td>All Service data (EU/US data centres)</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Cookies</h2>
      <p>We use two cookies, both functional:</p>
      <ul>
        <li>
          <strong>authjs.session-token</strong> -- your login session (httpOnly, secure, same-site)
        </li>
        <li>
          <strong>tracefinity-app-token</strong> -- passes your authentication to the core app
          (secure, same-site, 24h expiry)
        </li>
      </ul>
      <p>
        We do not use advertising, analytics, or any other tracking cookies.
      </p>

      <h2>5. Data retention</h2>
      <p>
        Your data is kept for as long as your account is active. If you delete your account,
        we remove your personal data and uploaded files within 30 days. Anonymised usage
        statistics may be retained.
      </p>

      <h2>6. Your rights (GDPR)</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access</strong> your personal data</li>
        <li><strong>Rectify</strong> inaccurate data</li>
        <li><strong>Erase</strong> your data (&quot;right to be forgotten&quot;)</li>
        <li><strong>Port</strong> your data in a machine-readable format</li>
        <li><strong>Object</strong> to processing</li>
        <li><strong>Restrict</strong> processing</li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:hello@tracefinity.net">hello@tracefinity.net</a>.
        We will respond within 30 days.
      </p>

      <h2>7. Security</h2>
      <p>
        Passwords are hashed with bcrypt. All connections use TLS. File storage is access-controlled
        per user. Database backups are encrypted at rest on DigitalOcean Spaces.
      </p>

      <h2>8. Children</h2>
      <p>
        The Service is not intended for anyone under 16. We do not knowingly collect data
        from children.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy. Material changes will be communicated via email or a
        notice on the site.
      </p>

      <h2>Contact</h2>
      <p>
        Data controller: Tracefinity, Ireland.<br />
        Email: <a href="mailto:hello@tracefinity.net">hello@tracefinity.net</a>
      </p>
    </main>
  );
}
