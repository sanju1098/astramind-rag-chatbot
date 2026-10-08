import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Use", href: "/terms" },
];

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/sanju1098/rag-chatbot",
    Icon: FaGithub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/sanjay-kumar-s-r",
    Icon: FaLinkedinIn,
  },
];

const focus =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";
const linkClass = `text-sm text-white/70 transition-colors hover:text-white focus-visible:text-white ${focus}`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-transparent bg-footer-bg text-white dark:border-white/10">
      {" "}
      <div className="container mx-auto px-4 py-10 sm:px-6 md:py-12 lg:px-8">
        {/* Top row: logo + social icons */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className={`text-xl font-semibold tracking-tight ${focus}`}
          >
            AstraMind
          </Link>

          <ul className="flex items-center gap-5">
            {socials.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className={`block text-white/70 transition-colors hover:text-white ${focus}`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom row: legal links + copyright */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-sm text-white/70">
            &copy; {year} AstraMind. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
