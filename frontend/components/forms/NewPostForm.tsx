"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, PenBox } from "lucide-react";
import PostService from "@/lib/services/postService";
import { DayForm } from "./DayForm";
import { PictureForm, PictureTarget, POST_TARGET } from "./PictureForm";
import { PictureList } from "./PictureList";
import { useDays } from "@/hooks/useDays";
import { usePictures } from "@/hooks/usePictures";
import { usePictureUpload, UploadJob } from "@/hooks/usePictureUpload";
import { FormInput } from "../low/FormInput";
import {
  SubmitPhase,
  UploadProgressOverlay,
} from "../low/UploadProgressOverlay";
import {
  beautifyDate,
  parseDateOnlyString,
  toDateOnlyString,
} from "@/lib/utils";
import { useTranslations } from "next-intl";

/** How long the finished state stays visible before leaving for the new post. */
const DONE_DISPLAY_MS = 900;

export function NewPostForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [createdGuid, setCreatedGuid] = useState<string | null>(null);
  const { pictures, addPictures, removePicture, removePicturesOfTarget } =
    usePictures();
  const { progress, upload } = usePictureUpload();
  const { days, addDay, editDay, removeDay, getDaysForApi } = useDays();
  const t = useTranslations("Forms.NewPostForm");
  const tCommon = useTranslations("Common");
  const tDay = useTranslations("Forms.NewPostForm.day");
  const tPicture = useTranslations("Forms.PictureForm");

  const rangeError = t("validation.dateRangeRequired");
  const formSchema = z.object({
    title: z.string().min(1, { message: t("validation.titleRequired") }),
    description: z
      .string()
      .min(1, { message: t("validation.descriptionRequired") }),
    // The calendar reports a half-chosen range while only the start is picked.
    dateRange: z.custom<{ from: Date; to: Date }>(
      (value) => {
        const range = value as Partial<{ from: Date; to: Date }> | undefined;
        return !!range?.from && !!range?.to;
      },
      { message: rangeError },
    ),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "" },
  });

  // Days may only lie within the trip, so they are unlocked by choosing the range.
  const range = useWatch({ control: form.control, name: "dateRange" });
  const minDate = range?.from;
  const maxDate = range?.to;
  const hasRange = !!minDate && !!maxDate;

  // Pictures belong to the whole post or to a day. Days are identified by their
  // uuid, so a picture follows its day when the days get re-sorted by date.
  const pictureTargets: PictureTarget[] = [
    { value: POST_TARGET, label: tPicture("wholePost") },
    ...days.map((day, idx) => ({
      value: day.uuid,
      label: `${tCommon("day")} ${idx + 1}`,
    })),
  ];

  const handleRemoveDay = (idx: number) => {
    removePicturesOfTarget(days[idx].uuid);
    removeDay(idx);
  };

  const toUploadJobs = (): UploadJob[] =>
    pictures.map((picture) => ({
      file: picture.file,
      // days are sent to the API in exactly this order, so the index matches the backend
      dayIndex:
        picture.target === POST_TARGET
          ? undefined
          : days.findIndex((d) => d.uuid === picture.target),
    }));

  const handleSubmit = form.handleSubmit(async (values) => {
    const outsideRange = days.some(
      (day) =>
        parseDateOnlyString(day.date) < values.dateRange.from ||
        parseDateOnlyString(day.date) > values.dateRange.to,
    );
    if (outsideRange) return toast.error(t("validation.daysOutsideRange"));

    setPhase("creating");
    const guid = await PostService.createPost({
      title: values.title,
      description: values.description,
      startDate: toDateOnlyString(values.dateRange.from),
      endDate: toDateOnlyString(values.dateRange.to),
      days: getDaysForApi(),
    });
    if (!guid) {
      toast.error(t("error"));
      return setPhase("idle");
    }

    const jobs = toUploadJobs();
    setPhase("uploading");
    const failed = jobs.length > 0 ? await upload(guid, jobs) : 0;

    if (failed > 0) {
      toast.error(t("pictureError"));
      setCreatedGuid(guid);
      return setPhase("failed");
    }

    toast.success(t("success"));
    setPhase("done");
    if (jobs.length > 0)
      await new Promise((resolve) => setTimeout(resolve, DONE_DISPLAY_MS));
    router.push(`/post/${guid}`);
  });

  return (
    <div className="w-full space-y-3">
      <UploadProgressOverlay
        phase={phase}
        progress={progress}
        onContinue={() => router.push(`/post/${createdGuid}`)}
      />
      <Form {...form}>
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <FormInput
            control={form.control}
            name="title"
            label={t("title")}
            required
          />
          <FormInput
            control={form.control}
            name="description"
            label={t("description")}
            type="markdown"
            required
          />
          <FormInput
            control={form.control}
            name="dateRange"
            label={t("dateRange")}
            type="dateRange"
            required
          />
          <DayForm
            onSubmit={addDay}
            minDate={minDate}
            maxDate={maxDate}
            disabled={!hasRange}
          />

          {days.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {days.map((day, idx) => (
                <DayForm
                  key={day.uuid}
                  defaultValues={{
                    date: parseDateOnlyString(day.date),
                    title: day.title,
                    description: day.description,
                  }}
                  onSubmit={(values) => editDay(idx, values)}
                  headers={{
                    title: tDay("edit", { day: idx + 1 }),
                    description: tDay("editDescription"),
                  }}
                  minDate={minDate}
                  maxDate={maxDate}
                  removeBtn
                  onRemove={() => handleRemoveDay(idx)}
                >
                  <PenBox className="h-4 w-4" /> {tCommon("day")} {idx + 1}{" "}
                  <span className="text-gray-500">
                    {beautifyDate(parseDateOnlyString(day.date))}
                  </span>
                </DayForm>
              ))}
            </div>
          )}

          <PictureForm targets={pictureTargets} onSubmit={addPictures} />
          <PictureList
            pictures={pictures}
            targets={pictureTargets}
            onRemove={removePicture}
          />

          <Button type="submit" disabled={phase !== "idle"}>
            {phase !== "idle" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {tCommon("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
