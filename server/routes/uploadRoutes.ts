/**
 * Cloudinary upload route for design images, videos, and documents.
 */
import express from "express";
import multer from "multer";
import auth from "../middleware/auth";
import cloudinary from "../config/cloudinary";

const uploadRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/** POST /api/upload — multipart upload to Cloudinary (auth required) */
uploadRouter.post(
  "/",
  auth,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 2 },
    { name: "documents", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({ message: "No files provided" });
      }

      const uploadedUrls: Record<string, string[]> = {
        images: [],
        videos: [],
        documents: [],
      };

      const uploadPromises: Promise<void>[] = [];

      for (const field of Object.keys(files)) {
        for (const file of files[field]) {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          const resourceType = field === "documents" ? "raw" : "auto";

          const promise = cloudinary.uploader
            .upload(dataURI, {
              folder: "keplans",
              resource_type: resourceType,
            })
            .then((result) => {
              uploadedUrls[field].push(result.secure_url);
            });

          uploadPromises.push(promise);
        }
      }

      await Promise.all(uploadPromises);

      return res.json(uploadedUrls);
    } catch (error) {
      console.error("Upload error:", error);
      const message =
        error instanceof Error ? error.message : "Upload failed";
      return res.status(500).json({ message });
    }
  }
);

export default uploadRouter;
