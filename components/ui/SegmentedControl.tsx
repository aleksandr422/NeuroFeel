"use client";

type SegmentedOption<T extends string | number> = {
  value: T;
  label: string;
};

export function SegmentedControl<T extends string | number>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<SegmentedOption<T>>;
  ariaLabel: string;
}) {
  return (
    <div className="inline-flex rounded-[var(--radius-pill)] bg-[var(--color-primary-100)] p-1" role="tablist" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`rounded-[var(--radius-pill)] px-3 py-1 text-xs transition ${active ? "bg-[var(--color-primary-500)] text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-primary-600)]"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
