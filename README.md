# Figart

[Figart](https://figart.vercel.app) is a browser design workspace for interfaces,
vector artwork, and visual ideas. It combines an SVG canvas, layers, properties,
reusable design elements, and account-backed files with an editable demo that
also appears on the landing page.

Figart uses Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS v4,
shadcn/ui with Radix, lucide-react, Clerk, Convex, and next-themes.

## Getting started

Install dependencies from the lockfile:

```sh
npm ci
```

Use a Node.js version supported by the installed Next.js version that also
supports running TypeScript imports in Node's test runner. The test command
loads `.ts` files directly without a separate transpiler.

Configure `.env.local` with your own Clerk and Convex application settings:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_SITE_URL=https://figart.vercel.app
```

Configure `CLERK_JWT_ISSUER_DOMAIN` in the Convex deployment and set up Clerk's
`convex` JWT template to match the `applicationID` in `convex/auth.config.ts`.
Account files require the schema and functions in `convex/` to be provisioned
in that deployment. See the [backend documentation](convex/README.md).

Guest editing does not require signing in, but the application still mounts
Clerk and Convex providers and needs valid provider configuration.

```sh
npm run dev
```

Open `http://localhost:3000`. Use `/editor/demo` to explore the starter or
`/start` to create a local file. Sign in at `/dashboard` to manage account files.
The dev and build scripts use webpack. Avoid running a production build and the
dev server together on this machine.

## Pages and file modes

| Route                                                     | Purpose                                                                                      |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `/`                                                       | Landing page with an editable-design preview, features, workflows, FAQ, and get-started form |
| `/dashboard`                                              | Account file browser; guests can browse resources and open the demo                          |
| `/editor/demo`                                            | Editable Elsewhere demo saved in this browser                                                |
| `/editor/local-*`                                         | A document already stored in this browser                                                    |
| `/editor/cloud-*`                                         | An authenticated, owner-checked Convex document                                              |
| `/start`                                                  | Create or import a local design without signing in                                           |
| `/files`                                                  | Search and download validated browser documents                                              |
| `/features`, `/use-cases`, `/guides`                      | Product, use-case, and learning hubs                                                         |
| `/features/[slug]`, `/use-cases/[slug]`, `/guides/[slug]` | Statically generated articles defined in the site catalog                                    |
| `/templates`, `/tools`                                    | Editable starters and an overview of available tools                                         |
| `/faq`, `/help`, `/about`, `/privacy`                     | Searchable answers, support information, project background, and data information            |
| `/sign-in`, `/sign-up`                                    | Clerk account entry points                                                                   |

The public site uses a sticky header, shared footer, page metadata, and related
links. Canonical URLs, the sitemap, robots configuration, and social metadata use
`https://figart.vercel.app` by default. Override `NEXT_PUBLIC_SITE_URL` to change
the origin. Private workspace and authentication pages are marked noindex;
`/files` is also excluded from the sitemap.

## Editor and dashboard

- Frames, rectangles, ellipses, lines, text, raster images, and Bézier paths.
- Pages, nested layers, grouping, ordering, visibility, locking, and renaming.
- Position, dimensions, rotation, fills, strokes, opacity, corners, shadows,
  typography, and alignment controls.
- Horizontal and vertical auto layout with gap and padding.
- Local components, snapshot instances, detachment, and color swatches.
- Undo/redo, clipboard operations, duplication, nudge, pan, zoom, and grid snapping.
- Basic prototype links and presentation, plus CSS property inspection.
- SVG and PNG export and editable `.figart` JSON import/export.
- Account file search, sorting, grid/list views, favorites, duplicate, rename,
  trash, restore, and permanent deletion.

The dashboard opens navigation in a drawer below 768px. Below 1024px, the editor
uses separate layers and properties drawers, a persistent mobile header, and a
wrapping toolbar. Desktop panel visibility is stored separately while resizing.
The drawers use Radix dialogs with focus trapping and Escape dismissal.

### Useful controls

| Action                                 | Control                             |
| -------------------------------------- | ----------------------------------- |
| Move, frame, rectangle, ellipse, text  | `V`, `F`, `R`, `O`, `T`             |
| Pen, hand                              | `P`, `H`                            |
| Temporary pan                          | Hold Space and drag                 |
| Pan / zoom                             | Scroll / Ctrl or Cmd + scroll       |
| Fit page / fit selection / actual size | Shift+1 / Shift+2 / `0`             |
| Duplicate while moving                 | Alt + drag                          |
| Constrain movement / cancel a drag     | Shift + drag / Escape               |
| Undo / redo                            | Ctrl or Cmd+Z / Ctrl or Cmd+Shift+Z |
| Group / ungroup                        | Ctrl or Cmd+G / Ctrl or Cmd+Shift+G |
| Toggle desktop sidebars / layers       | Tab / Shift+Tab                     |

The pen places anchors: click for corners, drag for Bézier handles, and click
the first anchor to close a path. Enter or Escape ends the current pen operation.
Double-click a Bézier path to edit anchors and handles; Alt-drag splits handles.

## Saving and compatibility

Account documents save to Convex with an owner check and an expected revision.
The editor keeps a browser backup; failed saves remain errors and retain recovery
data. An older tab cannot silently overwrite a newer document revision.

Local files and the demo save only in the current browser. Download an editable
backup before clearing browser data or switching devices. Browser recovery files
can be copied to an account from the dashboard. Public starter-copy actions save
a browser copy before attempting account creation.

Existing `.repimly` files remain importable. The internal document identifier
`repimly-design`, storage key `repimly-design-files-v1`, and storage event
`repimly-files` are retained for compatibility; the public brand and new download
extension are Figart. The current demo has its own versioned storage identity so
older demo documents are not overwritten.

Cloud documents are limited to 900,000 serialized UTF-8 bytes. The editor accepts
individual embedded account images up to 350,000 bytes. Document validation also
checks geometry, supported fields, node identities, and hierarchy integrity.

## Limitations

Figart does not yet provide full Figma or FigCraft parity. Boolean geometry,
advanced constraints, variants, bound variables, live collaboration, comments,
plugins, advanced prototype transitions, and native `.fig` import are not
implemented. Instances are snapshots and do not automatically inherit later
changes from their source component. Selection bounds and alignment use
axis-aligned geometry. Touch layouts are supported; a mouse or trackpad remains
useful for precise vector editing.

## Project structure

| Location                        | Responsibility                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `app/page.tsx`                  | Composes the landing sections and website structured data                                           |
| `components/landing/`           | Separate hero, features, workflows, FAQ, and get-started sections; shared layout and demo previews  |
| `components/common/`            | Public header and footer                                                                            |
| `components/site/`, `lib/site/` | Marketing pages, article catalog, navigation, metadata, and canonical origin                        |
| `components/design/`            | Dashboard, editor, SVG canvas, toolbar, panels, responsive drawers, dialogs, and editing hook       |
| `lib/design/`                   | Document model, hierarchy, layout, vector helpers, frame queue, storage, file creation, and starter |
| `convex/`                       | Schema, authentication configuration, and owner-checked queries/mutations                           |
| `tests/`                        | Node tests for document invariants, persistence, interactions, and site routes                      |
| `public/demo/`, `public/fonts/` | Demo photographs and local display font                                                             |
| `licenses/`                     | Attribution and third-party license notices                                                         |

Keep workspace theme variables scoped to `WorkspaceTheme`. Landing styles live
in `components/landing/landing.module.css`. Tailwind v4 and existing shadcn
components handle layout and controls; SVG attributes and runtime inline styles
handle editable geometry.

## Validation

```sh
npm run typecheck
npm run test:design
npm run build
```

Run targeted ESLint checks on changed TypeScript files. Check the running UI at
phone, tablet, and desktop widths, including drawer dismissal, canvas controls,
file operations, and save recovery. Run expensive checks sequentially and avoid
starting duplicate dev servers. A Markdown-only change does not require a build.
The Node tests do not deploy functions or modify remote account data.

## Attribution

Figart adapts interface ideas and workflows from FigCraft into React/TypeScript;
it does not execute the Rust/egui runtime. See [FigCraft attribution](licenses/NOTICE.md)
and [demo asset credits](licenses/demo-assets.md). The former image editor,
image backend, AI tools, and batch studio are no longer part of this application.
