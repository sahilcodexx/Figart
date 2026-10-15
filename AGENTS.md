# Figart — Browser Design Workspace

## Product and scope

Figart is a browser workspace for UI design, vector artwork, and editable design
files. The public origin is `https://figart.vercel.app`, configurable through
`NEXT_PUBLIC_SITE_URL` in `lib/site/config.ts`.

The landing page has been redesigned and split into section components. Keep its
current design, large gradient footer wordmark, and sticky navigation unless the
owner requests changes. Do not restore the removed image editor, image backend,
AI image tools, batch studio, or project-limit system.

FigCraft's Rust/egui code is an interface reference, not the runtime. Preserve its
MIT notice under `licenses/`. Do not ship ArtCraft logos or reference screenshots.
Do not describe unsupported Figma features as implemented.

## Stack

Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS v4, shadcn/ui
with Radix, lucide-react, Convex, Clerk, and next-themes. Use the existing
components and dependencies before introducing another library.

## Structure

- `app/page.tsx` composes the landing sections and website structured data.
- `components/landing/` contains separate hero, features, workflows, FAQ, and
  get-started sections, shared layout, scoped styles, and product previews.
- `components/common/` contains the public header and footer.
- `components/site/` and `lib/site/` contain public pages, article content,
  navigation, metadata, and site configuration.
- `components/design/` contains the dashboard, editor, SVG canvas, panels,
  toolbar, dialogs, responsive panel helper, and `useDesignEditor`.
- `lib/design/` contains the document format, hierarchy, layout, vectors,
  storage, gesture scheduling, creation helpers, and Elsewhere starter.
- `convex/designs.ts` contains owner-checked file queries and mutations.
- `tests/` uses Node's test runner; no third-party test framework is installed.

## Routes and storage

- `/dashboard` is public, with authenticated account file operations and guest
  resource/demo entry points. Guest local-file creation lives at `/start`.
- `/files` lists browser documents. `/editor/local-*` opens those browser files.
- `/editor/demo` uses the versioned Elsewhere demo slot. Do not overwrite older
  demo slots or user edits when updating the starter.
- `/editor/cloud-*` opens owner-checked Convex files and requires authentication.
- Marketing articles are generated from `lib/site/catalog.ts`; keep route
  generation, navigation, related links, canonical metadata, and sitemap aligned.

New editable downloads use `.figart`; imports also accept legacy `.repimly`.
Keep `repimly-design`, `repimly-design-files-v1`, and `repimly-files` compatible
unless a deliberate migration is requested and implemented. These are persisted
identifiers, not public branding.

## Implementation conventions

Compose pages from focused components instead of growing a single page module.
Use Tailwind v4 and existing shadcn components. Keep editor light/dark variables
inside `WorkspaceTheme`; do not change landing or global tokens to style the
workspace. Use inline styles for runtime geometry and tokens. Add explanatory
comments only when needed to explain non-obvious behavior.

The dashboard uses navigation drawers below 768px; the editor uses panel drawers
below 1024px. Keep the canvas, toolbar, dialogs, file actions, and navigation usable
at narrow widths. Preserve desktop panel preferences when resizing. Use Radix for
modal focus management and respect keyboard navigation inside dialogs and menus.

Document changes go through `useDesignEditor`, with one undo entry per gesture.
Keep pointer updates coalesced per frame. Avoid document serialization, full
workspace updates, or database writes on every pointer movement. Retain anchored,
bounded zoom and the grab/grabbing cursor behavior.

Validate imported and stored documents. Keep hierarchy cycle-free and identity
references valid. Account documents have a 900,000-byte serialized UTF-8 limit;
individual account images accepted by the editor are limited to 350,000 bytes.

Every cloud access must check ownership. Saves must respect expected revisions.
Preserve browser backups and recovery paths on failures; never report a failed
save as successful. Local-only work must not silently become account data.

## Validation and machine load

For code changes, run checks appropriate to the affected behavior:

```sh
npm run typecheck
npm run test:design
npm run build
```

Use targeted ESLint on changed workspace files. Verify important editing flows
in the running browser and inspect phone, tablet, and desktop layouts. State
which checks were completed and which were unavailable. Documentation-only
changes need content, path, and link checks rather than an application build.

The owner has reported CPU spikes and machine crashes. Reuse an existing dev
server, run expensive checks sequentially, and avoid simultaneous builds and dev
servers. Do not run repeated full builds without a reason.

Never deploy, delete, or modify existing remote data merely to test local code.
Use the local Node backend tests for ownership and revision checks. Backend
provisioning and production deployment are separate from local verification.

## Documentation and attribution

Keep `README.md` and `convex/README.md` aligned with actual routes, supported
features, and save behavior. Update owned attribution prose when appropriate,
but preserve third-party copyright and license texts. Do not expose environment
secrets or put account-specific credentials into documentation.
