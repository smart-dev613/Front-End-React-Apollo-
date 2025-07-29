/** Hooks */
import { useCallback } from 'react';

/** Request */
import { getAvatarUploadToken } from '../../../../providers/user';
import { uploadPresignedS3 } from '../../../../providers/core/common';

export const useUpload = (eventId: any) => {
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (files === null) return;
    try {
      const file = files[0];
      const key = file.name
      let result: any = await getAvatarUploadToken(eventId, key);
      if (result.data.getS3POSTUploadToken) {
        const data = result.data.getS3POSTUploadToken;

        // construct the FormData manually for sending to S3
        const formData = new FormData();
        // formData.append('Content-Type', file.type)
        formData.append("Content-Type", file.type);

        // add all the required presigned fields
        Object.entries(data.fields).forEach(([k, v]) => {
          formData.append(k, v as any);
        });

        // add the object key in the bucket (lbi-avatars/USER_ID/image.png)
        // @ts-ignore
        formData.append(
          "key",
          `event-logo/${eventId}/${file.name}`
        );

        // ACL must be public read
        formData.append("acl", "public-read");

        // and finally add the file itself (this should be last)
        formData.append("file", file);

        const res: any = await uploadPresignedS3(data.url, formData);
        if (res.status !== 204) {
          // TODO: show nice error to user
          console.error("File could not be uploaded to S3");
        } else {
          let previewUrl = `https://user-assets.synkd.life/event-logo/${eventId}/${file.name}`;
          if (previewUrl) {
            return previewUrl
          }
        }
      } else {
        alert("Error getting upload token for avatar upload");
      }
    } catch (error) {
      console.log(error)
    }
    return '';
  }, [eventId])

  return {
    handleFileUpload,
  }
}
