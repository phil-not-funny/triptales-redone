"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, PenBox } from "lucide-react";
import PostService from "@/lib/services/postService";
import { DayForm } from "./DayForm";
import { useDays } from "@/hooks/useDays";
import { FormInput } from "../low/FormInput";

const formSchema = z
  .object({
    title: z.string().min(1, { message: "A title is required" }),
    description: z.string().min(1, { message: "A description is required" }),
    startDate: z.date(),
    endDate: z.date(),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (endDate < startDate) {
      ctx.addIssue({
        code: "custom",
        message: "The end date must be after the start date.",
        path: ["endDate"],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

export function NewPostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { days, addDay, editDay, removeDay, getDaysForApi } = useDays();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    console.log(days);
  }, [days]);

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
      toast.success("Post created successfully!");
      router.push(`/post/${response}`);
    } else {
      toast.error("Failed to create post!");
    }
    setLoading(false);
  });

  return (
    <div className="w-full space-y-3">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <FormInput control={form.control} name="title" label="Title" />
          <FormInput
            control={form.control}
            name="description"
            label="Description / Content"
            type="markdown"
          />
          <div className="flex flex-row justify-between gap-2">
            <FormInput
              control={form.control}
              name="startDate"
              label="Start Date"
              type="date"
            />
            <FormInput
              control={form.control}
              name="endDate"
              label="End Date"
              type="date"
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
                    title: `Edit Day ${idx + 1}`,
                    description: "You're about to edit a day in your post.",
                  }}
                  removeBtn
                  onRemove={() => removeDay(idx)}
                >
                  <PenBox className="h-4 w-4" /> Day {idx + 1}{" "}
                  <span className="text-gray-500">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(day.date))}
                  </span>
                </DayForm>
              ))}
            </div>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
