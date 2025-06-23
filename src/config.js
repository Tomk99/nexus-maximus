// Ez a változó a Next.js beépített környezeti változó rendszerét használja.
// Fejlesztés közben (npm run dev) az .env.local fájlból fogja venni az értéket.
// Éles környezetben (pl. Vercel) a Vercel beállításaiban megadott környezeti változót fogja használni.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default API_URL;