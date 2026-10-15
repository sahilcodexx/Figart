# FigCraft attribution

Figart's browser design workspace adapts interface structure, color tokens, and
design workflows from FigCraft, copyright (c) 2026 ArtCraft Team and the FigCraft
contributors. FigCraft is available under MIT OR Apache-2.0. This adaptation
uses the MIT license; preserve the complete copyright and permission notice in
[figcraft-MIT.txt](figcraft-MIT.txt).

The reference source is the owner's local `Documents/figcraft` checkout,
including the following interface modules:

```text
crates/ui-egui/src/{theme,toolbar,home,layers,right,layout_panel,proto_panel}.rs
```

Figart implements its workspace in React and TypeScript with an SVG canvas.
The FigCraft Rust engine and egui renderer are not included or executed. This
attribution does not imply complete feature parity or an affiliation with
ArtCraft. ArtCraft logos and reference screenshots are not shipped as assets.

The Elsewhere starter contains editable geometry, text, prototype connections,
and embedded photographs. Its photographs and display font have separate
[asset credits and license references](demo-assets.md). Interface icons use the
existing ISC-licensed `lucide-react` package.
