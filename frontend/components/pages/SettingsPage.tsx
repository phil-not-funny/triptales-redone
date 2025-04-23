"use client";

import { UserDetailedResponse, UserUploadRequest } from "@/types/RequestTypes";
import { UserFlavorForm } from "../forms/UserFlavorForm";
import Sorry from "../low/Sorry";
import { useUser } from "../providers/UserProvider";
import { Separator } from "../ui/separator";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import UserService from "@/lib/services/userService";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";

interface UserSettingsProps {
  user: UserDetailedResponse;
}

const SettingsFlavorSection: React.FC<UserSettingsProps> = ({ user }) => {
  return (
    <div className="w-full max-w-xl px-3 md:px-0">
      <h2 className="text-center text-xl font-semibold text-gray-700">
        Customization
      </h2>
      <UserFlavorForm user={user} />
    </div>
  );
};

const SettingsPictureSectionSection = ({
  type,
  setUploadData
}: {
  type: "ProfilePicture" | "BannerImage";
  setUploadData: Dispatch<SetStateAction<UserUploadRequest | null>>
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, or GIF)");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        toast.error("Image size must be less than 25MB");
        return;
      }
      setLoading(true);
      setImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        var result = reader.result as string;
        setPreview(result);
        setUploadData((prev: UserUploadRequest | null) => ({
          ProfilePicture:
            type === "ProfilePicture" ? file : prev?.ProfilePicture || null,
          BannerImage:
            type === "BannerImage" ? file : prev?.BannerImage || null,
        }));
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <label
        htmlFor={"image-upload-" + type.toLowerCase()}
        className="block text-sm font-medium text-gray-700"
      >
        {loading && <Loader2 />} Select {type}
      </label>
      <Input
        key={type.toLowerCase()}
        type="file"
        id={"image-upload-" + type.toLowerCase()}
        accept="image/jpeg, image/png"
        name={type.toLowerCase()}
        onChange={handleFileChange}
        disabled={loading}
      />
      {preview && (
        <div className="relative w-full max-w-md">
          <div className="relative h-64 w-full">
            <Image
              src={preview}
              alt="Image preview"
              priority
              className="rounded-md object-contain"
              fill
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsPictureSection: React.FC<UserSettingsProps> = ({ user }) => {
  const [uploadData, setUploadData] = useState<UserUploadRequest | null>(null);

  const handleUploadImage = async () => {
    if (!uploadData) {
      toast.error("Please select an image to upload.");
      return;
    }
    const response = await UserService.userUpload(uploadData);
    if (response) {
      toast.success("Images uploaded successfully!");
    } else {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="w-full max-w-xl space-y-3 px-3 md:px-0">
      <h2 className="text-center text-xl font-semibold text-gray-700">
        Images Customization
      </h2>
      <div className="flex flex-row items-center justify-between gap-4">
        <SettingsPictureSectionSection setUploadData={setUploadData} type="ProfilePicture" />
        <SettingsPictureSectionSection setUploadData={setUploadData} type="BannerImage" />
      </div>
      <Button onClick={handleUploadImage}>Upload Images</Button>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { user: savedUser } = useUser();
  const [user, setUser] = useState<UserDetailedResponse | null>(null);

  const init = async () => {
    const response = await UserService.getByUsername(savedUser?.username || "");
    if (response) {
      setUser(response);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Settings</h1>
      {!user ? (
        <Sorry>Please Log In to Continue</Sorry>
      ) : (
        <Fragment>
          <Separator />
          <SettingsFlavorSection user={user} />
          <SettingsPictureSection user={user} />
        </Fragment>
      )}
    </div>
  );
};

export default SettingsPage;
