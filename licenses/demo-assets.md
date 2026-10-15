# Elsewhere demo assets

Elsewhere is a fictional boutique-stay app created as Figart's editable sample.
Its three screens cover discovery, stay details, and booking review. Stay names,
prices, reviews, hosts, and booking details are illustrative sample content.

## Editable design and previews

`lib/design/starter.ts` builds the document from editable layers and prototype
links. `lib/design/starter-assets.ts` contains embedded photo data so exported
editable files remain portable. Local copies under `public/demo/` serve the
landing preview. When replacing a demo photo, update the relevant local and
embedded copies together so the preview and editable sample stay consistent.

## Photographs

| Local file                       | Credit                                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `public/demo/forest-cabin.jpg`   | [Douglas Schneiders — cabin on a lake surrounded by trees](https://unsplash.com/photos/a-cabin-on-a-lake-surrounded-by-trees-wvrcVFPDvj8) |
| `public/demo/lakeside-cabin.jpg` | [Daniel Park — small cabin on the shore of a lake](https://unsplash.com/photos/a-small-cabin-on-the-shore-of-a-lake-kqt7Aj4HlqU)          |

Both photographs are distributed under the [Unsplash License](https://unsplash.com/license).
The local demo copies are resized and compressed.

## Display font

The demo uses DM Serif Display, stored at
`public/fonts/dm-serif-display.ttf` and registered in
`components/design/design-fonts.css`. The font is distributed under the SIL Open
Font License; retain [DM-Serif-Display-OFL.txt](DM-Serif-Display-OFL.txt).

FigCraft's separate interface attribution is recorded in [NOTICE.md](NOTICE.md).
