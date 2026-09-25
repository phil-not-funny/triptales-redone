"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { IMAGE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

interface PictureGalleryProps {
  /** Picture paths as returned by the API (relative to the image host). */
  pictures: string[];
  alt: string;
  className?: string;
}

/**
 * Small thumbnails of the given pictures. Clicking one opens it enlarged in a
 * lightbox that can be paged through with the buttons or the arrow keys.
 */
export function PictureGallery({
  pictures,
  alt,
  className,
}: PictureGalleryProps) {
  const [current, setCurrent] = useState<number | null>(null);
  const t = useTranslations("Post");

  const open = current !== null;
  const count = pictures.length;

  useEffect(() => {
    if (!open) return;
    const step = (delta: number) =>
      setCurrent((prev) =>
        prev === null ? prev : (prev + delta + count) % count,
      );
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, count]);

  const step = (delta: number) =>
    setCurrent((prev) =>
      prev === null ? prev : (prev + delta + count) % count,
    );

  if (pictures.length === 0) return null;

  return (
    <>
      <div className={cn("flex flex-wrap gap-2", className)}>
        {pictures.map((picture, index) => (
          <button
            key={picture}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={t("enlargePicture", { index: index + 1 })}
            className="overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
          >
            <img
              src={`${IMAGE_URL}/${picture}`}
              alt={alt}
              loading="lazy"
              className="h-24 w-32 cursor-zoom-in object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(value) => !value && setCurrent(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          {current !== null && (
            <div className="flex items-center gap-2">
              {pictures.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => step(-1)}
                  aria-label={t("previousPicture")}
                >
                  <ChevronLeft />
                </Button>
              )}
              <img
                src={`${IMAGE_URL}/${pictures[current]}`}
                alt={alt}
                className="max-h-[75vh] min-w-0 flex-1 rounded-lg object-contain"
              />
              {pictures.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => step(1)}
                  aria-label={t("nextPicture")}
                >
                  <ChevronRight />
                </Button>
              )}
            </div>
          )}
          {pictures.length > 1 && current !== null && (
            <p className="text-center text-sm text-gray-500">
              {current + 1} / {pictures.length}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
