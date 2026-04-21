import * as ImageManipulator from "expo-image-manipulator";

/**
 * Chuyển ảnh đã chọn (HEIC/HEIF trên iOS, v.v.) sang JPEG để khớp backend
 * `/virtual-tryon/upload-model` và tránh MIME không nằm trong whitelist.
 */
export async function prepareModelImageForTryOn(sourceUri: string): Promise<{
  uri: string;
  mimeType: string;
  fileName: string;
}> {
  const result = await ImageManipulator.manipulateAsync(sourceUri, [], {
    compress: 0.88,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return {
    uri: result.uri,
    mimeType: "image/jpeg",
    fileName: `model-${Date.now()}.jpg`,
  };
}

/** JPEG hóa ảnh (đánh giá, v.v.) — tránh HEIC khi upload multipart. */
export async function compressImageToJpeg(
  sourceUri: string,
  compress = 0.85
): Promise<{ uri: string; mimeType: string; fileName: string }> {
  const result = await ImageManipulator.manipulateAsync(sourceUri, [], {
    compress,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return {
    uri: result.uri,
    mimeType: "image/jpeg",
    fileName: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`,
  };
}
