"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import userService from "@/lib/services/userService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormInput } from "../low/FormInput";
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations("Forms.LoginForm");
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
    password: z.string().min(1, {
      message: t("validation.passwordRequired"),
    }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
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
          name="password"
          label={t("password")}
          textType="password"
          required
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
    const response = await userService.login(values);
    setLoading(false);
    if (response.status === 200) {
      toast.success(response.message);
      router.push("/");
    } else {
      toast.error(response.message);
    }
  }
}
