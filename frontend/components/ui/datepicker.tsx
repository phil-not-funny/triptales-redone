"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = React.PropsWithChildren & {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  initialDate?: Date;
};

export function DatePicker({
  children,
  initialDate,
  value,
  onChange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value || initialDate || undefined,
  );

  // Sync local state with form value
  React.useEffect(() => {
    setDate(value || undefined);
  }, [value]);

  // Handle date selection and propagate to form
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{children}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}