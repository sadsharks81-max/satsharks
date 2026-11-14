import type { ReactNode } from "react";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { Icon } from "../common/Icon";

export type LegalHighlight = {
  icon: string;
  title: string;
  description: string;
};

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  effectiveDate: string;
  highlights: LegalHighlight[];
  sections: LegalSection[];
};

export function LegalPage({
  eyebrow,
  title,
  summary,
  effectiveDate,
  highlights,
  sections,
}: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-primary py-20 text-on-primary md:py-24">
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 -top-36 h-96 w-96 rounded-full bg-primary-fixed/20 blur-3xl" />
            <div className="absolute -bottom-44 right-0 h-[30rem] w-[30rem] rounded-full bg-secondary-container/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.035)_50%,transparent_100%)]" />
          </div>

          <div className="relative mx-auto max-w-[1200px] px-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                <Icon name="verified_user" className="text-[16px]" />
                {eyebrow}
              </span>
              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                {summary}
              </p>
              <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
                Effective and last updated: {effectiveDate}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-outline-variant/40 bg-surface-container-low py-10">
          <div className="mx-auto grid max-w-[1200px] gap-4 px-6 md:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                  <Icon name={highlight.icon} className="text-[22px]" />
                </div>
                <h2 className="mt-4 font-headline text-lg font-bold text-on-surface">
                  {highlight.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                  On this page
                </p>
                <nav aria-label={`${title} sections`} className="mt-4">
                  <ol className="space-y-1">
                    {sections.map((section, index) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="flex gap-3 rounded-lg px-2 py-2 text-sm leading-5 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                        >
                          <span className="font-mono text-[11px] text-outline">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{section.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>

            <article className="min-w-0 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-2 shadow-sm sm:px-9 lg:px-12">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className={`scroll-mt-28 py-9 ${
                    index !== sections.length - 1 ? "border-b border-outline-variant/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 font-mono text-xs font-semibold text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-on-surface sm:text-[28px]">
                        {section.title}
                      </h2>
                      <div className="mt-5 space-y-4 text-[15px] leading-7 text-on-surface-variant [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h3]:pt-2 [&_h3]:font-headline [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-on-surface [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-on-surface [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
