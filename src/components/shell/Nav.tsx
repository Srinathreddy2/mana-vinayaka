"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const INSTAGRAM_URL = "https://www.instagram.com/yerraballi_committee_kurrollu/";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/years", label: "Years" },
  { href: "/memories", label: "Memories" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed header.
 *
 * Transparent and wide at the top of the page; past 24px it contracts
 * into a floating glass pill and drops the sub-label under the wordmark.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { openComposer } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 24);

      if (currentScrollY <= 20) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling down -> hide navbar smoothly
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show navbar smoothly
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isHeaderVisible = visible || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 py-4 transition-all duration-500 ease-out md:py-6 ${
          isHeaderVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="gutter">
          <div
            className={`shell flex items-center justify-between rounded-full transition-[background-color,border-color,box-shadow,padding,transform] duration-500 ${
              scrolled
                ? "glass px-4 py-2.5 shadow-[0_18px_50px_-24px_rgb(0_0_0/0.9)] md:px-5"
                : "px-0 py-1"
            }`}
          >
            <Link href="/" className="group flex items-center gap-3" aria-label="Mana Vinayaka home">
              <Lamp />
              <span className="flex flex-col leading-none">
                <span className="whitespace-nowrap font-display text-[1.0625rem] tracking-tight text-bone-50">
                  Mana Vinayaka
                </span>
                <AnimatePresence initial={false}>
                  {!scrolled && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="mt-1 overflow-hidden text-[0.5625rem] font-semibold tracking-[0.24em] whitespace-nowrap text-brass-500/80 uppercase"
                    >
                      Our celebrations · Our memories
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300 ${
                      active ? "text-brass-300" : "text-bone-300 hover:text-bone-50"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-brass-500/30 bg-brass-500/10"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              {/* Instagram Icon Circular Button */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="grid size-10 place-items-center rounded-full border border-brass-500/30 bg-ink-950/60 text-bone-100 transition-all duration-300 hover:scale-105 hover:border-brass-400 hover:text-brass-300"
              >
                <InstagramIcon />
              </a>

              {/* Contact / External Link Pill Button matching Team Thunders reference */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on Instagram"
                className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-brass-300 via-brass-400 to-brass-500 px-4 py-2 font-sans text-xs font-bold text-ink-950 shadow-[0_0_20px_rgba(232,176,75,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(232,176,75,0.6)]"
              >
                <span>Contact</span>
                <ArrowUpRightIcon />
              </a>

              {/* Mobile menu burger button */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="hairline grid size-10 place-items-center rounded-full text-bone-100 transition-colors hover:border-brass-400/60 hover:text-brass-300 lg:hidden"
              >
                {menuOpen ? <Close /> : <Burger />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

/** Full-screen overlay menu: oversized numbered links, staggered in. */
function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const { openComposer } = useStore();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-0 z-30 flex flex-col justify-center bg-ink-950/97 backdrop-blur-xl lg:hidden"
        >
          <nav className="gutter flex flex-col gap-1">
            {LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.6, delay: 0.06 + i * 0.07, ease: EASE }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={`flex items-baseline gap-4 border-b border-brass-500/10 py-5 font-display text-4xl transition-colors sm:text-5xl ${
                    isActive(pathname, link.href) ? "text-brass-300" : "text-bone-100"
                  }`}
                >
                  <span className="font-sans text-[0.625rem] tracking-[0.2em] text-brass-500/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="gutter mt-12 flex flex-col gap-5"
          >
            <span className="font-deva text-brass-400">గణపతి బాప్పా మోరియా</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                openComposer();
              }}
              className="btn btn-primary btn-lg self-start"
            >
              <Plus />
              Add Memory
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Plus() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

function Burger() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function Close() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function Lamp() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-brass-500/25 bg-brass-500/8 transition-transform duration-500 group-hover:scale-105 md:size-12">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <path
          d="M12 3.6c1.8 2.2 2.6 3.5 2.6 4.9a2.6 2.6 0 0 1-5.2 0c0-1.4.8-2.7 2.6-4.9Z"
          fill="var(--color-brass-200)"
          style={{ transformOrigin: "center bottom", animation: "flame 2.8s ease-in-out infinite" }}
        />
        <path d="M4.2 13.6h15.6c0 3.6-3.5 5.7-7.8 5.7s-7.8-2.1-7.8-5.7Z" fill="var(--color-brass-500)" />
        <ellipse cx="12" cy="13.6" rx="7.8" ry="1.6" fill="var(--color-brass-300)" opacity="0.7" />
      </svg>
    </span>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
