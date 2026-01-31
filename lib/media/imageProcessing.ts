// Image processing utilities
import * as ImageManipulator from 'expo-image-manipulator';

export interface ImageProcessingOptions {
  quality?: number; // 0-1, default 0.8
  maxWidth?: number;
  maxHeight?: number;
}

export interface ProcessedImage {
  uri: string;
  width: number;
  height: number;
}

const DEFAULT_OPTIONS: ImageProcessingOptions = {
  quality: 0.8,
  maxWidth: 1080,
  maxHeight: 1920,
};

/**
 * Compress and optionally resize an image
 */
export async function compressImage(
  uri: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const { quality, maxWidth, maxHeight } = { ...DEFAULT_OPTIONS, ...options };

  const actions: ImageManipulator.Action[] = [];

  // Get original dimensions to determine if resize is needed
  // ImageManipulator will handle this when we process
  if (maxWidth || maxHeight) {
    actions.push({
      resize: {
        width: maxWidth,
        height: maxHeight,
      },
    });
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: quality,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

/**
 * Compress image with specific aspect ratio dimensions
 */
export async function compressImageForAspectRatio(
  uri: string,
  aspectRatio: '1:1' | '4:5' | '9:16',
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const { quality } = { ...DEFAULT_OPTIONS, ...options };

  // Target dimensions based on aspect ratio
  const dimensions: Record<string, { width: number; height: number }> = {
    '1:1': { width: 1080, height: 1080 },
    '4:5': { width: 1080, height: 1350 },
    '9:16': { width: 1080, height: 1920 },
  };

  const targetDimensions = dimensions[aspectRatio] || dimensions['1:1'];

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        resize: {
          width: targetDimensions.width,
          height: targetDimensions.height,
        },
      },
    ],
    {
      compress: quality,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

/**
 * Quick compress without resize (for already cropped images)
 */
export async function quickCompress(
  uri: string,
  quality: number = 0.8
): Promise<ProcessedImage> {
  const result = await ImageManipulator.manipulateAsync(uri, [], {
    compress: quality,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}
