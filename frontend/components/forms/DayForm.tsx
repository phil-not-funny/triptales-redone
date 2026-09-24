import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FormInput } from "../low/FormInput";
import { useTranslations } from "next-intl";

type DayFormValues = {
  title: string;
  description: string;
  date: Date;
};

interface DayFormProps {
  onSubmit: (values: DayFormValues) => void;
  defaultValues?: Partial<DayFormValues>;
  children?: React.ReactNode;
  headers?: { title: string; description: string };
  removeBtn?: boolean;
  onRemove?: () => void;
  /** Earliest day the user may pick, usually the start of the trip. */
  minDate?: Date;
  /** Latest day the user may pick, usually the end of the trip. */
  maxDate?: Date;
  disabled?: boolean;
}

function getDayFormSchema(
  t: ReturnType<typeof useTranslations<"Forms.DayForm">>,
  minDate?: Date,
  maxDate?: Date,
) {
  return z.object({
    title: z.string().min(1, { message: t("validation.titleRequired") }),
    description: z
      .string()
      .min(1, { message: t("validation.descriptionRequired") }),
    date: z
      .date({ message: t("validation.dateRequired") })
      .refine((date) => !minDate || date >= minDate, {
        message: t("validation.dateOutsideRange"),
      })
      .refine((date) => !maxDate || date <= maxDate, {
        message: t("validation.dateOutsideRange"),
      }),
  });
}

export function DayForm({
  onSubmit,
  defaultValues,
  children,
  headers,
  removeBtn = false,
  onRemove,
  minDate,
  maxDate,
  disabled = false,
}: DayFormProps) {
  const t = useTranslations("Forms.DayForm");
  const tCommon = useTranslations("Common");
  const tNewPost = useTranslations("Forms.NewPostForm.day");

  const defaultHeaders = {
    title: tNewPost("add"),
    description: tNewPost("addDescription"),
  };

  const finalHeaders = headers || defaultHeaders;
  const daysFormSchema = getDayFormSchema(t, minDate, maxDate);

  const [open, setOpen] = useState(false);
  // A form without initial values adds a new day and starts empty next time.
  const isNewDay = defaultValues === undefined;

  const form = useForm<DayFormValues>({
    resolver: zodResolver(daysFormSchema),
    defaultValues: defaultValues ?? { title: "", description: "" },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
    if (isNewDay) form.reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={disabled}>
          {children || (
            <>
              <Plus className="h-4 w-4" /> {tCommon("day")}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{finalHeaders.title}</DialogTitle>
          <DialogDescription>{finalHeaders.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full space-y-3"
          >
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
              required
            />
            <FormInput
              control={form.control}
              name="date"
              label={t("date")}
              type="date"
              minDate={minDate}
              maxDate={maxDate}
              required
            />
            <DialogFooter
              className={
                removeBtn ? "!flex !flex-row !justify-between" : undefined
              }
            >
              {removeBtn && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove?.();
                  }}
                >
                  {tCommon("remove")}
                </Button>
              )}
              <Button type="submit">{tCommon("add")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
