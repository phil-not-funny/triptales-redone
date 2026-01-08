import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
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
import { useTranslations } from 'next-intl';

type DayFormValues = z.infer<ReturnType<typeof getDayFormSchema>>;

interface DayFormProps {
  onSubmit: (values: DayFormValues) => void;
  defaultValues?: Partial<DayFormValues>;
  children?: React.ReactNode;
  headers?: { title: string; description: string };
  removeBtn?: boolean;
  onRemove?: () => void;
}

function getDayFormSchema(t: ReturnType<typeof useTranslations<"Forms.DayForm">>) {
  return z.object({
    title: z.string().min(1, { message: t("validation.titleRequired") }),
    description: z.string().min(1, { message: t("validation.descriptionRequired") }),
    date: z.date(),
  });
}

export function DayForm({
  onSubmit,
  defaultValues = { title: "", description: "" },
  children,
  headers,
  removeBtn = false,
  onRemove,
}: DayFormProps) {
  const t = useTranslations("Forms.DayForm");
  const tCommon = useTranslations("Common");
  const tNewPost = useTranslations("Forms.NewPostForm.day");

  const defaultHeaders = {
    title: tNewPost("add"),
    description: tNewPost("addDescription"),
  };

  const finalHeaders = headers || defaultHeaders;
  const daysFormSchema = getDayFormSchema(t);

  const form = useForm<DayFormValues>({
    resolver: zodResolver(daysFormSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
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
