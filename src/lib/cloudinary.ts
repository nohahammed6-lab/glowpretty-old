/**
 * Cloudinary Unsigned Upload Utility
 * Cloud Name: qazdrpcx
 * Upload Preset: site2_images
 */

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  created_at?: string;
}

export const CLOUDINARY_CLOUD_NAME = 'qazdrpcx';
export const CLOUDINARY_UPLOAD_PRESET = 'site2_images';
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads an image file directly to Cloudinary using Unsigned Upload Preset.
 * Returns the `secure_url` string.
 */
export async function uploadImageToCloudinary(
  file: File | Blob | string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type if File object
    if (file instanceof File && !file.type.startsWith('image/')) {
      reject(new Error('الملف المحدد ليس صورة صالحة (الصيغ المسموحة: JPG, PNG, WEBP, GIF, SVG)'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          if (data && data.secure_url) {
            resolve(data.secure_url);
          } else {
            reject(new Error('استجابة Cloudinary لم تحتوي على رابط آمن (secure_url)'));
          }
        } catch (err) {
          reject(new Error('فشل معالجة استجابة رفع الصورة من Cloudinary'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          const msg = errData?.error?.message || `فشل رفع الصورة (${xhr.status})`;
          reject(new Error(msg));
        } catch {
          reject(new Error(`فشل رفع الصورة إلى Cloudinary (كود: ${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('حدث خطأ في الاتصال بالشبكة أثناء رفع الصورة إلى Cloudinary'));
    };

    xhr.send(formData);
  });
}
