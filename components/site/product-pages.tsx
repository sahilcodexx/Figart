import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Component,
  Download,
  Frame,
  Github,
  Hand,
  Layers,
  LockKeyhole,
  MousePointer2,
  Palette,
  PenTool,
  RectangleHorizontal,
  ShieldCheck,
  Sparkles,
  Type,
} from "lucide-react";
import { PageShell, PageCta } from "./page-shell";
import { StarterPreview } from "@/components/landing/starter-preview";
import { EditorPreview } from "@/components/landing/product-preview";
import { Eyebrow, LandingButton } from "@/components/landing/shared";
import { TemplateButton, LocalStartForm } from "./design-launch";
import { QuestionList } from "./question-list";
import { TopicDirectory } from "./topic-pages";
import { BrowserFiles } from "./browser-files";
import { shortcuts } from "@/lib/site/content";

const card = "rounded-xl border border-[#e6e8e5] bg-white p-7 sm:p-8";
const capabilities = [
  {
    icon: Frame,
    title: "A canvas that makes room",
    description:
      "Build with frames, shapes, images, and text. Pan freely, zoom into a detail, and organize your work across pages.",
  },
  {
    icon: PenTool,
    title: "Vectors, with intention",
    description:
      "Place anchor points and drag Bézier handles. Create open or closed paths, then come back to refine the curve.",
  },
  {
    icon: Layers,
    title: "A little more structure",
    description:
      "Name your layers, nest them in frames, group related objects, and arrange your content with horizontal or vertical auto layout.",
  },
  {
    icon: Component,
    title: "Your own foundations",
    description:
      "Create components, add snapshot instances from your assets, and work with the colors and typography that fit your project.",
  },
  {
    icon: Cloud,
    title: "Pick up where you left off",
    description:
      "Sign in to save files to your account. Work locally when you prefer, with browser copies and editable file downloads.",
  },
  {
    icon: Download,
    title: "Take your work with you",
    description:
      "Export SVG or PNG artwork, inspect layer properties, and download a complete editable document for another session.",
  },
];

export function FeaturesPage() {
  return (
    <PageShell
      eyebrow="Features"
      title={
        <>
          Familiar tools.
          <br />A little more possibility.
        </>
      }
      description="An open canvas for considered interfaces, expressive vectors, and everything your next idea could become."
    >
      <div className="relative h-[430px] overflow-hidden rounded-2xl border border-[#cdebf5] bg-[#c3ebf8] sm:h-[580px]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff45_1px,transparent_1px),linear-gradient(to_bottom,#ffffff45_1px,transparent_1px)] bg-size-[36px_36px]" />
        <EditorPreview className="absolute top-10 left-8 origin-top-left scale-[0.72] sm:top-14 sm:left-16 sm:scale-100 lg:left-1/2 lg:-translate-x-1/2" />
      </div>
      <section className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((item) => (
          <article key={item.title} className={card}>
            <item.icon className="mb-6 size-6 text-[#147bd0]" />
            <h2 className="text-xl tracking-[-0.2px]">{item.title}</h2>
            <p className="mt-3 text-[15px] leading-[1.65] text-[#888]">
              {item.description}
            </p>
          </article>
        ))}
      </section>
      <section className="mt-20 grid gap-8 border-t border-[#e8e8e8] pt-10 md:grid-cols-2">
        <div>
          <Eyebrow>Still taking shape</Eyebrow>
          <h2 className="text-3xl leading-tight">
            Know what’s here.
            <br />
            And what’s still ahead.
          </h2>
        </div>
        <p className="text-base leading-[1.7] text-[#888]">
          Figart is growing. Live collaboration, advanced prototype behaviors,
          boolean operations, constraints, component variants, and native Figma
          file import are not available yet. The editor focuses on drawing,
          arranging, and saving editable designs today.
        </p>
      </section>
      <TopicDirectory group="Product" />
      <PageCta />
    </PageShell>
  );
}

const cases = [
  {
    title: "Product interfaces",
    detail:
      "Explore an app flow, organize screens, and refine the details that make an interface feel right.",
    tag: "From wireframe to interface",
    icon: MousePointer2,
  },
  {
    title: "Visual identities",
    detail:
      "Put color, typography, and composition in conversation. Find a direction that feels like your brand.",
    tag: "Make it recognizable",
    icon: Palette,
  },
  {
    title: "Web & landing pages",
    detail:
      "Plan a hero, balance a content section, and work through a responsive layout before you start building.",
    tag: "Think in sections",
    icon: RectangleHorizontal,
  },
  {
    title: "Vector artwork",
    detail:
      "Draw an icon, tune a curve, and export clean SVG assets for your next website or app.",
    tag: "Details that scale",
    icon: PenTool,
  },
  {
    title: "Personal projects",
    detail:
      "A side project, an experiment, a new beginning. Make room for the ideas you have been meaning to try.",
    tag: "Start small. Keep going.",
    icon: Sparkles,
  },
  {
    title: "Learning by making",
    detail:
      "Take apart the editable starter, understand its layers, and rebuild it in your own visual language.",
    tag: "Explore a real document",
    icon: Layers,
  },
];
export function UseCasesPage() {
  return (
    <PageShell
      eyebrow="Use cases"
      title={
        <>
          For the things
          <br />
          you can’t wait to make.
        </>
      }
      description="Different projects. Different starting points. One space to work through the possibilities."
    >
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((item) => (
          <article key={item.title} className={card}>
            <div className="mb-8 flex items-center justify-between">
              <item.icon className="size-6 text-[#147bd0]" />
              <span className="text-[10px] text-[#999]">{item.tag}</span>
            </div>
            <h2 className="text-[23px] tracking-[-0.3px]">{item.title}</h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-[#888]">
              {item.detail}
            </p>
            <Link
              href={
                item.title === "Learning by making" ? "/templates" : "/start"
              }
              className="mt-7 inline-flex items-center gap-2 text-sm text-[#147bd0]"
            >
              {item.title === "Learning by making"
                ? "Explore the starter"
                : "Start creating"}
              <ArrowRight className="size-3.5" />
            </Link>
          </article>
        ))}
      </section>
      <section className="mt-20 overflow-hidden rounded-2xl bg-[#e8ebe2] px-6 pt-10 sm:px-12">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <Eyebrow>A complete starting point</Eyebrow>
            <h2 className="text-3xl tracking-[-0.4px]">
              A slower kind of stay.
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-[#7e8577]">
              Discover, stay details, and booking review. Three considered
              screens, ready for your own direction.
            </p>
          </div>
          <LandingButton href="/templates">Explore Elsewhere</LandingButton>
        </div>
        <div className="mt-10 grid grid-cols-3 items-start gap-4 sm:gap-8 lg:gap-14">
          {[0, 1, 2].map((index) => (
            <StarterPreview
              key={index}
              screen={index}
              className="rounded-t-[20px] shadow-[0_10px_35px_#25322712]"
            />
          ))}
        </div>
      </section>
      <TopicDirectory group="Use cases" />
      <PageCta />
    </PageShell>
  );
}

export function TemplatesPage() {
  return (
    <PageShell
      eyebrow="Starter design"
      title={
        <>
          A thoughtful start.
          <br />
          An entirely new direction.
        </>
      }
      description="Skip the placeholder screen. Explore a complete, editable app experience, then make the colors, copy, and composition your own."
    >
      <section className="overflow-hidden rounded-2xl border border-[#e3e7dd] bg-[#e8ebe2]">
        <div className="grid grid-cols-3 gap-3 px-5 pt-8 sm:gap-8 sm:px-12 sm:pt-12 lg:gap-16 lg:px-20">
          {[0, 1, 2].map((index) => (
            <StarterPreview
              key={index}
              screen={index}
              className="rounded-t-[20px] shadow-[0_10px_35px_#25322712]"
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-8 border-t border-[#e1e5d9] bg-white p-7 sm:p-10">
          <div>
            <p className="mb-2 text-xs text-[#9a9f93]">
              MOBILE APP · 430 × 932 · 3 SCREENS
            </p>
            <h2 className="text-[28px] tracking-[-0.4px]">
              Elsewhere — Boutique stays
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#888]">
              Editable text, embedded photography, vector icons, and prototype
              links between discovery, details, and booking.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <TemplateButton />
            <LandingButton href="/editor/demo" secondary>
              Preview demo
            </LandingButton>
          </div>
        </div>
      </section>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Make a copy",
            text: "Use this template creates your own file. Signed-in copies go to your account; guest copies stay in your browser.",
          },
          {
            title: "Edit every detail",
            text: "Change individual text layers, replace photographs, tune spacing, and explore the vector icons in the layer tree.",
          },
          {
            title: "Take it with you",
            text: "Download SVG or PNG artwork, or export an editable Figart file. Photographs are embedded in that file.",
          },
        ].map((item) => (
          <div key={item.title} className={card}>
            <h3 className="text-lg">{item.title}</h3>
            <p className="mt-3 text-sm leading-[1.7] text-[#888]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-[#999]">
        Elsewhere is a fictional sample. Stay details, prices, hosts, and
        ratings are demonstration content. Photography:{" "}
        <a
          href="https://unsplash.com/photos/a-cabin-on-a-lake-surrounded-by-trees-wvrcVFPDvj8"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Douglas Schneiders
        </a>{" "}
        and{" "}
        <a
          href="https://unsplash.com/photos/a-small-cabin-on-the-shore-of-a-lake-kqt7Aj4HlqU"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Daniel Park
        </a>{" "}
        / Unsplash.
      </p>
      <PageCta
        title="Prefer to start from nothing?"
        description="A blank canvas is a good starting point, too."
      />
    </PageShell>
  );
}

const toolGroups = [
  {
    icon: MousePointer2,
    title: "Select & navigate",
    text: "Select a layer, move a selection, drag a duplicate, or make a little room with the Hand tool.",
    keys: ["V", "H", "Space + drag", "Alt + drag"],
  },
  {
    icon: Frame,
    title: "Frames & shapes",
    text: "Draw frames, rectangles, ellipses, and lines. Adjust dimensions, corner radius, fill, stroke, and opacity in the inspector.",
    keys: ["F", "R", "O", "L"],
  },
  {
    icon: PenTool,
    title: "Vector drawing",
    text: "Click to place a point. Drag to shape a curve. Edit handles, close a path, or split a handle to change direction.",
    keys: ["P", "Enter", "Alt"],
  },
  {
    icon: Type,
    title: "Typography",
    text: "Add editable text. Choose a font family, size, weight, color, and alignment to find the right voice.",
    keys: ["T"],
  },
  {
    icon: Layers,
    title: "Layers & layout",
    text: "Group objects, reorder layers, nest content in frames, and arrange a frame with horizontal or vertical auto layout.",
    keys: ["Ctrl / ⌘ + G", "Ctrl / ⌘ + ]"],
  },
  {
    icon: Download,
    title: "Files & exports",
    text: "Save your editable document, export SVG or PNG, and bring a Figart file back into the workspace later.",
    keys: ["Ctrl / ⌘ + S"],
  },
];
export function ToolsPage() {
  return (
    <PageShell
      eyebrow="Design tools"
      title={
        <>
          Less friction.
          <br />
          More room to create.
        </>
      }
      description="A guide to the tools you’ll find in the workspace, with the shortcuts that help you keep moving."
    >
      <section className="grid gap-5 md:grid-cols-2">
        {toolGroups.map((item) => (
          <article key={item.title} className={card}>
            <div className="flex items-center gap-3">
              <item.icon className="size-5 text-[#147bd0]" />
              <h2 className="text-[23px] tracking-[-0.3px]">{item.title}</h2>
            </div>
            <p className="mt-5 max-w-lg text-[15px] leading-[1.7] text-[#888]">
              {item.text}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {item.keys.map((key) => (
                <kbd
                  key={key}
                  className="rounded-md border border-[#e1e3df] bg-[#f7f8f6] px-2.5 py-1.5 font-sans text-xs text-[#777] shadow-[0_1px_0_#e2e4df]"
                >
                  {key}
                </kbd>
              ))}
            </div>
          </article>
        ))}
      </section>
      <PageCta
        title="Get a feel for the tools."
        description="Open the editable demo and try a small change: a color, a curve, or a new headline."
      />
    </PageShell>
  );
}

export function FaqPage() {
  return (
    <PageShell
      eyebrow="FAQs"
      title={
        <>
          A few answers.
          <br />A clearer starting point.
        </>
      }
      description="From your first canvas to your first export. Find the details that help you make the most of Figart."
    >
      <QuestionList />
      <div className="mt-10 rounded-xl bg-[#f2f3f0] p-7">
        <h2 className="text-xl">Looking for a walkthrough?</h2>
        <p className="mt-3 text-sm text-[#888]">
          The help page covers your first file, the editing workflow, and useful
          shortcuts.
        </p>
        <Link
          href="/help"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#147bd0]"
        >
          Visit help & getting started
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <PageCta />
    </PageShell>
  );
}

export function HelpPage() {
  const steps = [
    {
      title: "Choose your starting point",
      text: "Create an account file from the dashboard, start a browser file, or make a copy of the Elsewhere template.",
      href: "/start",
      link: "Create your first file",
    },
    {
      title: "Build on the canvas",
      text: "Press F to draw a frame, R for a rectangle, and T for text. Select a layer to adjust its properties in the right panel.",
      href: "/tools",
      link: "Explore the tools",
    },
    {
      title: "Move around comfortably",
      text: "Hold Space and drag to pan. Use Ctrl or Command with the wheel to zoom. Shift + 2 fits your selected object.",
      href: "/editor/demo",
      link: "Try the demo",
    },
    {
      title: "Save something you can keep",
      text: "Account files save to the database. Local files stay in this browser. Export an editable backup when you finish a session.",
      href: "/privacy",
      link: "Understand your files",
    },
  ];
  return (
    <PageShell
      eyebrow="Help & getting started"
      title={
        <>
          Your first idea.
          <br />
          Your next few steps.
        </>
      }
      description="A practical guide to opening a file, finding your way around the canvas, and keeping your work safe."
    >
      <section className="grid gap-5 md:grid-cols-2">
        {steps.map((step, index) => (
          <article key={step.title} className={card}>
            <span className="mb-6 block text-xs text-[#147bd0]">
              0{index + 1} / GETTING STARTED
            </span>
            <h2 className="text-[23px]">{step.title}</h2>
            <p className="mt-4 text-[15px] leading-[1.7] text-[#888]">
              {step.text}
            </p>
            <Link
              href={step.href}
              className="mt-6 inline-flex items-center gap-2 text-sm text-[#147bd0]"
            >
              {step.link}
              <ArrowRight className="size-3.5" />
            </Link>
          </article>
        ))}
      </section>
      <section id="shortcuts" className="mt-20 scroll-mt-28">
        <Eyebrow>Keep your hands in flow</Eyebrow>
        <h2 className="mb-8 text-3xl">A few familiar shortcuts.</h2>
        <dl className="grid overflow-hidden rounded-xl border border-[#e6e8e5] md:grid-cols-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.label}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee] px-6 py-4 even:bg-[#f8f9f7]"
            >
              <dt className="text-sm text-[#777]">{shortcut.label}</dt>
              <dd>
                <kbd className="rounded border border-[#e1e3df] bg-white px-2 py-1 font-sans text-xs text-[#666]">
                  {shortcut.keys}
                </kbd>
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="mt-20">
        <Eyebrow>Find an answer</Eyebrow>
        <h2 className="mb-7 text-3xl">Something else on your mind?</h2>
        <QuestionList compact />
      </section>
      <PageCta />
    </PageShell>
  );
}

export function AboutPage() {
  return (
    <PageShell
      eyebrow="Meet the maker"
      title={
        <>
          A little space for
          <br />
          independent ideas.
        </>
      }
      description="Figart is built by Sahil: a browser design workspace for making an idea tangible, one detail at a time."
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex min-h-[370px] flex-col justify-between rounded-2xl bg-linear-to-br from-[#d9f4fc] to-[#bce2f2] p-9">
          <span className="flex size-20 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[38px] text-[#147bd0]">
            S
          </span>
          <div>
            <p className="text-sm text-[#6d8b96]">THE PERSON BEHIND FIGART</p>
            <h2 className="mt-3 text-[38px] tracking-[-0.5px]">Sahil</h2>
            <p className="mt-2 text-base text-[#6d8b96]">
              Designer, builder, and the maker of this space.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-[#e6e8e5] p-8 sm:p-10">
          <Eyebrow>What this space is for</Eyebrow>
          <h2 className="text-3xl leading-tight">
            Make something.
            <br />
            Then make it yours.
          </h2>
          <div className="mt-6 space-y-5 text-[16px] leading-[1.75] text-[#888]">
            <p>
              Figart brings the familiar pieces of a design workflow together: a
              canvas, layers, a few useful tools, and a place to keep the work.
            </p>
            <p>
              The goal is a workspace that feels approachable for an experiment
              and useful enough to turn that experiment into a real interface.
            </p>
            <p>
              The project is still growing. You can explore what works today,
              work through the editable starter, and follow the maker’s work.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <LandingButton href="https://github.com/sahilcodexx">
              <Github className="size-4" />
              Find Sahil on GitHub
            </LandingButton>
            <LandingButton href="https://twitter.com/sahilcodex" secondary>
              Follow on X
            </LandingButton>
          </div>
        </div>
      </section>
      <PageCta />
    </PageShell>
  );
}

export function PrivacyPage() {
  const sections = [
    {
      title: "Browser files stay in this browser",
      text: "Local designs are stored in browser storage on the device where you create them. They are not automatically added to your account. Clearing site data can remove these files, so download an editable copy before switching browsers or clearing storage.",
    },
    {
      title: "Account files use your signed-in identity",
      text: "Clerk handles sign-in. Convex stores account design documents, titles, timestamps, revisions, and file organization metadata. File operations check the signed-in owner before returning or changing an account file.",
    },
    {
      title: "Recovery copies are separate files",
      text: "The editor keeps browser backups when storage is available. A backup can remain on that browser after a cloud file is changed or deleted. You can inspect browser recovery files from the dashboard and download a copy from the editor.",
    },
    {
      title: "Deletion depends on where the file lives",
      text: "Account files can be moved to Trash, restored, or permanently deleted from the dashboard. Permanently deleting an account file does not automatically clear independent browser copies or downloads you have already made.",
    },
    {
      title: "You choose when to move a local design",
      text: "Signing in does not automatically upload every browser file. Use Save a copy to account from the recovery section, or import an editable file into your account workspace.",
    },
  ];
  return (
    <PageShell
      eyebrow="Your data & privacy"
      title={
        <>
          Your ideas.
          <br />
          Know where they live.
        </>
      }
      description="A practical explanation of account files, browser storage, and recovery copies, based on how Figart works today."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            icon: Cloud,
            title: "Account storage",
            text: "Files saved through your signed-in workspace.",
          },
          {
            icon: LockKeyhole,
            title: "Browser storage",
            text: "Local files and recovery copies on this device.",
          },
          {
            icon: Download,
            title: "Your own copy",
            text: "Editable downloads you keep outside Figart.",
          },
        ].map((item) => (
          <div key={item.title} className={card}>
            <item.icon className="mb-5 size-6 text-[#147bd0]" />
            <h2 className="text-xl">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#888]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-14 grid gap-10 lg:grid-cols-[0.6fr_1fr]">
        <aside className="self-start rounded-xl bg-[#f0f3ed] p-7">
          <ShieldCheck className="mb-5 size-7 text-[#6f8d5b]" />
          <h2 className="text-xl">Before you clear your browser</h2>
          <p className="mt-4 text-sm leading-[1.7] text-[#7d8775]">
            Export an editable Figart file, or save a copy to your account.
            Browser files are tied to this browser and device.
          </p>
          <Link
            href="/help"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[#147bd0]"
          >
            Read the saving guide
            <ArrowRight className="size-3.5" />
          </Link>
        </aside>
        <div className="divide-y divide-[#e9e9e7]">
          {sections.map((section) => (
            <section key={section.title} className="py-7 first:pt-0">
              <h2 className="text-[23px] tracking-[-0.2px]">{section.title}</h2>
              <p className="mt-4 text-[16px] leading-[1.75] text-[#888]">
                {section.text}
              </p>
            </section>
          ))}
          <section className="pt-7">
            <h2 className="text-[23px]">Questions about your files?</h2>
            <p className="mt-4 text-base leading-relaxed text-[#888]">
              Check the help guide for recovery and export steps, or visit the
              maker’s public profile to get in touch.
            </p>
            <div className="mt-5 flex gap-5 text-sm text-[#147bd0]">
              <Link href="/help">Help & recovery</Link>
              <Link href="/about">Meet the maker</Link>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}

export function StartPage() {
  return (
    <PageShell
      eyebrow="Start locally"
      title={
        <>
          An idea is enough.
          <br />
          Start right here.
        </>
      }
      description="Create a design in this browser without signing in. A blank canvas or a complete starter: the choice is yours."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <LocalStartForm />
        <aside className="rounded-2xl bg-[#ecf7fa] p-8">
          <Hand className="mb-6 size-7 text-[#147bd0]" />
          <h2 className="text-[26px] leading-tight">
            Your browser.
            <br />
            Your starting point.
          </h2>
          <ul className="mt-6 space-y-5 text-[15px] leading-[1.6] text-[#78858a]">
            <li>No account needed to create a local design.</li>
            <li>Changes save to this browser as you work.</li>
            <li>
              Download an editable copy before switching devices or clearing
              site data.
            </li>
          </ul>
          <div className="mt-8 border-t border-[#d6e8ed] pt-7">
            <p className="mb-4 text-sm leading-relaxed text-[#78858a]">
              Want files available through your account instead?
            </p>
            <LandingButton href="/dashboard">
              Open account workspace
            </LandingButton>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

export function FilesPage() {
  return (
    <PageShell
      eyebrow="Your files"
      title={
        <>
          Your ideas.
          <br />
          Right where you left them.
        </>
      }
      description="Open designs saved in this browser, download an editable copy, or head to your account workspace for cloud files."
    >
      <div className="mb-12 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-[#dcebf1] bg-[#edf8fc] p-7">
        <div>
          <h2 className="text-[23px]">Looking for your account files?</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#7e8e95]">
            Your signed-in workspace keeps cloud files together, with stars,
            renaming, trash, and recovery options.
          </p>
        </div>
        <LandingButton href="/dashboard">Open account workspace</LandingButton>
      </div>
      <BrowserFiles />
      <PageCta />
    </PageShell>
  );
}
