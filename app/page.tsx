import { ArchitectureSection } from "@/src/components/ArchitectureSection";
import { FeatureSection } from "@/src/components/FeatureSection";
import { Hero } from "@/src/components/Hero";
import { Navbar } from "@/src/components/Navbar";
import { Portal } from "@/src/components/Motion";
import { ScrollCanvas } from "@/src/components/ScrollCanvas";
import { SectionTransition } from "@/src/components/SectionTransition";
import { TechStackSection } from "@/src/components/TechStackSection";

export default function Home() {
  return (
    <main className="relative page-sections">
      <ScrollCanvas />
      <Navbar />
      <SectionTransition><Hero /></SectionTransition>
      <SectionTransition><FeatureSection /></SectionTransition>
      <SectionTransition><ArchitectureSection /></SectionTransition>
      <SectionTransition><TechStackSection /></SectionTransition>
      <SectionTransition><Portal /></SectionTransition>
    </main>
  );
}
