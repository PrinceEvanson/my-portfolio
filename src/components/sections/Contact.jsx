import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import AppLink from "@/components/transition/AppLink";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

/*
  HOW THE FORM SENDS
  - If VITE_FORM_ENDPOINT is set (e.g. a Formspree URL), the message is
    posted there and lands in your inbox without the visitor leaving the site.
  - If it is NOT set, the form falls back to opening the visitor's email app
    with everything pre-filled, which works the same as your email button.
*/
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

const ease = [0.22, 1, 0.36, 1];
const EMPTY = { name: "", email: "", phone: "", project: "" };

// Underlined input with a floating label.
function Field({ label, name, type = "text", required, textarea, value, onChange, autoComplete }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="relative">
      <Tag
        id={name}
        name={name}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full resize-none border-b border-paper/20 bg-transparent pb-3 pt-6 text-lg text-paper outline-none transition-colors duration-300 focus:border-accent"
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-0 top-6 origin-left font-mono text-sm text-muted transition-all duration-300 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-accent peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90"
      >
        {label}
      </label>
    </div>
  );
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  // idle | sending | sent | opened | error
  const [status, setStatus] = useState("idle");

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot: real people never fill this hidden field.
    if (new FormData(e.currentTarget).get("website")) return;

    setStatus("sending");

    // Fallback: open the visitor's email app with a pre-filled message.
    if (!ENDPOINT) {
      const subject = `New project enquiry from ${values.name}`;
      const body = [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Phone: ${values.phone || "-"}`,
        "",
        "What we're building:",
        values.project,
      ].join("\n");
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      setStatus("opened");
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.project,
          _subject: `New project enquiry from ${values.name}`,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setValues(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const done = status === "sent" || status === "opened";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.5, ease }}
          className="rounded-2xl border border-accent/40 bg-accent/5 p-8 md:p-10"
          role="status"
        >
          <p className="font-mono text-sm text-accent">
            {status === "sent" ? "Message sent" : "Almost there"}
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {status === "sent"
              ? "Thanks, I'll be in touch soon."
              : "Your email app should be open."}
          </h3>
          <p className="mt-3 text-muted">
            {status === "sent"
              ? "Your details came straight to my inbox."
              : "Hit send in your email app and your message is on its way. If nothing opened, use the email button above."}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-8 font-mono text-sm text-accent underline-offset-4 hover:underline"
          >
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease }}
          className="space-y-8"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <Field label="Your name" name="name" required autoComplete="name" value={values.name} onChange={set("name")} />
            <Field label="Email" name="email" type="email" required autoComplete="email" value={values.email} onChange={set("email")} />
          </div>
          <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} />
          <Field label="What are we building?" name="project" textarea required value={values.project} onChange={set("project")} />

          {/* Honeypot (hidden from people, tempting to bots) */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-block rounded-full border border-accent px-8 py-4 font-mono text-sm text-accent transition-colors duration-300 hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send message ↗"}
              </button>
            </Magnetic>

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-400"
                  role="alert"
                >
                  Something went wrong. Please try again or use the email button.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-32 md:px-12 md:py-48">
      <Reveal>
        <p className="mb-10 font-mono text-sm text-accent">( 01 ) Contact</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="text-[11vw] font-bold leading-[0.9] tracking-tighter md:text-[8vw]">
          Let&apos;s build something.
        </h2>
      </Reveal>
      <Reveal delay={0.2} className="mt-12">
        <Magnetic>
          <AppLink
            href={`mailto:${profile.email}`}
            className="inline-block rounded-full border border-accent px-8 py-4 font-mono text-sm text-accent transition-colors duration-300 hover:bg-accent hover:text-ink"
          >
            {profile.email}
          </AppLink>
        </Magnetic>
      </Reveal>

      <Reveal delay={0.3} className="mt-24">
        <ul className="flex gap-8 font-mono text-sm text-muted">
          {socials.map((s) => (
            <li key={s.label}>
              <AppLink href={s.href} className="transition-colors hover:text-accent">
                {s.label} ↗
              </AppLink>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Alternative: contact form (centered) */}
      <Reveal delay={0.15} className="mx-auto mt-24 max-w-2xl md:mt-32">
        <p className="mb-8 text-center font-mono text-sm text-muted">
          tell me about it here
        </p>
        <ContactForm />
      </Reveal>
    </section>
  );
}