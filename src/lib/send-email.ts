import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";

type InquiryData = {
  device: string;
  brand: string;
  model: string;
  issues: string[];
  problem: string;
  name: string;
  email: string;
  phone: string;
};

const DEVICE_LABELS: Record<string, string> = {
  phone: "Mobilni telefon",
  laptop: "Prenosnik",
  tablet: "Tablica",
};

const BRAND_LABELS: Record<string, string> = {
  apple: "Apple",
  samsung: "Samsung",
  huawei: "Huawei",
  xiaomi: "Xiaomi",
  oneplus: "OnePlus",
  google: "Google Pixel",
  sony: "Sony",
  nokia: "Nokia",
  hp: "HP",
  dell: "Dell",
  lenovo: "Lenovo",
  asus: "Asus",
  acer: "Acer",
  msi: "MSI",
  lg: "LG",
  motorola: "Motorola",
  other: "Ostalo",
};

export const sendInquiryEmail = createServerFn({ method: "POST" })
  .validator((data: InquiryData) => data)
  .handler(async ({ data }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const issuesList =
      data.issues.length > 0
        ? data.issues.map((i) => `<li>${i}</li>`).join("")
        : "<li>—</li>";

    const { error } = await resend.emails.send({
      from: "Vpraševalnik iRepair <noreply@irepair.si>",
      to: ["podpora@irepair.si"],
      replyTo: data.email,
      subject: `Povpraševanje za popravilo — ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fff;">
          <div style="background: #111; color: #fff; padding: 16px 24px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 900; font-size: 22px; letter-spacing: -1px;">iRepair.si</span>
            <span style="opacity: 0.5; font-size: 13px; margin-left: auto;">Novo povpraševanje</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-top: none;">
            <tr style="background: #f9fafb;">
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; width: 38%; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Ime in priimek</td>
              <td style="padding: 12px 16px; color: #111;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">E-pošta</td>
              <td style="padding: 12px 16px;"><a href="mailto:${data.email}" style="color: #1e6fd9;">${data.email}</a></td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Telefon</td>
              <td style="padding: 12px 16px;"><a href="tel:${data.phone}" style="color: #1e6fd9;">${data.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Vrsta naprave</td>
              <td style="padding: 12px 16px;">${DEVICE_LABELS[data.device] ?? data.device}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Znamka</td>
              <td style="padding: 12px 16px;">${BRAND_LABELS[data.brand] ?? data.brand}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Model naprave</td>
              <td style="padding: 12px 16px;">${data.model}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Izbrane napake</td>
              <td style="padding: 12px 16px;"><ul style="margin: 0; padding-left: 18px;">${issuesList}</ul></td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Opis težave</td>
              <td style="padding: 12px 16px; white-space: pre-wrap;">${data.problem || "—"}</td>
            </tr>
          </table>

          <p style="margin-top: 20px; color: #9ca3af; font-size: 11px; text-align: center;">
            Sporočilo poslano prek spletnega obrazca iRepair.si
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });
