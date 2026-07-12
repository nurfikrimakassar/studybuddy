import {
  TopBar,
  Hero,
  Problem,
  Features,
  HowItWorks,
  SocialProof,
  FinalCTA,
  Footer,
  WaitlistProvider,
} from "@/components/landing-page";

export default function Home() {
  return (
    <div style={{ fontFamily: "var(--font-body)", color: "#1E1B33", background: "#FAF8FC", overflowX: "hidden" }}>
      <WaitlistProvider>
        <TopBar />
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <SocialProof />
        <FinalCTA />
      </WaitlistProvider>
      <Footer />
    </div>
  );
}
