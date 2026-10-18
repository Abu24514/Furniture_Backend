import imagekit from "../config/imagekit.js";

export const uploadImageService = async (file) => {
  const result = await imagekit.files.upload({
    file: file.buffer.toString("base64"),
    fileName: file.originalname,
    folder: "/furniture-products",
  });

  return result.url;
};

export const deleteImageService = async (fileId) => {
  await imagekit.files.delete(fileId);
};