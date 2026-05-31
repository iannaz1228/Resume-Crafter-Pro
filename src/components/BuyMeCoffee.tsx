import { useState } from "react";
import { Coffee, Copy, Check, Heart } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import iannazImg from "@/iannaz.jpg";

const DONATION = {
  name: "Ian Magistrado Naz",
  message: "If ResumeCraft Pro helped you land an interview, a small coffee keeps the project alive. Thank you! 💛",
  paymentMethods: [
    {
      name: "PayPal",
      icon: "/paypal.png",
      details: [
        { label: "Email", value: "iannaz1228@gmail.com" },
        { label: "Username", value: "@iannaz1997" },
      ],
      link: "https://paypal.me/iannaz1997",
    },
    {
      name: "GCash",
      icon: "/gcash.png",
      details: [
        { label: "Name", value: "Ian Naz" },
        { label: "Number", value: "09105673778" },
      ],
    },
    {
      name: "Wise",
      icon: "/wise.png",
      details: [
        { label: "Name", value: "IAN MAGISTRADO NAZ" },
        { label: "Number", value: "2002972831" },
      ],
    },
    {
      name: "PayMaya",
      icon: "/maya.png",
      details: [
        { label: "Name", value: "Ian Naz" },
        { label: "Number", value: "09915527842" },
      ],
    },
  ],
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 rounded-md bg-muted/60 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-8 w-8 shrink-0"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success(`${label} copied to clipboard`);
          setTimeout(() => setCopied(false), 1500);
        }}
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export function BuyMeCoffee() {
  const [open, setOpen] = useState(false);
  const initials = DONATION.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      {/* Floating avatar + speech bubble */}
      <div className="fixed bottom-5 right-5 z-50 flex items-end gap-2 group">
        {/* Speech bubble */}
        <div className="animate-in fade-in slide-in-from-right-2 relative mb-1 hidden duration-500 sm:block">
          <div className="rounded-2xl border-2 border-primary/30 bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-elegant whitespace-nowrap">
            <span className="inline-flex items-center gap-1">
              <Coffee className="h-3.5 w-3.5 text-primary" />
              Buy me a coffee
            </span>
            {/* tail */}
            <span className="absolute -right-1.5 bottom-3 h-3 w-3 rotate-45 border-b-2 border-r-2 border-primary/30 bg-card" />
          </div>
        </div>

        {/* Avatar button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative h-14 w-14 rounded-full bg-gradient-primary ring-2 ring-primary shadow-elegant transition-transform hover:scale-110"
          aria-label="Buy me a coffee"
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={iannazImg} alt={DONATION.name} />
            <AvatarFallback className="bg-gradient-primary font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* coffee badge */}
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-accent text-accent-foreground shadow">
            <Coffee className="h-3.5 w-3.5" />
          </span>
          {/* pulse ring */}
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full ring-2 ring-primary/50" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto p-4 sm:max-w-sm">
          <DialogHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 ring-2 ring-primary">
                <AvatarImage src={iannazImg} alt={DONATION.name} />
                <AvatarFallback className="bg-gradient-primary text-xs font-bold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <DialogTitle className="flex items-center gap-1 text-base">
                  <Coffee className="h-4 w-4 text-primary" /> Buy me a coffee
                </DialogTitle>
                <DialogDescription className="text-xs">by {DONATION.name}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <p className="flex gap-2 rounded-md bg-secondary/50 p-2 text-xs text-muted-foreground">
            <Heart className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
            <span>{DONATION.message}</span>
          </p>

          <div className="space-y-2.5">
            {DONATION.paymentMethods.map((method) => (
              <section key={method.name} className="space-y-1">
                <div className="flex items-center gap-2">
                  <img
                    src={method.icon}
                    alt={method.name}
                    className="h-5 w-auto object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <h3 className="text-xs font-semibold">{method.name}</h3>
                </div>
                {method.details.map((d) => (
                  <CopyRow key={d.label} label={d.label} value={d.value} />
                ))}
                {method.link && (
                  <Button asChild variant="outline" size="sm" className="h-8 w-full text-xs">
                    <a href={method.link} target="_blank" rel="noopener noreferrer">
                      Open {method.name}
                    </a>
                  </Button>
                )}
              </section>
            ))}
          </div>

          <p className="pt-1 text-center text-[10px] text-muted-foreground">
            Every coffee helps! Salamat! ☕
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
