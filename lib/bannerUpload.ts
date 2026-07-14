import { getYoutubeVideoId } from '@/lib/bannerMedia';
import type { BannerMediaType } from '@/lib/bannerMedia';

type MediaAsset = { public_id: string; url: string; alt: string };

/** Max banner media file size allowed for direct Cloudinary upload */
export const MAX_BANNER_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

async function getCloudinarySignature(folder: string, resourceType: 'image' | 'video') {
  const res = await fetch('/api/upload/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, resourceType }),
  });

  const raw = await res.text();
  let data: {
    success?: boolean;
    error?: string;
    cloudName?: string;
    apiKey?: string;
    timestamp?: number;
    signature?: string;
    folder?: string;
    resourceType?: string;
  } = {};

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Could not prepare upload. Please try again.');
  }

  if (!res.ok || !data.success || !data.cloudName || !data.apiKey || !data.signature || !data.timestamp) {
    throw new Error(data.error || 'Could not prepare upload.');
  }

  return data as Required<
    Pick<typeof data, 'cloudName' | 'apiKey' | 'timestamp' | 'signature' | 'folder' | 'resourceType'>
  >;
}

/**
 * Uploads the file straight to Cloudinary (bypasses Vercel request body limits).
 */
async function uploadDirectToCloudinary(
  file: File,
  folder: string,
  resourceType: 'image' | 'video'
): Promise<MediaAsset> {
  if (file.size > MAX_BANNER_UPLOAD_BYTES) {
    throw new Error('File must be 5 MB or smaller.');
  }

  const signed = await getCloudinarySignature(folder, resourceType);
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', signed.apiKey);
  form.append('timestamp', String(signed.timestamp));
  form.append('signature', signed.signature);
  form.append('folder', signed.folder || folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`;
  const uploadRes = await fetch(endpoint, {
    method: 'POST',
    body: form,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || !uploadData.secure_url) {
    throw new Error(uploadData?.error?.message || `Failed to upload ${resourceType}.`);
  }

  return {
    public_id: uploadData.public_id || '',
    url: uploadData.secure_url,
    alt: '',
  };
}

async function uploadImageAsset(file: File, title: string): Promise<MediaAsset> {
  const asset = await uploadDirectToCloudinary(file, 'skygo/banners', 'image');
  return { ...asset, alt: title };
}

async function uploadVideoAsset(file: File, title: string): Promise<MediaAsset> {
  const asset = await uploadDirectToCloudinary(file, 'skygo/banners/videos', 'video');
  return { ...asset, alt: title };
}

function imageFromUrl(url: string, title: string): MediaAsset {
  return { public_id: '', url, alt: title };
}

export interface BannerMediaInput {
  mediaType: BannerMediaType;
  title: string;
  imageFile: File | null;
  externalImageUrl: string;
  videoFile: File | null;
  externalVideoUrl: string;
  youtubeUrl: string;
  existingImage?: MediaAsset;
  existingVideo?: MediaAsset;
}

export async function buildBannerMediaPayload(input: BannerMediaInput) {
  const {
    mediaType,
    title,
    imageFile,
    externalImageUrl,
    videoFile,
    externalVideoUrl,
    youtubeUrl,
    existingImage,
    existingVideo,
  } = input;

  let image: MediaAsset | undefined = existingImage;
  let video: MediaAsset | undefined = existingVideo;
  let normalizedYoutubeUrl = '';

  if (imageFile) {
    image = await uploadImageAsset(imageFile, title);
  } else if (externalImageUrl.trim()) {
    image = imageFromUrl(externalImageUrl.trim(), title);
  }

  if (mediaType === 'image') {
    if (!image?.url) {
      throw new Error('Banner image is required.');
    }
    return {
      mediaType,
      image,
      video: null,
      youtubeUrl: '',
    };
  }

  if (mediaType === 'video') {
    if (videoFile) {
      video = await uploadVideoAsset(videoFile, title);
    } else if (externalVideoUrl.trim()) {
      video = imageFromUrl(externalVideoUrl.trim(), title);
    } else if (existingVideo?.url) {
      video = existingVideo;
    }

    if (!video?.url) {
      throw new Error('Banner video file or URL is required.');
    }

    return {
      mediaType,
      image,
      video,
      youtubeUrl: '',
    };
  }

  normalizedYoutubeUrl = youtubeUrl.trim();
  if (!getYoutubeVideoId(normalizedYoutubeUrl)) {
    throw new Error('A valid YouTube link is required.');
  }

  return {
    mediaType,
    image,
    video: null,
    youtubeUrl: normalizedYoutubeUrl,
  };
}
