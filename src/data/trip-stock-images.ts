/** Trip imagery — hero, accommodation, and tempo traveller use local assets; gallery uses remote URLs. */

export type TripStockImage = {
  src: string;
  alt: string;
  /** Short label for caption */
  label: string;
};

export const HERO_STOCK_IMAGE: TripStockImage = {
  src: "/images/hero-primary.png",
  alt: "Divya Kashi Yatra team grouped together in front of a weathered blue wall",
  label: "The people behind your Kashi yatra",
};

/** Partner stay — illustrative twin room; hotels listed on page are actual options. */
export const ACCOMMODATION_STOCK_IMAGE: TripStockImage = {
  src: "/images/accommodation-primary.png",
  alt: "Bright twin hotel room with white linens, navy accents, wood headboard, and window view",
  label: "Premium 3★ / 4★ style stay in Varanasi",
};

/** Delhi ↔ Varanasi leg — premium AC tempo traveller interior our groups use. */
export const LUXURY_TRAVELLER_STOCK_IMAGE: TripStockImage = {
  src: "/images/tempo-traveller-primary.png",
  alt: "Premium AC tempo traveller interior: beige quilted seats, wood-trim armrests, red aisle carpet, and large side windows",
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
