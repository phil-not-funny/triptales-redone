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

  const addDay = ({ title, description, date }: DayValues) => {
    setDays((prev) => [
      ...prev,
      { title, description, date: date.toLocaleDateString(), uuid: uuidv4() },
    ]);
    toast.success("Day added successfully!");
  };

  const editDay = (index: number, { title, description, date }: DayValues) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[index] = {
        title,
        description,
        date: date.toLocaleDateString(),
        uuid: newDays[index].uuid,
      };
      return newDays;
    });
  };

  const removeDay = (index: number) => {
    setDays((prev) => prev.filter((_, i) => i !== index));
    toast.success("Day removed successfully!");
  };

  const getDaysForApi = () => days.map(({ uuid, ...rest }) => rest);

  return { days, addDay, editDay, removeDay, getDaysForApi };
}
