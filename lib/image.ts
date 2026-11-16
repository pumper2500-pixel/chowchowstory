// ย่อรูปในเครื่องก่อนอัปโหลด: กว้างสุด 1280px, JPEG, ไม่เกิน ~1.8 MB
// การวาดลง canvas แล้ว encode ใหม่ = ลบ EXIF ทั้งหมดไปด้วย (รวมพิกัด GPS ในรูปจากมือถือ)

const MAX_SIDE = 1280;
const MAX_BYTES = 1_800_000;

export async function prepareImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("ไฟล์นี้ไม่ใช่รูปภาพ");
  let bmp: ImageBitmap;
  try {
    // imageOrientation: หมุนรูปตาม EXIF ก่อนลบ (รูปแนวตั้งจากมือถือจะไม่ตะแคง)
    bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("เปิดรูปนี้ไม่ได้ ถ้าเป็นไฟล์ HEIC จาก iPhone ลองเลือกจากแอปรูปภาพในมือถือโดยตรง หรือบันทึกเป็น JPG ก่อน");
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close?.();

  for (const q of [0.85, 0.75, 0.65, 0.55]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", q));
    if (blob && blob.size <= MAX_BYTES) return blob;
  }
  throw new Error("รูปใหญ่เกินไป ลองเลือกรูปอื่น");
}
