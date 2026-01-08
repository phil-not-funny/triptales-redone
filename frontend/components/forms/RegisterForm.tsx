"use client";

import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import userService from "@/lib/services/userService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormInput } from "../low/FormInput";
import { useTranslations } from 'next-intl';

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations("Forms.RegisterForm");

  const formSchema = z
    .object({
      username: z
        .string()
        .min(4, {
          message: t("validation.usernameMinLength"),
        })
        .regex(/^[a-z0-9._]+$/, {
          message: t("validation.usernameFormat"),
        }),
      password: z.string().min(8, {
        message: t("validation.passwordMinLength"),
      }).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, {
        message: t("validation.passwordFormat")
      }),
      confirmPassword: z.string().min(1, {
        message: t("validation.confirmPasswordRequired"),
      }),
      email: z.string().email({
        message: t("validation.emailInvalid"),
      }),
      displayName: z.string().min(1, {
        message: t("validation.displayNameRequired"),
      }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: t("validation.passwordsDoNotMatch"),
          path: ["confirmPassword"],
        });
      }
    });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      displayName: "",
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
        <FormInput
          control={form.control}
          name="confirmPassword"
          label={t("confirmPassword")}
          textType="password"
          required
        />
        <FormInput
          control={form.control}
          name="email"
          label={t("email")}
          textType="email"
          required
        />
        <FormInput
          control={form.control}
          name="displayName"
          label={t("displayName")}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} {t("createAccount")}
        </Button>
      </form>
    </Form>
  );

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await userService.register(values);
    setLoading(false);
    if (response.status === 200) {
      toast.success(t("success"));
      router.push("/landing/login");
    } else {
      toast.error(response.message);
    }
  }
}
