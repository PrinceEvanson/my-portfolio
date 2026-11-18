import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";

const first = projects[0];

const ENDPOINTS = [
  { id: "list", method: "GET", path: "/api/projects" },
  { id: "one", method: "GET", path: `/api/projects/${first.id}` },
  { id: "missing", method: "GET", path: "/api/projects/does-not-exist" },
  { id: "post", method: "POST", path: "/api/messages" },
  { id: "health", method: "GET", path: "/api/health" },
];

const slim = ({ id, title, year, description, tags }) => ({ id, title, year, description, tags });

// A tiny mock server that runs in the browser. Same shape as a real route handler.
function handle(ep, body) {
  switch (ep.id) {
    case "list":
      return { status: 200, json: { count: projects.length, data: projects.map(slim) } };
    case "one":
      return { status: 200, json: { data: slim(first) } };
    case "missing":
      return { status: 404, json: { error: "NotFound", message: "No project with that id" } };
    case "health":
      return { status: 200, json: { status: "ok", uptime: "99.98%", version: "1.0.0" } };
    case "post": {
      const message = body.message.trim();
      if (!message) {
        return {
          status: 422,
          json: { error: "ValidationError", field: "message", message: "message is required" },
        };
      }
      return {
        status: 201,
        json: {
          id: `msg_${Math.random().toString(36).slice(2, 8)}`,
          status: "queued",
          received: { name: body.name.trim() || "anonymous", message },
          createdAt: new Date().toISOString(),
        },
      };
    }
    default:
      return { status: 500, json: { error: "ServerError" } };
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
  const [sel, setSel] = useState("list");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [shown, setShown] = useState("");
  const timer = useRef(null);

  const ep = ENDPOINTS.find((e) => e.id === sel);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Typewriter reveal of the response body
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
      setResp({ status: r.status, ms, text: JSON.stringify(r.json, null, 2) });
      setLoading(false);
    }, 380);
  };

  const body = ep.method === "POST" ? { name: name || "anonymous", message } : null;

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
            <b>{e.method}</b> {e.path.replace("/api", "")}
          </button>
        ))}
      </div>

      {ep.method === "POST" && (
        <div className="grid grid-cols-2 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name (optional)"
            aria-label="Name"
            className="rounded-md bg-transparent px-3 py-2 font-mono text-xs outline-none placeholder:opacity-50"
            style={{ border: `1px solid ${fg}66`, color: fg }}
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="message"
            aria-label="Message"
            className="rounded-md bg-transparent px-3 py-2 font-mono text-xs outline-none placeholder:opacity-50"
            style={{ border: `1px solid ${fg}66`, color: fg }}
          />
        </div>
      )}

      <div className="rounded-lg bg-ink p-3 font-mono text-[11px] leading-relaxed text-paper">
        <p>
          <span className="text-[#ffb84d]">{ep.method}</span> {ep.path} HTTP/1.1
        </p>
        <p className="text-muted">Authorization: Bearer ••••••</p>
        {body && <p className="text-muted">{JSON.stringify(body)}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-full px-5 py-2 font-mono text-xs font-bold disabled:opacity-50"
          style={{ background: fg, color: "#ffb84d" }}
        >
          {loading ? "Running..." : "Run ▶"}
        </button>
        {resp && (
          <span className="font-mono text-xs font-bold" style={{ color: "#0a0a0b" }}>
            <span
              className="rounded px-1.5 py-0.5"
              style={{ background: "#0a0a0b", color: statusColor(resp.status) }}
            >
              {resp.status}
            </span>{" "}
            {resp.ms}ms
          </span>
        )}
      </div>

      <pre className="min-h-[110px] flex-1 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-ink p-3 font-mono text-[11px] leading-relaxed text-paper">
        {resp ? <Json text={shown} /> : <span className="text-muted">// response appears here</span>}
      </pre>
      <p className="font-mono text-[10px] opacity-60">Simulated by a mock server in your browser.</p>
    </div>
  );
}
