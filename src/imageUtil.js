/**
 * 사진 파일 → 정사각형 아바타 데이터 URL (기본 384px, JPEG 압축).
 * 확대 보기에도 선명하면서 Firestore 문서에 저장 가능한 크기 (~20-30KB).
 */
export async function fileToAvatar(file, size = 384) {
  const source = await loadBitmap(file);
  const w = source.width ?? source.naturalWidth;
  const h = source.height ?? source.naturalHeight;
  const side = Math.min(w, h);
  const sx = (w - side) / 2;
  const sy = (h - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, sx, sy, side, side, 0, 0, size, size);
  source.close?.();
  return canvas.toDataURL("image/jpeg", 0.78);
}

async function loadBitmap(file) {
  // EXIF 회전 반영 (아이폰 세로 사진 등)
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* 미지원 브라우저 → img 폴백 */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
