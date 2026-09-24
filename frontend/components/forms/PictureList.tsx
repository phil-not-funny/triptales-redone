"use client";

import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { PictureTarget, PictureValues } from "./PictureForm";

interface PictureListProps {
  pictures: PictureValues[];
  targets: PictureTarget[];
  onRemove: (id: string) => void;
}

/**
 * Preview grid of the pictures selected for a post, each labelled with the
 * target (whole post or day) it belongs to.
 */
export function PictureList({ pictures, targets, onRemove }: PictureListProps) {
  const tCommon = useTranslations("Common");

  if (pictures.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {pictures.map((picture) => (
        <div
          key={picture.id}
          className="flex flex-col gap-2 rounded-md border p-2 shadow-xs"
        >
          <img
            src={picture.previewUrl}
            alt="Preview"
            className="h-32 w-full rounded-md object-cover"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-500">
              {targets.find((x) => x.value === picture.target)?.label}
            </span>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onRemove(picture.id)}
            >
              {tCommon("remove")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
