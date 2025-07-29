/** Hooks */
import { useState, useEffect, useCallback } from 'react';
import { useRouterQuery } from '../../../_hooks/useRouterQuery';

/** API */
//import { getAllEventContents } from '../../../../../providers/events'

export const useData = (eventId: any) => {
  const [data, setData] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);

  const [queries] = useRouterQuery()

  const getContent = useCallback(async () => {
    try {
      setLoading(true);
      // const { data }: any = await getAllEventContents(eventId);

      // if (data) {
      //   const { getAllEventContents } = data;
      //   setData(getAllEventContents.contents
      //     .filter((content: any) => {
      //       if (queries.type) {
      //         return content.subContentType === queries.type
      //       }
      //       return !content.subContentType || content.subContentType === 'content'
      //     })
      //     .map((content: any) => {
      //       return {
      //         ...content,
      //         id: content.id,
      //         logoUrl: content.imageURL,
      //         bio: content.body,
      //         linkURL: content.linkURL,
      //         keywords: content.keywords ? content.keywords : [],
      //         name: content.name,
      //         type: "content",
      //         pricing: content.pricing,
      //         links: content.links,
      //         images: content.images
      //       };
      //     })
      //   )
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setRefetch(false);
      setLoading(false);
    }
  }, [eventId, queries.type]);

  useEffect(() => {
    getContent();
  }, [getContent])

  useEffect(() => {
    if (refetch) {
      getContent();
    }
  }, [refetch, getContent])

  return {
    data,
    loading,
    setRefetch,
  }
}
