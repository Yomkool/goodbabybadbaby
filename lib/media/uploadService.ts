// Media upload service with progress tracking
import { File } from 'expo-file-system';
import { supabase } from '@/lib/supabase';
import { getMimeType, getFileExtension } from './validation';

export interface UploadOptions {
  bucket: 'posts' | 'avatars';
  folder?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  publicUrl: string;
  path: string;
}

export interface UploadTask {
  promise: Promise<UploadResult>;
  cancel: () => void;
}

/**
 * Upload file to Supabase Storage with progress tracking
 */
export function uploadMedia(
  uri: string,
  userId: string,
  mediaType: 'image' | 'video',
  options: UploadOptions = { bucket: 'posts' }
): UploadTask {
  let cancelled = false;
  let uploadPromiseReject: (reason: Error) => void;

  const promise = new Promise<UploadResult>(async (resolve, reject) => {
    uploadPromiseReject = reject;

    try {
      if (cancelled) {
        reject(new Error('Upload cancelled'));
        return;
      }

      const { bucket, folder, onProgress } = options;

      // Report initial progress
      onProgress?.(0);

      // Get file extension and mime type
      const extension = getFileExtension(uri) || (mediaType === 'video' ? 'mp4' : 'jpg');
      const contentType = getMimeType(extension, mediaType);

      // Generate unique filename
      const timestamp = Date.now();
      const basePath = folder ? `${folder}/${userId}` : userId;
      const fileName = `${basePath}/${timestamp}.${extension}`;

      onProgress?.(10);

      if (cancelled) {
        reject(new Error('Upload cancelled'));
        return;
      }

      // Read file using expo-file-system File API
      const file = new File(uri);
      const arrayBuffer = await file.arrayBuffer();

      onProgress?.(50);

      if (cancelled) {
        reject(new Error('Upload cancelled'));
        return;
      }

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, arrayBuffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        reject(new Error(uploadError.message || 'Upload failed'));
        return;
      }

      onProgress?.(90);

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

      onProgress?.(100);

      resolve({
        publicUrl: urlData.publicUrl,
        path: fileName,
      });
    } catch (error) {
      console.error('Upload error:', error);
      reject(error instanceof Error ? error : new Error('Upload failed'));
    }
  });

  return {
    promise,
    cancel: () => {
      cancelled = true;
      uploadPromiseReject?.(new Error('Upload cancelled'));
    },
  };
}

/**
 * Upload with retry logic
 */
export async function uploadMediaWithRetry(
  uri: string,
  userId: string,
  mediaType: 'image' | 'video',
  options: UploadOptions & { maxRetries?: number } = { bucket: 'posts' }
): Promise<UploadResult> {
  const { maxRetries = 3, ...uploadOptions } = options;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const task = uploadMedia(uri, userId, mediaType, uploadOptions);
      return await task.promise;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Upload failed');

      // Don't retry if cancelled
      if (lastError.message === 'Upload cancelled') {
        throw lastError;
      }

      console.warn(`Upload attempt ${attempt} failed:`, lastError.message);

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError || new Error('Upload failed after retries');
}

/**
 * Delete uploaded media (for cleanup on failure)
 */
export async function deleteMedia(
  path: string,
  bucket: 'posts' | 'avatars' = 'posts'
): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.error('Delete error:', error);
    }
  } catch (error) {
    console.error('Error deleting media:', error);
  }
}
