import { ScheduleNestedImage } from "./nested/schedule-nested-image.interface";

export interface Schedule {
  _id: string;
  image: ScheduleNestedImage;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
}
