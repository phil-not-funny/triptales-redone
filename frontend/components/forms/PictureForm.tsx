/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { getCroppedImg } from "@/lib/utils";
import { useTranslations } from 'next-intl';

// Target value for the picture of the whole post. Day pictures use the day's uuid.
export const POST_TARGET = "post";

export type PictureTarget = {
  value: string;
  label: string;
  taken: boolean;
};

export type PictureValues = {
  file: File;
  previewUrl: string;
  target: string;
};

interface PictureFormProps {
  targets: PictureTarget[];
  onSubmit: (values: PictureValues) => void;
}

export function PictureForm({ targets, onSubmit }: PictureFormProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const t = useTranslations("Forms.PictureForm");
  const tSettings = useTranslations("Settings");
  const tCommon = useTranslations("Common");

  const reset = () => {
    setFile(null);
    setPreview(null);
    setCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    setTarget(targets.find((x) => !x.taken)?.value ?? null);
  };

  const handleOpenChange = (value: boolean) => {
    if (value) reset();
    // closed without adding: the preview was not handed over, so free it
    else if (preview) URL.revokeObjectURL(preview);
    setOpen(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isValidType = ["image/jpeg", "image/png", "image/gif"].includes(
      selected.type,
    );
    if (!isValidType) return toast.error(tSettings("imageFormatError"));
    if (selected.size > 25 * 1024 * 1024)
      return toast.error(tSettings("imageSizeError"));

    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setCroppedArea(null);
  };

  const handleAdd = async () => {
    if (!file || !preview) return toast.error(tSettings("selectImageFirst"));
    if (!target) return;

    let result = file;
    if (cropping && croppedArea) {
      try {
        const blob = await getCroppedImg(preview, croppedArea);
        result = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });
      } catch {
        return toast.error(tSettings("cropError"));
      }
    }

    let previewUrl = preview;
    if (result !== file) {
      URL.revokeObjectURL(preview);
      previewUrl = URL.createObjectURL(result);
    }
    onSubmit({ file: result, previewUrl, target });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full"
          disabled={targets.every((x) => x.taken)}
        >
          <ImagePlus className="h-4 w-4" /> {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add")}</DialogTitle>
          <DialogDescription>{t("addDescription")}</DialogDescription>
        </DialogHeader>
        <div className="w-full space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="upload-post-picture">{t("select")}</Label>
            <Input
              id="upload-post-picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {preview && (
            <>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={cropping ? "outline" : "default"}
                  onClick={() => setCropping(false)}
                >
                  {t("original")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={cropping ? "default" : "outline"}
                  onClick={() => setCropping(true)}
                >
                  {t("crop")}
                </Button>
              </div>
              {cropping ? (
                <div className="relative h-64 w-full">
                  <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, areaPixels) => setCroppedArea(areaPixels)}
                  />
                </div>
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-auto max-h-64 w-full rounded-lg object-contain"
                />
              )}
            </>
          )}

          <div className="flex flex-col gap-2">
            <Label>{t("belongsTo")}</Label>
            <div className="flex flex-wrap gap-2">
              {targets.map((x) => (
                <Button
                  key={x.value}
                  type="button"
                  size="sm"
                  variant={target === x.value ? "default" : "outline"}
                  disabled={x.taken}
                  onClick={() => setTarget(x.value)}
                >
                  {x.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAdd} disabled={!file || !target}>
            {tCommon("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
