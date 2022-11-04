import { Document } from 'mongoose';

export interface IProducts extends Document {
  name: string;
  description: string;
  price: number;
  stock: string;
  isStock?: boolean;
  createdAt: Date;
}
