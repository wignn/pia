import { Footer } from "@/src/components/Footer";
import { FeatureSection } from "@/src/components/FeatureSection";
import { ArchitectureSection } from "@/src/components/ArchitectureSection";
import { TechStackSection } from "@/src/components/TechStackSection";
import { Hero } from "@/src/components/Hero";
import { Navbar } from "@/src/components/Navbar";
import { ScrollCanvas } from "@/src/components/ScrollCanvas";
import { SectionTransition } from "@/src/components/SectionTransition";
import {Portal} from "@/src/components/Motion";

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
