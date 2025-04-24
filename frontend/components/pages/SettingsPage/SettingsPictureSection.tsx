"use client";

import { UserUploadRequest } from "@/types/RequestTypes";
import { useState } from "react";
import UserService from "@/lib/services/userService";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import ImageUploader from "./SettingsPictureUpload";
import { UserSettingsProps } from "./SettingsPage";

const SettingsPictureSection: React.FC<UserSettingsProps> = ({ user }) => {
  const [uploadData, setUploadData] = useState<UserUploadRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [anyPreview, setAnyPreview] = useState<boolean>(false);

  const handleUploadImage = async () => {
    if (!uploadData) return toast.error("Select an image first.");
    setLoading(true);
    const res = await UserService.userUpload(uploadData);
    toast[res ? "success" : "error"](
      res ? "Images uploaded!" : "Upload failed.",
    );
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl space-y-4 px-3 md:px-0">
      <h2 className="text-center text-xl font-semibold text-gray-700">
        Images Customization
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <ImageUploader
          type="ProfilePicture"
          setUploadData={setUploadData}
          setPreviewUrl={() => setAnyPreview(true)}
          previewUrl={user.profilePicture}
        />
        <ImageUploader
          type="BannerImage"
          setUploadData={setUploadData}
          setPreviewUrl={() => setAnyPreview(true)}
          previewUrl={user.bannerImage}
        />
      </div>
      {anyPreview && (
        <span className="text-muted-foreground block text-sm italic">
          This is a preview. Click "Upload Images" to save these changes.
        </span>
      )}
      <Button onClick={handleUploadImage} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Upload
        Images
      </Button>
    </div>
  );
};

export default SettingsPictureSection;
