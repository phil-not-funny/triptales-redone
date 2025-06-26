/* eslint-disable @next/next/no-img-element */
"use client";

import { UserUploadRequest } from "@/types/RequestTypes";
import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/utils";

const ImageUploader = ({
  type,
  setUploadData,
  setPreviewUrl,
  previewUrl
}: {
  type: "ProfilePicture" | "BannerImage";
  setUploadData: Dispatch<SetStateAction<UserUploadRequest | null>>;
  setPreviewUrl?: Dispatch<SetStateAction<string | null>>;
  previewUrl?: string | null;
}) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = (_: Area, areaPixels: Area) =>
    setCroppedArea(areaPixels);

  const updateUploadData = (file: File) => {
    setPreviewUrl?.(URL.createObjectURL(file));
    setUploadData((prev) => ({
      ProfilePicture:
        type === "ProfilePicture" ? file : prev?.ProfilePicture || null,
      BannerImage: type === "BannerImage" ? file : prev?.BannerImage || null,
    }));
  };

  const handleFinishCrop = async () => {
    if (!preview || !croppedArea) return;
    try {
      const blob = await getCroppedImg(preview, croppedArea);
      const file = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });
      updateUploadData(file);
      setOpen(false);
      setPreview(URL.createObjectURL(file));
    } catch {
      toast.error("Failed to crop image. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = ["image/jpeg", "image/png", "image/gif"].includes(
      file.type,
    );
    if (!isValidType)
      return toast.error("Upload a valid image (JPEG, PNG, GIF)");
    if (file.size > 25 * 1024 * 1024)
      return toast.error("Image must be < 25MB");

    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      updateUploadData(file);
      setLoading(false);
      if (type === "ProfilePicture") {
        setOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={`upload-${type}`} className="mb-2 font-medium">
        {loading ? (
          <Loader2 className="inline-block animate-spin" />
        ) : (
          `Select ${type}`
        )}
      </label>
      <Input
        id={`upload-${type}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      {(previewUrl || preview) && !open && (
        <div className="mt-4 flex w-full flex-col items-center justify-between">
          <img
            src={preview || "https://localhost:5001/" + previewUrl}
            alt="Preview"
            className={
              "h-auto " +
              (type === "ProfilePicture" ? "w-1/2 rounded-full" : "w-full")
            }
          />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop {type}</DialogTitle>
          </DialogHeader>
          <div className="relative h-64 w-full">
            <Cropper
              image={preview!}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleFinishCrop}>
              Finish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
