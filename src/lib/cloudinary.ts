import config from '@/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { logger } from './winston';

cloudinary.config({
  cloud_name: config.CLOUDINART_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production',
});

export const uploadToCloudinary = (
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string,
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['png', 'jpg', 'webp'],
          resource_type: 'image',
          folder: 'blog-api',
          public_id: publicId,
          transformation: { quality: 'auto' },
        },
        (err, result) => {
          if (err) {
            logger.error('Error uploading image to cloudinary', err);
            reject(err);
          }
          resolve(result);
        },
      )
      .end(buffer);
  });
};

export const deleteBanner=async(publicId : string)=>{
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    logger.info("Image deleted",result)
  } catch (error) {
    console.log(error);
  }
}