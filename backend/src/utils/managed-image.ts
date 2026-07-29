import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

const uploadsDirectory = path.resolve(__dirname, "../../uploads");

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const cloudinaryPublicId = (imageUrl: string) => {
  try {
    const url = new URL(imageUrl);
    if (url.hostname !== "res.cloudinary.com") return null;
    const marker = "/upload/";
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex < 0) return null;
    const assetPath = decodeURIComponent(url.pathname.slice(markerIndex + marker.length))
      .replace(/^v\d+\//, "")
      .replace(/\.[^/.]+$/, "");
    return assetPath || null;
  } catch {
    return null;
  }
};

/**
 * Deletes only images managed by this application. Data URLs disappear with the
 * database value, and third-party URLs are deliberately left untouched.
 */
export const deleteManagedImage = async (imageUrl?: string | null) => {
  if (!imageUrl || imageUrl.startsWith("data:")) return;

  const publicId = cloudinaryPublicId(imageUrl);
  if (publicId && cloudinaryConfigured) {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return;
  }

  let pathname = imageUrl;
  try {
    pathname = new URL(imageUrl).pathname;
  } catch {
    // Relative application URL.
  }
  if (!pathname.startsWith("/uploads/")) return;

  const filePath = path.resolve(uploadsDirectory, path.basename(pathname));
  if (path.dirname(filePath) !== uploadsDirectory) return;
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    if (error?.code !== "ENOENT") throw error;
  }
};

export const deleteReplacedManagedImage = async (
  previousUrl?: string | null,
  nextUrl?: string | null
) => {
  if (previousUrl && previousUrl !== nextUrl) {
    await deleteManagedImage(previousUrl);
  }
};
