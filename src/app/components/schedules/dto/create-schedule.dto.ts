export class CreateScheduleDto {
  scheduledAt!: string;

  constructor(scheduledAt: Date, public imageId: string) {
    if (scheduledAt) {
      this.scheduledAt = scheduledAt.toISOString();
    }
  }
}
