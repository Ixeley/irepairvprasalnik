import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { sendInquiryEmail, type InquiryData } from "@/lib/send-email";

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

const MODELS: Record<string, string[]> = {
  apple_phone: [
    "iPhone SE (2020)", "iPhone SE (2022)", "iPhone SE (2024)",
    "iPhone 7", "iPhone 7 Plus",
    "iPhone 8", "iPhone 8 Plus",
    "iPhone X", "iPhone XS", "iPhone XS Max", "iPhone XR",
    "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
    "iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
    "iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
    "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
    "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
    "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
  ],
  apple_tablet: [
    "iPad 9 (2021)", "iPad 10 (2022)",
    "iPad mini 5", "iPad mini 6", "iPad mini 7",
    "iPad Air 4", "iPad Air 5", "iPad Air 11\" M2", "iPad Air 13\" M2",
    "iPad Pro 11\" (2020)", "iPad Pro 11\" (2021)", "iPad Pro 11\" (2022)", "iPad Pro 11\" M4",
    "iPad Pro 12.9\" (2020)", "iPad Pro 12.9\" (2021)", "iPad Pro 12.9\" (2022)", "iPad Pro 13\" M4",
  ],
  apple_laptop: [
    "MacBook Air 13\" M1 (2020)", "MacBook Air 13\" M2 (2022)", "MacBook Air 13\" M3 (2024)",
    "MacBook Air 15\" M2 (2023)", "MacBook Air 15\" M3 (2024)",
    "MacBook Pro 13\" M1 (2020)", "MacBook Pro 13\" M2 (2022)",
    "MacBook Pro 14\" M1 Pro (2021)", "MacBook Pro 14\" M2 Pro (2023)", "MacBook Pro 14\" M3 Pro (2023)", "MacBook Pro 14\" M4 Pro (2024)",
    "MacBook Pro 16\" M1 Pro (2021)", "MacBook Pro 16\" M2 Pro (2023)", "MacBook Pro 16\" M3 Pro (2023)", "MacBook Pro 16\" M4 Pro (2024)",
  ],
  samsung_phone: [
    "Galaxy S20", "Galaxy S20+", "Galaxy S20 Ultra",
    "Galaxy S21", "Galaxy S21+", "Galaxy S21 Ultra",
    "Galaxy S22", "Galaxy S22+", "Galaxy S22 Ultra",
    "Galaxy S23", "Galaxy S23+", "Galaxy S23 Ultra",
    "Galaxy S24", "Galaxy S24+", "Galaxy S24 Ultra",
    "Galaxy S25", "Galaxy S25+", "Galaxy S25 Ultra",
    "Galaxy A14", "Galaxy A15", "Galaxy A25",
    "Galaxy A32", "Galaxy A33", "Galaxy A34", "Galaxy A35",
    "Galaxy A51", "Galaxy A52", "Galaxy A52s", "Galaxy A53", "Galaxy A54", "Galaxy A55",
    "Galaxy A71", "Galaxy A72", "Galaxy A73",
    "Galaxy Z Fold 3", "Galaxy Z Fold 4", "Galaxy Z Fold 5", "Galaxy Z Fold 6",
    "Galaxy Z Flip 3", "Galaxy Z Flip 4", "Galaxy Z Flip 5", "Galaxy Z Flip 6",
  ],
  samsung_tablet: [
    "Galaxy Tab S6 Lite", "Galaxy Tab S6",
    "Galaxy Tab S7", "Galaxy Tab S7+", "Galaxy Tab S7 FE",
    "Galaxy Tab S8", "Galaxy Tab S8+", "Galaxy Tab S8 Ultra",
    "Galaxy Tab S9", "Galaxy Tab S9+", "Galaxy Tab S9 Ultra", "Galaxy Tab S9 FE",
    "Galaxy Tab S10", "Galaxy Tab S10+", "Galaxy Tab S10 Ultra",
    "Galaxy Tab A7", "Galaxy Tab A7 Lite", "Galaxy Tab A8",
  ],
  huawei_phone: [
    "P30 Lite", "P30", "P30 Pro",
    "P40 Lite", "P40", "P40 Pro",
    "P50", "P50 Pro",
    "Mate 30", "Mate 30 Pro",
    "Mate 40", "Mate 40 Pro",
    "Mate 50", "Mate 50 Pro",
    "Nova 5T", "Nova 7", "Nova 9", "Nova 10",
    "Y6p", "Y7a", "Y8p",
  ],
  huawei_tablet: [
    "MatePad 10.4", "MatePad 11", "MatePad Pro 10.8", "MatePad Pro 11",
    "MediaPad M6 8.4", "MediaPad M6 10.8", "MediaPad T10",
  ],
  xiaomi_phone: [
    "Redmi Note 8", "Redmi Note 9", "Redmi Note 9 Pro",
    "Redmi Note 10", "Redmi Note 10 Pro", "Redmi Note 10S",
    "Redmi Note 11", "Redmi Note 11 Pro", "Redmi Note 11S",
    "Redmi Note 12", "Redmi Note 12 Pro", "Redmi Note 12S",
    "Redmi Note 13", "Redmi Note 13 Pro", "Redmi Note 13 Pro+",
    "Redmi Note 14", "Redmi Note 14 Pro",
    "Redmi 9", "Redmi 9A", "Redmi 10", "Redmi 12", "Redmi 13",
    "Mi 11", "Mi 11 Ultra", "Mi 11 Lite",
    "Xiaomi 12", "Xiaomi 12 Pro", "Xiaomi 12 Lite",
    "Xiaomi 13", "Xiaomi 13 Pro", "Xiaomi 13 Lite",
    "Xiaomi 14", "Xiaomi 14 Pro",
    "POCO X3 NFC", "POCO X3 Pro", "POCO X5", "POCO X5 Pro", "POCO X6", "POCO X6 Pro",
    "POCO F3", "POCO F4", "POCO F5",
    "POCO M3", "POCO M4 Pro", "POCO M5",
  ],
  xiaomi_tablet: [
    "Xiaomi Pad 5", "Xiaomi Pad 5 Pro",
    "Xiaomi Pad 6", "Xiaomi Pad 6 Pro",
    "Redmi Pad", "Redmi Pad SE",
  ],
  oneplus_phone: [
    "OnePlus 8", "OnePlus 8 Pro", "OnePlus 8T",
    "OnePlus 9", "OnePlus 9 Pro", "OnePlus 9R",
    "OnePlus 10 Pro", "OnePlus 10T",
    "OnePlus 11", "OnePlus 11R",
    "OnePlus 12", "OnePlus 12R",
    "Nord CE 2", "Nord CE 2 Lite", "Nord CE 3", "Nord CE 3 Lite",
    "Nord 2T", "Nord 3", "Nord 4",
  ],
  google_phone: [
    "Pixel 4", "Pixel 4 XL", "Pixel 4a",
    "Pixel 5", "Pixel 5a",
    "Pixel 6", "Pixel 6 Pro", "Pixel 6a",
    "Pixel 7", "Pixel 7 Pro", "Pixel 7a",
    "Pixel 8", "Pixel 8 Pro", "Pixel 8a",
    "Pixel 9", "Pixel 9 Pro", "Pixel 9 Pro XL", "Pixel 9 Pro Fold",
  ],
  google_tablet: [
    "Pixel Tablet",
  ],
  sony_phone: [
    "Xperia 10 III", "Xperia 10 IV", "Xperia 10 V", "Xperia 10 VI",
    "Xperia 5 II", "Xperia 5 III", "Xperia 5 IV", "Xperia 5 V",
    "Xperia 1 II", "Xperia 1 III", "Xperia 1 IV", "Xperia 1 V", "Xperia 1 VI",
  ],
  nokia_phone: [
    "Nokia 5.4", "Nokia 6.2", "Nokia 7.2",
    "Nokia G10", "Nokia G20", "Nokia G21", "Nokia G22", "Nokia G42", "Nokia G60",
    "Nokia X10", "Nokia X20", "Nokia X30",
    "Nokia C21", "Nokia C22", "Nokia C32",
    "Nokia 3.4", "Nokia 4.2",
  ],
  motorola_phone: [
    "Moto G8 Plus", "Moto G8 Power",
    "Moto G9 Plus", "Moto G9 Play", "Moto G9 Power",
    "Moto G10", "Moto G20", "Moto G30", "Moto G31",
    "Moto G41", "Moto G51", "Moto G52", "Moto G53", "Moto G54",
    "Moto G62", "Moto G72", "Moto G82",
    "Edge 20", "Edge 20 Pro", "Edge 30", "Edge 30 Pro",
    "Edge 40", "Edge 40 Pro", "Edge 50", "Edge 50 Pro",
  ],
  hp_laptop: [
    "HP EliteBook 840 G7", "HP EliteBook 840 G8", "HP EliteBook 840 G9", "HP EliteBook 840 G10",
    "HP EliteBook 850 G7", "HP EliteBook 850 G8",
    "HP ProBook 450 G7", "HP ProBook 450 G8", "HP ProBook 450 G9", "HP ProBook 450 G10",
    "HP ProBook 640 G8", "HP ProBook 650 G5",
    "HP Pavilion 14", "HP Pavilion 15", "HP Pavilion x360 14",
    "HP Envy 13", "HP Envy 14", "HP Envy 15", "HP Envy x360 13", "HP Envy x360 15",
    "HP Spectre x360 13", "HP Spectre x360 14",
    "HP Omen 15", "HP Omen 16", "HP Omen 17",
    "HP Laptop 15s", "HP 250 G8", "HP 255 G8", "HP 255 G9",
  ],
  dell_laptop: [
    "Dell XPS 13 (9310)", "Dell XPS 13 (9315)", "Dell XPS 13 Plus (9320)",
    "Dell XPS 15 (9510)", "Dell XPS 15 (9520)", "Dell XPS 15 (9530)",
    "Dell XPS 17 (9710)", "Dell XPS 17 (9730)",
    "Dell Inspiron 15 3000", "Dell Inspiron 15 5000", "Dell Inspiron 15 7000",
    "Dell Inspiron 14 5000", "Dell Inspiron 14 7000",
    "Dell Inspiron 13 5000", "Dell Inspiron 13 7000",
    "Dell Latitude 5420", "Dell Latitude 5520",
    "Dell Latitude 7420", "Dell Latitude 7520",
    "Dell Latitude 5440", "Dell Latitude 5540",
    "Dell Vostro 15 3500", "Dell Vostro 15 5000",
    "Dell G15 (5510)", "Dell G15 (5515)", "Dell G16 (7620)",
  ],
  lenovo_laptop: [
    "ThinkPad X1 Carbon Gen 9", "ThinkPad X1 Carbon Gen 10", "ThinkPad X1 Carbon Gen 11", "ThinkPad X1 Carbon Gen 12",
    "ThinkPad X1 Yoga Gen 6", "ThinkPad X1 Yoga Gen 7", "ThinkPad X1 Yoga Gen 8",
    "ThinkPad T14 Gen 2", "ThinkPad T14 Gen 3", "ThinkPad T14 Gen 4",
    "ThinkPad T14s Gen 2", "ThinkPad T14s Gen 3",
    "ThinkPad E14 Gen 3", "ThinkPad E14 Gen 4", "ThinkPad E14 Gen 5",
    "ThinkPad E15 Gen 3", "ThinkPad E15 Gen 4",
    "IdeaPad 5 14", "IdeaPad 5 15", "IdeaPad Slim 5", "IdeaPad Slim 3",
    "Yoga 7 14", "Yoga 7 16", "Yoga 9 14",
    "Legion 5 15", "Legion 5 16", "Legion 5 Pro 16",
    "Legion 7 16", "IdeaPad Gaming 3",
  ],
  asus_laptop: [
    "ZenBook 14 UX425", "ZenBook 14 UX3402", "ZenBook 13 UX325",
    "ZenBook Pro 15 UX535", "ZenBook Pro 16X UX7602",
    "ZenBook Duo 14", "ZenBook Flip 13", "ZenBook Flip 15",
    "VivoBook 15", "VivoBook 14", "VivoBook S15 OLED", "VivoBook S14 OLED",
    "VivoBook Pro 15 OLED", "VivoBook Pro 16 OLED",
    "ROG Zephyrus G14 (2022)", "ROG Zephyrus G14 (2023)", "ROG Zephyrus G14 (2024)",
    "ROG Zephyrus G15", "ROG Zephyrus M16",
    "ROG Strix G15", "ROG Strix G17",
    "ROG Flow X13", "ROG Flow X16",
    "TUF Gaming A15", "TUF Gaming A17",
    "TUF Gaming F15", "TUF Gaming F17",
  ],
  acer_laptop: [
    "Aspire 3 A315", "Aspire 5 A515", "Aspire 7 A715",
    "Swift 3 SF314", "Swift 5 SF514", "Swift X SFX14",
    "Swift Go 14", "Swift Go 16",
    "Nitro 5 AN515", "Nitro 5 AN517", "Nitro V 15", "Nitro V 16",
    "Predator Helios 300", "Predator Helios 16", "Predator Helios Neo 16",
    "TravelMate P2", "TravelMate P4",
    "Extensa 15",
  ],
  msi_laptop: [
    "MSI Modern 14", "MSI Modern 15",
    "MSI Prestige 14 Evo", "MSI Prestige 15",
    "MSI GF63 Thin", "MSI GF65 Thin",
    "MSI GP66 Leopard", "MSI GP76 Leopard",
    "MSI GS66 Stealth", "MSI GS76 Stealth",
    "MSI GE66 Raider", "MSI GE76 Raider",
    "MSI Titan GT77",
    "MSI Creator 15", "MSI Creator 17",
    "MSI Cyborg 14", "MSI Cyborg 15",
    "MSI Katana GF66", "MSI Katana 15",
    "MSI Stealth 14", "MSI Stealth 15", "MSI Stealth 16",
  ],
  lg_laptop: [
    "LG Gram 14", "LG Gram 15", "LG Gram 16", "LG Gram 17",
    "LG Gram 2-in-1 14", "LG Gram 2-in-1 16",
    "LG UltraPC 14", "LG UltraPC 16",
  ],
  lg_phone: [
    "LG G8 ThinQ", "LG G8X ThinQ",
    "LG V50 ThinQ", "LG V50S ThinQ", "LG V60 ThinQ",
    "LG Velvet", "LG Wing",
    "LG K42", "LG K52", "LG K62",
    "LG Q52", "LG Q92",
  ],
  samsung_laptop: [
    "Galaxy Book Pro 360 13\"", "Galaxy Book Pro 360 15\"",
    "Galaxy Book Pro 13\"", "Galaxy Book Pro 15\"",
    "Galaxy Book2 Pro 360 13\"", "Galaxy Book2 Pro 360 15\"",
    "Galaxy Book2 Pro 13\"", "Galaxy Book2 Pro 15\"",
    "Galaxy Book3 Pro 360 13\"", "Galaxy Book3 Pro 360 16\"",
    "Galaxy Book3 Pro 14\"", "Galaxy Book3 Pro 16\"",
    "Galaxy Book4 Pro 360 14\"", "Galaxy Book4 Pro 16\"",
    "Galaxy Book4 Edge 14\"", "Galaxy Book4 Edge 16\"",
    "Galaxy Book2 15\"", "Galaxy Book3 15\"", "Galaxy Book4 15\"",
  ],
  huawei_laptop: [
    "MateBook D 14 (2020)", "MateBook D 14 (2021)", "MateBook D 14 (2022)", "MateBook D 14 (2023)",
    "MateBook D 15 (2020)", "MateBook D 15 (2021)", "MateBook D 15 (2022)",
    "MateBook D 16 (2022)", "MateBook D 16 (2023)",
    "MateBook 13 (2020)", "MateBook 14 (2020)", "MateBook 14 (2021)",
    "MateBook 14s", "MateBook 16s",
    "MateBook X Pro (2020)", "MateBook X Pro (2021)", "MateBook X Pro (2022)",
    "MateBook E",
  ],
  xiaomi_laptop: [
    "Mi Notebook Pro 14", "Mi Notebook Pro 15",
    "Mi Notebook Air 13.3\"", "Mi Notebook Air 12.5\"",
    "Mi Notebook 14", "Mi Notebook 15",
    "RedmiBook 14", "RedmiBook 15", "RedmiBook 16",
    "RedmiBook Pro 14", "RedmiBook Pro 15",
    "Xiaomi Book Pro 14", "Xiaomi Book S 12.4",
    "Mi Gaming Laptop 15.6\"",
  ],
  asus_phone: [
    "ZenFone 8", "ZenFone 9", "ZenFone 10", "ZenFone 11 Ultra",
    "ZenFone 8 Flip", "ZenFone 7 Pro",
    "ROG Phone 5", "ROG Phone 5 Pro", "ROG Phone 5s",
    "ROG Phone 6", "ROG Phone 6 Pro", "ROG Phone 6D",
    "ROG Phone 7", "ROG Phone 7 Ultimate",
    "ROG Phone 8", "ROG Phone 8 Pro",
  ],
  lenovo_tablet: [
    "Tab P11 Pro (Gen 1)", "Tab P11 Pro Gen 2",
    "Tab P11 (Gen 1)", "Tab P11 Gen 2",
    "Tab P12", "Tab P12 Pro",
    "Tab M10 FHD Plus", "Tab M10 Plus (Gen 3)",
    "Tab M11", "Tab M9",
    "Tab P10s", "Tab P11s",
    "Yoga Tab 11", "Yoga Tab 13",
    "Smart Tab M10 Plus",
  ],
  nokia_tablet: [
    "Nokia T10", "Nokia T20", "Nokia T21",
  ],
  motorola_tablet: [
    "Moto Tab G70", "Moto Tab G20", "Moto Tab G62",
  ],
  oneplus_tablet: [
    "OnePlus Pad", "OnePlus Pad 2", "OnePlus Pad Go",
  ],
  asus_tablet: [
    "ZenPad 3S 10", "ZenPad 10 M1000M",
    "ROG Flow Z13", "ROG Flow X13",
    "Chromebook Detachable CZ1", "Chromebook Detachable CM3",
  ],
  lg_tablet: [
    "LG G Pad 5 10.1", "LG G Pad IV 8.0",
    "LG G Pad III 8.0", "LG G Pad X II 8.0",
  ],
};

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
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const detectAndroidBrand = () => {
      if (/SM-/.test(ua)) return "samsung";
      if (/Xiaomi|Redmi|POCO/.test(ua)) return "xiaomi";
      if (/HUAWEI|HW-/.test(ua)) return "huawei";
      if (/OnePlus/.test(ua)) return "oneplus";
      if (/Pixel/.test(ua)) return "google";
      if (/Sony/.test(ua)) return "sony";
      if (/Nokia/.test(ua)) return "nokia";
      if (/moto/i.test(ua)) return "motorola";
      return "samsung";
    };
    if (/iPad/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))) {
      setDevice("tablet");
      setBrand(/iPad/.test(ua) ? "apple" : detectAndroidBrand());
    } else if (/iPhone|iPod/.test(ua)) {
      setDevice("phone");
      setBrand("apple");
    } else if (/Android/.test(ua)) {
      setDevice("phone");
      setBrand(detectAndroidBrand());
    } else {
      setDevice("laptop");
      if (/Macintosh/.test(ua)) setBrand("apple");
    }
  }, []);

  const modelSuggestions = (() => {
    const list = MODELS[`${brand}_${device}`] ?? [];
    if (!model.trim()) return list.slice(0, 8);
    return list.filter((m) => m.toLowerCase().includes(model.toLowerCase())).slice(0, 8);
  })();

  const toggleIssue = (issue: string) =>
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue],
    );

  const handleSubmit = async (e: FormEvent) => {
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

    setSending(true);
    try {
      const payload: InquiryData = { device, brand, model, issues, problem, name, email, phone };
      await sendInquiryEmail(payload);
      setSubmitted(true);
      setModel("");
      setIssues([]);
      setProblem("");
      setName("");
      setEmail("");
      setPhone("");
      setGdpr(false);
    } catch {
      toast.error("Napaka pri pošiljanju. Poskusite znova ali nas pokličite.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      <Toaster position="top-right" richColors />

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
                    <div className="relative">
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => {
                          setModel(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        placeholder="npr. iPhone 15 Pro ali Samsung Galaxy A54"
                        autoComplete="off"
                        className="w-full bg-card border border-border px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      {showSuggestions && modelSuggestions.length > 0 && (
                        <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-52 overflow-y-auto">
                          {modelSuggestions.map((s) => (
                            <li
                              key={s}
                              onMouseDown={() => {
                                setModel(s);
                                setShowSuggestions(false);
                              }}
                              className="px-4 py-2.5 text-sm hover:bg-primary/5 cursor-pointer border-b border-border/50 last:border-0"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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
                disabled={sending}
                className="w-full bg-foreground text-background font-bold py-5 rounded-md hover:bg-primary transition-colors uppercase tracking-widest shadow-lg shadow-black/5 animate-reveal [animation-delay:400ms] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? "Pošiljam..." : "Pošlji povpraševanje"}
              </button>

              {submitted && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl flex gap-4 items-start">
                  <div className="size-10 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="size-5 text-green-600"
                    >
                      <path d="M4 10l4.5 4.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 text-lg">
                      Povpraševanje uspešno poslano!
                    </h3>
                    <p className="text-green-700 text-sm mt-1">
                      Naši tehniki se vam bodo oglasili v najkrajšem možnem času. Odgovor
                      pričakujte na vaš e-poštni naslov.
                    </p>
                  </div>
                </div>
              )}
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
    </div>
  );
}
