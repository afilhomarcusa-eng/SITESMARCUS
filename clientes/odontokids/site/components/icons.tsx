const base = {
  className: "ico",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowUpRight() {
  return <svg {...base}><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>;
}

export function ArrowDown() {
  return <svg {...base}><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg>;
}

export function ArrowDownRight() {
  return <svg {...base}><path d="M7 7 17 17" /><path d="M17 9v8H9" /></svg>;
}

export function ArrowLeft() {
  return <svg {...base}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></svg>;
}

export function Pointer() {
  return (
    <svg {...base} strokeWidth={2}>
      <path d="M10 9.5V4a1.9 1.9 0 0 1 3.8 0v6" />
      <path d="M13.8 10.4V9.2a1.8 1.8 0 0 1 3.6 0v1.6" />
      <path d="M17.4 11.4a1.8 1.8 0 0 1 3.6 0v3.3a6 6 0 0 1-6 6h-1.7a5 5 0 0 1-3.9-1.9l-3.2-4a1.8 1.8 0 0 1 2.7-2.4l2.1 2.2" />
    </svg>
  );
}

export function ChevronDown() {
  return <svg {...base}><path d="m6 9 6 6 6-6" /></svg>;
}
