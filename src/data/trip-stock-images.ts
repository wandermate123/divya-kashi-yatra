/** Royalty-free stock URLs (Unsplash License) — Varanasi / Kashi / Sarnath themed. */

export type TripStockImage = {
  src: string;
  alt: string;
  /** Short label for caption */
  label: string;
};

export const HERO_STOCK_IMAGE: TripStockImage = {
  src: "https://images.unsplash.com/photo-1768123796352-93d9cb484d3b?auto=format&fit=crop&w=2000&q=85",
  alt: "Ghats along the Ganges in Varanasi with boats on the river",
  label: "Ganga ghats, Varanasi",
};

/** Premium stay mood (stock — illustrative; actual hotels listed below). */
export const ACCOMMODATION_STOCK_IMAGE: TripStockImage = {
  src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
  alt: "Elegant hotel room with tidy bed and warm lighting",
  label: "Premium 3★ / 4★ style stay in Varanasi",
};

/** Comfortable group road transfer (stock — representative AC tourist coach / traveller class). */
export const LUXURY_TRAVELLER_STOCK_IMAGE: TripStockImage = {
  src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85",
  alt: "Modern air-conditioned coach for group travel",
  label: "Delhi NCR ↔ Varanasi road transfer",
};

export const GALLERY_STOCK_IMAGES: TripStockImage[] = [
  {
    src: "https://images.unsplash.com/photo-1757693352185-9a6c1aa184fa?auto=format&fit=crop&w=1400&q=85",
    alt: "Sunrise light over a crowded riverbank with boats in Banaras",
    label: "Sunrise at the ghats",
  },
  {
    src: "https://images.unsplash.com/photo-1687859498649-953031d816a1?auto=format&fit=crop&w=1400&q=85",
    alt: "Wide view of historic ghats and steps along the sacred river",
    label: "Banaras riverfront",
  },
  {
    src: "https://images.unsplash.com/photo-1652288156243-a7505dcaa0ec?auto=format&fit=crop&w=1400&q=85",
    alt: "Ancient stupa and monastery ruins at Sarnath",
    label: "Sarnath",
  },
];
