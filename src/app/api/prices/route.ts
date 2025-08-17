import { NextResponse } from "next/server";

interface CropPrice {
  crop: string;
  price: number;
}

export async function GET() {
  const apiKey = "579b464db66ec23bdd00000133a59dfcdf124c917e1131b29975ad89"; 
  const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=20`;

  const fallback: CropPrice[] = [
    { crop: "Tomato", price: 3200 },
    { crop: "Onion", price: 2500 },
    { crop: "Potato", price: 2000 },
    { crop: "Wheat", price: 2800 },
    { crop: "Rice", price: 3500 }
  ];

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad API response");

    const data = await res.json();
    if (!Array.isArray(data.records)) {
      return NextResponse.json({ records: fallback });
    }

    // Explicitly tell TypeScript this is CropPrice[]
    const formatted: CropPrice[] = data.records.map((item: any) => {
      const price = Number(item.modal_price);
      return {
        crop: item.commodity?.trim() || "Unknown",
        price: isNaN(price) ? 0 : price
      };
    });

    // Now TypeScript knows what `p` is, so `.price` is valid
    const filtered: CropPrice[] = formatted.filter((p) => p.price > 0);

    return NextResponse.json({ records: filtered.length ? filtered : fallback });
  } catch (error) {
    console.error("API fetch failed:", error);
    return NextResponse.json({ records: fallback });
  }
}
