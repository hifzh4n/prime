"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Shield, Zap, X, LogIn, Settings, Ban, Code, MousePointerClick, Globe, ArrowUp, Menu, Loader2, Download, Copy, ClipboardCheck } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { PolicyModal } from "@/components/PolicyModal";
import confetti from "canvas-confetti";

// Icons
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.299 12.299 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286 19.839 19.839 0 006.0028-3.03.0777.0777 0 00.0321-.0543c.5007-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

export default function Home() {
  const LAUNCH_YEAR = 2026;
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);

  useEffect(() => {
    // Check for success payment
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') && query.get('session_id')) {
      const sessionId = query.get('session_id');

      // verify payment and get key
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.licenseKey) {
            setPurchasedKey(data.licenseKey);
            setSuccessModalOpen(true);
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
            window.history.replaceState(null, '', window.location.pathname);
          }
        })
        .catch(err => console.error(err));

    } else if (query.get('canceled')) {
      alert("Payment cancelled.");
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const [agreed, setAgreed] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [purchasedKey, setPurchasedKey] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const openPurchaseModal = (plan: string) => {
    setSelectedPlan(plan);
    setPurchaseModalOpen(true);
  };

  const handlePurchase = async () => {
    if (!agreed || !email) return;

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, email }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout failed.');
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
      setIsCheckingOut(false);
    }
  };

  const handleRedeem = async () => {
    if (!licenseKey) return;
    setRedeemStatus('validating');

    try {
      // Determine if input is email or key
      const isEmail = licenseKey.includes('@');
      const payload = isEmail ? { email: licenseKey } : { key: licenseKey };

      const response = await fetch('/api/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRedeemStatus('success');
        // If user entered email, we might want to show them the key if returned
        if (data.key) {
          setPurchasedKey(data.key);
        }
      } else {
        setRedeemStatus('error');
      }
    } catch (error) {
      console.error(error);
      setRedeemStatus('error');
    }
  };

  const handleDownload = () => {
    window.open('https://github.com/YimMenu/YimMenuV2', '_blank');
  };

  const handleCopyKey = () => {
    if (purchasedKey) {
      navigator.clipboard.writeText(purchasedKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white selection:bg-pink-500/30 overflow-x-hidden relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[180px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-pink-600/10 blur-[150px]" />
      </div>

      {/* Grid Pattern Overlay */}
      {/* Grid Pattern Overlay */}
      <div
        className="fixed inset-0 z-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"
        style={{
          backgroundSize: '50px 50px',
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          animation: 'grid-move 20s linear infinite'
        }}
      />
      <style jsx global>{`
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-orbitron tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            PRIME
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" onClick={(e) => scrollToSection(e, "features")} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" onClick={(e) => scrollToSection(e, "pricing")} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5" asChild>
              <Link href="https://discord.gg" target="_blank">
                <DiscordIcon className="w-5 h-5" />
                <span className="sr-only">Discord</span>
              </Link>
            </Button>
          </div>
          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-top-5 duration-300">
          <Link href="#features" className="text-2xl font-medium text-zinc-300 hover:text-white transition-colors" onClick={(e) => { scrollToSection(e, "features"); setMobileMenuOpen(false); }}>Features</Link>
          <Link href="#pricing" className="text-2xl font-medium text-zinc-300 hover:text-white transition-colors" onClick={(e) => { scrollToSection(e, "pricing"); setMobileMenuOpen(false); }}>Pricing</Link>
          <Link href="https://discord.gg" target="_blank" className="text-2xl font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>
            Discord <DiscordIcon className="w-6 h-6" />
          </Link>
        </div>
      )}

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400 mb-8 backdrop-blur-md animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Undetected since {LAUNCH_YEAR}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            DOMINATE LOS SANTOS
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light">
            The most powerful and cheapest cheat since {LAUNCH_YEAR}. <br />
            <span className="text-white/80">Experience god-like control with Prime.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-0 shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all transform hover:scale-105" asChild>
              <Link href="#pricing" onClick={(e) => scrollToSection(e, "pricing")}>
                Get Started Now <Zap className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 backdrop-blur-sm" asChild>
              <Link href="#features" onClick={(e) => scrollToSection(e, "features")}>
                View Features
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <span className="text-purple-500 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 inline-block">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Everything you need</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">Dominate the game with our comprehensive suite of tools designed for power and safety.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Limitless Customization", icon: Settings, desc: "From vehicle spawning and handling editors to weather manipulation and instant teleportation—control every aspect of Los Santos." },
              { title: "Ironclad Protections", icon: Shield, desc: "Bulletproof defense systems designed to shield you from malicious kicks, crash attempts, and griefing." },
              { title: "Smart Anti-Spam", icon: Ban, desc: "Intelligent filtering that automatically blocks chat spam, bounty notifications, and annoying advertisements." },
              { title: "LUA Scripting Engine", icon: Code, desc: "Expand your horizons with full LUA support. Write your own scripts or download thousands from the community." },
              { title: "Adaptive Interface", icon: MousePointerClick, desc: "Play your way with two distinct UI modes: a modern Click GUI or a classic List GUI, both fully themeable." },
              { title: "Global Localization", icon: Globe, desc: "Native support for multiple languages and full controller compatibility for a seamless experience anywhere." },
            ].map((feature, i) => (
              <Card key={i} className="bg-black/40 border-white/5 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300 group h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-900/20 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  </div>
                  <CardTitle className="text-xl text-white font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-6 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Transparent Pricing</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">Choose the plan that suits your playstyle. Instant delivery.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Standard Plan */}
            <PricingCard
              title="Standard"
              price={15}
              features={[
                { name: "All Basic Features", included: true },
                { name: "Full Protections", included: true },
                { name: "Vehicle Spawner", included: true },
                { name: "Advertise Session", included: true },
                { name: "Kicks & Crashes", included: true },
                { name: "LUA Scripting", included: true },
                { name: "Unlock All", included: true },
                { name: "Hulk Mode", included: true },
                { name: "Money + RP Drops", included: false },
                { name: "Convert Vehicle to PV", included: false },
                { name: "Traffic Variety", included: false },
                { name: "Free Shopping", included: false },
                { name: "Unlock GTA+", included: false },
                { name: "Battleye Bypass", included: false },
              ]}
              onPurchase={() => openPurchaseModal("Standard")}
              onRedeem={() => setRedeemModalOpen(true)}
            />

            {/* Premium Plan */}
            <PricingCard
              title="Premium"
              price={20}
              description="Upgrade from Standard for $5"
              isRecommended={true}
              features={[
                { name: "All Basic Features", included: true },
                { name: "Full Protections", included: true },
                { name: "Vehicle Spawner", included: true },
                { name: "Advertise Session", included: true },
                { name: "Kicks & Crashes", included: true },
                { name: "LUA Scripting", included: true },
                { name: "Unlock All", included: true },
                { name: "Hulk Mode", included: true },
                { name: "Money + RP Drops", included: true },
                { name: "Convert Vehicle to PV", included: true },
                { name: "Traffic Variety", included: true },
                { name: "Free Shopping", included: true },
                { name: "Unlock GTA+", included: true },
                { name: "Battleye Bypass", included: false },
              ]}
              onPurchase={() => openPurchaseModal("Premium")}
              onRedeem={() => setRedeemModalOpen(true)}
            />

            {/* Prime Plan */}
            <PricingCard
              title="Prime"
              price={30}
              isExclusive={true}
              features={[
                { name: "All Basic Features", included: true },
                { name: "Full Protections", included: true },
                { name: "Vehicle Spawner", included: true },
                { name: "Advertise Session", included: true },
                { name: "Kicks & Crashes", included: true },
                { name: "LUA Scripting", included: true },
                { name: "Unlock All", included: true },
                { name: "Hulk Mode", included: true },
                { name: "Money + RP Drops", included: true },
                { name: "Convert Vehicle to PV", included: true },
                { name: "Traffic Variety", included: true },
                { name: "Free Shopping", included: true },
                { name: "Unlock GTA+", included: true },
                { name: "Battleye Bypass", included: true },
              ]}
              onPurchase={() => openPurchaseModal("Prime")}
              onRedeem={() => setRedeemModalOpen(true)}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/60 backdrop-blur-xl py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 mb-2">PRIME</span>
              <p className="text-sm text-zinc-500">© {currentYear} Prime Cheats. All rights reserved.</p>
            </div>
            <div className="flex gap-8 items-center">
              <PolicyModal type="privacy" />
              <PolicyModal type="refund" />
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <Button
        size="icon"
        className={`fixed bottom-8 right-8 z-50 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all duration-300 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        onClick={scrollToTop}
      >
        <ArrowUp className="w-5 h-5" />
      </Button>

      {/* Purchase Modal */}
      <Dialog open={purchaseModalOpen} onOpenChange={(open) => {
        if (!open) {
          // Reset state when modal closes
          setAgreed(false);
          setEmail("");
        }
        setPurchaseModalOpen(open);
      }}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Purchase - {selectedPlan}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your email address to receive your license key upon successful payment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-zinc-200">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-black/50 border-zinc-800 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  className="border-zinc-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-zinc-200 font-medium cursor-pointer">
                  I Agree
                </Label>
              </div>
              <p className="text-xs text-zinc-500 pl-6">
                By clicking purchase, you agree to our <PolicyModal type="privacy" className="text-purple-400 hover:underline bg-transparent border-0 p-0 inline cursor-pointer" />.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={handlePurchase}
              disabled={!agreed || !email || isCheckingOut}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Redeem Modal */}
      <Dialog open={redeemModalOpen} onOpenChange={(open) => {
        if (!open) {
          setRedeemStatus('idle');
          setLicenseKey("");
          // Clear purchased key so it doesn't persist if they open redeem again later without a purchase
          if (!successModalOpen) setPurchasedKey("");
        }
        setRedeemModalOpen(open);
      }}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redeem License Key</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your license key OR your email address to verify your purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {redeemStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">License Verified!</p>
                  {purchasedKey && (
                    <div className="mt-2 text-sm bg-zinc-900 p-2 rounded text-purple-400 font-mono">
                      {purchasedKey}
                    </div>
                  )}
                  <p className="text-sm text-zinc-400 mt-2">You can now download the loader.</p>
                </div>
                <Button onClick={handleDownload} className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white gap-2">
                  <Download className="w-4 h-4" /> Download Loader
                </Button>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="key" className="text-zinc-200">License Key / Email</Label>
                <Input
                  id="key"
                  placeholder="Key (XXXX-...) or Email"
                  className={`bg-black/50 border-zinc-800 text-white focus:border-purple-500/50 focus:ring-purple-500/20 font-mono tracking-wider ${licenseKey.includes('@') ? '' : 'uppercase'}`}
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  disabled={redeemStatus === 'validating'}
                />
                {redeemStatus === 'error' && (
                  <p className="text-sm text-red-500">Invalid license key. Please try again.</p>
                )}
              </div>
            )}
          </div>
          {redeemStatus !== 'success' && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleRedeem}
                disabled={!licenseKey || redeemStatus === 'validating'}
                className="w-full bg-white text-black hover:bg-zinc-200"
              >
                {redeemStatus === 'validating' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Verify Key"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-green-500 text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Thank you for your purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-in zoom-in duration-500">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <div className="text-center space-y-2 w-full">
              <p className="text-white font-medium">Payment Verified!</p>
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-md flex items-center justify-between gap-2 group relative">
                <code className="font-mono text-purple-400 select-all text-sm break-all">{purchasedKey || "Generating key..."}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-zinc-500 hover:text-white"
                  onClick={handleCopyKey}
                  title="Copy to clipboard"
                >
                  {isCopied ? <ClipboardCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-zinc-500">Save this key! It has also been sent to your email.</p>
            </div>
            <Button
              className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              onClick={() => {
                setSuccessModalOpen(false);
                setLicenseKey(purchasedKey); // Auto-fill redeem input
                setRedeemModalOpen(true);
              }}
            >
              Redeem Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
