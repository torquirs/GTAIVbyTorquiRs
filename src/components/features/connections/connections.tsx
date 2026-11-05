import { ArrowUpRight } from "lucide-react";

const connections = [
  {
    name: "Discord",
    handle: "TorquiRS",
    href: "https://discord.gg/55U4nZaqzZ",
    icon: "discord",
    color: "bg-[#5865F2]",
  },
  {
    name: "GitHub",
    handle: "TorquiRS",
    href: "https://github.com/torquirs",
    icon: "github",
    color: "bg-[#24292f]",
  },
  {
    name: "Steam",
    handle: "TorquiRS",
    href: "https://steamcommunity.com/profiles/76561198712699486",
    icon: "steam",
    color: "bg-[#1b2838]",
  },
  {
    name: "PlayStation",
    handle: "TorquiRS",
    href: "https://profile.playstation.com/TorquiRS",
    icon: "playstation",
    color: "bg-[#003791]",
  },
] as const;

type ConnectionIconName = (typeof connections)[number]["icon"];

function ConnectionIcon({ name }: { name: ConnectionIconName }) {
  const sharedProps = {
    "aria-hidden": true as const,
    className: "size-5 fill-current",
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "discord":
      return (
        <svg {...sharedProps}>
          <path d="M19.7 5.3a18 18 0 0 0-4.4-1.4l-.6 1.2a16 16 0 0 0-5.4 0l-.6-1.2a18 18 0 0 0-4.4 1.4C1.5 9.4.7 13.4 1.1 17.4a18 18 0 0 0 5.4 2.7l1.2-2a11 11 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11.4 0l.5.4a11 11 0 0 1-1.9.9l1.2 2a18 18 0 0 0 5.4-2.7c.5-4.6-.8-8.6-3.2-12.1ZM8.7 14.8c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
        </svg>
      );
    case "github":
      return (
        <svg {...sharedProps}>
          <path d="M12 .9a11.2 11.2 0 0 0-3.5 21.8c.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.2-1.3-5.2-5.6 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3.1 1.1a10.7 10.7 0 0 1 5.7 0c2.2-1.4 3.1-1.1 3.1-1.1.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.3-5.2 5.6.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.2 11.2 0 0 0 12 .9Z" />
        </svg>
      );
    case "steam":
      return (
        <svg {...sharedProps}>
          <path d="M12 2a10 10 0 0 0-9.9 8.6l5.4 2.2a3.3 3.3 0 0 1 2-.7l2.4-3.5v-.1a4.2 4.2 0 1 1 4.2 4.2h-.1l-3.4 2.5a3.3 3.3 0 0 1-6.5.8l-3.9-1.6A10 10 0 1 0 12 2Zm5.9 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9.5 13.8a1.9 1.9 0 1 0 .1 3.8 1.9 1.9 0 0 0-.1-3.8Z" />
        </svg>
      );
    case "playstation":
      return (
        <svg {...sharedProps}>
          <path d="M9 3.1v16.7l3.8 1.2V6.8c0-.7.3-1.2.9-1  .7.2.8.8.8 1.5v5.7c2.4 1.2 4.3 0 4.3-3.1 0-3.2-1.1-4.6-4.4-5.7C12.2 3.4 9 2.5 9 3.1ZM14.8 17.4l5.1-1.8c.6-.2.7-.5.2-.7-.5-.2-1.3-.2-1.9 0l-3.4 1.2v-2.1l.5-.2s2.7-1 3.9-1.4c1.9-.6 4.2-.4 4.2 1.4 0 1.9-2 2.7-2 2.7l-6.6 2.4v-1.5ZM1 17.9c0-.5.6-1 1.8-1.4l4.8-1.7v2.1l-3.4 1.2c-.6.2-.7.5-.2.7.5.2 1.3.2 1.9 0l1.7-.6v1.9l-.3.1a9 9 0 0 1-4.7.2C1.4 20 1 19 1 17.9Z" />
        </svg>
      );
  }
}

/**
 * Displays the user's platform profiles above the landing-page gallery.
 */
export function Connections() {
  return (
    <section aria-labelledby="connections-title" className="mb-6">
      <h2
        className="tracking-label mb-3 text-[9px] font-semibold uppercase text-white/55"
        id="connections-title"
      >
        Connections
      </h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {connections.map((connection) => (
          <li key={connection.name}>
            <a
              className="group flex min-h-16 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5 shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/[0.09]"
              href={connection.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white ${connection.color}`}
              >
                <ConnectionIcon name={connection.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-white/95">
                  {connection.name}
                </span>
                <span className="block truncate text-[10px] text-white/55">
                  {connection.handle}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 shrink-0 text-white/35 transition-colors group-hover:text-neon-pink"
                strokeWidth={1.7}
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
