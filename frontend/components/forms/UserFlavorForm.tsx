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
import { useTranslations } from 'next-intl';

export function UserFlavorForm({ user }: { user: UserDetailedResponse }) {
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations("Forms.UserFlavorForm");
  const tCommon = useTranslations("Common");

  const formSchema = z.object({
    username: z
      .string()
      .min(1, {
        message: t("validation.usernameRequired"),
      })
      .regex(/^[a-z0-9._]+$/, {
        message: t("validation.usernameFormat"),
      }),
    displayName: z.string().min(1, { message: t("validation.displayNameRequired") }),
    biography: z.string().optional(),
    placeOfResidence: z.string().optional(),
    favoriteDestination: z.string().optional(),
  });

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
          label={t("username")}
          required
        />
        <FormInput
          control={form.control}
          name="displayName"
          label={t("displayName")}
          required
        />
        <FormInput
          control={form.control}
          name="placeOfResidence"
          label={t("placeOfResidence")}
        />
        <FormInput
          control={form.control}
          name="favoriteDestination"
          label={t("favoriteDestination")}
        />
        <FormInput
          control={form.control}
          name="biography"
          label={t("biography")}
          type="textarea"
          className="resize-none"
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} {tCommon("submit")}
        </Button>
      </form>
    </Form>
  );

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await userService.putFlavor(values);
    if (response) {
      toast.success(t("success"));
    } else {
      toast.error(t("error"));
    }
    setLoading(false);
  }
}
