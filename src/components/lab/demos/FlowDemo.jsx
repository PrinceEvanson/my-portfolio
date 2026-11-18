import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { flowNodes } from "@/data/backend";
import { useDevView } from "@/lib/devview";

const ROW = 34;
const TONE = { ok: "#7cffb2", warn: "#ffb84d", bad: "#ff6b6b", dim: "#8b8b94" };
const NODE_COLOR = { idle: "#8b8b94", ok: "#7cffb2", warn: "#ffb84d", error: "#ff6b6b", skip: "#8b8b94" };

// Work out what each hop does for the chosen switches. Every line has a plain-English text and a
// developer text. Pure function: easy to read, easy to extend.
function buildSteps({ cache, token, traffic, warm }) {
  const steps = [];
  let ms = 0;
  const push = (node, status, plain, dev, cost, tone = "ok") => {
    ms += cost;
    steps.push({ node, status, tone, plain, dev: cost ? `${dev}  ${cost}ms` : dev });
  };
  const finish = (code, label, plain, warmNext = warm, good = code < 400) => {
    const last = steps[steps.length - 1];
    last.result = { code, label, plain, ms, good };
    last.warm = warmNext;
    return steps;
  };

  push(0, "ok", "You ask to see order #42", "GET /api/orders/42", 0);

  if (traffic === "spike") {
    push(1, "error", "Front door: too many people at once. Please wait.", "429 rate limit exceeded", 3, "bad");
    return finish(429, "Too Many Requests", "Too busy, try again in a moment");
  }
  push(1, "ok", "Front door: not too busy, come in", "rate limit ok (97/100 per min)", 3);

  if (token === "expired") {
    push(2, "error", "Security desk: your pass has expired", "401 token expired", 5, "bad");
    return finish(401, "Unauthorized", "Please sign in again");
  }
  push(2, "ok", "Security desk: your pass is good", "JWT verified", 5);
  push(3, "ok", "Kitchen: working on it", "handler getOrder(42)", 4);

  if (cache && warm) {
    push(4, "ok", "Quick shelf: already had it ready!", "cache HIT", 2);
    push(5, "skip", "Archive: no need to visit this time", "database skipped", 0, "dim");
    return finish(200, "OK (from cache)", "Success, straight from the quick shelf", true);
  }

  if (cache) push(4, "warn", "Quick shelf: not there yet", "cache MISS", 2, "warn");
  else push(4, "skip", "Quick shelf: switched off", "cache disabled", 0, "dim");

  push(
    5,
    "ok",
    cache ? "Archive: found it, and left a copy on the shelf" : "Archive: found it",
    cache ? "SELECT ... id=42, then cache SET" : "SELECT ... id=42 (index scan)",
    18
  );
  return finish(200, "OK", "Success", cache);
}

function Seg({ label, value, options, onChange, fg }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-mono text-[11px] opacity-70">{label}</span>
      <div className="flex overflow-hidden rounded-md" style={{ border: `1px solid ${fg}55` }}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className="px-2.5 py-1 font-mono text-[11px] transition-colors"
            style={value === o.value ? { background: fg, color: "#4dd2ff" } : { color: fg }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Send a request through the front door, security desk, kitchen, shelf and archive, and watch each stop.
export default function FlowDemo({ fg, onExplore }) {
  const dev = useDevView();
  const [cache, setCache] = useState(false);
  const [token, setToken] = useState("valid");
  const [traffic, setTraffic] = useState("normal");
  const [warm, setWarm] = useState(false);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(null);
  const [statuses, setStatuses] = useState(() => flowNodes.map(() => "idle"));
  const [log, setLog] = useState([]);
  const [result, setResult] = useState(null);
  const [runId, setRunId] = useState(0);
  const timers = useRef([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const run = () => {
    clear();
    onExplore();
    const steps = buildSteps({ cache, token, traffic, warm });
    setStatuses(flowNodes.map(() => "idle"));
    setLog([]);
    setResult(null);
    setRunId((n) => n + 1);
    setPos(0);
    setRunning(true);

    steps.forEach((s, i) => {
      timers.current.push(
        setTimeout(() => {
          setPos(s.node);
          setStatuses((prev) => prev.map((v, idx) => (idx === s.node ? s.status : v)));
          setLog((l) => [...l, { plain: s.plain, dev: s.dev, tone: s.tone }]);
          if (i === steps.length - 1) {
            setResult(s.result);
            setWarm(s.warm);
            setRunning(false);
          }
        }, 450 * (i + 1))
      );
    });
  };

  // Turning the shelf off empties it, so the next run has to visit the archive again.
  const toggleCache = (v) => {
    setCache(v);
    if (!v) setWarm(false);
  };

  const failed = result && !result.good;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative shrink-0" style={{ height: ROW * flowNodes.length }}>
        <span className="absolute bottom-4 left-[15px] top-4 w-px" style={{ background: `${fg}44` }} />
        {flowNodes.map((n, i) => {
          const st = statuses[i];
          const color = NODE_COLOR[st];
          return (
            <div
              key={n.id}
              className="absolute left-0 right-0 flex items-center gap-3"
              style={{ top: i * ROW, height: ROW }}
            >
              <span
                className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors duration-300"
                style={{ borderColor: color, color, background: "#0a0a0b" }}
              >
                {st === "ok" ? "✓" : st === "error" ? "✕" : st === "skip" ? "–" : i + 1}
              </span>
              <span className="whitespace-nowrap text-sm font-semibold">{dev ? n.dev : n.plain}</span>
              <span className="min-w-0 truncate font-mono text-[11px] opacity-60">
                {dev ? n.tech : n.note}
              </span>
            </div>
          );
        })}
        <motion.span
          className="absolute left-[9px] z-20 h-3 w-3 rounded-full"
          style={{ background: failed ? "#ff6b6b" : fg, boxShadow: `0 0 0 4px ${fg}33` }}
          initial={false}
          animate={{ top: (pos ?? 0) * ROW + ROW / 2 - 6, opacity: pos === null ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        />
      </div>

      <div className="grid gap-1.5">
        <Seg
          label={dev ? "Cache" : "Quick shelf"}
          fg={fg}
          value={cache}
          onChange={toggleCache}
          options={[
            { value: false, label: "off" },
            { value: true, label: "on" },
          ]}
        />
        <Seg
          label={dev ? "Token" : "Your pass"}
          fg={fg}
          value={token}
          onChange={setToken}
          options={[
            { value: "valid", label: dev ? "valid" : "good" },
            { value: "expired", label: "expired" },
          ]}
        />
        <Seg
          label={dev ? "Traffic" : "Crowd"}
          fg={fg}
          value={traffic}
          onChange={setTraffic}
          options={[
            { value: "normal", label: "normal" },
            { value: "spike", label: dev ? "spike" : "rush hour" },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="rounded-full px-5 py-2 font-mono text-xs font-bold transition-opacity disabled:opacity-50"
          style={{ background: fg, color: "#4dd2ff" }}
        >
          {running ? "On its way..." : "Send request"}
        </button>
        {result && (
          <motion.span
            key={runId}
            className="rounded-md bg-ink px-2.5 py-1.5 font-mono text-xs font-bold"
            style={{ color: failed ? "#ff6b6b" : "#7cffb2" }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            {dev ? `${result.code} ${result.label}` : result.plain} · {result.ms}ms
          </motion.span>
        )}
      </div>
      {!dev && result && !failed && (
        <p className="font-mono text-[11px] opacity-70">
          {result.ms} milliseconds. A blink takes about 300.
        </p>
      )}

      <div className="min-h-[96px] flex-1 overflow-hidden rounded-lg bg-ink p-3 font-mono text-[11px] leading-relaxed text-paper">
        {log.length === 0 && (
          <p className="text-muted">{dev ? "$ waiting for a request..." : "Press “Send request” to begin."}</p>
        )}
        {log.slice(-6).map((l, i) => (
          <p key={`${i}-${l.plain}`} style={{ color: TONE[l.tone] }}>
            <span className="text-muted">› </span>
            {dev ? l.dev : l.plain}
          </p>
        ))}
      </div>
    </div>
  );
}