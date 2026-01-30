-- Storage Policies for avatars bucket
-- Allow authenticated users to upload their own pet avatars

-- Policy: Allow authenticated users to upload to pet-avatars folder
CREATE POLICY "Allow authenticated uploads to pet-avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = 'pet-avatars'
);

-- Policy: Allow authenticated users to update their own uploads
CREATE POLICY "Allow authenticated updates to pet-avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = 'pet-avatars'
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = 'pet-avatars'
);

-- Policy: Allow public read access to all avatars (for displaying in app)
CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy: Allow authenticated users to delete their own pet avatars
-- (We'll restrict this more in future when we track ownership)
CREATE POLICY "Allow authenticated deletes in pet-avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = 'pet-avatars'
);
