export class CreateImageDto {
  constructor(
    public category: string,
    public title: string,
    public backgroundColor?: string
  ) {}
}
