export type TopicGroup = "Product" | "Use cases" | "Resources";
export type TopicPage = {
  path: string;
  group: TopicGroup;
  label: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[];
  steps: string[];
  related: string[];
};
export const topicPages: TopicPage[] = [
  {
    path: "/use-cases/ui-design",
    group: "Use cases",
    label: "UI design",
    title: "Design an interface that feels considered.",
    description:
      "Use Figart to design app screens, organize interface layers, and refine typography, spacing, and visual hierarchy.",
    sections: [
      {
        title: "Start with one useful screen",
        body: "Choose the screen that carries the main action: discovering a stay, reading a product, or reviewing a booking. Draw a frame with F and give it a clear name. Add the content people need before decorating it. In the Elsewhere starter, the destination search, featured stay, and price each have a deliberate place in the reading order.",
      },
      {
        title: "Refine hierarchy with actual content",
        body: "Use short, realistic labels instead of repeated placeholder copy. Select text to set its size, weight, and alignment in the inspector. Keep supporting details quieter than the main action. Group related controls and compare the screen at a comfortable zoom level; a layout that works only when magnified probably needs a simpler hierarchy.",
      },
      {
        title: "Keep the design editable",
        body: "Name the layers that matter and put related objects in frames. Individual labels, shapes, images, and vector icons remain editable. Export a PNG for review, an SVG for vector artwork, or a Figart file to keep the document structure.",
      },
    ],
    steps: [
      "Open the Elsewhere template or draw a blank frame.",
      "Define the primary action and add realistic content.",
      "Tune typography, spacing, fills, and corner radii.",
      "Export a screen for review and keep an editable backup.",
    ],
    related: ["/use-cases/wireframing", "/features/auto-layout", "/templates"],
  },
  {
    path: "/use-cases/ux-design",
    group: "Use cases",
    label: "UX design",
    title: "Work through the experience, one decision at a time.",
    description:
      "Map a small user journey into editable screens, compare alternatives, and build simple click-through flows in Figart.",
    sections: [
      {
        title: "Make the next step clear",
        body: "Begin with a concrete task rather than an entire product. For a stay-booking flow, that task might be choosing a place and checking its total price. Create a frame for each meaningful step, then ask what information someone needs to make the next decision.",
      },
      {
        title: "Explore alternatives side by side",
        body: "Duplicate a frame and try another content order, button label, or grouping. Keep both versions visible on the canvas. Use plain text to explain the scenario and keep layer names descriptive so you can revisit the reasoning later.",
      },
      {
        title: "Review the flow with simple prototypes",
        body: "Connect a selected layer to another frame in the Prototype panel, then open the presentation view. These links are useful for reviewing navigation between screens. Figart does not provide usability analytics, real-time research sessions, or advanced prototype behaviors; export your screens when you need to review them elsewhere.",
      },
    ],
    steps: [
      "Write one user task in a text layer.",
      "Create frames for the important decisions.",
      "Duplicate a frame to explore a different approach.",
      "Connect the screens and review the click-through flow.",
    ],
    related: [
      "/use-cases/prototyping",
      "/use-cases/ui-design",
      "/guides/getting-started",
    ],
  },
  {
    path: "/use-cases/wireframing",
    group: "Use cases",
    label: "Wireframing",
    title: "Find the structure before the finish.",
    description:
      "Create low-fidelity wireframes with frames, simple shapes, and text. Focus on content, order, and the next action.",
    sections: [
      {
        title: "Keep the first version deliberately simple",
        body: "Use a small set of gray fills, one text family, and a few sizes. A rectangle can stand in for an image while a real headline explains its purpose. Draw frames for the screens or page sections you want to compare. Keep enough space between frames to see each idea clearly.",
      },
      {
        title: "Use content to test the layout",
        body: "A wireframe should answer practical questions: what appears first, which action is primary, and what supporting information belongs nearby? Replace filler with plausible labels. If the layout struggles with the amount of text you expect, fix the structure now instead of hiding the issue behind styling.",
      },
      {
        title: "Move into visual design when the order works",
        body: "Duplicate your wireframe before exploring color and typography. This preserves the structural version for comparison. Use auto layout on simple rows and columns, or place layers manually when exploring a new composition.",
      },
    ],
    steps: [
      "Draw a frame and name the screen.",
      "Place headings, content blocks, and one primary action.",
      "Try realistic text and adjust the reading order.",
      "Duplicate the wireframe before adding visual detail.",
    ],
    related: [
      "/use-cases/ui-design",
      "/features/auto-layout",
      "/use-cases/web-design",
    ],
  },
  {
    path: "/use-cases/prototyping",
    group: "Use cases",
    label: "Prototyping",
    title: "Give the next screen a destination.",
    description:
      "Create simple frame-to-frame prototypes in Figart and review the navigation of an interface before you build it.",
    sections: [
      {
        title: "Link an action to another frame",
        body: "Arrange the screens on one page. Select the button or layer that should lead somewhere, switch the inspector to Prototype, and choose its target frame. The visual design remains an editable document; the link describes which screen to show when the layer is clicked in presentation view.",
      },
      {
        title: "Walk through the important path",
        body: "Open the presentation view and follow the main journey. In the Elsewhere template, the featured stay opens its detail screen, and the reserve control leads to booking review. Include a route back where someone needs to revise a decision.",
      },
      {
        title: "Use the right level of fidelity",
        body: "Frame links help explain screen order and navigation. They do not create working bookings, submit payments, or turn the design into an application. Advanced transitions, conditional logic, and live collaboration are not currently supported. Keep your prototype focused on the decisions it can communicate clearly.",
      },
    ],
    steps: [
      "Create the frames for your flow.",
      "Select a clickable layer and open Prototype.",
      "Choose the destination frame.",
      "Present the design and test the route forward and back.",
    ],
    related: ["/templates", "/use-cases/ux-design", "/features/components"],
  },
  {
    path: "/use-cases/web-design",
    group: "Use cases",
    label: "Web design",
    title: "Plan a page with a clear reading order.",
    description:
      "Design website layouts in Figart using editable frames, typography, images, and reusable interface elements.",
    sections: [
      {
        title: "Build the page around its purpose",
        body: "Start with the action the page should support. A landing page might introduce a product, explain its useful features, and offer a clear way to try it. Create separate frames for the page or for sections you want to explore independently. Give the main heading and supporting copy enough room before adding extra decoration.",
      },
      {
        title: "Compare desktop and mobile deliberately",
        body: "Make a second frame at a narrower width and work through how the content should change. Shorten overly long labels, stack related blocks, and check whether the primary action remains easy to find. Figart does not automatically produce responsive HTML or apply responsive constraints; use these frames to make the decisions before implementation.",
      },
      {
        title: "Prepare the pieces for development",
        body: "Inspect layer properties and export individual artwork as SVG or PNG. Keep the editable document so you can return to the composition later. A design file communicates the layout, but the finished website still needs implementation and browser testing.",
      },
    ],
    steps: [
      "Define the page purpose and primary action.",
      "Build a desktop composition with realistic content.",
      "Create a mobile frame and rework the layout.",
      "Export artwork and retain the editable document.",
    ],
    related: [
      "/use-cases/wireframing",
      "/features/design-export",
      "/guides/export-svg-png",
    ],
  },
  {
    path: "/use-cases/vector-art",
    group: "Use cases",
    label: "Vector artwork",
    title: "Draw the detail that makes it yours.",
    description:
      "Create editable vector icons and artwork with shapes, paths, Bézier handles, fills, and strokes in Figart.",
    sections: [
      {
        title: "Start with the simplest geometry",
        body: "Use a rectangle, ellipse, or line when the shape is straightforward. Reach for the Pen tool when you need to control a contour. Working with fewer intentional points usually makes a path easier to refine than tracing every small change in direction.",
      },
      {
        title: "Tune the curve at its anchors",
        body: "Click to make a corner point, or drag as you place a point to create curve handles. Finish an open path with Enter, or click its starting point to close it. Revisit a path to adjust anchors and handles. Alt lets you split handle behavior when one side needs a different direction.",
      },
      {
        title: "Export artwork that fits its destination",
        body: "Choose SVG when you want to preserve vector geometry. Choose PNG for a raster image at a chosen scale. Keep the Figart file when you want the full editable document. Boolean shape operations and native Figma import are not currently available.",
      },
    ],
    steps: [
      "Sketch with basic shapes or press P for the Pen tool.",
      "Use corner points and dragged handles intentionally.",
      "Set the fill, stroke, and opacity in the inspector.",
      "Export SVG and keep an editable copy.",
    ],
    related: [
      "/features/vector-editor",
      "/guides/pen-tool",
      "/features/design-export",
    ],
  },
  {
    path: "/features/vector-editor",
    group: "Product",
    label: "Vector editor",
    title: "An editable path from point to possibility.",
    description:
      "Draw and refine vector artwork in Figart with anchors, Bézier handles, basic shapes, fills, and strokes.",
    sections: [
      {
        title: "Create corners and curves in one tool",
        body: "Press P to select the Pen tool. A click places a corner anchor; a drag creates handles for a curved segment. Close the path by selecting its first point, or press Enter to finish it open. The result is an editable path rather than a flattened drawing.",
      },
      {
        title: "Refine the geometry without starting over",
        body: "Return to a path to edit its points and handles. Use Alt when the handle directions need to separate. Select the layer to adjust paint properties in the inspector. Resizing an anchored path scales its control points with the artwork.",
      },
      {
        title: "Combine drawing with a larger composition",
        body: "Keep related paths in named groups or frames, place text alongside them, and export the selected artwork. The tool supports core vector editing; boolean operations, variable-width brushes, and advanced vector effects are not included.",
      },
    ],
    steps: [
      "Place a small number of anchors.",
      "Drag to create the curves you need.",
      "Refine the handles and paint properties.",
      "Group the artwork and export the selection.",
    ],
    related: ["/guides/pen-tool", "/use-cases/vector-art", "/tools"],
  },
  {
    path: "/features/auto-layout",
    group: "Product",
    label: "Auto layout",
    title: "Give a row or column a little order.",
    description:
      "Arrange frame children horizontally or vertically with editable gap and padding controls in Figart.",
    sections: [
      {
        title: "Choose a direction for related content",
        body: "Use a frame to hold a row of controls or a column of content. In the inspector, choose horizontal or vertical layout. Figart positions the children along that direction, using the frame’s padding and gap values. Keep the child order meaningful in the layer tree.",
      },
      {
        title: "Treat spacing as a visible decision",
        body: "Start with enough padding to distinguish the frame from its contents. Then tune the gap between its children. A row of labels may need less space than a list of cards. Use nested frames when different parts of the composition need different spacing rules.",
      },
      {
        title: "Understand the current boundaries",
        body: "The layout system arranges children in a row or column. It is not a full browser layout engine and does not provide responsive constraints, wrapping, or every behavior of Figma’s auto layout. Use separate frames to explore different screen sizes.",
      },
    ],
    steps: [
      "Place related layers in a frame.",
      "Select horizontal or vertical layout.",
      "Set the frame padding and the gap between children.",
      "Reorder layers and review the resulting composition.",
    ],
    related: [
      "/use-cases/ui-design",
      "/use-cases/web-design",
      "/features/components",
    ],
  },
  {
    path: "/features/components",
    group: "Product",
    label: "Components",
    title: "Start from a piece you already considered.",
    description:
      "Create reusable design components and add snapshot instances from the assets panel in Figart.",
    sections: [
      {
        title: "Name a useful building block",
        body: "Select a related set of layers, such as a button, badge, or card, and create a component. Give it a name that explains its role in the interface. A small collection of purposeful elements is easier to work with than a large set of anonymous groups.",
      },
      {
        title: "Bring a component into the next composition",
        body: "Find components in the assets panel and add an instance to the canvas. The instance gives you a starting point for another screen. Group its layers with the surrounding content and refine the typography, color, and spacing that the new context requires.",
      },
      {
        title: "Instances are snapshots today",
        body: "Instances currently copy the component’s layers at the time they are created. Later changes to a source component do not automatically synchronize across instances. Variants, advanced overrides, and shared component libraries are not currently supported. Keep an editable file of your foundations and review copies deliberately.",
      },
    ],
    steps: [
      "Select the layers for one reusable element.",
      "Create and name a component.",
      "Add an instance from the assets panel.",
      "Review and edit the copy for its new context.",
    ],
    related: ["/templates", "/features/auto-layout", "/use-cases/ui-design"],
  },
  {
    path: "/features/design-export",
    group: "Product",
    label: "Design exports",
    title: "Take the right version of your work.",
    description:
      "Export SVG or PNG artwork from Figart, or download an editable Figart file for backup and reuse.",
    sections: [
      {
        title: "Export a selection or the page",
        body: "Select the frame or layers you want to take with you, then open Export. With nothing selected, the export uses the page’s visible top-level content. A focused selection is useful when you need one screen or icon rather than the complete canvas.",
      },
      {
        title: "Choose between geometry and pixels",
        body: "SVG preserves vector shapes and editable text in the exported markup. PNG creates a raster image at the chosen scale. Large dimensions and high scale factors increase export memory use, so select a smaller frame when you only need part of a design. Font availability can affect text in exported artwork.",
      },
      {
        title: "Keep a document you can reopen",
        body: "Download a Figart file when you want the document structure, pages, layers, and embedded photographs. Import that file from Start locally or the workspace later. Older editable design exports remain importable. Native .fig files are not supported.",
      },
    ],
    steps: [
      "Select the artwork you need.",
      "Open Export and choose SVG, PNG, or Figart file.",
      "Set the PNG scale if needed.",
      "Keep an editable download alongside presentation images.",
    ],
    related: ["/guides/export-svg-png", "/privacy", "/start"],
  },
  {
    path: "/guides/getting-started",
    group: "Resources",
    label: "Your first design",
    title: "From a first frame to a file you can keep.",
    description:
      "A practical walkthrough of creating your first Figart document, adding content, navigating the canvas, and saving your work.",
    sections: [
      {
        title: "Choose where the file should live",
        body: "Start locally creates a browser file without signing in. The account workspace stores designs in the database when you are signed in. The Elsewhere template is another useful starting point: it contains three complete screens with separate text, image, and vector layers.",
      },
      {
        title: "Make one small, visible change",
        body: "Select a headline and change its text or size in the inspector. Press R to draw a rectangle, or T to add a new label. Use the layer panel to select an object that sits inside a larger frame. Hold Space and drag to pan, and use Shift + 2 to fit your selection.",
      },
      {
        title: "Finish with a portable copy",
        body: "Account changes save automatically, while browser files stay on this device. Check the save status before closing the editor. Download an editable Figart file from the file menu when you want a copy outside browser storage. Clearing browser data can remove local files and recovery copies.",
      },
    ],
    steps: [
      "Create a blank file or copy the Elsewhere template.",
      "Select a layer and change one property.",
      "Try a new shape, frame, or text layer.",
      "Check saving and download an editable backup.",
    ],
    related: ["/start", "/templates", "/guides/keyboard-shortcuts"],
  },
  {
    path: "/guides/pen-tool",
    group: "Resources",
    label: "Pen tool guide",
    title: "A smoother curve starts with a few good points.",
    description:
      "Learn how to place anchors, create Bézier curves, close paths, and adjust handles with Figart’s Pen tool.",
    sections: [
      {
        title: "Build the outline with intentional anchors",
        body: "Press P, then click where the outline should begin. Click again for a straight segment. For a curve, press and drag as you place the next point; the drag creates handles that influence the curve’s direction. Start with fewer anchors so you can see what each handle contributes.",
      },
      {
        title: "Choose whether the path should close",
        body: "Click the first anchor to close a shape, or press Enter to finish an open path. Open paths are useful for lines and outlines; closed paths can carry a filled shape. Change fill and stroke independently in the inspector rather than adding extra geometry to simulate an outline.",
      },
      {
        title: "Refine rather than redraw",
        body: "Re-enter path editing to move an anchor or adjust a handle. Hold Alt to split handles when the curve needs a corner or a different direction on one side. If a segment feels uneven, simplify the surrounding geometry before adding more points.",
      },
    ],
    steps: [
      "Click for a corner anchor.",
      "Click and drag for a curved segment.",
      "Click the first point to close, or press Enter to finish.",
      "Adjust handles and tune fill and stroke.",
    ],
    related: [
      "/features/vector-editor",
      "/use-cases/vector-art",
      "/guides/export-svg-png",
    ],
  },
  {
    path: "/guides/export-svg-png",
    group: "Resources",
    label: "SVG, PNG, or editable file?",
    title: "Pick the format that fits the next step.",
    description:
      "Understand when to export SVG, PNG, or an editable Figart document, and what each format keeps.",
    sections: [
      {
        title: "Use SVG when the geometry matters",
        body: "SVG is useful for icons, logos, and other vector artwork that needs to stay sharp at different sizes. The export contains vector geometry and text. Raster photographs remain raster images inside the SVG; exporting them does not turn them into editable vectors. Fonts may need to be available in the destination environment.",
      },
      {
        title: "Use PNG for a straightforward image",
        body: "PNG is a practical choice for a screenshot, a review board, or a presentation. Choose the scale in the export dialog and export the specific frame you need. PNG flattens the result into pixels, so it does not preserve separate layers or editable text.",
      },
      {
        title: "Use a Figart file when you want to keep designing",
        body: "An editable download keeps the document’s pages, layers, paths, and embedded images. Import it into Figart when you want to continue editing. This is also a useful backup before clearing browser storage. SVG and PNG exports serve different purposes and are not substitutes for the full document.",
      },
    ],
    steps: [
      "Use SVG for scalable vector assets.",
      "Use PNG for a presentation-ready raster image.",
      "Use a Figart file for editing and backup.",
      "Export only the frame or selection you actually need.",
    ],
    related: ["/features/design-export", "/privacy", "/guides/getting-started"],
  },
  {
    path: "/guides/keyboard-shortcuts",
    group: "Resources",
    label: "Keyboard shortcuts",
    title: "Keep the next action close at hand.",
    description:
      "Learn Figart shortcuts for canvas navigation, drawing, duplication, grouping, saving, and undo.",
    sections: [
      {
        title: "Move around before changing tools",
        body: "Hold Space and drag to pan temporarily, or press H to select the Hand tool. Ctrl or Command with the wheel zooms around the pointer. Shift + 1 fits the page, Shift + 2 fits the selected layers, and 0 returns to 100%. Press Tab to hide or restore both sidebars.",
      },
      {
        title: "Switch tools with one key",
        body: "V selects the Move tool. F draws a frame, R a rectangle, O an ellipse, L a line, P a path, and T text. When drawing with the Pen tool, Enter finishes a path. These shortcuts apply while you are working on the canvas, rather than typing in an input or text field.",
      },
      {
        title: "Make copies and recover a decision",
        body: "Hold Alt and drag a selected object to duplicate it. Ctrl or Command + D also duplicates the selection. Ctrl or Command + G groups it, and adding Shift ungroups it. Use Ctrl or Command + Z to undo, Shift + Z to redo, and S to save. The help page keeps a quick reference nearby.",
      },
    ],
    steps: [
      "Use Space + drag to move the view.",
      "Switch drawing tools with V, F, R, O, L, P, or T.",
      "Use Alt + drag when exploring a duplicate.",
      "Undo, redo, and save with familiar modifier shortcuts.",
    ],
    related: ["/help#shortcuts", "/tools", "/guides/getting-started"],
  },
];
export const topicGroupPath = (group: TopicGroup) =>
  group === "Product"
    ? "/features"
    : group === "Use cases"
      ? "/use-cases"
      : "/guides";
