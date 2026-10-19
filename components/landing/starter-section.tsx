import { Eyebrow, LandingButton } from "./shared";
import { StarterPreview } from "./starter-preview";

const screens = [
  {
    title: "Discover",
    description: "An editorial home for places worth a pause.",
  },
  {
    title: "Stay details",
    description: "Photography, useful details, and room to breathe.",
  },
  {
    title: "Booking review",
    description: "A considered finish to the booking journey.",
  },
];

export function StarterSection() {
  return (
    <section
      id="starter-design"
      aria-labelledby="starter-title"
      className="scroll-mt-28 pt-24 md:pt-[124px]"
    >
      <Eyebrow>Inside the starter</Eyebrow>
      <div className="grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
        <h2
          id="starter-title"
          className="text-[34px] leading-[1.08] font-normal tracking-[-0.25px] text-balance md:text-[40px]"
        >
          A starting point.
          <br />
          Ready for your own take.
        </h2>
        <div>
          <p className="max-w-[480px] text-[18px] leading-[1.45] text-pretty text-[#777777]">
            Meet Elsewhere, a three-screen stay-booking app. Open the design,
            explore its layers, and change the type, images, or layout directly
            on the canvas.
          </p>
          <LandingButton href="/editor/demo" className="mt-5">
            Open the starter
          </LandingButton>
        </div>
      </div>
      <div className="mt-9 rounded-[15px] border border-[#e6e8e4] bg-[#f1f1f1] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
        <div className="mx-auto grid max-w-[970px] gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-14">
          {screens.map((screen, index) => (
            <figure key={screen.title} className="mx-auto w-full max-w-[280px]">
              <div className="overflow-hidden rounded-[15px] border border-[#e6e8e4] bg-white shadow-[0_4px_16px_#00000008]">
                <StarterPreview screen={index} />
              </div>
              <figcaption className="mt-5">
                <p className="text-[16px] text-[#555555]">
                  <span className="mr-2 text-[12px] text-[#898989]">
                    0{index + 1}
                  </span>
                  {screen.title}
                </p>
                <p className="mt-2 text-[14px] leading-[1.45] text-pretty text-[#777777]">
                  {screen.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
