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

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, {
        message: "Username is required",
      })
      .regex(/^[a-z0-9._]+$/, {
        message:
          "Username can only contain lowercase letters, numbers, dots, and underscores.",
      }),
    password: z.string().min(1, {
      message: "Password is required.",
    }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    displayName: z.string().min(1, {
      message: "Please enter a display name.",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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
          label="Username"
          required
        />
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          textType="password"
          required
        />
        <FormInput
          control={form.control}
          name="confirmPassword"
          label="Match Password"
          required
        />
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          textType="email"
          required
        />
        <FormInput
          control={form.control}
          name="displayName"
          label="Display Name"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} Create new Account
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
      toast.success("Account created successfully!");
      router.push("/landing/login");
    } else {
      toast.error(response.message);
    }
  }
}
