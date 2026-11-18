// Content for the "Engine Room" (back-end) section on the home page.
// Each chapter exists twice: a plain-English version (the default) and a developer version
// (the "Developer view" switch). Same ids, so the badge stamps are the same in both.
// TODO: swap the technology names for what you actually use.

export const backendChapters = [
  {
    id: "flow",
    num: "06",
    stamp: "Journey",
    kicker: "Behind the scenes",
    title: "What happens when you press a button?",
    blurb:
      "Every tap sends a request on a little journey: past a front door, a security desk, a kitchen and an archive. Make things go wrong on purpose and see exactly where it stops.",
    tags: ["Fast", "Secure", "Reliable"],
    hint: "Press Send, then flip a switch and send again.",
    bg: "#4dd2ff",
    fg: "#0a0a0b",
  },
  {
    id: "api",
    num: "07",
    stamp: "Inbox",
    kicker: "Talking to the server",
    title: "How apps talk to each other.",
    blurb:
      "When you send a message on a website, the page quietly asks a server to handle it. Try it below, even with an empty message, and see how the server answers.",
    tags: ["Requests", "Answers", "Error handling"],
    hint: "Pick an action, then press Run. Try sending an empty message.",
    bg: "#ffb84d",
    fg: "#0a0a0b",
  },
  {
    id: "query",
    num: "08",
    stamp: "Search",
    kicker: "Finding things fast",
    title: "Finding the needle in the haystack.",
    blurb:
      "Behind every search box is a database. Pick a filter and watch the list rearrange instantly. Keeping that fast, even with millions of rows, is something I design for.",
    tags: ["Search", "Sorting", "Speed"],
    hint: "Pick a tool, then change the order.",
    bg: "#7cffb2",
    fg: "#0a0a0b",
  },
];

export const backendChaptersDev = [
  {
    ...backendChapters[0],
    kicker: "Request lifecycle",
    title: "Follow a request all the way down.",
    blurb:
      "Gateway, auth, service, cache, database: every hop has a job and a cost. Break it on purpose. Expire the token, spike the traffic, switch the cache, and watch where it stops.",
    tags: ["REST", "JWT", "Caching", "Rate limiting"],
    hint: "Send a request, then flip a switch and send it again.",
  },
  {
    ...backendChapters[1],
    kicker: "API design",
    title: "Endpoints that behave.",
    blurb:
      "Clear routes, honest status codes and validation that explains itself. Run calls against a mock server living in your browser, including the ones that fail.",
    tags: ["Node.js", "REST", "Validation", "Status codes"],
    hint: "Pick an endpoint and run it. Try sending an empty message.",
  },
  {
    ...backendChapters[2],
    kicker: "Data & queries",
    title: "Data that answers fast.",
    blurb:
      "Model it, index it, query it. Filter and sort the table and watch the SQL rewrite itself while the query plan changes with it.",
    tags: ["PostgreSQL", "Indexes", "Query plans"],
    hint: "Pick a technology, then change the sort order.",
  },
];

// The hops in the request-flow demo: a plain-English name and a developer name for each.
export const flowNodes = [
  { id: "client", plain: "You", note: "press a button", dev: "Client", tech: "React app" },
  { id: "gateway", plain: "Front door", note: "stops big crowds", dev: "Gateway", tech: "rate limiting" },
  { id: "auth", plain: "Security desk", note: "checks your pass", dev: "Auth", tech: "JWT" },
  { id: "service", plain: "The kitchen", note: "does the work", dev: "Service", tech: "Node.js" },
  { id: "cache", plain: "Quick shelf", note: "remembers answers", dev: "Cache", tech: "Redis" },
  { id: "db", plain: "The archive", note: "stores everything", dev: "Database", tech: "PostgreSQL" },
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