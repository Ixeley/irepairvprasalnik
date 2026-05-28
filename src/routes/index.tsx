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
    "iPhone 5s",
    "iPhone 6", "iPhone 6 Plus", "iPhone 6s", "iPhone 6s Plus",
    "iPhone SE (2016)", "iPhone SE (2020)", "iPhone SE (2022)", "iPhone SE (2024)",
    "iPhone 7", "iPhone 7 Plus",
    "iPhone 8", "iPhone 8 Plus",
    "iPhone X", "iPhone XS", "iPhone XS Max", "iPhone XR",
    "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
    "iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
    "iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
    "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
    "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
    "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
    "iPhone 17", "iPhone 17 Air", "iPhone 17 Pro", "iPhone 17 Pro Max",
  ],
  apple_tablet: [
    "iPad 9 (2021)", "iPad 10 (2022)",
    "iPad mini 5", "iPad mini 6", "iPad mini 7",
    "iPad Air 4", "iPad Air 5", "iPad Air 11\" M2", "iPad Air 13\" M2",
    "iPad Pro 11\" (2020)", "iPad Pro 11\" (2021)", "iPad Pro 11\" (2022)", "iPad Pro 11\" M4",
    "iPad Pro 12.9\" (2020)", "iPad Pro 12.9\" (2021)", "iPad Pro 12.9\" (2022)", "iPad Pro 13\" M4",
  ],
  apple_laptop: [
    // MacBook Air
    "MacBook Air 11\" (2011)", "MacBook Air 11\" (2012)", "MacBook Air 11\" (2013)", "MacBook Air 11\" (2014)", "MacBook Air 11\" (2015)",
    "MacBook Air 13\" (2012)", "MacBook Air 13\" (2013)", "MacBook Air 13\" (2014)", "MacBook Air 13\" (2015)", "MacBook Air 13\" (2016)", "MacBook Air 13\" (2017)", "MacBook Air 13\" (2018)", "MacBook Air 13\" (2019)", "MacBook Air 13\" (2020 Intel)",
    "MacBook Air 13\" M1 (2020)", "MacBook Air 13\" M2 (2022)", "MacBook Air 13\" M3 (2024)",
    "MacBook Air 15\" M2 (2023)", "MacBook Air 15\" M3 (2024)",
    // MacBook Pro 13"
    "MacBook Pro 13\" (2012)", "MacBook Pro 13\" Retina (2012)", "MacBook Pro 13\" Retina (2013)", "MacBook Pro 13\" Retina (2014)", "MacBook Pro 13\" Retina (2015)",
    "MacBook Pro 13\" (2016)", "MacBook Pro 13\" (2017)", "MacBook Pro 13\" (2018)", "MacBook Pro 13\" (2019)", "MacBook Pro 13\" (2020 Intel)",
    "MacBook Pro 13\" M1 (2020)", "MacBook Pro 13\" M2 (2022)",
    // MacBook Pro 14"
    "MacBook Pro 14\" M1 Pro (2021)", "MacBook Pro 14\" M1 Max (2021)",
    "MacBook Pro 14\" M2 Pro (2023)", "MacBook Pro 14\" M2 Max (2023)",
    "MacBook Pro 14\" M3 (2023)", "MacBook Pro 14\" M3 Pro (2023)", "MacBook Pro 14\" M3 Max (2023)",
    "MacBook Pro 14\" M4 (2024)", "MacBook Pro 14\" M4 Pro (2024)", "MacBook Pro 14\" M4 Max (2024)",
    // MacBook Pro 15"
    "MacBook Pro 15\" Retina (2012)", "MacBook Pro 15\" Retina (2013)", "MacBook Pro 15\" Retina (2014)", "MacBook Pro 15\" Retina (2015)", "MacBook Pro 15\" (2016)", "MacBook Pro 15\" (2017)", "MacBook Pro 15\" (2018)", "MacBook Pro 15\" (2019)",
    // MacBook Pro 16"
    "MacBook Pro 16\" (2019 Intel)", "MacBook Pro 16\" (2020 Intel)",
    "MacBook Pro 16\" M1 Pro (2021)", "MacBook Pro 16\" M1 Max (2021)",
    "MacBook Pro 16\" M2 Pro (2023)", "MacBook Pro 16\" M2 Max (2023)",
    "MacBook Pro 16\" M3 Pro (2023)", "MacBook Pro 16\" M3 Max (2023)",
    "MacBook Pro 16\" M4 Pro (2024)", "MacBook Pro 16\" M4 Max (2024)",
    // MacBook 12" Retina
    "MacBook 12\" Retina (2015)", "MacBook 12\" Retina (2016)", "MacBook 12\" Retina (2017)",
  ],
  samsung_phone: [
    // J serija (2013–2019)
    "Galaxy J1", "Galaxy J1 Ace", "Galaxy J1 mini",
    "Galaxy J2", "Galaxy J2 Core", "Galaxy J2 Prime", "Galaxy J2 Pro",
    "Galaxy J3", "Galaxy J3 Pro",
    "Galaxy J4", "Galaxy J4+", "Galaxy J4 Core",
    "Galaxy J5", "Galaxy J5 Prime", "Galaxy J5 Pro",
    "Galaxy J6", "Galaxy J6+",
    "Galaxy J7", "Galaxy J7 Neo", "Galaxy J7 Prime", "Galaxy J7 Pro", "Galaxy J7 Duo", "Galaxy J7 Max",
    "Galaxy J8",
    // Note serija
    "Galaxy Note 3", "Galaxy Note 4", "Galaxy Note 5",
    "Galaxy Note 8", "Galaxy Note 9",
    "Galaxy Note 10", "Galaxy Note 10+", "Galaxy Note 10 Lite",
    "Galaxy Note 20", "Galaxy Note 20 Ultra",
    // S serija
    "Galaxy S4", "Galaxy S4 Mini",
    "Galaxy S5", "Galaxy S5 Mini",
    "Galaxy S6", "Galaxy S6 Edge", "Galaxy S6 Edge+",
    "Galaxy S7", "Galaxy S7 Edge",
    "Galaxy S8", "Galaxy S8+",
    "Galaxy S9", "Galaxy S9+",
    "Galaxy S10e", "Galaxy S10", "Galaxy S10+", "Galaxy S10 Lite",
    "Galaxy S20", "Galaxy S20+", "Galaxy S20 Ultra", "Galaxy S20 FE",
    "Galaxy S21", "Galaxy S21+", "Galaxy S21 Ultra", "Galaxy S21 FE",
    "Galaxy S22", "Galaxy S22+", "Galaxy S22 Ultra", "Galaxy S22 FE",
    "Galaxy S23", "Galaxy S23+", "Galaxy S23 Ultra", "Galaxy S23 FE",
    "Galaxy S24", "Galaxy S24+", "Galaxy S24 Ultra", "Galaxy S24 FE",
    "Galaxy S25", "Galaxy S25+", "Galaxy S25 Ultra", "Galaxy S25 Edge",
    // A serija
    "Galaxy A01", "Galaxy A02", "Galaxy A02s", "Galaxy A03", "Galaxy A03s", "Galaxy A03 Core",
    "Galaxy A04", "Galaxy A04s", "Galaxy A05", "Galaxy A05s",
    "Galaxy A10", "Galaxy A10e", "Galaxy A10s",
    "Galaxy A11", "Galaxy A12",
    "Galaxy A13", "Galaxy A13 5G", "Galaxy A14", "Galaxy A14 5G",
    "Galaxy A15", "Galaxy A15 5G",
    "Galaxy A20", "Galaxy A20e", "Galaxy A20s",
    "Galaxy A21", "Galaxy A21s",
    "Galaxy A22", "Galaxy A22 5G",
    "Galaxy A23", "Galaxy A23 5G", "Galaxy A24",
    "Galaxy A25", "Galaxy A25 5G",
    "Galaxy A30", "Galaxy A30s", "Galaxy A31",
    "Galaxy A32", "Galaxy A32 5G", "Galaxy A33 5G", "Galaxy A34 5G", "Galaxy A35 5G", "Galaxy A36 5G",
    "Galaxy A40", "Galaxy A41", "Galaxy A42 5G",
    "Galaxy A50", "Galaxy A50s", "Galaxy A51", "Galaxy A51 5G",
    "Galaxy A52", "Galaxy A52 5G", "Galaxy A52s 5G", "Galaxy A53 5G", "Galaxy A54 5G", "Galaxy A55 5G", "Galaxy A56 5G",
    "Galaxy A70", "Galaxy A70s", "Galaxy A71", "Galaxy A71 5G",
    "Galaxy A72", "Galaxy A73 5G",
    "Galaxy A80", "Galaxy A90 5G",
    // M serija
    "Galaxy M01", "Galaxy M02", "Galaxy M02s",
    "Galaxy M10", "Galaxy M10s", "Galaxy M11", "Galaxy M12",
    "Galaxy M13", "Galaxy M13 5G", "Galaxy M14", "Galaxy M14 5G", "Galaxy M15 5G",
    "Galaxy M20", "Galaxy M21", "Galaxy M21s", "Galaxy M22", "Galaxy M23 5G",
    "Galaxy M30", "Galaxy M30s", "Galaxy M31", "Galaxy M31s",
    "Galaxy M32", "Galaxy M32 5G", "Galaxy M33 5G", "Galaxy M34 5G", "Galaxy M35 5G",
    "Galaxy M40", "Galaxy M51", "Galaxy M52 5G", "Galaxy M53 5G", "Galaxy M54 5G", "Galaxy M55 5G",
    // F serija
    "Galaxy F13", "Galaxy F23", "Galaxy F42 5G", "Galaxy F54",
    // Xcover (rugged)
    "Galaxy Xcover 4", "Galaxy Xcover 4s", "Galaxy Xcover 5", "Galaxy Xcover 6 Pro", "Galaxy Xcover 7",
    // Grand / Core / Win (stari)
    "Galaxy Grand Prime", "Galaxy Grand Prime Pro",
    "Galaxy Core Prime", "Galaxy Core 2",
    "Galaxy Win",
    // Z serija (zložljivi)
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
    // P serija
    "P10", "P10 Plus", "P10 Lite",
    "P20", "P20 Pro", "P20 Lite",
    "P30 Lite", "P30", "P30 Pro",
    "P40 Lite", "P40 Lite E", "P40", "P40 Pro",
    "P50", "P50 Pro",
    "P Smart 2019", "P Smart 2020", "P Smart 2021", "P Smart Z",
    // Mate serija
    "Mate 10", "Mate 10 Pro",
    "Mate 20", "Mate 20 Pro", "Mate 20 Lite", "Mate 20 X",
    "Mate 30", "Mate 30 Pro",
    "Mate 40", "Mate 40 Pro",
    "Mate 50", "Mate 50 Pro",
    // Nova serija
    "Nova 3", "Nova 3i",
    "Nova 5T",
    "Nova 7", "Nova 7i",
    "Nova 8", "Nova 8i",
    "Nova 9", "Nova 9 SE",
    "Nova 10", "Nova 10 SE",
    "Nova 11",
    // Y serija
    "Y5p", "Y6p", "Y7a", "Y8p", "Y8s", "Y9a",
    "Y5 2019", "Y6 2019", "Y7 2019", "Y9 2019",
    "Y6s", "Y7p", "Y9s",
  ],
  huawei_tablet: [
    "MatePad 10.4", "MatePad 11", "MatePad Pro 10.8", "MatePad Pro 11",
    "MediaPad M6 8.4", "MediaPad M6 10.8", "MediaPad T10",
  ],
  xiaomi_phone: [
    // Redmi Note serija
    "Redmi Note 5", "Redmi Note 5 Pro",
    "Redmi Note 6 Pro",
    "Redmi Note 7", "Redmi Note 7 Pro",
    "Redmi Note 8", "Redmi Note 8 Pro", "Redmi Note 8T",
    "Redmi Note 9", "Redmi Note 9 Pro", "Redmi Note 9S", "Redmi Note 9 Pro Max",
    "Redmi Note 10", "Redmi Note 10 Pro", "Redmi Note 10S", "Redmi Note 10 Pro Max",
    "Redmi Note 11", "Redmi Note 11 Pro", "Redmi Note 11S", "Redmi Note 11 Pro+",
    "Redmi Note 12", "Redmi Note 12 Pro", "Redmi Note 12S", "Redmi Note 12 Pro+", "Redmi Note 12 Turbo",
    "Redmi Note 13", "Redmi Note 13 Pro", "Redmi Note 13S", "Redmi Note 13 Pro+",
    "Redmi Note 14", "Redmi Note 14 Pro", "Redmi Note 14 Pro+",
    // Redmi serija
    "Redmi 6", "Redmi 6A",
    "Redmi 7", "Redmi 7A",
    "Redmi 8", "Redmi 8A",
    "Redmi 9", "Redmi 9A", "Redmi 9C", "Redmi 9T",
    "Redmi 10", "Redmi 10A", "Redmi 10C",
    "Redmi 12", "Redmi 12C",
    "Redmi 13", "Redmi 13C",
    // Mi / Xiaomi serija
    "Mi 9", "Mi 9T", "Mi 9T Pro",
    "Mi 10", "Mi 10 Pro", "Mi 10 Lite", "Mi 10T", "Mi 10T Pro",
    "Mi 11", "Mi 11 Ultra", "Mi 11 Lite", "Mi 11 Lite 5G", "Mi 11i",
    "Xiaomi 11T", "Xiaomi 11T Pro",
    "Xiaomi 12", "Xiaomi 12 Pro", "Xiaomi 12 Lite", "Xiaomi 12T", "Xiaomi 12T Pro",
    "Xiaomi 13", "Xiaomi 13 Pro", "Xiaomi 13 Lite", "Xiaomi 13T", "Xiaomi 13T Pro",
    "Xiaomi 14", "Xiaomi 14 Pro", "Xiaomi 14 Ultra", "Xiaomi 14T", "Xiaomi 14T Pro",
    "Xiaomi 15", "Xiaomi 15 Pro", "Xiaomi 15 Ultra",
    // POCO serija
    "POCO X2", "POCO X3", "POCO X3 NFC", "POCO X3 Pro", "POCO X3 GT",
    "POCO X4", "POCO X4 Pro 5G", "POCO X4 GT",
    "POCO X5", "POCO X5 Pro", "POCO X6", "POCO X6 Pro", "POCO X6 Neo",
    "POCO F1", "POCO F2 Pro", "POCO F3", "POCO F3 GT", "POCO F4", "POCO F4 GT", "POCO F5", "POCO F5 Pro",
    "POCO M2", "POCO M2 Pro", "POCO M3", "POCO M3 Pro", "POCO M4", "POCO M4 Pro", "POCO M4 Pro 5G",
    "POCO M5", "POCO M5s", "POCO M6", "POCO M6 Pro",
    "POCO C40", "POCO C50", "POCO C55", "POCO C65",
  ],
  xiaomi_tablet: [
    "Xiaomi Pad 5", "Xiaomi Pad 5 Pro",
    "Xiaomi Pad 6", "Xiaomi Pad 6 Pro",
    "Redmi Pad", "Redmi Pad SE",
  ],
  oneplus_phone: [
    "OnePlus 5", "OnePlus 5T",
    "OnePlus 6", "OnePlus 6T",
    "OnePlus 7", "OnePlus 7 Pro", "OnePlus 7T", "OnePlus 7T Pro",
    "OnePlus 8", "OnePlus 8 Pro", "OnePlus 8T",
    "OnePlus 9", "OnePlus 9 Pro", "OnePlus 9R", "OnePlus 9RT",
    "OnePlus 10 Pro", "OnePlus 10T", "OnePlus 10R",
    "OnePlus 11", "OnePlus 11R",
    "OnePlus 12", "OnePlus 12R",
    "OnePlus 13", "OnePlus 13R",
    "Nord", "Nord 2", "Nord 2T", "Nord 3", "Nord 4",
    "Nord CE", "Nord CE 2", "Nord CE 2 Lite", "Nord CE 3", "Nord CE 3 Lite", "Nord CE 4",
    "Nord N10", "Nord N100", "Nord N20", "Nord N200",
  ],
  google_phone: [
    "Pixel 2", "Pixel 2 XL",
    "Pixel 3", "Pixel 3 XL", "Pixel 3a", "Pixel 3a XL",
    "Pixel 4", "Pixel 4 XL", "Pixel 4a", "Pixel 4a 5G",
    "Pixel 5", "Pixel 5a",
    "Pixel 6", "Pixel 6 Pro", "Pixel 6a",
    "Pixel 7", "Pixel 7 Pro", "Pixel 7a",
    "Pixel 8", "Pixel 8 Pro", "Pixel 8a",
    "Pixel 9", "Pixel 9 Pro", "Pixel 9 Pro XL", "Pixel 9 Pro Fold",
    "Pixel Fold",
  ],
  google_tablet: [
    "Pixel Tablet",
  ],
  sony_phone: [
    // Z serija (stara)
    "Xperia Z3", "Xperia Z3 Compact", "Xperia Z3+",
    "Xperia Z5", "Xperia Z5 Compact", "Xperia Z5 Premium",
    // X serija
    "Xperia X", "Xperia X Compact", "Xperia X Performance",
    "Xperia XA", "Xperia XA1", "Xperia XA1 Plus", "Xperia XA1 Ultra",
    "Xperia XA2", "Xperia XA2 Plus", "Xperia XA2 Ultra",
    // XZ serija
    "Xperia XZ", "Xperia XZs",
    "Xperia XZ1", "Xperia XZ1 Compact",
    "Xperia XZ2", "Xperia XZ2 Compact", "Xperia XZ2 Premium",
    "Xperia XZ3",
    // Moderna serija
    "Xperia L4", "Xperia L3",
    "Xperia 10", "Xperia 10 Plus",
    "Xperia 10 II",
    "Xperia 10 III", "Xperia 10 III Lite",
    "Xperia 10 IV", "Xperia 10 V", "Xperia 10 VI",
    "Xperia 5", "Xperia 5 II", "Xperia 5 III", "Xperia 5 IV", "Xperia 5 V",
    "Xperia 1", "Xperia 1 II", "Xperia 1 III", "Xperia 1 IV", "Xperia 1 V", "Xperia 1 VI",
  ],
  nokia_phone: [
    // Klasični modeli
    "Nokia 2.2", "Nokia 2.3", "Nokia 2.4",
    "Nokia 3.1", "Nokia 3.2", "Nokia 3.4",
    "Nokia 4.2",
    "Nokia 5.1", "Nokia 5.1 Plus", "Nokia 5.3", "Nokia 5.4",
    "Nokia 6.1", "Nokia 6.1 Plus", "Nokia 6.2",
    "Nokia 7.1", "Nokia 7.2",
    "Nokia 8.1", "Nokia 8.3 5G",
    "Nokia 9 PureView",
    // C serija
    "Nokia C1", "Nokia C2", "Nokia C3",
    "Nokia C20", "Nokia C21", "Nokia C21 Plus",
    "Nokia C22", "Nokia C30", "Nokia C32",
    // G serija
    "Nokia G10", "Nokia G11", "Nokia G20", "Nokia G21",
    "Nokia G22", "Nokia G42", "Nokia G50", "Nokia G60",
    // X serija
    "Nokia X10", "Nokia X20", "Nokia X30",
    // T serija (tablice — v nokia_tablet)
  ],
  motorola_phone: [
    // Moto G serija
    "Moto G6", "Moto G6 Play", "Moto G6 Plus",
    "Moto G7", "Moto G7 Play", "Moto G7 Power", "Moto G7 Plus",
    "Moto G8", "Moto G8 Play", "Moto G8 Plus", "Moto G8 Power",
    "Moto G9", "Moto G9 Play", "Moto G9 Plus", "Moto G9 Power",
    "Moto G10", "Moto G10 Power",
    "Moto G20", "Moto G22", "Moto G30", "Moto G31",
    "Moto G32", "Moto G41", "Moto G42",
    "Moto G51", "Moto G52", "Moto G53", "Moto G53s",
    "Moto G54", "Moto G54 Power",
    "Moto G55", "Moto G60", "Moto G60s",
    "Moto G62", "Moto G71", "Moto G71s",
    "Moto G72", "Moto G73", "Moto G82", "Moto G84", "Moto G85",
    // Edge serija
    "Moto Edge 20", "Moto Edge 20 Lite", "Moto Edge 20 Pro",
    "Moto Edge 30", "Moto Edge 30 Fusion", "Moto Edge 30 Neo", "Moto Edge 30 Pro", "Moto Edge 30 Ultra",
    "Moto Edge 40", "Moto Edge 40 Neo", "Moto Edge 40 Pro",
    "Moto Edge 50", "Moto Edge 50 Neo", "Moto Edge 50 Pro", "Moto Edge 50 Ultra", "Moto Edge 50 Fusion",
    // Razr serija (zložljivi)
    "Moto Razr 5G", "Moto Razr 40", "Moto Razr 40 Ultra", "Moto Razr+ (2023)",
    "Moto Razr 50", "Moto Razr 50 Ultra",
    // E serija
    "Moto E6", "Moto E6 Plus", "Moto E7", "Moto E7 Plus", "Moto E7i Power",
    "Moto E20", "Moto E22", "Moto E22i", "Moto E32", "Moto E40",
  ],
  hp_laptop: [
    // EliteBook
    "HP EliteBook 840 G5", "HP EliteBook 840 G6", "HP EliteBook 840 G7", "HP EliteBook 840 G8", "HP EliteBook 840 G9", "HP EliteBook 840 G10",
    "HP EliteBook 850 G5", "HP EliteBook 850 G6", "HP EliteBook 850 G7", "HP EliteBook 850 G8",
    "HP EliteBook 1040 G8", "HP EliteBook 1040 G9", "HP EliteBook 1040 G10",
    "HP EliteBook x360 830 G5", "HP EliteBook x360 830 G6", "HP EliteBook x360 1030 G7",
    // ProBook
    "HP ProBook 430 G6", "HP ProBook 430 G7", "HP ProBook 430 G8",
    "HP ProBook 450 G6", "HP ProBook 450 G7", "HP ProBook 450 G8", "HP ProBook 450 G9", "HP ProBook 450 G10",
    "HP ProBook 455 G7", "HP ProBook 455 G8", "HP ProBook 455 G9",
    "HP ProBook 640 G5", "HP ProBook 640 G8",
    "HP ProBook 650 G4", "HP ProBook 650 G5",
    // Pavilion
    "HP Pavilion 14 (2020)", "HP Pavilion 14 (2021)", "HP Pavilion 14 (2022)", "HP Pavilion 14 (2023)",
    "HP Pavilion 15 (2020)", "HP Pavilion 15 (2021)", "HP Pavilion 15 (2022)", "HP Pavilion 15 (2023)",
    "HP Pavilion 17",
    "HP Pavilion x360 14 (2021)", "HP Pavilion x360 14 (2022)", "HP Pavilion x360 14 (2023)",
    "HP Pavilion Aero 13",
    // Envy
    "HP Envy 13 (2020)", "HP Envy 13 (2021)",
    "HP Envy 14 (2021)", "HP Envy 14 (2022)",
    "HP Envy 15 (2020)", "HP Envy 15 (2021)",
    "HP Envy 17",
    "HP Envy x360 13 (2021)", "HP Envy x360 13 (2022)", "HP Envy x360 13 (2023)",
    "HP Envy x360 15 (2021)", "HP Envy x360 15 (2022)", "HP Envy x360 15 (2023)",
    // Spectre
    "HP Spectre x360 13 (2020)", "HP Spectre x360 13 (2021)",
    "HP Spectre x360 14 (2021)", "HP Spectre x360 14 (2022)", "HP Spectre x360 14 (2023)",
    "HP Spectre x360 16",
    // Omen (gaming)
    "HP Omen 15 (2020)", "HP Omen 15 (2021)",
    "HP Omen 16 (2021)", "HP Omen 16 (2022)", "HP Omen 16 (2023)",
    "HP Omen 17 (2021)", "HP Omen 17 (2022)",
    "HP Omen Transcend 14",
    // Victus (gaming)
    "HP Victus 15 (2021)", "HP Victus 15 (2022)", "HP Victus 15 (2023)",
    "HP Victus 16 (2021)", "HP Victus 16 (2022)", "HP Victus 16 (2023)",
    // ZBook
    "HP ZBook Firefly 14 G7", "HP ZBook Firefly 14 G8", "HP ZBook Firefly 14 G9",
    "HP ZBook Studio G7", "HP ZBook Studio G8",
    // Splošni
    "HP Laptop 15s-fq", "HP Laptop 15s-eq",
    "HP 250 G7", "HP 250 G8", "HP 250 G9", "HP 250 G10",
    "HP 255 G7", "HP 255 G8", "HP 255 G9", "HP 255 G10",
  ],
  dell_laptop: [
    // XPS serija
    "Dell XPS 13 (9300)", "Dell XPS 13 (9310)", "Dell XPS 13 (9315)", "Dell XPS 13 Plus (9320)", "Dell XPS 13 (9340)",
    "Dell XPS 15 (9500)", "Dell XPS 15 (9510)", "Dell XPS 15 (9520)", "Dell XPS 15 (9530)", "Dell XPS 15 (9560)",
    "Dell XPS 17 (9700)", "Dell XPS 17 (9710)", "Dell XPS 17 (9720)", "Dell XPS 17 (9730)",
    // Inspiron serija
    "Dell Inspiron 13 5301", "Dell Inspiron 13 5310", "Dell Inspiron 13 5320",
    "Dell Inspiron 14 5402", "Dell Inspiron 14 5410", "Dell Inspiron 14 5415", "Dell Inspiron 14 5420", "Dell Inspiron 14 5430",
    "Dell Inspiron 14 7415", "Dell Inspiron 14 7420", "Dell Inspiron 14 7430 2-in-1",
    "Dell Inspiron 15 3501", "Dell Inspiron 15 3511", "Dell Inspiron 15 3520", "Dell Inspiron 15 3530",
    "Dell Inspiron 15 5501", "Dell Inspiron 15 5510", "Dell Inspiron 15 5515", "Dell Inspiron 15 5520", "Dell Inspiron 15 5530",
    "Dell Inspiron 15 7500", "Dell Inspiron 15 7510", "Dell Inspiron 15 7520",
    "Dell Inspiron 16 5620", "Dell Inspiron 16 5625", "Dell Inspiron 16 5630",
    "Dell Inspiron 16 7610", "Dell Inspiron 16 7620", "Dell Inspiron 16 7630",
    "Dell Inspiron 17 3793", "Dell Inspiron 17 5702",
    // Latitude serija
    "Dell Latitude 5310", "Dell Latitude 5320", "Dell Latitude 5330",
    "Dell Latitude 5410", "Dell Latitude 5420", "Dell Latitude 5430",
    "Dell Latitude 5510", "Dell Latitude 5520", "Dell Latitude 5530",
    "Dell Latitude 7310", "Dell Latitude 7320", "Dell Latitude 7330",
    "Dell Latitude 7410", "Dell Latitude 7420", "Dell Latitude 7430",
    "Dell Latitude 5440", "Dell Latitude 5540",
    "Dell Latitude 7440", "Dell Latitude 7540",
    // Vostro serija
    "Dell Vostro 14 3400", "Dell Vostro 14 3401", "Dell Vostro 14 3430",
    "Dell Vostro 14 5402", "Dell Vostro 14 5410", "Dell Vostro 14 5415",
    "Dell Vostro 15 3500", "Dell Vostro 15 3510", "Dell Vostro 15 3520", "Dell Vostro 15 3530",
    "Dell Vostro 15 5502", "Dell Vostro 15 5510", "Dell Vostro 15 5515",
    // Gaming - G serija
    "Dell G15 5510", "Dell G15 5511", "Dell G15 5515", "Dell G15 5520", "Dell G15 5525", "Dell G15 5530",
    "Dell G16 7620", "Dell G16 7630",
    // Alienware
    "Dell Alienware m15 R4", "Dell Alienware m15 R5", "Dell Alienware m15 R6", "Dell Alienware m15 R7",
    "Dell Alienware m16 R1", "Dell Alienware m16 R2",
    "Dell Alienware x14", "Dell Alienware x15 R1", "Dell Alienware x15 R2",
  ],
  lenovo_laptop: [
    // ThinkPad X1
    "ThinkPad X1 Carbon Gen 7", "ThinkPad X1 Carbon Gen 8", "ThinkPad X1 Carbon Gen 9", "ThinkPad X1 Carbon Gen 10", "ThinkPad X1 Carbon Gen 11", "ThinkPad X1 Carbon Gen 12",
    "ThinkPad X1 Yoga Gen 4", "ThinkPad X1 Yoga Gen 5", "ThinkPad X1 Yoga Gen 6", "ThinkPad X1 Yoga Gen 7", "ThinkPad X1 Yoga Gen 8",
    "ThinkPad X1 Extreme Gen 4", "ThinkPad X1 Extreme Gen 5",
    // ThinkPad T
    "ThinkPad T14 Gen 1", "ThinkPad T14 Gen 2", "ThinkPad T14 Gen 3", "ThinkPad T14 Gen 4", "ThinkPad T14 Gen 5",
    "ThinkPad T14s Gen 1", "ThinkPad T14s Gen 2", "ThinkPad T14s Gen 3",
    "ThinkPad T15 Gen 1", "ThinkPad T15 Gen 2",
    "ThinkPad T16 Gen 1", "ThinkPad T16 Gen 2",
    // ThinkPad E
    "ThinkPad E14 Gen 2", "ThinkPad E14 Gen 3", "ThinkPad E14 Gen 4", "ThinkPad E14 Gen 5",
    "ThinkPad E15 Gen 2", "ThinkPad E15 Gen 3", "ThinkPad E15 Gen 4",
    "ThinkPad E16 Gen 1", "ThinkPad E16 Gen 2",
    // ThinkPad L
    "ThinkPad L14 Gen 1", "ThinkPad L14 Gen 2", "ThinkPad L14 Gen 3", "ThinkPad L14 Gen 4",
    "ThinkPad L15 Gen 1", "ThinkPad L15 Gen 2", "ThinkPad L15 Gen 3",
    // ThinkPad X
    "ThinkPad X13 Gen 1", "ThinkPad X13 Gen 2", "ThinkPad X13 Gen 3", "ThinkPad X13 Gen 4",
    "ThinkPad X13 Yoga Gen 2", "ThinkPad X13 Yoga Gen 3",
    // IdeaPad
    "IdeaPad 1 14", "IdeaPad 1 15",
    "IdeaPad 3 14", "IdeaPad 3 15", "IdeaPad 3 17",
    "IdeaPad 5 14", "IdeaPad 5 15", "IdeaPad 5 16",
    "IdeaPad 5 Pro 14", "IdeaPad 5 Pro 16",
    "IdeaPad Slim 3 14", "IdeaPad Slim 3 15", "IdeaPad Slim 3 16",
    "IdeaPad Slim 5 14", "IdeaPad Slim 5 16",
    "IdeaPad Slim 7 14", "IdeaPad Flex 5 14",
    // Yoga
    "Yoga 6 13", "Yoga 7 14", "Yoga 7 16", "Yoga 9 14", "Yoga 9 15",
    "Yoga Slim 6 14", "Yoga Slim 7 14", "Yoga Slim 7 Pro 14",
    // Legion (gaming)
    "Legion 5 15ACH6", "Legion 5 15ARH7", "Legion 5 15IAH7",
    "Legion 5 16ACH6", "Legion 5 16ARH7", "Legion 5 16IRX9",
    "Legion 5 Pro 16ACH6", "Legion 5 Pro 16ARX8",
    "Legion 7 16ACHg6", "Legion 7 16ARHA7", "Legion 7 16IRX9",
    "Legion 7i 16", "Legion Pro 5i 16", "Legion Pro 7i 16",
    "IdeaPad Gaming 3 15", "IdeaPad Gaming 3 16",
    "LOQ 15 (2023)", "LOQ 15 (2024)", "LOQ 16 (2023)",
  ],
  asus_laptop: [
    // ZenBook
    "ASUS ZenBook 13 UX325", "ASUS ZenBook 13 OLED UX325",
    "ASUS ZenBook 14 UX425", "ASUS ZenBook 14 UX3402", "ASUS ZenBook 14 OLED",
    "ASUS ZenBook 14X OLED", "ASUS ZenBook 15 UX534",
    "ASUS ZenBook Pro 15 UX535", "ASUS ZenBook Pro 16X UX7602",
    "ASUS ZenBook Duo 14 UX482", "ASUS ZenBook Duo 16X UX8402",
    "ASUS ZenBook Flip 13 UX363", "ASUS ZenBook Flip 14 UP5401",
    "ASUS ZenBook S 13 OLED", "ASUS ZenBook S 16 OLED",
    // VivoBook
    "ASUS VivoBook 14 X413", "ASUS VivoBook 14 X1404",
    "ASUS VivoBook 15 X513", "ASUS VivoBook 15 X1504",
    "ASUS VivoBook 15 OLED K513", "ASUS VivoBook 15 OLED K3504",
    "ASUS VivoBook 16 X1605",
    "ASUS VivoBook 17 X712",
    "ASUS VivoBook S14 OLED", "ASUS VivoBook S15 OLED",
    "ASUS VivoBook S16 OLED",
    "ASUS VivoBook Pro 14 OLED", "ASUS VivoBook Pro 15 OLED", "ASUS VivoBook Pro 16 OLED",
    "ASUS VivoBook Pro 16X OLED",
    // ExpertBook
    "ASUS ExpertBook B1 B1500", "ASUS ExpertBook B1 B1400",
    "ASUS ExpertBook B5 B5402", "ASUS ExpertBook B9 B9400",
    // ROG (gaming)
    "ASUS ROG Zephyrus G14 (2021)", "ASUS ROG Zephyrus G14 (2022)", "ASUS ROG Zephyrus G14 (2023)", "ASUS ROG Zephyrus G14 (2024)",
    "ASUS ROG Zephyrus G15 (2021)", "ASUS ROG Zephyrus G15 (2022)",
    "ASUS ROG Zephyrus M16 (2021)", "ASUS ROG Zephyrus M16 (2022)",
    "ASUS ROG Strix G15 G513", "ASUS ROG Strix G15 G513 (2022)",
    "ASUS ROG Strix G17 G713", "ASUS ROG Strix G17 G713 (2022)",
    "ASUS ROG Strix SCAR 15", "ASUS ROG Strix SCAR 16", "ASUS ROG Strix SCAR 17",
    "ASUS ROG Flow X13 GV301", "ASUS ROG Flow X16 GV601",
    "ASUS ROG Flow Z13",
    // TUF (gaming)
    "ASUS TUF Gaming A15 FA506 (2020)", "ASUS TUF Gaming A15 FA506 (2021)", "ASUS TUF Gaming A15 FA507 (2022)", "ASUS TUF Gaming A15 (2023)",
    "ASUS TUF Gaming A16 (2023)", "ASUS TUF Gaming A16 (2024)",
    "ASUS TUF Gaming A17 FA706 (2020)", "ASUS TUF Gaming A17 (2021)",
    "ASUS TUF Gaming F15 FX506 (2020)", "ASUS TUF Gaming F15 FX507 (2022)", "ASUS TUF Gaming F15 (2023)",
    "ASUS TUF Gaming F17 FX706 (2020)", "ASUS TUF Gaming F17 (2021)",
  ],
  acer_laptop: [
    // Aspire
    "Acer Aspire 3 A315 (2019)", "Acer Aspire 3 A315 (2020)", "Acer Aspire 3 A315 (2021)", "Acer Aspire 3 A315 (2022)", "Acer Aspire 3 A315 (2023)",
    "Acer Aspire 5 A515 (2019)", "Acer Aspire 5 A515 (2020)", "Acer Aspire 5 A515 (2021)", "Acer Aspire 5 A515 (2022)", "Acer Aspire 5 A515 (2023)",
    "Acer Aspire 7 A715 (2020)", "Acer Aspire 7 A715 (2021)", "Acer Aspire 7 A715 (2022)",
    "Acer Aspire 5 A514", "Acer Aspire 5 A516",
    "Acer Aspire Vero 14", "Acer Aspire Vero 16",
    // Swift
    "Acer Swift 1 SF114", "Acer Swift 3 SF313", "Acer Swift 3 SF314", "Acer Swift 3 SF316",
    "Acer Swift 5 SF514", "Acer Swift 5 SF515",
    "Acer Swift X SFX14 (2021)", "Acer Swift X SFX14 (2022)", "Acer Swift X SFX16",
    "Acer Swift Go 14 SFG14", "Acer Swift Go 16 SFG16",
    "Acer Swift Edge 16",
    // Spin (2-in-1)
    "Acer Spin 3 SP313", "Acer Spin 3 SP314", "Acer Spin 5 SP513",
    // Nitro (gaming)
    "Acer Nitro 5 AN515 (2019)", "Acer Nitro 5 AN515 (2020)", "Acer Nitro 5 AN515 (2021)", "Acer Nitro 5 AN515 (2022)", "Acer Nitro 5 AN515 (2023)",
    "Acer Nitro 5 AN517 (2020)", "Acer Nitro 5 AN517 (2021)", "Acer Nitro 5 AN517 (2022)",
    "Acer Nitro V 15 ANV15 (2023)", "Acer Nitro V 16 ANV16 (2024)",
    "Acer Nitro 16 AN16 (2023)", "Acer Nitro 16 AN16 (2024)",
    // Predator (gaming)
    "Acer Predator Helios 300 PH315 (2020)", "Acer Predator Helios 300 PH315 (2021)", "Acer Predator Helios 300 PH315 (2022)",
    "Acer Predator Helios 300 PH317",
    "Acer Predator Helios 16 PHN16 (2022)", "Acer Predator Helios 16 PHN16 (2023)",
    "Acer Predator Helios Neo 16 (2023)", "Acer Predator Helios Neo 16 (2024)",
    "Acer Predator Triton 300", "Acer Predator Triton 500",
    // TravelMate / Extensa
    "Acer TravelMate P2 TMP214", "Acer TravelMate P2 TMP215",
    "Acer TravelMate P4 TMP414",
    "Acer TravelMate Spin P4",
    "Acer Extensa 15 EX215",
    "Acer ConceptD 3", "Acer ConceptD 5",
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
    // G serija
    "LG G5", "LG G6", "LG G7 ThinQ", "LG G8 ThinQ", "LG G8X ThinQ",
    // V serija
    "LG V30", "LG V30+", "LG V40 ThinQ", "LG V50 ThinQ", "LG V50S ThinQ", "LG V60 ThinQ",
    // Posebni modeli
    "LG Velvet", "LG Velvet 5G",
    "LG Wing",
    "LG Stylo 5", "LG Stylo 6",
    // K serija
    "LG K40", "LG K40S", "LG K41S", "LG K42",
    "LG K50", "LG K50S", "LG K51S", "LG K52", "LG K61", "LG K62",
    "LG K71", "LG K92 5G",
    // Q serija
    "LG Q60", "LG Q52", "LG Q70", "LG Q92 5G",
    // W serija
    "LG W10", "LG W30",
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
    const sendHeight = () => {
      window.parent.postMessage({ iframeHeight: document.body.scrollHeight }, "*");
    };
    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <Toaster position="top-right" richColors />

      <main className="w-full px-4 md:px-8 py-6 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form Column */}
          <div className="lg:col-span-8 space-y-12 animate-reveal px-3 sm:px-0">
            <header className="space-y-4 text-center md:text-left">
              <div className="text-sm font-mono text-primary uppercase tracking-widest">
                Spletni obrazec za servis
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance uppercase">
                Oddajte povpraševanje{" "}
                <span className="text-primary">brezplačno</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-xl text-pretty mx-auto md:mx-0">
                Izpolnite spodnje podatke o vaši napravi in naši tehniki vam bodo v najkrajšem
                možnem času poslali neobvezujočo informativno ponudbo.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 01 Device Type */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm size-8 border border-border flex items-center justify-center rounded-full">
                    01
                  </span>
                  <h2 className="font-bold uppercase tracking-wide text-lg">Vrsta naprave</h2>
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
                        <span className="block font-bold text-base uppercase">{d.title}</span>
                        <span className="block text-sm text-muted-foreground mt-1">{d.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 02 Brand */}
              <section className="space-y-6 animate-reveal [animation-delay:100ms]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm size-8 border border-border flex items-center justify-center rounded-full">
                    02
                  </span>
                  <h2 className="font-bold uppercase tracking-wide text-lg">Znamka naprave</h2>
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
                  <span className="font-mono text-sm size-8 border border-border flex items-center justify-center rounded-full">
                    03
                  </span>
                  <h2 className="font-bold uppercase tracking-wide text-lg">Podrobnosti o težavi</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase mb-2 text-muted-foreground">
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
                        className="w-full bg-card border border-border px-5 py-4 text-base rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                              className="px-5 py-3 text-base hover:bg-primary/5 cursor-pointer border-b border-border/50 last:border-0"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase mb-2 text-muted-foreground">
                      Najpogostejše napake{" "}
                      <span className="font-mono text-xs text-muted-foreground/70 normal-case">
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
                            className={`flex items-center gap-3 text-left px-4 py-3.5 border rounded-md transition-all text-base ${
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
                    <label className="block text-sm font-bold uppercase mb-2 text-muted-foreground">
                      Drug opis težave{" "}
                      <span className="font-mono text-xs text-muted-foreground/70 normal-case">
                        (če napake ni na seznamu)
                      </span>
                    </label>
                    <textarea
                      rows={4}
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Opišite napako podrobneje ali navedite težavo, ki ni na seznamu zgoraj..."
                      className="w-full bg-card border border-border px-5 py-4 text-base rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <label className="block group cursor-pointer">
                    <input type="file" accept="image/*" className="sr-only" />
                    <div className="w-full h-24 bg-muted/50 border border-dashed border-border rounded-md flex flex-col items-center justify-center group-hover:bg-muted transition-colors">
                      <span className="text-sm font-mono text-muted-foreground uppercase">
                        Naloži fotografijo napake (neobvezno)
                      </span>
                    </div>
                  </label>
                </div>
              </section>

              {/* 04 Contact */}
              <section className="space-y-6 animate-reveal [animation-delay:300ms]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm size-8 border border-border flex items-center justify-center rounded-full">
                    04
                  </span>
                  <h2 className="font-bold uppercase tracking-wide text-lg">Kontaktni podatki</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Ime in priimek"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-card border border-border px-5 py-4 text-base rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <input
                    type="email"
                    placeholder="E-poštni naslov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-card border border-border px-5 py-4 text-base rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                  <span className="text-sm text-muted-foreground leading-relaxed">
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
          <aside className="lg:col-span-4 px-3 sm:px-0">
            <div className="lg:sticky lg:top-6 space-y-6">
              <div className="p-10 bg-foreground text-background rounded-2xl space-y-8 animate-reveal [animation-delay:500ms]">
                <h3 className="text-2xl font-bold uppercase tracking-tight">Zakaj iRepair?</h3>
                <ul className="space-y-8">
                  {[
                    {
                      tag: "24h",
                      title: "Hiter odziv",
                      desc: "Večina popravil je zaključenih v istem delovnem dnevu.",
                    },
                    {
                      tag: "€0",
                      title: "Brezplačna hitra diagnostika",
                      desc: "Hitra brezplačna diagnostika — če ni potrebno razstaviti naprave, ne plačate ničesar.",
                    },
                    {
                      tag: "3m",
                      title: "Garancija",
                      desc: "Na vsa opravljena popravila nudimo najmanj 3 mesece garancije.",
                    },
                    {
                      tag: "📦",
                      title: "Brezplačen prevzem",
                      desc: "Pošljite napravo po pošti ali naročite naš prevzem na domu.",
                    },
                  ].map((f) => (
                    <li key={f.title} className="flex gap-4">
                      <div className="shrink-0 size-12 border border-background/20 flex items-center justify-center rounded-lg">
                        <span className="font-mono text-sm">{f.tag}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-base uppercase">{f.title}</h4>
                        <p className="text-background/60 text-sm mt-1">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-background/10 text-center">
                  <p className="text-[10px] font-mono text-background/40 uppercase">
                    iRepair Servis
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
                    <a href="tel:+38659023951" className="font-bold hover:text-primary">
                      059 023 951
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
