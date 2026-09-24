import { useState } from "react";
import { PictureValues } from "@/components/forms/PictureForm";

/**
 * Keeps the pictures a user selected while composing a post. Any number of
 * pictures can belong to the same target (the whole post, or a day).
 */
export function usePictures() {
  const [pictures, setPictures] = useState<PictureValues[]>([]);

  const addPictures = (added: PictureValues[]) =>
    setPictures((prev) => [...prev, ...added]);

  const removeWhere = (predicate: (p: PictureValues) => boolean) => {
    pictures
      .filter(predicate)
      .forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPictures((prev) => prev.filter((p) => !predicate(p)));
  };

  const removePicture = (id: string) => removeWhere((p) => p.id === id);

  const removePicturesOfTarget = (target: string) =>
    removeWhere((p) => p.target === target);

  return { pictures, addPictures, removePicture, removePicturesOfTarget };
}
