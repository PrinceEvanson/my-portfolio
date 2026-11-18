// Infinite horizontal ticker. Content is duplicated so the -50% loop is seamless.
export default function Marquee({ items, className = "" }) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            {item}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
