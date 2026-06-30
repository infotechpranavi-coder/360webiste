import { prepareBannerImageForUpload, readFileAsDataUrl } from '@/lib/utils';
import { getYoutubeVideoId } from '@/lib/bannerMedia';
import type { BannerMediaType } from '@/lib/bannerMedia';

type MediaAsset = { public_id: string; url: string; alt: string };

async function uploadImageAsset(file: File, title: string): Promise<MediaAsset> {
  const base64 = await prepareBannerImageForUpload(file);
  const uploadRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: base64, folder: 'skygo/banners' }),
  });
  const uploadData = await uploadRes.json();
  if (!uploadData.success) {
    throw new Error(uploadData.error || 'Failed to upload image.');
  }
  return {
    public_id: uploadData.public_id,
    url: uploadData.url,
    alt: title,
  };
}

async function uploadVideoAsset(file: File, title: string): Promise<MediaAsset> {
  const base64 = await readFileAsDataUrl(file);
  const uploadRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: base64,
      folder: 'skygo/banners/videos',
      resourceType: 'video',
    }),
  });
  const uploadData = await uploadRes.json();
  if (!uploadData.success) {
    throw new Error(uploadData.error || 'Failed to upload video.');
  }
  return {
    public_id: uploadData.public_id,
    url: uploadData.url,
    alt: title,
  };
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
