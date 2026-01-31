// Video processing utilities
import * as VideoThumbnails from 'expo-video-thumbnails';
import { quickCompress } from './imageProcessing';

export interface VideoThumbnailOptions {
  time?: number; // Time in milliseconds to capture thumbnail (default: 0)
  quality?: number; // Thumbnail compression quality (default: 0.8)
}

export interface VideoProcessingResult {
  thumbnailUri: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

/**
 * Generate a thumbnail from a video
 */
export async function generateVideoThumbnail(
  videoUri: string,
  options: VideoThumbnailOptions = {}
): Promise<VideoProcessingResult> {
  const { time = 0, quality = 0.8 } = options;

  try {
    // Generate thumbnail at specified time (default: first frame)
    const thumbnail = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time,
      quality: 1, // Get high quality first, then compress
    });

    // Compress the thumbnail
    const compressed = await quickCompress(thumbnail.uri, quality);

    return {
      thumbnailUri: compressed.uri,
      thumbnailWidth: compressed.width,
      thumbnailHeight: compressed.height,
    };
  } catch (error) {
    console.error('Error generating video thumbnail:', error);
    throw new Error('Failed to generate video thumbnail');
  }
}

/**
 * Generate thumbnail from middle of video
 * Useful for getting a more representative frame
 */
export async function generateThumbnailFromMiddle(
  videoUri: string,
  durationMs: number,
  quality: number = 0.8
): Promise<VideoProcessingResult> {
  const middleTime = Math.floor(durationMs / 2);
  return generateVideoThumbnail(videoUri, { time: middleTime, quality });
}

/**
 * Process video for upload - returns thumbnail info
 * Note: Video compression would require native modules like FFmpeg
 * For now, we just generate the thumbnail
 */
export async function processVideoForUpload(
  videoUri: string,
  durationMs?: number
): Promise<VideoProcessingResult> {
  // If duration is provided, use middle frame, otherwise use first frame
  if (durationMs && durationMs > 1000) {
    return generateThumbnailFromMiddle(videoUri, durationMs);
  }
  return generateVideoThumbnail(videoUri);
}
