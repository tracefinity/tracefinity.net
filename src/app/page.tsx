import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* hero */}
      <section className="pt-16 pb-20">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08]">
          Photograph tools.
          <br />
          <span className="text-accent">Print storage.</span>
        </h1>
        <p className="mt-5 text-lg text-text-secondary max-w-lg leading-relaxed">
          Place your tools on paper, let AI trace their outlines, and generate
          3D-printable Gridfinity bins that fit them perfectly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Get started free
            <ArrowIcon />
          </Link>
          <a
            href="https://github.com/tracefinity/tracefinity"
            className="inline-flex items-center gap-2 rounded-full bg-elevated border border-white/6 px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-colors"
          >
            <GithubIcon />
            Source
          </a>
        </div>
      </section>

      {/* how it works */}
      <section>
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-accent/10 text-accent text-xs font-semibold px-3 py-1 mb-3">
            How it works
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            From photo to 3D print in minutes
          </h2>
        </div>

        <div className="space-y-6">
          <WorkflowStep
            n={1}
            title="Upload a photo"
            description="Photograph your tools on A4 or Letter paper from above. The paper provides real-world scale calibration."
            image="/screenshots/upload.png"
            alt="Upload interface showing a photographed wrench on paper"
          />
          <WorkflowStep
            n={2}
            title="AI traces the outlines"
            description="Gemini generates precise silhouette masks of each tool. Edit vertices and add finger holes for easy removal."
            image="/screenshots/trace.png"
            alt="AI tracing interface showing the generated mask and tool outline"
            reverse
          />
          <WorkflowStep
            n={3}
            title="Configure and export"
            description="Arrange tools in a Gridfinity bin, tweak dimensions, and export the STL for your 3D printer."
            image="/screenshots/configure.png"
            alt="Bin configuration interface with 3D preview of the generated bin"
          />
        </div>
      </section>

      {/* features */}
      <section className="mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard title="AI-powered tracing">
            Google Gemini generates accurate masks across varied lighting and tool shapes.
          </FeatureCard>
          <FeatureCard title="Drag-and-drop bins">
            Tool library with reusable outlines. Arrange multiple tools in a single bin.
          </FeatureCard>
          <FeatureCard title="Ready to print">
            Export STL or 3MF files. Automatic bin splitting for large grids that exceed bed size.
          </FeatureCard>
        </div>
      </section>

      {/* cta */}
      <section className="mt-20 mb-8 text-center rounded-xl border border-border bg-surface p-10">
        <h2 className="text-xl font-bold tracking-tight">
          Start organising your workshop
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Free plan includes 5 tools. No card required.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Get started free
            <ArrowIcon />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-full bg-elevated border border-white/6 px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-colors"
          >
            See pricing
          </Link>
        </div>
      </section>
    </main>
  );
}

function WorkflowStep({
  n,
  title,
  description,
  image,
  alt,
  reverse,
}: {
  n: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  reverse?: boolean;
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-5 items-center ${reverse ? "sm:flex-row-reverse" : ""}`}>
      <div className="sm:w-2/5 flex-shrink-0">
        <span className="inline-block rounded-full bg-accent/10 text-accent text-xs font-bold w-6 h-6 leading-6 text-center mb-3">
          {n}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
      <div className="sm:w-3/5 rounded-lg overflow-hidden border border-border">
        <Image
          src={image}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold mb-1.5">{title}</h3>
      <p className="text-xs text-text-secondary leading-relaxed">{children}</p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
