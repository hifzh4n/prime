
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PolicyModal({ type, className }: { type: 'privacy' | 'refund', className?: string }) {
    const isPrivacy = type === 'privacy';
    const title = isPrivacy ? "Privacy Policy" : "Refund Policy";

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className={className || "text-sm text-zinc-400 hover:text-white transition-colors"}>
                    {title}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-black/90 border-white/10 text-zinc-300">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white mb-4">{title}</DialogTitle>
                    <DialogDescription>
                        {isPrivacy ? (
                            "At Prime, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner."
                        ) : (
                            "Our refund policy outlines the conditions under which you may request a refund for your purchase."
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-sm leading-relaxed mt-4">
                    {isPrivacy ? (
                        <>
                            {/* Privacy Policy Content */}
                            <h3 className="text-lg font-semibold text-white">1. Information We Collect</h3>
                            <p>We collect information to provide better services to our users. The types of information we collect include:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Personal Information:</strong> Name, email address, and any other information you provide to us.</li>
                                <li><strong>Usage Information:</strong> Information about how you use our services, including your IP address, browser type, access times, pages viewed, and the referring link through which you accessed our site.</li>
                                <li><strong>Cookies and Tracking Technologies:</strong> Information collected through cookies and other tracking technologies.</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white mt-6">2. How We Use Your Information</h3>
                            <p>We use the information we collect for various purposes, including to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Provide, operate, and maintain our services</li>
                                <li>Improve, personalize, and expand our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Communicate with you regarding updates, security alerts, and support</li>
                                <li>Detect, prevent, and address technical issues</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white mt-6">3. Data Security</h3>
                            <p>We implement a variety of security measures to maintain the safety of your personal information. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>

                            <h3 className="text-lg font-semibold text-white mt-6">4. Contact Us</h3>
                            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@prime.gg" className="text-cyan-400 hover:underline">support@prime.gg</a>.</p>
                        </>
                    ) : (
                        <>
                            {/* Refund Policy Content */}
                            <h3 className="text-lg font-semibold text-white">1. Refund Eligibility</h3>
                            <p>We offer refunds under the following circumstances:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>The product is proven to be non-functional on your system despite support assistance.</li>
                                <li>You have not redeemed the license key.</li>
                                <li>The request is made within 7 days of purchase.</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white mt-6">2. Non-Refundable Items</h3>
                            <p>Refunds are generally NOT granted for:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Change of mind after key redemption.</li>
                                <li>Incompatibility due to system requirements not being met (please check requirements before purchase).</li>
                                <li>Bans or suspensions from third-party services (game bans).</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white mt-6">3. How to Request a Refund</h3>
                            <p>To request a refund, please contact our support team at <a href="mailto:support@prime.gg" className="text-cyan-400 hover:underline">support@prime.gg</a> with your order details and reason for the request.</p>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
