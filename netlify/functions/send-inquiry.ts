import type { Handler } from "@netlify/functions";
import { Resend } from "resend";

const DEVICE_LABELS: Record<string, string> = {
  phone: "Mobilni telefon",
  laptop: "Prenosnik",
  tablet: "Tablica",
};

const BRAND_LABELS: Record<string, string> = {
  apple: "Apple", samsung: "Samsung", huawei: "Huawei", xiaomi: "Xiaomi",
  oneplus: "OnePlus", google: "Google Pixel", sony: "Sony", nokia: "Nokia",
  hp: "HP", dell: "Dell", lenovo: "Lenovo", asus: "Asus",
  acer: "Acer", msi: "MSI", lg: "LG", motorola: "Motorola", other: "Ostalo",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { device, brand, model, issues, problem, name, email, phone } =
      JSON.parse(event.body ?? "{}");

    const resend = new Resend(process.env.RESEND_API_KEY);

    const issuesList =
      Array.isArray(issues) && issues.length > 0
        ? issues.map((i: string) => `<li>${i}</li>`).join("")
        : "<li>—</li>";

    const { error } = await resend.emails.send({
      from: "Vpraševalnik iRepair <noreply@irepair.si>",
      to: ["podpora@irepair.si"],
      replyTo: email,
      subject: `Povpraševanje za popravilo — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;">
          <div style="background:#111;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;">
            <span style="font-weight:900;font-size:22px;letter-spacing:-1px;">iRepair.si</span>
            <span style="opacity:0.5;font-size:13px;margin-left:auto;float:right;">Novo povpraševanje</span>
          </div>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none;">
            <tr style="background:#f9fafb;">
              <td style="padding:12px 16px;font-weight:600;color:#374151;width:38%;font-size:13px;">Ime in priimek</td>
              <td style="padding:12px 16px;color:#111;">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:600;color:#374151;font-size:13px;">E-pošta</td>
              <td style="padding:12px 16px;"><a href="mailto:${email}" style="color:#1e6fd9;">${email}</a></td>
            </tr>
            <tr style="background:#f9fafb;">
              <td style="padding:12px 16px;font-weight:600;color:#374151;font-size:13px;">Telefon</td>
              <td style="padding:12px 16px;"><a href="tel:${phone}" style="color:#1e6fd9;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:600;color:#374151;font-size:13px;">Vrsta naprave</td>
              <td style="padding:12px 16px;">${DEVICE_LABELS[device] ?? device}</td>
            </tr>
            <tr style="background:#f9fafb;">
              <td style="padding:12px 16px;font-weight:600;color:#374151;font-size:13px;">Znamka</td>
              <td style="padding:12px 16px;">${BRAND_LABELS[brand] ?? brand}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:600;color:#374151;font-size:13px;">Model naprave</td>
              <td style="padding:12px 16px;">${model}</td>
            </tr>
            <tr style="background:#f9fafb;">
              <td style="padding:12px 16px;font-weight:600;color:#374151;font-size:13px;vertical-align:top;">Izbrane napake</td>
              <td style="padding:12px 16px;"><ul style="margin:0;padding-left:18px;">${issuesList}</ul></td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:600;color:#374151;font-size:13px;vertical-align:top;">Opis težave</td>
              <td style="padding:12px 16px;white-space:pre-wrap;">${problem || "—"}</td>
            </tr>
          </table>
          <p style="margin-top:20px;color:#9ca3af;font-size:11px;text-align:center;">
            Sporočilo poslano prek spletnega obrazca iRepair.si
          </p>
        </div>
      `,
    });

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
