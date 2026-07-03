import Link from 'next/link';
import { ArrowRight, CheckCircle2, LayoutDashboard, Scale, FileBarChart, Settings2 } from 'lucide-react';

const features = [
  { icon: LayoutDashboard, title: 'Automated Allocation', desc: 'Rule-based and scoring-driven course assignment that factors in specialization, rank, and experience.' },
  { icon: Scale, title: 'Fair Workload Balancing', desc: 'Dynamic workload tracking prevents overload and keeps distribution equitable across the department.' },
  { icon: Settings2, title: 'Configurable Policy Engine', desc: 'Adjust workload limits and scoring weights from the interface — no code changes required.' },
  { icon: FileBarChart, title: 'Instant Reporting', desc: 'Generate and export allocation summaries, workload reports, and level-based lists as PDF.' },
];

export default function Home() {
  return (
    <div className="dashboard-content-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5 font-bold text-lg text-[var(--text)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-[#12203d] font-extrabold">
            EA
          </div>
          EduAlloc
        </div>
        <Link href="/dashboard" className="dashboard-primary-btn">
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-panel)] px-4 py-1.5 text-xs font-semibold text-[var(--primary-strong)]">
          Built for Higher Institutions
        </span>
        <h1 className="mt-6 panel-section-title text-4xl sm:text-5xl lg:text-9xl">
          Course allocation, <span className="text-[var(--primary)]">without the spreadsheet chaos</span>
        </h1>
        <p className="mt-5 text-lg text-[var(--text-soft)] max-w-2xl mx-auto">
          Replace manual, error-prone course assignment with a system that balances lecturer workload,
          respects specialization, and keeps the HOD in full control.
        </p>
        <div className="mt-9 flex justify-center gap-4">
          <Link href="/dashboard" className="dashboard-primary-btn px-7 py-3.5 text-base">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="dashboard-card p-6">
            <div className="icon-tile mb-5">
              <f.icon className="h-5 w-5 text-[var(--primary)]" strokeWidth={2.2} />
            </div>
            <h3 className="font-semibold text-[var(--text)] mb-2">{f.title}</h3>
            <p className="text-sm text-[var(--text-soft)] leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="dashboard-panel p-8 flex flex-wrap items-center gap-6 justify-between">
          <div className="flex items-center gap-3 text-[var(--text-soft)]">
            <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
            HOD retains full override authority on every allocation decision.
          </div>
          <Link href="/dashboard" className="dashboard-primary-btn">Explore the system</Link>
        </div>
      </section>
    </div>
  );
}