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
        Tracefinity (&quot;we&quot;, &quot;us&quot;). By creating an account or using the
        Service you agree to be bound by these terms in full. If you do not agree,
        do not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        Tracefinity lets you photograph tools, trace their outlines using AI, and generate
        3D-printable Gridfinity bin files. We offer free and paid subscription tiers.
      </p>
      <p>
        The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
        We may modify, suspend, or discontinue the Service (or any part of it) at any time,
        with or without notice, for any reason. We are not liable to you or any third party
        for any modification, suspension, or discontinuation of the Service.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide a valid email address and a password of at least 8 characters.
        You are responsible for all activity under your account and for keeping your
        credentials secure. One account per person. We reserve the right to refuse
        registration or terminate any account at our sole discretion.
      </p>

      <h2>3. Subscriptions and billing</h2>
      <p>
        Paid plans are billed monthly or annually via Stripe. Subscriptions renew
        automatically unless cancelled. You can cancel at any time from your dashboard
        or the Stripe customer portal. Cancellation takes effect at the end of your
        current billing period. You retain access until that period ends.
      </p>
      <p>
        We do not offer refunds for any reason, including partial billing periods,
        unused traces, service dissatisfaction, or early cancellation of annual plans.
        By subscribing you acknowledge and accept this.
      </p>
      <p>
        We reserve the right to change subscription prices at any time. Price changes
        take effect at your next billing cycle.
      </p>

      <h2>4. Usage limits</h2>
      <p>
        Each plan includes a set number of AI traces per calendar month and a tool storage
        limit. When you reach your limit, further traces are blocked until the next month or
        until you upgrade. We may adjust plan limits at any time.
      </p>

      <h2>5. Your content</h2>
      <p>
        You retain ownership of the images you upload and the files we generate for you.
        By uploading content you grant us a limited licence to store, process, and display
        it solely to provide the Service. You may delete your content at any time.
      </p>
      <p>
        You are solely responsible for ensuring you have the right to upload any content.
        We are not responsible for reviewing, verifying, or moderating user content.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for anything unlawful or fraudulent</li>
        <li>Attempt to circumvent usage limits, rate limits, or access controls</li>
        <li>Reverse-engineer, decompile, or scrape the Service</li>
        <li>Upload malicious files, malware, or harmful content</li>
        <li>Create multiple accounts to evade limits or bans</li>
        <li>Use the Service in any way that could damage, disable, or impair it</li>
        <li>Resell, sublicence, or commercially redistribute the Service</li>
      </ul>
      <p>
        We may suspend or terminate your access immediately and without notice if we
        believe you have violated these terms.
      </p>

      <h2>7. AI and generated output</h2>
      <p>
        The Service uses AI (Google Gemini) to trace tool outlines. AI output is
        inherently imprecise and provided without any guarantee of accuracy, completeness,
        or fitness for purpose. Generated STL/3MF files are approximations.
      </p>
      <p>
        You are solely responsible for verifying that generated files are suitable for
        your intended use before 3D printing. We accept no liability whatsoever for
        failed prints, wasted materials, tools that do not fit, damage to printers, or
        any other consequence of using generated files.
      </p>

      <h2>8. Third-party services</h2>
      <p>The Service relies on third-party providers:</p>
      <ul>
        <li><strong>Google Gemini API</strong> for AI image processing</li>
        <li><strong>Stripe</strong> for payment processing</li>
        <li><strong>DigitalOcean</strong> for hosting and file storage</li>
      </ul>
      <p>
        We are not responsible for the availability, performance, or conduct of these
        third-party services. Outages, errors, or changes to third-party services may
        affect the Service and do not entitle you to a refund or compensation.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        To the maximum extent permitted by applicable law, we expressly disclaim all
        warranties, whether express, implied, statutory, or otherwise, including but
        not limited to implied warranties of merchantability, fitness for a particular
        purpose, title, and non-infringement.
      </p>
      <p>
        We do not warrant that the Service will be uninterrupted, error-free, secure,
        or free of viruses or other harmful components. We do not warrant the accuracy
        or reliability of any AI-generated output. We make no commitment regarding
        uptime, data durability, or backup availability.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, in no event shall we be
        liable for any indirect, incidental, special, consequential, punitive, or
        exemplary damages, including but not limited to loss of profits, data, business
        opportunities, goodwill, or other intangible losses, regardless of whether we
        have been advised of the possibility of such damages.
      </p>
      <p>
        Our total aggregate liability to you for all claims arising from or relating to
        the Service shall not exceed the lesser of (a) the amount you have paid us in
        the three (3) months preceding the event giving rise to the claim, or
        (b) fifty euros (&euro;50).
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Tracefinity and its operator
        from and against any claims, damages, losses, liabilities, costs, and expenses
        (including reasonable legal fees) arising from your use of the Service, your
        violation of these terms, or your violation of any rights of a third party.
      </p>

      <h2>12. Data loss</h2>
      <p>
        While we take reasonable precautions, we do not guarantee that your data will be
        preserved. You are responsible for maintaining your own backups of any important
        files. We are not liable for any loss of data, including uploaded images, tool
        libraries, or generated files.
      </p>

      <h2>13. Termination</h2>
      <p>
        We may suspend or terminate your account at any time, for any reason, with or
        without notice. Upon termination, your right to use the Service ceases immediately.
        We may delete your data after termination. You may close your account at any time
        by contacting us.
      </p>
      <p>
        Sections 9 (Disclaimer of warranties), 10 (Limitation of liability), 11
        (Indemnification), and 12 (Data loss) survive termination.
      </p>

      <h2>14. Force majeure</h2>
      <p>
        We are not liable for any failure or delay in performance due to causes beyond
        our reasonable control, including but not limited to acts of God, natural disasters,
        pandemic, war, terrorism, labour disputes, power failures, internet or
        telecommunications failures, government actions, or third-party service outages.
      </p>

      <h2>15. Changes to these terms</h2>
      <p>
        We may update these terms at any time. Changes are effective immediately upon
        posting. Continued use of the Service after changes constitutes acceptance of
        the revised terms. It is your responsibility to review these terms periodically.
      </p>

      <h2>16. Severability</h2>
      <p>
        If any provision of these terms is found to be unenforceable or invalid, that
        provision shall be limited or eliminated to the minimum extent necessary, and
        the remaining provisions shall remain in full force and effect.
      </p>

      <h2>17. Entire agreement</h2>
      <p>
        These terms, together with our Privacy Policy, constitute the entire agreement
        between you and Tracefinity regarding the Service and supersede all prior
        agreements and understandings.
      </p>

      <h2>18. Governing law</h2>
      <p>
        These terms are governed by the laws of Ireland. Any disputes shall be subject
        to the exclusive jurisdiction of the courts of Ireland.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:hello@tracefinity.net">hello@tracefinity.net</a>.
      </p>
    </main>
  );
}
