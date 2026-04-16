type DeliveryZone = {
  zone: number;
  fee: number;
  maxRadiusMiles: number;
};

const ZONES: DeliveryZone[] = [
  { zone: 1, fee: 7.99, maxRadiusMiles: 2 },
  { zone: 2, fee: 8.99, maxRadiusMiles: 4 },
  { zone: 3, fee: 9.99, maxRadiusMiles: 6 },
  { zone: 4, fee: 10.99, maxRadiusMiles: 8 },
  { zone: 5, fee: 12.99, maxRadiusMiles: 10 },
];

const STORE_LAT = 38.6957;
const STORE_LNG = -121.3230;

function haversineDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDeliveryZone(
  lat: number,
  lng: number,
): { zone: number; fee: number } | null {
  const distance = haversineDistanceMiles(STORE_LAT, STORE_LNG, lat, lng);
  for (const z of ZONES) {
    if (distance <= z.maxRadiusMiles) {
      return { zone: z.zone, fee: z.fee };
    }
  }
  return null;
}

export function getDeliveryFeeDisplay(): string {
  return '$7.99 – $12.99 based on distance';
}
