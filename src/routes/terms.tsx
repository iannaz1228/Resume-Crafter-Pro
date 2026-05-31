import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ResumeCraft Pro" },
      {
        name: "description",
        content: "Terms of service for ResumeCraft Pro resume builder.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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

        <h1 className="mt-8 font-display text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-12 space-y-8 text-foreground">
          <section>
            <h2 className="font-display text-2xl font-bold">1. Acceptance of Terms</h2>
            <p className="mt-3 text-muted-foreground">
              By accessing and using ResumeCraft Pro (the "Service"), you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please do not use this Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">2. Use License</h2>
            <p className="mt-3 text-muted-foreground">
              Permission is granted to temporarily download one copy of the materials (information or software) on
              ResumeCraft Pro for personal, non-commercial transitory viewing only. This is the grant of a license,
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on ResumeCraft Pro</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">3. Disclaimer</h2>
            <p className="mt-3 text-muted-foreground">
              The materials on ResumeCraft Pro are provided on an 'as is' basis. ResumeCraft Pro makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">4. Limitations</h2>
            <p className="mt-3 text-muted-foreground">
              In no event shall ResumeCraft Pro or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
              use the materials on ResumeCraft Pro, even if we or our authorized representative has been notified orally
              or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">5. Accuracy of Materials</h2>
            <p className="mt-3 text-muted-foreground">
              The materials appearing on ResumeCraft Pro could include technical, typographical, or photographic errors.
              ResumeCraft Pro does not warrant that any of the materials on its website are accurate, complete, or current.
              We may make changes to the materials contained on our Service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">6. Links</h2>
            <p className="mt-3 text-muted-foreground">
              ResumeCraft Pro has not reviewed all of the sites linked to its website and is not responsible for the
              contents of any such linked site. The inclusion of any link does not imply endorsement by ResumeCraft Pro of
              the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">7. Modifications</h2>
            <p className="mt-3 text-muted-foreground">
              ResumeCraft Pro may revise these terms of service for its Service at any time without notice. By using this
              Service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">8. Governing Law</h2>
            <p className="mt-3 text-muted-foreground">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in
              which ResumeCraft Pro operates, and you irrevocably submit to the exclusive jurisdiction of the courts in
              that location.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">9. Contact Information</h2>
            <p className="mt-3 text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at:
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
