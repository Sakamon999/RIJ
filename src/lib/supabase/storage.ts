import { supabase } from './client';

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  upsert?: boolean;
}

export interface UploadResult {
  url: string;
  path: string;
  fullPath: string;
}

export async function uploadFile({
  bucket,
  path,
  file,
  upsert = false,
}: UploadOptions): Promise<UploadResult> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path,
    fullPath: data.fullPath,
  };
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw error;
  }
}

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function listFiles(bucket: string, path?: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function createBucket(
  bucketName: string,
  options?: {
    public?: boolean;
    fileSizeLimit?: number;
    allowedMimeTypes?: string[];
  }
) {
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: options?.public ?? false,
    fileSizeLimit: options?.fileSizeLimit,
    allowedMimeTypes: options?.allowedMimeTypes,
  });

  if (error) {
    throw error;
  }

  return data;
}
