import { Control, FieldValues, Path } from "react-hook-form";
import MDEditor, { commands } from "@uiw/react-md-editor";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DatePicker } from "../ui/datepicker";
import { Input } from "../ui/input";
import { HTMLInputTypeAttribute } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: "text" | "date" | "markdown" | "textarea";
  placeholder?: string;
  textType?: HTMLInputTypeAttribute | undefined;
  required?: boolean;
  className?: string;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  textType,
  className,
}: FormInputProps<T>) {
  const tCommon = useTranslations("Common");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="!gap-1">
            {label}
            {required && <span className="font-semibold text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            {type === "date" ? (
              <DatePicker {...field}>{tCommon("pickDate")}</DatePicker>
            ) : type === "markdown" ? (
              <MDEditor
                commands={commands
                  .getCommands()
                  .filter((i) => i.name !== "image" && i.name !== "comment")}
                className={cn("leading-relaxed text-gray-700", className)}
                data-color-mode="light"
                {...field}
              />
            ) : type === "text" ? (
              <Input
                type={textType}
                {...field}
                placeholder={placeholder}
                className={className}
              />
            ) : type === "textarea" ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                className={className}
              />
            ) : null}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
