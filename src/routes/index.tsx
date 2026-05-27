import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: RepairInquiryPage,
});

type DeviceType = "phone" | "laptop" | "tablet";

const DEVICE_TYPES: { id: DeviceType; title: string; sub: string }[] = [
  { id: "phone", title: "Mobilni telefon", sub: "iPhone, Samsung, Xiaomi..." },
  { id: "laptop", title: "Prenosnik", sub: "MacBook, Dell, HP..." },
  { id: "tablet", title: "Tablica", sub: "iPad, Galaxy Tab..." },
];

const BRANDS = [
  { id: "apple", label: "Apple", slug: "apple", color: "000000" },
  { id: "samsung", label: "Samsung", slug: "samsung", color: "1428A0" },
  { id: "huawei", label: "Huawei", slug: "huawei", color: "FF0000" },
  { id: "xiaomi", label: "Xiaomi", slug: "xiaomi", color: "FF6900" },
  { id: "oneplus", label: "OnePlus", slug: "oneplus", color: "EB0028" },
  { id: "google", label: "Google Pixel", slug: "google", color: "4285F4" },
  { id: "sony", label: "Sony", slug: "sony", color: "000000" },
  { id: "nokia", label: "Nokia", slug: "nokia", color: "124191" },
  { id: "hp", label: "HP", slug: "hp", color: "0096D6" },
  { id: "dell", label: "Dell", slug: "dell", color: "007DB8" },
  { id: "lenovo", label: "Lenovo", slug: "lenovo", color: "E2231A" },
  { id: "asus", label: "Asus", slug: "asus", color: "00539B" },
  { id: "acer", label: "Acer", slug: "acer", color: "83B81A" },
  { id: "msi", label: "MSI", slug: "msi", color: "FF0000" },
  { id: "lg", label: "LG", slug: "lg", color: "A50034" },
  { id: "motorola", label: "Motorola", slug: "motorola", color: "5C92FA" },
];

const COMMON_ISSUES: Record<DeviceType, string[]> = {
  phone: [
    "Razbit zaslon",
    "Baterija se hitro prazni",
    "Naprava se ne polni",
    "Pokvarjena kamera",
    "Zvočnik / mikrofon ne deluje",
    "Tipka za vklop / glasnost",
    "Stik z vodo",
    "Programska napaka / zatika se",
  ],
  laptop: [
    "Naprava se ne vklopi",
    "Razbit zaslon",
    "Tipkovnica ne deluje",
    "Pregrevanje / glasni ventilatorji",
    "Baterija ne drži",
    "Polnilec / priključek za polnjenje",
    "Počasno delovanje / virusi",
    "Zamenjava SSD / nadgradnja RAM",
  ],
  tablet: [
    "Razbit zaslon",
    "Baterija se hitro prazni",
    "Naprava se ne polni",
    "Touch zaslon ne deluje",
    "Zvočnik / mikrofon",
    "Programska napaka",
    "Stik z vodo",
    "Zamenjava stekla",
  ],
};

function RepairInquiryPage() {
  const [device, setDevice] = useState<DeviceType>("phone");
  const [brand, setBrand] = useState<string>("apple");
  const [model, setModel] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gdpr, setGdpr] = useState(false);

  const toggleIssue = (issue: string) =>
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue],
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!gdpr) {
      toast.error("Potrdite strinjanje s pogoji in GDPR.");
      return;
    }
    if (!model.trim() || !name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Izpolnite vsa obvezna polja.");
      return;
    }
    if (issues.length === 0 && !problem.trim()) {
      toast.error("Izberite vsaj eno težavo ali jo opišite spodaj.");
      return;
    }
    toast.success("Povpraševanje uspešno poslano!", {
      description: "Naši tehniki se vam bodo oglasili v najkrajšem možnem času.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="size-8 bg-foreground flex items-center justify-center rounded-sm">
              <span className="text-background font-black text-lg">iR</span>
            </div>
            <span className="font-bold tracking-tight text-xl">iRepair.si</span>
          </a>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-primary transition-colors">
              Popravila
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Rezervni deli
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Kontakt
            </a>
          </div>
          <div className="hidden sm:block text-xs font-mono bg-primary/5 text-primary px-3 py-1.5 rounded-full border border-primary/20">
            STATUS: DELAVNICA ODPRTA
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Column */}
          <div className="lg:col-span-8 space-y-12 animate-reveal">
            <header className="space-y-4">
              <div className="text-xs font-mono text-primary uppercase tracking-widest">
                Spletni obrazec za servis
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance uppercase">
                Oddajte povpraševanje{" "}
                <span className="text-primary">brezplačno</span>
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg text-pretty">
                Izpolnite spodnje podatke o vaši napravi in naši tehniki vam bodo v najkrajšem
                možnem času poslali neobvezujočo informativno ponudbo.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 01 Device Type */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs size-6 border border-border flex items-center justify-center rounded-full">
                    01
                  </span>
                  <h2 className="font-bold uppercase tracking-wide">Vrsta naprave</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DEVICE_TYPES.map((d) => {
                    const active = device === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDevice(d.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          active
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="block font-bold text-sm uppercase">{d.title}</span>
                        <span className="block text-xs text-muted-foreground mt-1">{d.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 02 Brand */}
              <section className="space-y-6 animate-reveal [animation-delay:100ms]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs size-6 border border-border flex items-center justify-center rounded-full">
                    02
                  </span>
                  <h2 className="font-bold uppercase tracking-wide">Znamka naprave</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {BRANDS.map((b) => {
                    const active = brand === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBrand(b.id)}
                        title={b.label}
                        className={`aspect-[4/3] bg-white border rounded-lg transition-all flex items-center justify-center p-5 ${
                          active
                            ? "border-primary ring-2 ring-primary/30 shadow-sm"
                            : "border-border hover:border-primary/60"
                        }`}
                      >
                        <img
                          src={`https://cdn.simpleicons.org/${b.slug}/${b.color}`}
                          alt={b.label}
                          loading="lazy"
                          className="max-h-16 max-w-full object-contain"
                        />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setBrand("other")}
                    className={`aspect-[4/3] bg-white border rounded-lg transition-all flex items-center justify-center border-dashed ${
                      brand === "other"
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/60"
                    }`}
                  >
                    <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                      Ostalo
                    </span>
                  </button>
                </div>
              </section>

              {/* 03 Details */}
              <section className="space-y-6 animate-reveal [animation-delay:200ms]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs size-6 border border-border flex items-center justify-center rounded-full">
                    03
                  </span>
                  <h2 className="font-bold uppercase tracking-wide">Podrobnosti o težavi</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1.5 text-muted-foreground">
                      Model naprave
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="npr. iPhone 13 Pro ali MacBook Air M1"
                      className="w-full bg-card border border-border px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-muted-foreground">
                      Najpogostejše napake{" "}
                      <span className="font-mono text-[10px] text-muted-foreground/70 normal-case">
                        (izberite eno ali več)
                      </span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {COMMON_ISSUES[device].map((issue) => {
                        const active = issues.includes(issue);
                        return (
                          <button
                            key={issue}
                            type="button"
                            onClick={() => toggleIssue(issue)}
                            className={`flex items-center gap-3 text-left px-3 py-2.5 border rounded-md transition-all text-sm ${
                              active
                                ? "border-primary bg-primary/5 text-foreground"
                                : "border-border hover:border-primary/50 text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`size-4 shrink-0 border-2 rounded flex items-center justify-center transition-all ${
                                active ? "bg-primary border-primary" : "border-border"
                              }`}
                            >
                              {active && (
                                <svg
                                  viewBox="0 0 16 16"
                                  className="size-3 text-primary-foreground"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            <span>{issue}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1.5 text-muted-foreground">
                      Drug opis težave{" "}
                      <span className="font-mono text-[10px] text-muted-foreground/70 normal-case">
                        (če napake ni na seznamu)
                      </span>
                    </label>
                    <textarea
                      rows={4}
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Opišite napako podrobneje ali navedite težavo, ki ni na seznamu zgoraj..."
                      className="w-full bg-card border border-border px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <label className="block group cursor-pointer">
                    <input type="file" accept="image/*" className="sr-only" />
                    <div className="w-full h-24 bg-muted/50 border border-dashed border-border rounded-md flex flex-col items-center justify-center group-hover:bg-muted transition-colors">
                      <span className="text-xs font-mono text-muted-foreground uppercase">
                        Naloži fotografijo napake (neobvezno)
                      </span>
                    </div>
                  </label>
                </div>
              </section>

              {/* 04 Contact */}
              <section className="space-y-6 animate-reveal [animation-delay:300ms]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs size-6 border border-border flex items-center justify-center rounded-full">
                    04
                  </span>
                  <h2 className="font-bold uppercase tracking-wide">Kontaktni podatki</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Ime in priimek"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-card border border-border px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <input
                    type="email"
                    placeholder="E-poštni naslov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-card border border-border px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Telefonska številka"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-card border border-border px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary md:col-span-2"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gdpr}
                    onChange={(e) => setGdpr(e.target.checked)}
                    className="mt-1 size-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Strinjam se s pogoji poslovanja in dovoljujem obdelavo osebnih podatkov za
                    namen priprave ponudbe (GDPR).
                  </span>
                </label>
              </section>

              <button
                type="submit"
                className="w-full bg-foreground text-background font-bold py-5 rounded-md hover:bg-primary transition-colors uppercase tracking-widest shadow-lg shadow-black/5 animate-reveal [animation-delay:400ms]"
              >
                Pošlji povpraševanje
              </button>
            </form>
          </div>

          {/* Side Panel */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="p-8 bg-foreground text-background rounded-2xl space-y-6 animate-reveal [animation-delay:500ms]">
                <h3 className="text-xl font-bold uppercase tracking-tight">Zakaj iRepair?</h3>
                <ul className="space-y-6">
                  {[
                    {
                      tag: "24h",
                      title: "Hiter odziv",
                      desc: "Večina popravil je zaključenih v istem delovnem dnevu.",
                    },
                    {
                      tag: "€0",
                      title: "Brezplačna diagnostika",
                      desc: "Če naprave ne popravimo, ne plačate ničesar.",
                    },
                    {
                      tag: "12m",
                      title: "Garancija",
                      desc: "Na vsa opravljena popravila nudimo do 12 mesecev garancije.",
                    },
                    {
                      tag: "📦",
                      title: "Brezplačen prevzem",
                      desc: "Pošljite napravo po pošti ali naročite naš prevzem na domu.",
                    },
                  ].map((f) => (
                    <li key={f.title} className="flex gap-4">
                      <div className="shrink-0 size-10 border border-background/20 flex items-center justify-center rounded-lg">
                        <span className="font-mono text-xs">{f.tag}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm uppercase">{f.title}</h4>
                        <p className="text-background/60 text-xs mt-1">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-background/10 text-center">
                  <p className="text-[10px] font-mono text-background/40 uppercase">
                    iRepair Tehnična Podpora d.o.o.
                  </p>
                </div>
              </div>

              <div className="p-6 border border-border rounded-2xl bg-card">
                <div className="text-xs font-bold text-muted-foreground uppercase mb-4">
                  Imate vprašanje?
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pokličite nas:</span>
                    <a href="tel:+38641123456" className="font-bold hover:text-primary">
                      041 123 456
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pišite nam:</span>
                    <a href="mailto:info@irepair.si" className="font-bold hover:text-primary">
                      info@irepair.si
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-border py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} iRepair.si — Vse pravice pridržane.
          </div>
          <div className="flex gap-6 text-xs font-mono text-muted-foreground uppercase">
            <a href="#" className="hover:text-primary">
              Zasebnost
            </a>
            <a href="#" className="hover:text-primary">
              Pogoji
            </a>
            <a href="#" className="hover:text-primary">
              Lokacije
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
