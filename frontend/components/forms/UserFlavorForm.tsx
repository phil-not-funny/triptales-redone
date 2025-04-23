"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import userService from "@/lib/services/userService";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { UserDetailedResponse } from "@/types/RequestTypes";
import { FormInput } from "../low/FormInput";
import { useUser } from "../providers/UserProvider";

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username is required",
    })
    .regex(/^[a-z0-9._]+$/, {
      message:
        "Username can only contain lowercase letters, numbers, dots, and underscores.",
    }),
  displayName: z.string().min(1, { message: "Display name is required." }),
  biography: z.string().optional(),
  placeOfResidence: z.string().optional(),
  favoriteDestination: z.string().optional(),
});

export function UserFlavorForm({ user }: { user: UserDetailedResponse }) {
  const { refreshUser } = useUser();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      displayName: user.displayName,
      biography: user.biography || "",
      placeOfResidence: user.placeOfResidence || "",
      favoriteDestination: user.favoriteDestination || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <FormInput
          control={form.control}
          name="username"
          label="Username"
          required
        />
        <FormInput
          control={form.control}
          name="displayName"
          label="Display Name"
          required
        />
        <FormInput
          control={form.control}
          name="placeOfResidence"
          label="Place of Residence"
        />
        <FormInput
          control={form.control}
          name="favoriteDestination"
          label="Favorite Destination"
        />
        <FormInput
          control={form.control}
          name="biography"
          label="Biography"
          type="textarea"
          className="resize-none"
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} Submit
        </Button>
      </form>
    </Form>
  );

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await userService.putFlavor(values);
    if (response) {
      toast.success("User updated successfully.");
      refreshUser();
    } else {
      toast.error("Failed to update user.");
    }
    setLoading(false);
  }
}
