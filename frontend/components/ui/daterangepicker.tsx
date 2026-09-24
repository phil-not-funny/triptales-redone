"use client";

import * as React from "react";
import { differenceInCalendarDays, format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateRangePickerProps = React.PropsWithChildren & {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  /** Formats the length of the selected range, e.g. "5 days". */
  formatDuration?: (days: number) => string;
};

/**
 * Picks a start and end date in one calendar: the first click sets the start,
 * the second the end. The popover closes as soon as the range is complete.
 */
export function DateRangePicker({
  children,
  value,
  onChange,
  formatDuration,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<Date | undefined>();

  // The first click yields a one-day range; the end is still to be chosen.
  const isPickingEnd =
    !!value?.from && !!value.to && isSameDay(value.from, value.to);
  const previewStart =
    isPickingEnd && hovered && hovered < value.from! ? hovered : value?.from;
  const previewEnd =
    isPickingEnd && hovered && hovered > value.from! ? hovered : value?.from;
  const showPreview =
    isPickingEnd && !!hovered && !isSameDay(hovered, value.from!);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    setHovered(undefined);
  };

  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range);
    setHovered(undefined);
    if (range?.from && range.to && !isSameDay(range.from, range.to))
      setOpen(false);
  };

  const days =
    value?.from && value.to
      ? differenceInCalendarDays(value.to, value.from) + 1
      : null;

  return (
    <Popover modal open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal sm:w-[380px]",
            !value?.from && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {value?.from ? (
            <span>
              {format(value.from, "PPP")}
              {value.to && ` – ${format(value.to, "PPP")}`}
              {days !== null && formatDuration && (
                <span className="text-muted-foreground ml-2">
                  ({formatDuration(days)})
                </span>
              )}
            </span>
          ) : (
            <span>{children}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          defaultMonth={value?.from}
          numberOfMonths={2}
          onDayMouseEnter={setHovered}
          onDayMouseLeave={() => setHovered(undefined)}
          // While the end is being chosen, the span up to the hovered day is
          // previewed as one green band, so the first click is visibly a range.
          modifiers={
            showPreview
              ? {
                  preview: { from: previewStart!, to: previewEnd! },
                  previewStart: previewStart!,
                  previewEnd: previewEnd!,
                }
              : undefined
          }
          modifiersClassNames={{
            preview: "bg-green-100",
            previewStart: "rounded-l-full",
            previewEnd: "rounded-r-full",
          }}
          // Outside days are only hidden, not removed, so every month keeps
          // its weekday alignment and a day is not shown twice.
          classNames={{
            outside: "invisible",
            ...(showPreview && {
              range_start: "bg-green-100",
              range_end: "bg-green-100",
            }),
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
