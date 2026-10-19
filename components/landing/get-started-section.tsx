import Image from "next/image";
import { Button } from "@/components/ui/button";

export function GetStartedSection() {
  return (
    <section
      id="get-started"
      aria-labelledby="get-started-title"
      className="relative isolate mt-24 flex min-h-[430px] flex-col items-center justify-center overflow-hidden rounded-[15px]  px-6 py-16 text-center md:mt-[124px]"
    >
      <Image
        src="/bluesky.png"
        alt=""
        fill
        sizes="(min-width: 1440px) 1304px, 100vw"
        className="-z-20 object-cover object-[center_72%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-[#0b4aa3]/10 to-[#0b4aa3]/25"
      />
      <h2
        id="get-started-title"
        className="text-[30px] leading-[1.18] font-normal tracking-[-0.5px] text-white md:text-[40px]"
      >
        Make room for your next big idea.
      </h2>
      <p className="mt-5 max-w-[620px] text-[20px] leading-[1.45] text-white/90">
        A blank canvas, familiar tools, and a world of possibilities.
        <br className="hidden sm:block" /> Bring your ideas to life with Figart.
      </p>
      <form
        action="/sign-up"
        method="get"
        className="mt-6 flex w-full max-w-[340px] items-center rounded-[11px] border border-white/60 bg-white p-1 shadow-[0_8px_24px_#0a3a8040]"
      >
        <label htmlFor="landing-email" className="sr-only">
          Your email address
        </label>
        <input
          id="landing-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          placeholder="Enter Your Email"
          className="h-10 w-full min-w-0 rounded-md bg-white px-3 text-[13px] text-[#555] outline-none placeholder:text-[#a5aaa4] focus-visible:ring-2 focus-visible:ring-[#147bd0]/40"
        />
        <Button
          type="submit"
          className="h-10 shrink-0 rounded-[7px] border border-[#1381d8] bg-linear-to-b from-[#2189dd] to-[#1172c7] px-3 text-sm font-normal text-white shadow-[inset_0_1px_1px_#ffffff50,0_1px_2px_#00000014] hover:from-[#147acb] hover:to-[#0865b6]"
        >
          Get started
        </Button>
      </form>
    </section>
  );
}
