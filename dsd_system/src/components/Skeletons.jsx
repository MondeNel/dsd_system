// src/components/Skeletons.jsx

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-3 w-20 rounded bg-slate-200/70"></div>
        <div className="h-8 w-8 rounded-lg bg-slate-200/70"></div>
      </div>
      <div className="mt-3 h-7 w-16 rounded bg-slate-200/70"></div>
      <div className="mt-2 h-3 w-24 rounded bg-slate-200/70"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse">
      <div className="h-4 w-32 rounded bg-slate-200/70 mb-4"></div>
      <div className="h-56 rounded-xl bg-slate-200/70"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="glass-card overflow-hidden rounded-2xl animate-pulse">
      <div className="p-4 border-b border-white/10">
        <div className="h-4 w-28 rounded bg-slate-200/70"></div>
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-3 flex-1 rounded bg-slate-200/70"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TabsSkeleton() {
  return (
    <div className="flex gap-0 mb-6 border-b border-white/20 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-8 w-20 rounded-t-lg bg-slate-200/70 mr-1"></div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse">
      <div className="flex justify-end mb-2">
        <div className="h-8 w-8 rounded-xl bg-slate-200/70"></div>
      </div>
      <div className="glass-card rounded-2xl p-5 mb-6">
        <div className="h-4 w-32 rounded bg-slate-200/70 mb-3"></div>
        <div className="h-2 w-full rounded-full bg-slate-200/70 mb-3"></div>
        <div className="flex justify-between">
          <div className="h-3 w-20 rounded bg-slate-200/70"></div>
          <div className="h-3 w-20 rounded bg-slate-200/70"></div>
          <div className="h-3 w-20 rounded bg-slate-200/70"></div>
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="h-4 w-28 rounded bg-slate-200/70"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 rounded-xl bg-slate-200/70"></div>
          <div className="h-20 rounded-xl bg-slate-200/70"></div>
        </div>
        <div className="h-20 rounded-xl bg-slate-200/70"></div>
        <div className="flex justify-end">
          <div className="h-9 w-20 rounded-xl bg-slate-200/70"></div>
        </div>
      </div>
    </div>
  );
}

export function CommentsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 animate-pulse">
      <div className="col-span-1 glass-card rounded-2xl p-4">
        <div className="h-4 w-20 rounded bg-slate-200/70 mb-3"></div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-slate-200/70"></div>
          ))}
        </div>
      </div>
      <div className="col-span-2 glass-card rounded-2xl p-5">
        <div className="h-4 w-32 rounded bg-slate-200/70 mb-2"></div>
        <div className="h-3 w-48 rounded bg-slate-200/70 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-200/70"></div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 h-9 rounded-xl bg-slate-200/70"></div>
          <div className="h-9 w-16 rounded-xl bg-slate-200/70"></div>
        </div>
      </div>
    </div>
  );
}