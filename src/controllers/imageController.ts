const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

export const uploadImage = async (
  fileName: string,
  imgUrl: string
): Promise<number | null> => {
  try {
    const imageResponse = await fetch(imgUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageArrayBuffer = await imageResponse.arrayBuffer();

    const formData = new FormData();
    console.log(fileName);
    formData.append("file", new Blob([imageArrayBuffer]), fileName);

    const uploadResponse = await fetch(
      "https://uhdmovies.mov/wp-json/wp/v2/media",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64"),
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text();
      throw new Error(
        `Image upload error! status: ${uploadResponse.status}, body: ${errorBody}`
      );
    }

    const uploadedImage = await uploadResponse.json();
    const featuredImageId = uploadedImage.id;

    return featuredImageId;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return null;
  }
};
