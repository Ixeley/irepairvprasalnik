export type InquiryData = {
  device: string;
  brand: string;
  model: string;
  issues: string[];
  problem: string;
  name: string;
  email: string;
  phone: string;
};

export async function sendInquiryEmail(data: InquiryData): Promise<void> {
  const response = await fetch("/.netlify/functions/send-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Server error");
  }
}
