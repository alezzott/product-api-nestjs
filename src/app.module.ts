import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './products/product.service';
import { ProductsController } from './products/products.controller';
import { Product, ProductSchema } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ProductList'),

    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ProductsModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductService],
})
export class AppModule {}
