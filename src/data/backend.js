export const backendChapters = [
  {
    id: "flow",
    num: "06",
    stamp: "Flow",
    kicker: "Request lifecycle",
    title: "Follow a request all the way down.",
    blurb:
      "Gateway, auth, service, cache, database: every hop has a job and a cost. Break it on purpose. Expire the token, spike the traffic, switch the cache, and watch where it stops.",
    tags: ["REST", "JWT", "Caching", "Rate limiting"],
    hint: "Send a request, then flip a switch and send it again.",
    bg: "#4dd2ff",
    fg: "#0a0a0b",
  },
  {
    id: "api",
    num: "07",
    stamp: "API",
    kicker: "API design",
    title: "Endpoints that behave.",
    blurb:
      "Clear routes, honest status codes and validation that explains itself. Run calls against a mock server living in your browser, including the ones that fail.",
    tags: ["Node.js", "REST", "Validation", "Status codes"],
    hint: "Pick an endpoint and run it. Try sending an empty message.",
    bg: "#ffb84d",
    fg: "#0a0a0b",
  },
  {
    id: "query",
    num: "08",
    stamp: "Query",
    kicker: "Data & queries",
    title: "Data that answers fast.",
    blurb:
      "Model it, index it, query it. Filter and sort the table and watch the SQL rewrite itself while the query plan changes with it.",
    tags: ["PostgreSQL", "Indexes", "Query plans"],
    hint: "Pick a technology, then change the sort order.",
    bg: "#7cffb2",
    fg: "#0a0a0b",
  },
];

// The hops in the request-flow demo.
export const flowNodes = [
  { id: "client", label: "Client", tech: "React app" },
  { id: "gateway", label: "Gateway", tech: "rate limiting" },
  { id: "auth", label: "Auth", tech: "JWT" },
  { id: "service", label: "Service", tech: "Node.js" },
  { id: "cache", label: "Cache", tech: "Redis" },
  { id: "db", label: "Database", tech: "PostgreSQL" },
];

// Sample rows for the query demo. Replace with real project names if you like.
export const queryRows = [
  { id: 1, name: "Orders API", stack: ["Node.js", "PostgreSQL", "Redis"], year: 2026 },
  { id: 2, name: "Auth Service", stack: ["Node.js", "MongoDB"], year: 2025 },
  { id: 3, name: "Realtime Chat", stack: ["Node.js", "React"], year: 2025 },
  { id: 4, name: "Analytics Dashboard", stack: ["React", "PostgreSQL"], year: 2026 },
  { id: 5, name: "File Uploader", stack: ["Node.js", "React"], year: 2024 },
  { id: 6, name: "Job Queue", stack: ["Node.js", "Redis"], year: 2024 },
  { id: 7, name: "Booking Platform", stack: ["React", "Node.js", "PostgreSQL"], year: 2023 },
];
