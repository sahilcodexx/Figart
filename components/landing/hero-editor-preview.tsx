import {
  ChevronDown,
  Frame,
  MousePointer2,
  PenTool,
  Plus,
  Square,
  Type,
} from "lucide-react";
import { StarterPreview } from "./starter-preview";

export function HeroEditorPreview() {
  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-[#f3f4f1] bg-[#fafbf8] text-left text-[#424b42]"
      role="img"
      aria-label="Figart design workspace showing three editable Elsewhere app screens, layers, and design properties"
    >
      <div className="flex h-[35px] items-center gap-2 border-b border-[#e6e9e2] px-2 md:h-[42px] md:gap-5 md:px-3.5">
        <span className="text-xs font-semibold tracking-[-0.7px] md:text-[15px] [&>span]:text-[#1687d6]">
          figart<span>.</span>
        </span>
        <span className="inline-flex max-w-[130px] items-center gap-1.5 overflow-hidden text-[6px] whitespace-nowrap md:max-w-none md:text-[8px]">
          Elsewhere — A slower kind of stay <ChevronDown size={10} />
        </span>
        <span className="ml-auto grid size-5 shrink-0 place-items-center rounded-full bg-[#728776] text-[8px] text-white">
          S
        </span>
        <span className="rounded-[5px] bg-[#1687d6] px-[9px] py-[5px] text-[8px] text-white">
          Export
        </span>
      </div>
      <div className="grid h-[clamp(210px,38svh,350px)] grid-cols-1 md:h-[var(--preview-height)] md:grid-cols-[132px_minmax(0,1fr)_124px] md:[--preview-height:clamp(200px,58svh,650px)]">
        <div className="hidden border-r border-[#e6e9e2] bg-[#fafbf8] px-2.5 py-[5px] text-[8px] md:block">
          <div className="my-3 flex items-center justify-between text-[8px] font-semibold [&>span]:font-normal [&>span]:text-[#8c9488]">
            Pages <Plus size={12} />
          </div>
          <div className="rounded bg-[#edf0e9] px-1.5 py-[7px] text-[7px]">
            Stay experience
          </div>
          <div className="my-3 flex items-center justify-between text-[8px] font-semibold [&>span]:font-normal [&>span]:text-[#8c9488]">
            Layers
          </div>
          {["Discover", "Stay details", "Booking review"].map((name, index) => (
            <div
              key={name}
              className={
                index === 0
                  ? "-mx-2.5 flex items-center gap-[5px] bg-[#e0edfb] px-3.5 py-2 text-[7px] text-[#267db5]"
                  : "flex items-center gap-[5px] px-1 py-2 text-[7px]"
              }
            >
              <Frame size={11} />
              {name}
            </div>
          ))}
          <div className="py-[7px] pl-3 text-[6px] text-[#92998d]">
            T &nbsp; Editorial headline
          </div>
          <div className="py-[7px] pl-3 text-[6px] text-[#92998d]">
            ▧ &nbsp; Featured photograph
          </div>
          <div className="py-[7px] pl-3 text-[6px] text-[#92998d]">
            ▢ &nbsp; Stay information
          </div>
        </div>
        <div className="relative flex min-w-0 items-center justify-center overflow-hidden bg-[#e9ece5] px-3.5 pt-6 pb-[45px] md:px-6 md:pt-[30px] md:pb-[55px]">
          <div className="grid w-full max-w-[min(390px,calc((38svh-85px)*1.38))] grid-cols-3 items-start gap-2.5 md:max-w-[min(800px,calc((var(--preview-height)-110px)*1.38))] md:gap-[17px] [&_p]:mb-[7px] [&_p]:text-[5px] [&_p]:text-[#90978a] md:[&_p]:text-[6px] [&_svg]:rounded-[3px] [&_svg]:shadow-[0_3px_10px_#33452f10]">
            {["01 / Discover", "02 / Stay details", "03 / Make it yours"].map(
              (label, screen) => (
                <div key={label}>
                  <p>{label}</p>
                  <StarterPreview screen={screen} />
                </div>
              ),
            )}
          </div>
          <div
            className="absolute bottom-3 flex items-center gap-3 rounded-md bg-[#fafbf8] px-2.5 py-[7px] shadow-[0_2px_8px_#33452f10] [&_svg]:size-[11px] [&_svg:first-child]:text-[#1687d6]"
            aria-hidden="true"
          >
            <MousePointer2 />
            <Frame />
            <Square />
            <PenTool />
            <Type />
          </div>
        </div>
        <div className="hidden border-l border-[#e6e9e2] bg-[#fafbf8] px-2.5 py-[5px] text-[8px] md:block">
          <div className="my-3 flex items-center justify-between text-[8px] font-semibold [&>span]:font-normal [&>span]:text-[#8c9488]">
            Design <span>100%</span>
          </div>
          <div className="my-3 flex items-center justify-between text-[8px] font-semibold [&>span]:font-normal [&>span]:text-[#8c9488]">
            Frame
          </div>
          <div className="grid grid-cols-2 gap-[5px] [&>span]:rounded-[3px] [&>span]:bg-[#edf0e9] [&>span]:p-[5px] [&>span]:text-[7px] [&>span]:text-[#84917d]">
            <span>X &nbsp; 0</span>
            <span>Y &nbsp; 0</span>
            <span>W &nbsp; 430</span>
            <span>H &nbsp; 932</span>
          </div>
          <div className="my-3 flex items-center justify-between text-[8px] font-semibold [&>span]:font-normal [&>span]:text-[#8c9488]">
            Appearance
          </div>
          <div className="flex justify-between rounded-[3px] bg-[#edf0e9] p-[5px] text-[7px] text-[#84917d]">
            ◐ &nbsp; 100% <span>⌗ &nbsp; 24</span>
          </div>
          <div className="my-3 flex items-center justify-between text-[8px] font-semibold [&>span]:font-normal [&>span]:text-[#8c9488]">
            Fill <Plus size={11} />
          </div>
          <div className="flex justify-between rounded-[3px] bg-[#edf0e9] p-[5px] text-[7px] text-[#84917d]">
            □ &nbsp; FAF9F5
          </div>
          <div className="my-3 flex items-center justify-between text-[8px] font-semibold [&>span]:font-normal [&>span]:text-[#8c9488]">
            Local styles
          </div>
          <div className="flex gap-[5px] [&>i]:size-5 [&>i]:rounded [&>i]:bg-[#314f3b] [&>i:nth-child(2)]:border [&>i:nth-child(2)]:border-[#e7e7df] [&>i:nth-child(2)]:bg-[#faf9f5] [&>i:nth-child(3)]:bg-[#89987c] [&>i:nth-child(4)]:bg-[#d8e3ef]">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}
