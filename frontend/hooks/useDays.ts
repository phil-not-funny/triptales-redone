import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { CreatePostRequestDay } from "@/types/RequestTypes";

type NCreatePostRequestDay = CreatePostRequestDay & {
  uuid: string;
};

type DayValues = {
  title: string;
  description: string;
  date: Date;
};

export function useDays() {
  const [days, setDays] = useState<NCreatePostRequestDay[]>([]);

  const sortDaysByDate = (
    daysArray: NCreatePostRequestDay[],
  ): NCreatePostRequestDay[] => {
    return [...daysArray].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const addDay = ({ title, description, date }: DayValues) => {
    setDays((prev) => {
      const newDay = {
        title,
        description,
        date: date.toISOString().split("T")[0],
        uuid: uuidv4(),
      };
      const updatedDays = [...prev, newDay];
      return sortDaysByDate(updatedDays);
    });
    toast.success("Day added successfully!");
  };

  const editDay = (index: number, { title, description, date }: DayValues) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[index] = {
        title,
        description,
        date: date.toISOString().split("T")[0],
        uuid: newDays[index].uuid,
      };
      return sortDaysByDate(newDays);
    });
  };

  const removeDay = (index: number) => {
    setDays((prev) => prev.filter((_, i) => i !== index));
    toast.success("Day removed successfully!");
  };

  const getDaysForApi = () => days.map(({ uuid, ...rest }) => rest);

  return { days, addDay, editDay, removeDay, getDaysForApi };
}
