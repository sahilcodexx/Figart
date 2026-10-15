import { LandingLayout } from "@/components/landing/landing-layout";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { WorkflowsSection } from "@/components/landing/workflows-section";
import { FaqSection } from "@/components/landing/faq-section";
import { GetStartedSection } from "@/components/landing/get-started-section";
import { StructuredData } from "@/components/site/structured-data";
import { absoluteUrl } from "@/lib/site/config";

export default function Page() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Figart",
          url: absoluteUrl(),
          description:
            "A browser workspace for UI design, vector artwork, and editable interfaces.",
        }}
      />
      <LandingLayout>
        <HeroSection />
        <FeaturesSection />
        <WorkflowsSection />
        <FaqSection />
        <GetStartedSection />
      </LandingLayout>
    </>
  );
}
