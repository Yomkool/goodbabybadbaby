// Media validation utilities
import { File } from 'expo-file-system';

// File size limits in bytes
export const FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024, // 10MB
  video: 50 * 1024 * 1024, // 50MB
} as const;

// Supported formats
export const SUPPORTED_FORMATS = {
  image: ['jpg', 'jpeg', 'png', 'heic', 'webp'],
  video: ['mp4', 'mov', 'm4v'],
} as const;

// Max video duration in seconds
export const MAX_VIDEO_DURATION = 15;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileInfo {
  uri: string;
  size: number;
  extension: string;
  mimeType: string;
}

/**
 * Get file extension from URI
 */
export function getFileExtension(uri: string): string {
  const parts = uri.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get MIME type from extension
 */
export function getMimeType(extension: string, mediaType: 'image' | 'video'): string {
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    heic: 'image/heic',
    webp: 'image/webp',
    // Videos
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    m4v: 'video/x-m4v',
  };
  return mimeTypes[extension] || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg');
}

/**
 * Get file info from URI
 */
export async function getFileInfo(uri: string): Promise<FileInfo | null> {
  try {
    const file = new File(uri);

    // Check if file exists
    if (!file.exists) return null;

    const extension = getFileExtension(uri);
    const videoFormats: readonly string[] = SUPPORTED_FORMATS.video;
    const isVideo = videoFormats.includes(extension);
    const mimeType = getMimeType(extension, isVideo ? 'video' : 'image');

    // Get file size - the size property may be null for some URIs
    const size = file.size ?? 0;

    return {
      uri,
      size,
      extension,
      mimeType,
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
}

/**
 * Validate file format
 */
export function validateFormat(
  extension: string,
  mediaType: 'image' | 'video'
): ValidationResult {
  const supported: readonly string[] = SUPPORTED_FORMATS[mediaType];
  if (!supported.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported ${mediaType} format. Supported: ${supported.join(', ').toUpperCase()}`,
    };
  }
  return { valid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(
  size: number,
  mediaType: 'image' | 'video'
): ValidationResult {
  const limit = FILE_SIZE_LIMITS[mediaType];
  const limitMB = limit / (1024 * 1024);

  if (size > limit) {
    const sizeMB = (size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large (${sizeMB}MB). Maximum size: ${limitMB}MB`,
    };
  }
  return { valid: true };
}

/**
 * Validate video duration
 */
export function validateVideoDuration(durationSeconds: number): ValidationResult {
  if (durationSeconds > MAX_VIDEO_DURATION) {
    return {
      valid: false,
      error: `Video too long (${Math.round(durationSeconds)}s). Maximum: ${MAX_VIDEO_DURATION} seconds`,
    };
  }
  return { valid: true };
}

/**
 * Validate media file completely
 */
export async function validateMedia(
  uri: string,
  mediaType: 'image' | 'video',
  videoDuration?: number
): Promise<ValidationResult> {
  // Get file info
  const fileInfo = await getFileInfo(uri);
  if (!fileInfo) {
    return { valid: false, error: 'Could not read file' };
  }

  // Validate format
  const formatResult = validateFormat(fileInfo.extension, mediaType);
  if (!formatResult.valid) return formatResult;

  // Validate size
  const sizeResult = validateFileSize(fileInfo.size, mediaType);
  if (!sizeResult.valid) return sizeResult;

  // Validate video duration
  if (mediaType === 'video' && videoDuration !== undefined) {
    const durationResult = validateVideoDuration(videoDuration);
    if (!durationResult.valid) return durationResult;
  }

  return { valid: true };
}
