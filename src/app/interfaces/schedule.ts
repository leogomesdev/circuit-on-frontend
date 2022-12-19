interface NestedImage {
  _id: string;
  title: string;
  category: string;
  backgroundColor: string;
}

export interface Schedule {
  _id: string;
  image: NestedImage;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
}
