/** @type {import('next').NextConfig} */
// output: 'export' → ได้ไฟล์ static ใน /out ใช้ได้ทั้ง Vercel และห่อเป็นแอปด้วย Capacitor (Milestone 06)
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
