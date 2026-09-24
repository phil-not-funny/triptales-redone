"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
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
import { useTranslations } from "next-intl";

// Target value for the pictures of the whole post. Day pictures use the day's uuid.
export const POST_TARGET = "post";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export type PictureTarget = {
  value: string;
  label: string;
};

export type PictureValues = {
  id: string;
  file: File;
  previewUrl: string;
  target: string;
};

type SelectedFile = {
  file: File;
  previewUrl: string;
};

interface PictureFormProps {
  targets: PictureTarget[];
  onSubmit: (values: PictureValues[]) => void;
}

/**
 * Dialog for adding pictures to a post or one of its days. Several files can
 * be picked at once; a single picture can additionally be cropped.
 */
export function PictureForm({ targets, onSubmit }: PictureFormProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedFile[]>([]);
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const t = useTranslations("Forms.PictureForm");
  const tSettings = useTranslations("Settings");
  const tCommon = useTranslations("Common");

  // Cropping only makes sense for exactly one picture.
  const single = selected.length === 1 ? selected[0] : null;

  const discardSelection = () =>
    selected.forEach((s) => URL.revokeObjectURL(s.previewUrl));

  const reset = () => {
    setSelected([]);
    setCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    setTarget(targets[0]?.value ?? null);
  };

  const handleOpenChange = (value: boolean) => {
    if (value) reset();
    // closed without adding: the previews were not handed over, so free them
    else discardSelection();
    setOpen(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const valid = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(tSettings("imageFormatError"));
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(tSettings("imageSizeError"));
        return false;
      }
      return true;
    });
    if (valid.length === 0) return;

    discardSelection();
    setSelected(
      valid.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    );
    setCropping(false);
    setCroppedArea(null);
  };

  const handleAdd = async () => {
    if (selected.length === 0)
      return toast.error(tSettings("selectImageFirst"));
    if (!target) return;

    let values: PictureValues[] = selected.map(({ file, previewUrl }) => ({
      id: uuidv4(),
      file,
      previewUrl,
      target,
    }));

    if (single && cropping && croppedArea) {
      try {
        const blob = await getCroppedImg(single.previewUrl, croppedArea);
        const file = new File([blob], "croppedImage.jpg", {
          type: "image/jpeg",
        });
        URL.revokeObjectURL(single.previewUrl);
        values = [
          {
            id: values[0].id,
            file,
            previewUrl: URL.createObjectURL(file),
            target,
          },
        ];
      } catch {
        return toast.error(tSettings("cropError"));
      }
    }

    onSubmit(values);
    setSelected([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
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
              multiple
              onChange={handleFileChange}
            />
          </div>

          {single && (
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
                    image={single.previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, areaPixels) =>
                      setCroppedArea(areaPixels)
                    }
                  />
                </div>
              ) : (
                <img
                  src={single.previewUrl}
                  alt="Preview"
                  className="h-auto max-h-64 w-full rounded-lg object-contain"
                />
              )}
            </>
          )}

          {selected.length > 1 && (
            <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto">
              {selected.map(({ previewUrl }) => (
                <img
                  key={previewUrl}
                  src={previewUrl}
                  alt="Preview"
                  className="h-16 w-full rounded-md object-cover"
                />
              ))}
            </div>
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
                  onClick={() => setTarget(x.value)}
                >
                  {x.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleAdd}
            disabled={selected.length === 0 || !target}
          >
            {tCommon("add")}
            {selected.length > 1 && ` (${selected.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
