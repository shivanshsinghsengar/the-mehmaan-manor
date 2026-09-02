/**
 * Cloudinary URL helpers
 *
 * Cloudinary URLs look like:
 *   https://res.cloudinary.com/<cloud>/image/upload/<transformations>/v<ver>/<folder>/<id>.<ext>
 *
 * We inject transformation params directly into the URL path so we
 * can control quality and format at render time, regardless of what
 * was applied at upload time. This avoids re-uploading images.
 */

/**
 * Apply quality and format transformations to a Cloudinary URL.
 *
 * @param url   - The original Cloudinary secure_url from the database
 * @param opts  - quality: 1–100 or "auto" | format: "auto" | "webp" | "avif"
 */
export function cloudinaryUrl(
  url: string,
  opts: {
    quality?: number | "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low";
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "limit";
  } = {}
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const { quality = "auto:best", format = "auto", width, height, crop } = opts;

  // Build transformation string
  const parts: string[] = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop) parts.push(`c_${crop}`);
  parts.push(`q_${quality}`);
  parts.push(`f_${format}`);
  const transform = parts.join(",");

  // Insert after "/upload/" in the URL
  return url.replace("/upload/", `/upload/${transform}/`);
}

/**
 * Hero image: full-resolution, best quality, auto format.
 * Used for the main slideshow LCP image.
 */
export function heroImageUrl(url: string, width = 1920): string {
  return cloudinaryUrl(url, {
    quality: "auto:best",
    format: "auto",
    width,
    crop: "limit", // never upscale, just limit max width
  });
}

/**
 * Property card: medium quality for listing cards.
 */
export function cardImageUrl(url: string, width = 900): string {
  return cloudinaryUrl(url, {
    quality: 85,
    format: "auto",
    width,
    crop: "limit",
  });
}

/**
 * Thumbnail: small Instagram-style circular photos.
 */
export function thumbnailUrl(url: string, size = 200): string {
  return cloudinaryUrl(url, {
    quality: 80,
    format: "auto",
    width: size,
    height: size,
    crop: "fill",
  });
}
