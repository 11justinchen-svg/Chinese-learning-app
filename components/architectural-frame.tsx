function EaveCorner({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 190"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 70C62 72 115 58 166 31c25-13 51-19 84-19" />
      <path d="M16 84c55 0 108-13 157-38 27-14 51-20 75-21" />
      <path d="M54 84v34h151V49" />
      <path d="M82 78v25m94-40v40M67 103h126" />
      <path d="M69 104l16 16h92l16-16M91 120v34m80-34v34" />
      <path d="M85 135h92m-78 0v29m64-29v29m-64-14h64" />
      <circle cx="205" cy="49" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArchitecturalFrame() {
  return (
    <div className="architecture-frame" aria-hidden="true">
      <EaveCorner className="architecture-corner architecture-corner--tl" />
      <EaveCorner className="architecture-corner architecture-corner--tr" />
      <div className="architecture-lattice architecture-lattice--bl" />
      <div className="architecture-lattice architecture-lattice--br" />
    </div>
  );
}
