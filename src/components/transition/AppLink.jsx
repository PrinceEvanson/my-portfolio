import { classify } from "@/lib/links";
import { site } from "@/config/site";
import { usePageTransition } from "./TransitionProvider";

// Use this instead of <a> everywhere.
//  - external links (other websites): cue animation, then a new tab
//  - internal links (other pages of this portfolio): page wipe, then the page loads in the SAME tab
// Both are configurable in src/config/site.js.
// Ctrl/Cmd/Shift/middle-click still behave like normal browser links.
export default function AppLink({ href, label, children, onClick, ...rest }) {
  const { navigate } = usePageTransition();
  const kind = classify(href);
  const opensTab =
    (kind === "external" && site.externalNewTab) || (kind === "internal" && site.internalNewTab);

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    if (kind === "self") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (kind === "hash" || kind === "mail") return; // browser handles these natively

    e.preventDefault();
    navigate(href, { label, kind });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      {...(opensTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
