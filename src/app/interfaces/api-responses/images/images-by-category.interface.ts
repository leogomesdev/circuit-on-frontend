import { ImagesByCategoryNestedImage } from "./nested/images-by-category-nested-image.interface";

export interface ImagesByCategory {
  category: string;
  images: ImagesByCategoryNestedImage[];
}
