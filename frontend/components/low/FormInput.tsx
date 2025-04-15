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

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: "text" | "date" | "markdown";
  placeholder?: string;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "date" ? (
              <DatePicker {...field}>Pick a Date</DatePicker>
            ) : type === "markdown" ? (
              <MDEditor
                commands={commands
                  .getCommands()
                  .filter((i) => i.name !== "image" && i.name !== "comment")}
                className="leading-relaxed text-gray-700"
                data-color-mode="light"
                {...field}
              />
            ) : (
              <Input {...field} placeholder={placeholder} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
