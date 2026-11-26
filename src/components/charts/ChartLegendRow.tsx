export function ChartLegendRow({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-3 text-[.85rem] text-muted-foreground">
      {items.map(([color, label]) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <i className="inline-block size-3 rounded-lg" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}
