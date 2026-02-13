import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Tracefinity.",
  alternates: { canonical: "https://tracefinity.net/terms" },
};

export default function TermsPage() {
  return (
    <main className="pt-12 prose-custom">
      <h1>Terms of Service</h1>
      <p className="text-text-muted text-sm">Last updated: 13 February 2026</p>

      <p>
        These terms govern your use of Tracefinity (&quot;the Service&quot;), operated by
        Tracefinity (&quot;we&quot;, &quot;us&quot;). By using the Service you agree to these terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        Tracefinity lets you photograph tools, trace their outlines using AI, and generate
        3D-printable Gridfinity bin files. We offer free and paid subscription tiers.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide a valid email address and a password of at least 8 characters.
        You are responsible for keeping your credentials secure. One account per person.
      </p>

      <h2>3. Subscriptions and billing</h2>
      <p>
        Paid plans are billed monthly or annually via Stripe. You can cancel at any time
        from your dashboard or the Stripe customer portal. Cancellation takes effect at the
        end of your current billing period. We do not offer refunds for partial periods.
      </p>
      <p>
        We reserve the right to change pricing with 30 days notice. Existing subscriptions
        continue at their current price until renewed.
      </p>

      <h2>4. Usage limits</h2>
      <p>
        Each plan includes a set number of AI traces per calendar month and a tool storage
        limit. When you reach your limit, further traces are blocked until the next month or
        until you upgrade.
      </p>

      <h2>5. Your content</h2>
      <p>
        You retain ownership of the images you upload and the files we generate for you.
        We store your content to provide the Service and do not use it for any other purpose.
        You may delete your content at any time.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for anything unlawful</li>
        <li>Attempt to circumvent usage limits or access controls</li>
        <li>Reverse-engineer or scrape the Service</li>
        <li>Upload malicious files or content</li>
        <li>Create multiple free accounts to evade limits</li>
      </ul>

      <h2>7. Third-party services</h2>
      <p>The Service uses:</p>
      <ul>
        <li><strong>Google Gemini API</strong> to process your images and generate tool outlines</li>
        <li><strong>Stripe</strong> to handle payments and subscriptions</li>
        <li><strong>DigitalOcean Spaces</strong> to store your files</li>
      </ul>
      <p>Your use of these services is subject to their respective terms.</p>

      <h2>8. Availability and warranties</h2>
      <p>
        The Service is provided &quot;as is&quot;. We aim for high availability but do not
        guarantee uninterrupted service. AI tracing results may vary in quality.
        We are not liable for 3D prints that do not fit as expected.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our total liability to you is limited to
        the amount you have paid us in the 12 months preceding the claim.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or terminate your account if you violate these terms. You may close
        your account at any time by contacting us.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms. Material changes will be communicated via email or a
        notice on the site. Continued use after changes constitutes acceptance.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the laws of Ireland. Any disputes shall be resolved
        in the courts of Ireland.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:hello@tracefinity.net">hello@tracefinity.net</a>.
      </p>
    </main>
  );
}
