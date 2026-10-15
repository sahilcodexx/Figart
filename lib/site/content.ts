export const questions = [
  {
    category: "Getting started",
    question: "What is Figart?",
    answer:
      "Figart is a browser design workspace for interfaces, vector artwork, and visual ideas. Create with frames, layers, shapes, text, and editable Bézier paths on an open canvas.",
  },
  {
    category: "Getting started",
    question: "Can I start without an account?",
    answer:
      "Yes. Choose Start locally to create a browser file, or open the editable demo. Sign in when you want to create files saved to your account. Local files remain on the browser where you created them.",
  },
  {
    category: "Getting started",
    question: "Do I need to install anything?",
    answer:
      "No. Figart runs in your browser. Use a desktop or laptop with a mouse or trackpad for the editing controls.",
  },
  {
    category: "Files & saving",
    question: "Where are my designs saved?",
    answer:
      "Account files save to the database with ownership checks. Local files and recovery backups use browser storage. Always download an editable copy before clearing browser data or changing devices.",
  },
  {
    category: "Files & saving",
    question: "How do I move a local file to my account?",
    answer:
      "Sign in and open your dashboard. Expand Browser recovery files and choose Save a copy to account. The browser version remains a separate copy.",
  },
  {
    category: "Files & saving",
    question: "What happens if an account save fails?",
    answer:
      "The editor shows the save error and retains a browser backup when storage is available. Download an editable backup from the file menu. If another tab changed the same file, reload the account version before saving over it.",
  },
  {
    category: "Editing",
    question: "How do I move around the canvas?",
    answer:
      "Hold Space and drag to pan, or select the Hand tool with H. Use Ctrl or Command with the mouse wheel to zoom around the pointer. Shift + 1 fits the page and Shift + 2 fits the selected objects.",
  },
  {
    category: "Editing",
    question: "How does the Pen tool work?",
    answer:
      "Press P. Click to place corner points, or click and drag to create curve handles. Click the first point to close a path, or press Enter to finish. Hold Alt while adjusting handles to split them.",
  },
  {
    category: "Editing",
    question: "Can I hide the editor sidebars?",
    answer:
      "Press Tab to hide or restore both sidebars. Shift + Tab toggles the left panel. The panel buttons let you collapse and restore either side individually.",
  },
  {
    category: "Editing",
    question: "How do I duplicate a selection?",
    answer:
      "Hold Alt and drag a selected object to make a copy. Ctrl or Command + D duplicates the selection. Nested child layers are copied with their parent.",
  },
  {
    category: "Export",
    question: "Which formats can I export and import?",
    answer:
      "Export SVG, PNG, or an editable Figart file. Import editable Figart JSON files through the workspace. Native Figma .fig import is not supported.",
  },
  {
    category: "Export",
    question: "Does Figart have every Figma feature?",
    answer:
      "Not yet. The workspace supports core drawing, layout, files, and simple prototype links. Real-time collaboration, advanced prototyping, constraints, boolean operations, component variants, and native .fig import are not available.",
  },
];
export const shortcuts = [
  { keys: "V", label: "Select and move" },
  { keys: "H / Space + drag", label: "Pan the canvas" },
  { keys: "F", label: "Draw a frame" },
  { keys: "R", label: "Draw a rectangle" },
  { keys: "O", label: "Draw an ellipse" },
  { keys: "P", label: "Draw a vector path" },
  { keys: "T", label: "Add text" },
  { keys: "L", label: "Draw a line" },
  { keys: "Alt + drag", label: "Drag a duplicate" },
  { keys: "Tab", label: "Toggle both sidebars" },
  { keys: "Shift + 1", label: "Fit page" },
  { keys: "Shift + 2", label: "Fit selection" },
  { keys: "Ctrl / ⌘ + S", label: "Save document" },
  { keys: "Ctrl / ⌘ + Z", label: "Undo" },
  { keys: "Ctrl / ⌘ + Shift + Z", label: "Redo" },
  { keys: "Ctrl / ⌘ + G", label: "Group selection" },
];
