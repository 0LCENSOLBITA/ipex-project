import { Link } from "@tanstack/react-router";

export function ClientHeader({ step }: { step?: { current: number; total: number; label: string } }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-navy text-primary-foreground">
            <span className="font-display text-sm font-semibold">i</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-tight text-navy">IPEX</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Submission Portal</div>
          </div>
        </Link>

        {step ? (
          <div className="hidden items-center gap-4 md:flex">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Step {step.current} of {step.total}
            </span>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-sage transition-all duration-500"
                style={{ width: `${(step.current / step.total) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">{step.label}</span>
          </div>
        ) : (
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link to="/" hash="process" className="hover:text-foreground">How it works</Link>
            <Link to="/submit/business-unit" className="hover:text-foreground">Submit</Link>
            <Link to="/admin" className="hover:text-foreground">Admin</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-xs text-muted-foreground">Powered by</div>
            <div className="text-xs font-medium tracking-wide text-foreground">STAAK</div>
          </div>
        </div>
      </div>
    </header>
  );
}
