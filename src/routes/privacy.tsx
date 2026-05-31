import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ResumeCraft Pro" },
      {
        name: "description",
        content: "Privacy policy for ResumeCraft Pro resume builder.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="mt-8 font-display text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-12 space-y-8 text-foreground">
          <section>
            <h2 className="font-display text-2xl font-bold">1. Introduction</h2>
            <p className="mt-3 text-muted-foreground">
              ResumeCraft Pro ("we", "us", "our", or "Company") operates the ResumeCraft Pro website and application.
              This page informs you of our policies regarding the collection, use, and disclosure of personal data when
              you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">2. Information Collection and Use</h2>
            <p className="mt-3 text-muted-foreground">
              We collect several different types of information for various purposes to provide and improve our Service
              to you.
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">Personal Data:</strong> While using our Service, we may ask you to
                provide us with certain personally identifiable information that can be used to contact or identify you
                ("Personal Data"). This may include, but is not limited to:
                <ul className="mt-2 ml-6 space-y-1 list-circle list-inside">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Cookies and Usage Data</li>
                </ul>
              </li>
              <li><strong className="text-foreground">Usage Data:</strong> We may also collect information on how the
                Service is accessed and used ("Usage Data"). This may include information such as your computer's Internet
                Protocol address, browser type, browser version, the pages you visit, the time and date of your visit,
                and other diagnostic data.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">3. Use of Data</h2>
            <p className="mt-3 text-muted-foreground">
              ResumeCraft Pro uses the collected data for various purposes:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer care and support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">4. Security of Data</h2>
            <p className="mt-3 text-muted-foreground">
              The security of your data is important to us, but remember that no method of transmission over the
              Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
              means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">5. Changes to This Privacy Policy</h2>
            <p className="mt-3 text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">6. Contact Us</h2>
            <p className="mt-3 text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Email:</strong> <a href="mailto:iannaz1228@gmail.com" className="text-primary hover:underline">iannaz1228@gmail.com</a></li>
              <li><strong className="text-foreground">GitHub:</strong> <a href="https://github.com/iannaz1228" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/iannaz1228</a></li>
              <li><strong className="text-foreground">Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61588589180451" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">facebook.com/Ian Naz</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
