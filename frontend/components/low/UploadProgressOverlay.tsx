"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { UploadProgress } from "@/hooks/usePictureUpload";
import { Button } from "../ui/button";

/** Stages of publishing a post. */
export type SubmitPhase = "idle" | "creating" | "uploading" | "done" | "failed";

interface UploadProgressOverlayProps {
  phase: SubmitPhase;
  progress: UploadProgress;
  /** Called when the user leaves the overlay after some pictures failed. */
  onContinue: () => void;
}

/**
 * Full-screen loading screen shown while a post and its pictures are being
 * published. It only reports "done" once the server confirmed every picture.
 */
export function UploadProgressOverlay({
  phase,
  progress,
  onContinue,
}: UploadProgressOverlayProps) {
  const t = useTranslations("Forms.NewPostForm.upload");

  if (phase === "idle") return null;

  const percent = Math.round(
    (phase === "done" || phase === "failed" ? 1 : progress.fraction) * 100,
  );
  const showBar = phase !== "creating";

  const message = {
    creating: t("creating"),
    uploading: progress.processing
      ? t("processing", {
          current: progress.completed + 1,
          total: progress.total,
        })
      : t("uploading", {
          current: progress.completed + 1,
          total: progress.total,
        }),
    done: t("done"),
    failed: t("failed", { count: progress.failed }),
  }[phase];

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 text-center shadow-xl">
        {phase === "done" ? (
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
        ) : phase === "failed" ? (
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
        ) : (
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-500" />
        )}
        <p className="text-sm font-medium text-gray-800">{message}</p>
        {showBar && (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
          >
            <div
              className="h-full rounded-full bg-gray-800 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
        {phase === "failed" && (
          <Button type="button" onClick={onContinue}>
            {t("toPost")}
          </Button>
        )}
      </div>
    </div>
  );
}
