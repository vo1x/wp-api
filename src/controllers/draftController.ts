import { uploadImage } from "./imageController";

const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

export const createDraft = async (
  title: string,
  content: string,
  imageFileName?: string,
  imageUrl?: string
): Promise<any | null> => {
  try {
    const bodyData: any = {
      title,
      content,
      status: "draft",
    };

    if (imageUrl && imageFileName) {
      const featuredImageId = await uploadImage(imageFileName, imageUrl);
      if (featuredImageId == null) {
        console.warn("Skipping image upload, no image uploaded.");
      } else {
        bodyData.featured_media = featuredImageId;
      }
    }

    const response = await fetch("https://uhdmovies.mov/wp-json/wp/v2/posts", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`
      );
    }

    const newDraft = await response.json();
    return newDraft;
  } catch (error: any) {
    console.error("Error creating draft:", error.message);
    return null;
  }
};
