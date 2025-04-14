"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { DatePicker } from "../ui/datepicker";
import PostService from "@/lib/services/postService";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { PostDay } from "@/types/ModelTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CreatePostRequestDay } from "@/types/RequestTypes";

const formSchema = z
  .object({
    title: z.string().min(1, {
      message: "A title is required",
    }),
    description: z.string().min(1, {
      message: "A description is required",
    }),
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

const daysFormSchema = z.object({
  title: z.string().min(1, {
    message: "A title is required",
  }),
  description: z.string().min(1, {
    message: "A description is required",
  }),
  date: z.date(),
});

function NewDayForm({
  days,
  setDays,
}: {
  days: CreatePostRequestDay[];
  setDays: React.Dispatch<React.SetStateAction<CreatePostRequestDay[]>>;
}) {
  const form = useForm<z.infer<typeof daysFormSchema>>({
    resolver: zodResolver(daysFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4" /> Day
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Day</DialogTitle>
          <DialogDescription>
            You're about to add a new in-detail day to your post.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field}>Pick a Date</DatePicker>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  async function onSubmit(values: z.infer<typeof daysFormSchema>) {
    setDays((prev) => [
      ...prev,
      {
        title: values.title,
        description: values.description,
        date: values.date.toLocaleDateString(),
      },
    ]);
    toast.success("Day added successfully!");
    console.log(days);
  }
}

export function NewPostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [days, setDays] = useState<CreatePostRequestDay[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return (
    <div className="w-full space-y-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-3"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description / Content</FormLabel>
                <FormControl data-color-mode="light">
                  <MDEditor
                    commands={commands
                      .getCommands()
                      .filter(
                        (i) => i.name !== "image" && i.name !== "comment",
                      )}
                    className="leading-relaxed text-gray-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-between gap-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field}>Pick a Date</DatePicker>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field}>Pick a Date</DatePicker>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />} Submit
          </Button>
        </form>
      </Form>
      <NewDayForm days={days} setDays={setDays} />
    </div>
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await PostService.createPost({
      title: values.title,
      description: values.description,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      days,
    });
    if (response) {
      toast.success("Post created successfully!");
      router.push(`/post/${response}`);
    } else toast.error("Failed to create post!");
    setLoading(false);
  }
}
