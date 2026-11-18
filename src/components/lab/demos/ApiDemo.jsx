import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { projects } from "@/data/projects";
import { useDevView } from "@/lib/devview";

const first = projects[0];

// `label` is the friendly button text, `ask` completes the sentence "The page asks the server to ..."
const ENDPOINTS = [
  { id: "list", method: "GET", path: "/api/projects", label: "All projects", ask: "show all of my projects" },
  { id: "one", method: "GET", path: `/api/projects/${first.id}`, label: "One project", ask: "open one project" },
  {
    id: "missing",
    method: "GET",
    path: "/api/projects/does-not-exist",
    label: "A project that isn't there",
    ask: "open a project that doesn't exist",
  },
  { id: "post", method: "POST", path: "/api/messages", label: "Send a message", ask: "pass on a message" },
  { id: "health", method: "GET", path: "/api/health", label: "Is it awake?", ask: "check that it is awake" },
];

const slim = ({ id, title, year, description, tags }) => ({ id, title, year, description, tags });

// A tiny mock server that runs in the browser. Each answer has the developer version (status + JSON)
// and a plain-English version (`plain`).
function handle(ep, body) {
  switch (ep.id) {
    case "list":
      return {
        status: 200,
        json: { count: projects.length, data: projects.map(slim) },
        plain: {
          ok: true,
          headline: `Found ${projects.length} projects`,
          lines: projects.map((p) => `${p.title} (${p.year})`),
        },
      };
    case "one":
      return {
        status: 200,
        json: { data: slim(first) },
        plain: {
          ok: true,
          headline: first.title,
          lines: [first.description, `Built with ${first.tags.join(", ")}`],
        },
      };
    case "missing":
      return {
        status: 404,
        json: { error: "NotFound", message: "No project with that id" },
        plain: {
          ok: false,
          headline: "Couldn't find that one",
          lines: ["The server politely says there's nothing with that name, instead of crashing."],
        },
      };
    case "health":
      return {
        status: 200,
        json: { status: "ok", uptime: "99.98%", version: "1.0.0" },
        plain: { ok: true, headline: "The server is awake and healthy", lines: ["Up 99.98% of the time"] },
      };
    case "post": {
      const message = body.message.trim();
      if (!message) {
        return {
          status: 422,
          json: { error: "ValidationError", field: "message", message: "message is required" },
          plain: {
            ok: false,
            headline: "The server asked for a message first",
            lines: ["It checks everything it receives, so empty or broken data never gets in."],
          },
        };
      }
      const who = body.name.trim() || "anonymous";
      return {
        status: 201,
        json: {
          id: `msg_${Math.random().toString(36).slice(2, 8)}`,
          status: "queued",
          received: { name: who, message },
          createdAt: new Date().toISOString(),
        },
        plain: {
          ok: true,
          headline: "Message received",
          lines: [`From ${who}: “${message}”`, "(This is a demo. Nothing is really sent.)"],
        },
      };
    }
    default:
      return {
        status: 500,
        json: { error: "ServerError" },
        plain: { ok: false, headline: "Something went wrong", lines: [] },
      };
  }
}

// Colour JSON: keys, strings, numbers/booleans.
function Json({ text }) {
  const parts = text.split(/("(?:[^"\\]|\\.)*"\s*:?|\b-?\d+(?:\.\d+)?\b|true|false|null)/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith('"') && p.trimEnd().endsWith(":")) return <span key={i} className="text-[#ffb84d]">{p}</span>;
    if (p.startsWith('"')) return <span key={i} className="text-[#7cffb2]">{p}</span>;
    if (/^(-?\d|true|false|null)/.test(p)) return <span key={i} className="text-[#4dd2ff]">{p}</span>;
    return <span key={i}>{p}</span>;
  });
}

const statusColor = (s) => (s < 300 ? "#7cffb2" : s < 500 ? "#ffb84d" : "#ff6b6b");

export default function ApiDemo({ fg, onExplore }) {
  const dev = useDevView();
  const [sel, setSel] = useState("list");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [shown, setShown] = useState("");
  const timer = useRef(null);

  const ep = ENDPOINTS.find((e) => e.id === sel);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Typewriter reveal of the JSON (developer view only uses it)
  useEffect(() => {
    if (!resp) return undefined;
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 5;
      setShown(resp.text.slice(0, i));
      if (i >= resp.text.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [resp]);

  const pick = (id) => {
    setSel(id);
    setResp(null);
  };

  const run = () => {
    clearTimeout(timer.current);
    onExplore();
    setLoading(true);
    setResp(null);
    const ms = Math.round(18 + Math.random() * 60);
    timer.current = setTimeout(() => {
      const r = handle(ep, { name, message });
      setResp({ status: r.status, ms, text: JSON.stringify(r.json, null, 2), plain: r.plain });
      setLoading(false);
    }, 380);
  };

  const body = ep.method === "POST" ? { name: name || "anonymous", message } : null;
  const inputs = ep.method === "POST";

  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5">
      <div className="flex flex-wrap gap-1.5">
        {ENDPOINTS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => pick(e.id)}
            className="rounded-md px-2 py-1 font-mono text-[11px] transition-colors"
            style={
              sel === e.id
                ? { background: fg, color: "#ffb84d" }
                : { border: `1px solid ${fg}55`, color: fg }
            }
          >
            {dev ? (
              <>
                <b>{e.method}</b> {e.path.replace("/api", "")}
              </>
            ) : (
              e.label
            )}
          </button>
        ))}
      </div>

      {inputs && (
        <div className="grid grid-cols-2 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dev ? "name (optional)" : "Your name (optional)"}
            aria-label="Name"
            className="rounded-md bg-transparent px-3 py-2 font-mono text-xs outline-none placeholder:opacity-50"
            style={{ border: `1px solid ${fg}66`, color: fg }}
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={dev ? "message" : "Your message"}
            aria-label="Message"
            className="rounded-md bg-transparent px-3 py-2 font-mono text-xs outline-none placeholder:opacity-50"
            style={{ border: `1px solid ${fg}66`, color: fg }}
          />
        </div>
      )}

      <div className="rounded-lg bg-ink p-3 font-mono text-[11px] leading-relaxed text-paper">
        {dev ? (
          <>
            <p>
              <span className="text-[#ffb84d]">{ep.method}</span> {ep.path} HTTP/1.1
            </p>
            <p className="text-muted">Authorization: Bearer ••••••</p>
            {body && <p className="text-muted">{JSON.stringify(body)}</p>}
          </>
        ) : (
          <p>
            The page asks the server to <span className="text-[#ffb84d]">{ep.ask}</span>.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-full px-5 py-2 font-mono text-xs font-bold disabled:opacity-50"
          style={{ background: fg, color: "#ffb84d" }}
        >
          {loading ? "Asking..." : dev ? "Run ▶" : "Ask the server ▶"}
        </button>
        {resp && (
          <span className="font-mono text-xs font-bold" style={{ color: "#0a0a0b" }}>
            <span
              className="rounded px-1.5 py-0.5"
              style={{ background: "#0a0a0b", color: statusColor(resp.status) }}
            >
              {dev ? resp.status : resp.status < 400 ? "✓ Success" : "✕ Problem"}
            </span>{" "}
            {resp.ms}ms
          </span>
        )}
      </div>

      <div className="min-h-[110px] flex-1 overflow-auto rounded-lg bg-ink p-3 text-paper">
        {!resp && (
          <p className="font-mono text-[11px] text-muted">
            {dev ? "// response appears here" : "The server's answer appears here."}
          </p>
        )}
        {resp && dev && (
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">
            <Json text={shown} />
          </pre>
        )}
        {resp && !dev && (
          <motion.div
            key={`${resp.ms}-${resp.plain.headline}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p
              className="text-sm font-bold"
              style={{ color: resp.plain.ok ? "#7cffb2" : "#ffb84d" }}
            >
              {resp.plain.headline}
            </p>
            <ul className="mt-2 space-y-1 text-xs leading-snug text-paper/80">
              {resp.plain.lines.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
      <p className="font-mono text-[10px] opacity-60">
        {dev ? "Simulated by a mock server in your browser." : "A pretend server, running right here in your browser."}
      </p>
    </div>
  );
}