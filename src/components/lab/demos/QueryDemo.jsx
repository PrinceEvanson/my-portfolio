import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { queryRows } from "@/data/backend";

const SORTS = [
  { id: "year-desc", label: "Newest", sql: "ORDER BY year DESC", fn: (a, b) => b.year - a.year },
  { id: "year-asc", label: "Oldest", sql: "ORDER BY year ASC", fn: (a, b) => a.year - b.year },
  { id: "name", label: "A–Z", sql: "ORDER BY name ASC", fn: (a, b) => a.name.localeCompare(b.name) },
];

// Technologies that appear on at least two rows become filter chips.
const TAGS = (() => {
  const count = {};
  queryRows.forEach((r) => r.stack.forEach((t) => (count[t] = (count[t] || 0) + 1)));
  return Object.keys(count).filter((t) => count[t] >= 2);
})();

const KEYWORDS = /\b(SELECT|FROM|WHERE|ORDER BY|ANY|DESC|ASC)\b/g;

function Sql({ text }) {
  return text.split(KEYWORDS).map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-[#7cffb2]">
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

// Change the filter or sort and watch the SQL rewrite itself and the rows rearrange.
export default function QueryDemo({ fg, onExplore }) {
  const [tag, setTag] = useState(null);
  const [sortId, setSortId] = useState("year-desc");
  const sort = SORTS.find((s) => s.id === sortId);

  const rows = useMemo(
    () => queryRows.filter((r) => !tag || r.stack.includes(tag)).sort(sort.fn),
    [tag, sort]
  );

  const sql = `SELECT id, name, year FROM projects${
    tag ? ` WHERE '${tag}' = ANY(stack)` : ""
  } ${sort.sql};`;
  const plan = tag ? "Index Scan using idx_projects_stack" : "Seq Scan on projects";
  const ms = (0.12 + rows.length * 0.05).toFixed(2);

  const choose = (setter, value) => {
    setter(value);
    onExplore();
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5">
      <div className="flex flex-wrap gap-1.5">
        {[null, ...TAGS].map((t) => (
          <button
            key={t ?? "all"}
            type="button"
            onClick={() => choose(setTag, t)}
            className="rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors"
            style={
              tag === t
                ? { background: fg, color: "#7cffb2" }
                : { border: `1px solid ${fg}55`, color: fg }
            }
          >
            {t ?? "All"}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        {SORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => choose(setSortId, s.id)}
            className="rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors"
            style={
              sortId === s.id
                ? { background: fg, color: "#7cffb2" }
                : { border: `1px solid ${fg}55`, color: fg }
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <pre className="whitespace-pre-wrap break-words rounded-lg bg-ink p-3 font-mono text-[11px] leading-relaxed text-paper">
        <Sql text={sql} />
      </pre>

      <ul className="flex min-h-[150px] flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {rows.map((r) => (
            <motion.li
              key={r.id}
              layout
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="flex shrink-0 items-center justify-between gap-3 rounded-lg bg-ink px-3 py-1.5 text-paper"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{r.name}</span>
                <span className="block truncate font-mono text-[10px] text-muted">
                  {r.stack.join(" · ")}
                </span>
              </span>
              <span className="font-mono text-xs text-[#7cffb2]">{r.year}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <p className="font-mono text-[11px] opacity-80">
        {rows.length} {rows.length === 1 ? "row" : "rows"} · {ms}ms · {plan}
      </p>
    </div>
  );
}
