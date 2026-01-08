"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, PenBox } from "lucide-react";
import PostService from "@/lib/services/postService";
import { DayForm } from "./DayForm";
import { useDays } from "@/hooks/useDays";
import { FormInput } from "../low/FormInput";
import { beautifyDate } from "@/lib/utils";
import { useTranslations } from 'next-intl';

export function NewPostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { days, addDay, editDay, removeDay, getDaysForApi } = useDays();
  const t = useTranslations("Forms.NewPostForm");
  const tCommon = useTranslations("Common");
  const tDay = useTranslations("Forms.NewPostForm.day");

  const formSchema = z
    .object({
      title: z.string().min(1, { message: t("validation.titleRequired") }),
      description: z.string().min(1, { message: t("validation.descriptionRequired") }),
      startDate: z.date(),
      endDate: z.date(),
    })
    .superRefine(({ startDate, endDate }, ctx) => {
      if (endDate < startDate) {
        ctx.addIssue({
          code: "custom",
          message: t("validation.endDateAfterStart"),
          path: ["endDate"],
        });
      }
    });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    const response = await PostService.createPost({
      title: values.title,
      description: values.description,
      startDate: values.startDate.toISOString().split("T")[0],
      endDate: values.endDate.toISOString().split("T")[0],
      days: getDaysForApi(),
    });
    if (response) {
      toast.success(t("success"));
      router.push(`/post/${response}`);
    } else {
      toast.error(t("error"));
    }
    setLoading(false);
  });

  return (
    <div className="w-full space-y-3">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <FormInput control={form.control} name="title" label={t("title")} required />
          <FormInput
            control={form.control}
            name="description"
            label={t("description")}
            type="markdown"
            required
          />
          <div className="flex flex-col items-center md:flex-row md:justify-between gap-2">
            <FormInput
              control={form.control}
              name="startDate"
              label={t("startDate")}
              type="date"
              required
            />
            <FormInput
              control={form.control}
              name="endDate"
              label={t("endDate")}
              type="date"
              required
            />
          </div>
          <DayForm onSubmit={addDay} />

          {days.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {days.map((day, idx) => (
                <DayForm
                  key={day.uuid}
                  defaultValues={{
                    date: new Date(day.date),
                    title: day.title,
                    description: day.description,
                  }}
                  onSubmit={(values) => editDay(idx, values)}
                  headers={{
                    title: tDay("edit", { day: idx + 1 }),
                    description: tDay("editDescription"),
                  }}
                  removeBtn
                  onRemove={() => removeDay(idx)}
                >
                  <PenBox className="h-4 w-4" /> {tCommon("day")} {idx + 1}{" "}
                  <span className="text-gray-500">
                    {beautifyDate(day.date)}
                  </span>
                </DayForm>
              ))}
            </div>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tCommon("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
