import {
  blankDocument,
  createNode,
  type DesignNode,
  type NodeKind,
} from "./document.ts";
import { forestCabin, lakesideCabin } from "./starter-assets.ts";

const ink = "#293b30",
  muted = "#8a8d82",
  paper = "#faf9f5",
  green = "#314f3b",
  line = "#e7e7df";
export const STARTER_DEMO_FILE = "local-demo-elsewhere-v2";

export function createStarterDocument() {
  const doc = blankDocument("Elsewhere — A slower kind of stay");
  const nodes: DesignNode[] = [];
  let serial = 0;
  let offset = 0;
  let screen = "";
  const add = (type: NodeKind, props: Partial<DesignNode>) => {
    const node = createNode(type, {
      id: `elsewhere-layer-${serial++}`,
      parentId: screen,
      ...props,
    });
    nodes.push(node);
    return node;
  };
  const box = (
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fill = "none",
    radius = 0,
    parentId = screen,
    stroke = "none",
  ) =>
    add("frame", {
      name,
      x: offset + x,
      y,
      width,
      height,
      fill,
      radius,
      parentId,
      stroke,
      strokeWidth: stroke === "none" ? 0 : 1,
      clip: true,
    });
  const text = (
    name: string,
    value: string,
    x: number,
    y: number,
    size = 14,
    fill = ink,
    weight = 400,
    width = 382,
    parentId = screen,
    serif = false,
  ) =>
    add("text", {
      name,
      text: value,
      x: offset + x,
      y,
      width,
      height: size * 1.4 * value.split("\n").length,
      fill,
      fontSize: size,
      fontWeight: weight,
      fontFamily: serif ? "DM Serif Display" : "Inter",
      parentId,
    });
  const rule = (y: number, x = 24, width = 382, parentId = screen) =>
    add("line", {
      name: "Divider",
      x: offset + x,
      y,
      width,
      height: 0,
      stroke: line,
      strokeWidth: 1,
      parentId,
    });
  const path = (
    name: string,
    points: number[][],
    x: number,
    y: number,
    size: number,
    color: string,
    parentId: string,
    fill = "none",
  ) =>
    add("path", {
      name,
      x: offset + x,
      y,
      width: size,
      height: size,
      fill,
      stroke: color,
      strokeWidth: (1.65 * size) / 24,
      points: points.map(([px, py]) => ({
        x: (px * size) / 24,
        y: (py * size) / 24,
      })),
      parentId,
    });
  const icon = (
    name: string,
    x: number,
    y: number,
    size = 22,
    color = ink,
    parentId = screen,
  ) => {
    const circle = (cx: number, cy: number, r: number) =>
      add("ellipse", {
        name: name + " circle",
        x: offset + x + ((cx - r) * size) / 24,
        y: y + ((cy - r) * size) / 24,
        width: (r * 2 * size) / 24,
        height: (r * 2 * size) / 24,
        fill: "none",
        stroke: color,
        strokeWidth: (1.65 * size) / 24,
        parentId,
      });
    const p = (points: number[][]) =>
      path(name, points, x, y, size, color, parentId);
    if (name === "search") {
      circle(10, 10, 6);
      p([
        [15, 15],
        [21, 21],
      ]);
    } else if (name === "back")
      p([
        [14, 5],
        [7, 12],
        [14, 19],
      ]);
    else if (name === "arrow") {
      p([
        [4, 12],
        [20, 12],
      ]);
      p([
        [14, 6],
        [20, 12],
        [14, 18],
      ]);
    } else if (name === "heart") {
      add("path", {
        name: "Heart outline",
        x: offset + x,
        y,
        width: size,
        height: size,
        fill: "none",
        stroke: color,
        strokeWidth: (1.65 * size) / 24,
        parentId,
        closed: true,
        anchors: [
          { x: (12 * size) / 24, y: (21 * size) / 24 },
          {
            x: (3 * size) / 24,
            y: (9 * size) / 24,
            in: { x: 0, y: (14 * size) / 24 },
            out: { x: (3 * size) / 24, y: (1 * size) / 24 },
          },
          {
            x: (12 * size) / 24,
            y: (6 * size) / 24,
            in: { x: (9 * size) / 24, y: (1 * size) / 24 },
          },
          {
            x: (21 * size) / 24,
            y: (9 * size) / 24,
            in: { x: (21 * size) / 24, y: (1 * size) / 24 },
            out: { x: (24 * size) / 24, y: (14 * size) / 24 },
          },
        ],
      });
    } else if (name === "star")
      p([
        [12, 2],
        [15, 8],
        [22, 9],
        [17, 14],
        [18, 21],
        [12, 18],
        [6, 21],
        [7, 14],
        [2, 9],
        [9, 8],
        [12, 2],
      ]);
    else if (name === "pin") {
      circle(12, 9, 3);
      p([
        [12, 22],
        [5, 13],
        [4, 9],
        [6, 4],
        [12, 2],
        [18, 4],
        [20, 9],
        [19, 13],
        [12, 22],
      ]);
    } else if (name === "home") {
      p([
        [3, 11],
        [12, 3],
        [21, 11],
      ]);
      p([
        [5, 10],
        [5, 21],
        [10, 21],
        [10, 15],
        [14, 15],
        [14, 21],
        [19, 21],
        [19, 10],
      ]);
    } else if (name === "saved")
      p([
        [6, 3],
        [18, 3],
        [18, 22],
        [12, 17],
        [6, 22],
        [6, 3],
      ]);
    else if (name === "person") {
      circle(12, 7, 4);
      p([
        [4, 22],
        [4, 18],
        [7, 14],
        [17, 14],
        [20, 18],
        [20, 22],
      ]);
    } else if (name === "calendar") {
      p([
        [4, 5],
        [20, 5],
        [20, 21],
        [4, 21],
        [4, 5],
      ]);
      p([
        [4, 10],
        [20, 10],
      ]);
      p([
        [8, 2],
        [8, 7],
      ]);
      p([
        [16, 2],
        [16, 7],
      ]);
    } else if (name === "bed") {
      p([
        [3, 19],
        [3, 5],
      ]);
      p([
        [3, 15],
        [21, 15],
        [21, 19],
      ]);
      p([
        [3, 9],
        [10, 9],
        [10, 15],
      ]);
      p([
        [10, 7],
        [19, 7],
        [21, 10],
        [21, 15],
      ]);
    } else if (name === "bath") {
      p([
        [3, 12],
        [21, 12],
        [19, 19],
        [5, 19],
        [3, 12],
      ]);
      p([
        [6, 20],
        [6, 22],
      ]);
      p([
        [18, 20],
        [18, 22],
      ]);
      p([
        [6, 12],
        [6, 5],
        [8, 3],
        [11, 3],
        [13, 5],
      ]);
    } else if (name === "wifi") {
      p([
        [2, 8],
        [7, 5],
        [12, 4],
        [17, 5],
        [22, 8],
      ]);
      p([
        [6, 12],
        [9, 10],
        [15, 10],
        [18, 12],
      ]);
      p([
        [9, 16],
        [12, 14],
        [15, 16],
      ]);
      circle(12, 20, 0.8);
    } else if (name === "check") {
      circle(12, 12, 9);
      p([
        [7, 12],
        [11, 16],
        [17, 9],
      ]);
    } else if (name === "compass") {
      circle(12, 12, 10);
      p([
        [16, 7],
        [14, 14],
        [7, 17],
        [10, 10],
        [16, 7],
      ]);
    }
  };
  const photo = (
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    image: string,
    radius = 0,
    parentId = screen,
  ) => {
    const frame = box(name, x, y, w, h, "#dfe5d8", radius, parentId);
    add("rectangle", {
      name: "Photograph",
      x: offset + x,
      y,
      width: w,
      height: h,
      image,
      fill: "none",
      parentId: frame.id,
    });
    return frame;
  };
  const status = (light = false) => {
    text("Time", "9:41", 26, 20, 12, light ? "#ffffff" : ink, 600, 70);
    const c = light ? "#ffffff" : ink;
    for (let i = 0; i < 4; i++)
      add("rectangle", {
        name: "Signal",
        x: offset + 340 + i * 4,
        y: 29 - i * 2,
        width: 2.5,
        height: 4 + i * 2,
        fill: c,
        radius: 1,
      });
    box("Battery", 375, 24, 24, 11, "none", 3, screen, c);
    box("Battery charge", 378, 27, 17, 5, c, 1);
    box("Battery terminal", 400, 28, 2, 4, c, 1);
  };
  const button = (
    name: string,
    label: string,
    x: number,
    y: number,
    w: number,
    h: number,
    target?: string,
  ) => {
    const frame = box(name, x, y, w, h, green, 16);
    if (target) frame.prototypeTarget = target;
    const title = text(
      name + " label",
      label,
      x,
      y + (h - 18) / 2,
      14,
      "#ffffff",
      500,
      w,
      frame.id,
    );
    title.textAlign = "center";
    return frame;
  };
  const makeScreen = (id: string, name: string, x: number) => {
    offset = x;
    const root = add("frame", {
      id,
      name,
      x,
      y: 0,
      width: 430,
      height: 932,
      fill: paper,
      radius: 28,
      parentId: null,
      clip: true,
    });
    screen = root.id;
    return root;
  };

  makeScreen("elsewhere-discover", "01 · Discover a slower stay", 0);
  status();
  text("Wordmark", "elsewhere.", 24, 62, 27, ink, 400, 240, screen, true);
  box("Account avatar", 366, 59, 40, 40, "#ece6d9", 20);
  text("Avatar initial", "M", 366, 69, 14, green, 500, 40).textAlign = "center";
  text("Greeting", "A LITTLE LESS ORDINARY", 24, 119, 10, muted, 500);
  text(
    "Editorial headline",
    "Somewhere new.\nA little more you.",
    24,
    146,
    36,
    ink,
    400,
    382,
    screen,
    true,
  );
  box("Destination search", 24, 244, 382, 54, "#f0f0e9", 15);
  icon("search", 41, 261, 20, green);
  text("Search placeholder", "Where would you like to go?", 75, 262, 13, muted);
  for (const [i, label] of [
    "All stays",
    "Cabins",
    "Lakeside",
    "Off-grid",
  ].entries()) {
    const x = 24 + i * 99;
    box(
      label + " filter",
      x,
      316,
      88,
      34,
      i === 0 ? green : "none",
      17,
      screen,
      i === 0 ? "none" : line,
    );
    text(
      label + " label",
      label,
      x,
      326,
      11,
      i === 0 ? "#ffffff" : muted,
      500,
      88,
    ).textAlign = "center";
  }
  text(
    "Featured heading",
    "A little closer to nature",
    24,
    381,
    22,
    ink,
    400,
    340,
    screen,
    true,
  );
  icon("arrow", 383, 385, 20, green);
  const stay = box(
    "Featured stay · The Willow House",
    24,
    424,
    382,
    330,
    "#ffffff",
    20,
    screen,
    line,
  );
  stay.prototypeTarget = "elsewhere-stay";
  photo("Willow House photograph", 24, 424, 382, 224, forestCabin, 0, stay.id);
  box("Curated badge", 40, 440, 92, 25, "#faf9f5", 12, stay.id);
  text(
    "Badge label",
    "RARE FINDS",
    40,
    448,
    9,
    green,
    500,
    92,
    stay.id,
  ).textAlign = "center";
  box("Save stay", 354, 439, 36, 36, "#faf9f5", 18, stay.id);
  icon("heart", 363, 448, 18, ink, stay.id);
  text("Stay name", "The Willow House", 40, 668, 18, ink, 500, 265, stay.id);
  text(
    "Stay location",
    "A quiet corner of Oslo, Norway",
    40,
    697,
    11,
    muted,
    400,
    280,
    stay.id,
  );
  text("Nightly rate", "$148", 40, 721, 19, ink, 500, 68, stay.id);
  text("Rate unit", "/ night", 92, 727, 11, muted, 400, 80, stay.id);
  icon("star", 330, 674, 13, green, stay.id);
  text("Stay rating", "4.98", 349, 674, 12, ink, 500, 45, stay.id);
  const pick = box("Personal recommendation", 24, 782, 382, 60, "#eeeee3", 13);
  photo("Second stay photograph", 32, 790, 46, 44, lakesideCabin, 9, pick.id);
  text(
    "Recommendation title",
    "A weekend, well spent.",
    92,
    794,
    13,
    ink,
    500,
    270,
    pick.id,
  );
  text(
    "Recommendation detail",
    "Handpicked for you · 12 quiet escapes",
    92,
    816,
    10,
    muted,
    400,
    290,
    pick.id,
  );
  icon("arrow", 375, 803, 17, green, pick.id);
  box("Bottom navigation", 0, 861, 430, 71, paper);
  rule(861);
  for (const [i, label] of [
    "Explore",
    "Saved",
    "Your stays",
    "Profile",
  ].entries()) {
    const x = 38 + i * 102;
    if (i === 0) box("Active navigation", x - 7, 871, 48, 30, "#e8ecd7", 15);
    icon(
      ["compass", "saved", "home", "person"][i],
      x + 6,
      876,
      20,
      i === 0 ? green : muted,
    );
    text(
      label + " navigation",
      label,
      x - 14,
      905,
      9,
      i === 0 ? green : muted,
      400,
      72,
    ).textAlign = "center";
  }

  makeScreen("elsewhere-stay", "02 · The Willow House", 494);
  photo("Immersive stay photograph", 0, 0, 430, 385, forestCabin);
  add("rectangle", {
    name: "Photograph contrast overlay",
    x: offset,
    y: 0,
    width: 430,
    height: 60,
    fill: "#102519",
    opacity: 0.25,
  });
  status(true);
  const back = box("Back to discover", 24, 64, 40, 40, paper, 20);
  back.prototypeTarget = "elsewhere-discover";
  icon("back", 34, 74, 20, ink, back.id);
  const save = box("Save stay", 366, 64, 40, 40, paper, 20);
  icon("heart", 376, 74, 20, ink, save.id);
  box("Photo pagination", 187, 316, 56, 25, "#20392c", 12);
  text("Photo count", "1 / 8", 187, 323, 10, "#ffffff", 400, 56).textAlign =
    "center";
  box("Stay information sheet", 0, 357, 430, 575, paper, 28);
  text("Collection eyebrow", "THE SLOW COLLECTION", 24, 383, 10, muted, 500);
  text(
    "Stay headline",
    "The Willow House",
    24,
    409,
    32,
    ink,
    400,
    382,
    screen,
    true,
  );
  icon("pin", 24, 456, 15, muted);
  text("Location", "Oslo, Norway", 46, 457, 12, muted, 400, 180);
  icon("star", 258, 457, 13, green);
  text("Guest reviews", "4.98  (128 reviews)", 279, 457, 11, ink, 400, 130);
  rule(491);
  for (const [i, label] of [
    "2 guests",
    "1 bedroom",
    "1 bath",
    "Wi-Fi",
  ].entries()) {
    const x = 40 + i * 96;
    icon(["person", "bed", "bath", "wifi"][i], x + 18, 513, 24, green);
    text(label + " amenity", label, x - 3, 551, 11, muted, 400, 66).textAlign =
      "center";
  }
  rule(587);
  text(
    "About heading",
    "A slower kind of staying.",
    24,
    612,
    22,
    ink,
    400,
    382,
    screen,
    true,
  );
  text(
    "About description",
    "A quiet cabin. A lake at your doorstep.\nLong mornings, tall trees, and nowhere\nelse you need to be.",
    24,
    652,
    14,
    muted,
    400,
    382,
  );
  box("Host avatar", 24, 740, 42, 42, "#e4decc", 21);
  text(
    "Host initial",
    "N",
    24,
    751,
    15,
    green,
    400,
    42,
    screen,
    true,
  ).textAlign = "center";
  text("Host name", "Hosted by Nora", 79, 742, 12, ink, 500, 230);
  text(
    "Host status",
    "Superhost · 6 years hosting",
    79,
    762,
    10,
    muted,
    400,
    230,
  );
  box("Host badge", 359, 750, 47, 24, "#e7eadb", 12);
  text("Host badge label", "★ 4.9", 359, 757, 10, green, 500, 47).textAlign =
    "center";
  box("Sticky reservation bar", 0, 817, 430, 115, paper);
  rule(817);
  text("Reservation price", "$148", 24, 844, 27, ink, 500, 100);
  text("Reservation unit", "/ night", 94, 859, 11, muted, 400, 75);
  text(
    "Reservation dates",
    "Oct 24–26 · 2 nights",
    24,
    887,
    10,
    muted,
    400,
    200,
  );
  button(
    "Reserve stay",
    "Reserve this stay",
    230,
    844,
    176,
    56,
    "elsewhere-booking",
  );

  makeScreen("elsewhere-booking", "03 · Your weekend away", 988);
  status();
  const returnStay = box("Back to stay", 24, 64, 40, 40, "#efefe6", 20);
  returnStay.prototypeTarget = "elsewhere-stay";
  icon("back", 34, 74, 20, ink, returnStay.id);
  text(
    "Booking navigation title",
    "Your stay",
    126,
    77,
    13,
    ink,
    500,
    178,
  ).textAlign = "center";
  text(
    "Booking eyebrow",
    "SOMETHING TO LOOK FORWARD TO",
    24,
    132,
    9,
    muted,
    500,
  );
  text(
    "Booking headline",
    "A weekend\nwell spent.",
    24,
    161,
    37,
    ink,
    400,
    382,
    screen,
    true,
  );
  photo("Reservation thumbnail", 24, 275, 86, 94, forestCabin, 14);
  text(
    "Reservation stay name",
    "The Willow House",
    127,
    283,
    17,
    ink,
    500,
    275,
  );
  text("Reservation location", "Oslo, Norway", 127, 312, 12, muted, 400, 260);
  icon("star", 127, 343, 13, green);
  text(
    "Reservation review",
    "4.98 · A guest favourite",
    147,
    344,
    11,
    muted,
    400,
    250,
  );
  rule(397);
  const trip = box(
    "Your trip details",
    24,
    424,
    382,
    99,
    "none",
    16,
    screen,
    line,
  );
  icon("calendar", 43, 445, 20, green, trip.id);
  text("Dates label", "DATES", 77, 444, 9, muted, 500, 130, trip.id);
  text("Selected dates", "Oct 24 – 26", 77, 465, 13, ink, 500, 140, trip.id);
  add("line", {
    name: "Trip column divider",
    x: offset + 228,
    y: 444,
    width: 0,
    height: 58,
    stroke: line,
    strokeWidth: 1,
    parentId: trip.id,
  });
  icon("person", 246, 445, 20, green, trip.id);
  text("Guests label", "GUESTS", 278, 444, 9, muted, 500, 100, trip.id);
  text("Guest count", "2 adults", 278, 465, 13, ink, 500, 100, trip.id);
  text(
    "Trip flexibility",
    "A little time away, just for you.",
    43,
    497,
    10,
    muted,
    400,
    345,
    trip.id,
  );
  const price = box("Price breakdown", 24, 548, 382, 174, "#efefe5", 17);
  text(
    "Price heading",
    "The little details",
    44,
    569,
    20,
    ink,
    400,
    330,
    price.id,
    true,
  );
  text(
    "Room subtotal label",
    "$148 × 2 nights",
    44,
    610,
    12,
    muted,
    400,
    250,
    price.id,
  );
  text(
    "Room subtotal",
    "$296",
    320,
    610,
    12,
    ink,
    400,
    65,
    price.id,
  ).textAlign = "right";
  text(
    "Service fee label",
    "Service fee",
    44,
    638,
    12,
    muted,
    400,
    250,
    price.id,
  );
  text("Service fee", "$24", 320, 638, 12, ink, 400, 65, price.id).textAlign =
    "right";
  rule(667, 44, 342, price.id);
  text("Total label", "Total (USD)", 44, 688, 13, ink, 500, 200, price.id);
  text("Total amount", "$320", 302, 682, 21, ink, 500, 84, price.id).textAlign =
    "right";
  icon("check", 25, 751, 23, green);
  text(
    "Cancellation promise",
    "Room to change your mind.",
    59,
    750,
    12,
    ink,
    500,
    345,
  );
  text(
    "Cancellation detail",
    "Free cancellation before October 17.",
    59,
    773,
    11,
    muted,
    400,
    345,
  );
  button("Confirm booking", "Confirm your getaway", 24, 829, 382, 56);
  text(
    "Booking reassurance",
    "SECURE BOOKING · NO HIDDEN FEES",
    24,
    905,
    9,
    muted,
    400,
    382,
  ).textAlign = "center";
  doc.pages[0].name = "Stay experience";
  doc.pages[0].nodes = nodes;
  doc.colors = [
    { name: "Forest", value: green },
    { name: "Ink", value: ink },
    { name: "Warm paper", value: paper },
    { name: "Sage", value: "#e8ecd7" },
    { name: "Muted", value: muted },
  ];
  return doc;
}
