import { Eyebrow, LandingButton } from "./shared";

const options = [
  {
    label: "In this browser",
    title: "Start with an idea.",
    description:
      "Open a local file and begin without an account. Your work stays in this browser, ready when you return.",
    details: [
      ["Getting started", "No sign-in required"],
      ["Saved to", "This browser on this device"],
      ["Take it with you", "Download an editable .figart file"],
    ],
    href: "/start",
    action: "Start locally",
  },
  {
    label: "In your account",
    title: "Keep your work close.",
    description:
      "Sign in to create account files. Return to your workspace to find your designs and keep working where you left off.",
    details: [
      ["Getting started", "Sign in to your workspace"],
      ["Saved to", "Your account, automatically"],
      ["A little reassurance", "Browser backups for recovery"],
    ],
    href: "/dashboard",
    action: "Open your workspace",
  },
];

export function WorkspaceSection() {
  return (
    <section
      id="your-workspace"
      aria-labelledby="workspace-title"
      className="scroll-mt-28 pt-24 md:pt-[124px]"
    >
      <Eyebrow>Your workspace</Eyebrow>
      <h2
        id="workspace-title"
        className="text-[34px] leading-[1.08] font-normal tracking-[-0.25px] text-balance md:text-[40px]"
      >
        Your files.
        <br />A workspace that fits.
      </h2>
      <div className="mt-9 grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        {options.map((option, index) => (
          <article
            key={option.label}
            className="border-t border-[#e6e8e4] pt-6"
          >
            <p className="text-[13px] text-[#797979]">{option.label}</p>
            <h3 className="mt-4 text-[27px] font-normal tracking-[-0.4px]">
              {option.title}
            </h3>
            <p className="mt-3 max-w-[500px] text-[18px] leading-[1.45] text-pretty text-[#777777]">
              {option.description}
            </p>
            <dl className="mt-6 divide-y divide-[#e6e8e4] border-y border-[#e6e8e4] text-[14px] leading-[1.45]">
              {option.details.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_1.2fr] gap-4 py-4"
                >
                  <dt className="text-[#797979]">{label}</dt>
                  <dd className="text-[#555555]">{value}</dd>
                </div>
              ))}
            </dl>
            <LandingButton
              href={option.href}
              secondary={index === 0}
              className="mt-6"
            >
              {option.action}
            </LandingButton>
          </article>
        ))}
      </div>
      <p className="mt-7 max-w-[650px] text-[14px] leading-[1.5] text-pretty text-[#797979]">
        Local files stay local. Download a copy before clearing browser data or
        moving to another device.
      </p>
    </section>
  );
}
