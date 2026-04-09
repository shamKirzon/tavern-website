import cloudinary from "../lib/cloudinary";

type Props = {
  localFile: any;
  type: "refundReceipt" | "payment";
};
export const uploadImageWithUrl = async ({ localFile, type }: Props) => {
  try {
    const result = await cloudinary.uploader.upload(localFile.path, {
      folder: type === "refundReceipt" ? "tav_refund_receipt" : "tav_valid_id",
      resource_type: "image",
      public_id: localFile.originalname.split(".")[0],
    });

    return result.secure_url;
  } catch (error: any) {
    console.log("Error in reservationService/uploadImage(): ", error);
    throw new Error("Failed to upload image");
  }
};
