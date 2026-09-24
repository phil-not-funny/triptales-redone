"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayButton, DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "w-fit",
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-3",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_caption: "flex h-7 items-center justify-center",
        caption_label: "text-sm font-medium",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-muted-foreground w-8 rounded-md text-[0.8rem] font-normal",
        week: "mt-2 flex w-full",
        day: "relative p-0 text-center text-sm",
        range_start: "rounded-l-full bg-green-100",
        range_middle: "bg-green-100",
        range_end: "rounded-r-full bg-green-100",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeft className="size-4" {...props} />
          }
          return <ChevronRight className="size-4" {...props} />
        },
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

/**
 * Day cell button. The selection look is derived from the day's modifiers, so
 * a range reads as one continuous band with filled start and end days.
 */
function CalendarDayButton({
  className,
  // `day` must not reach the DOM element, but is not needed otherwise
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  // `previewStart`/`previewEnd` are set by the range picker while the end of a
  // range is being chosen and mark the span up to the hovered day.
  const isRangeEdge =
    modifiers.range_start ||
    modifiers.range_end ||
    modifiers.previewStart ||
    modifiers.previewEnd
  const isInRange = isRangeEdge || modifiers.range_middle || modifiers.preview

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "size-8 p-0 font-normal",
        modifiers.range_middle || modifiers.preview
          ? "rounded-none bg-transparent text-green-900 hover:bg-green-200"
          : undefined,
        (isRangeEdge || (modifiers.selected && !isInRange)) &&
          "rounded-full bg-green-600 text-white hover:bg-green-600 hover:text-white",
        modifiers.today && !modifiers.selected && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Calendar }
