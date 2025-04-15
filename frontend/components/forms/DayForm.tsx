import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Plus, PenBox } from "lucide-react";
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

const daysFormSchema = z.object({
  title: z.string().min(1, { message: "A title is required" }),
  description: z.string().min(1, { message: "A description is required" }),
  date: z.date(),
});

type DayFormValues = z.infer<typeof daysFormSchema>;

interface DayFormProps {
  onSubmit: (values: DayFormValues) => void;
  defaultValues?: Partial<DayFormValues>;
  children?: React.ReactNode;
  headers?: { title: string; description: string };
  removeBtn?: boolean;
  onRemove?: () => void;
}

export function DayForm({
  onSubmit,
  defaultValues = { title: "", description: "" },
  children,
  headers = {
    title: "Add a new Day",
    description: "You're about to add a new in-detail day to your post.",
  },
  removeBtn = false,
  onRemove,
}: DayFormProps) {
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
              <Plus className="h-4 w-4" /> Day
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{headers.title}</DialogTitle>
          <DialogDescription>{headers.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <FormInput control={form.control} name="title" label="Title" />
            <FormInput
              control={form.control}
              name="description"
              label="Description"
            />
            <FormInput
              control={form.control}
              name="date"
              label="Date"
              type="date"
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
                    onRemove?.();
                  }}
                >
                  Remove
                </Button>
              )}
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
