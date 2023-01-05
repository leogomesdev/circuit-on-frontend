interface NestedImage {
  _id: string;
  title: string;
  updatedAt: string;
}

export interface ImagesByCategory {
  category: string;
  images: NestedImage[];
}
