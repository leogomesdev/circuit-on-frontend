export class CreateScheduleDto {
  scheduledAt: string;

  constructor(scheduledAt: Date, public imageId: string) {
    this.scheduledAt = scheduledAt.toISOString();
  }
}
