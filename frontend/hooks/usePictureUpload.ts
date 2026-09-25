import { useCallback, useState } from "react";
import PostService from "@/lib/services/postService";

/** A picture waiting to be uploaded to a post (or to one of its days). */
export type UploadJob = {
  file: File;
  /** Index of the day the picture belongs to; `undefined` for the whole post. */
  dayIndex?: number;
};

export type UploadProgress = {
  /** Number of pictures finished so far (successfully or not). */
  completed: number;
  total: number;
  /** Fraction (0..1) of all bytes that have been uploaded and processed. */
  fraction: number;
  /** Whether the current picture is fully sent and waits for the server. */
  processing: boolean;
  failed: number;
};

const INITIAL_PROGRESS: UploadProgress = {
  completed: 0,
  total: 0,
  fraction: 0,
  processing: false,
  failed: 0,
};

/**
 * Share of a picture's progress that is credited while its bytes are sent. The
 * rest is only granted once the server confirmed, so the bar never claims to
 * be finished while the server is still processing.
 */
const SENT_SHARE = 0.95;

/** Every picture is tried this often before it counts as failed. */
const MAX_ATTEMPTS = 2;

/**
 * Uploads pictures one after the other, one request per picture, and reports
 * the progress of the whole batch. Sending them sequentially keeps memory and
 * request sizes small and preserves the order in which the user added them.
 */
export function usePictureUpload() {
  const [progress, setProgress] = useState<UploadProgress>(INITIAL_PROGRESS);

  /**
   * @returns The number of pictures that could not be uploaded.
   */
  const upload = useCallback(
    async (guid: string, jobs: UploadJob[]): Promise<number> => {
      const totalBytes = jobs.reduce((sum, job) => sum + job.file.size, 0) || 1;
      let doneBytes = 0;
      let failed = 0;
      setProgress({ ...INITIAL_PROGRESS, total: jobs.length });

      for (const [index, job] of jobs.entries()) {
        let uploaded = false;
        for (let attempt = 0; attempt < MAX_ATTEMPTS && !uploaded; attempt++) {
          uploaded = await PostService.uploadPicture(
            guid,
            job.file,
            job.dayIndex,
            (sent) =>
              setProgress((prev) => ({
                ...prev,
                fraction:
                  (doneBytes + Math.min(sent, SENT_SHARE) * job.file.size) /
                  totalBytes,
                processing: sent >= 1,
              })),
          );
        }
        if (!uploaded) failed++;
        doneBytes += job.file.size;
        setProgress({
          completed: index + 1,
          total: jobs.length,
          fraction: doneBytes / totalBytes,
          processing: false,
          failed,
        });
      }
      return failed;
    },
    [],
  );

  return { progress, upload };
}
