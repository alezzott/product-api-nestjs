import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { IProducts } from './products.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: Model<IProducts>,
  ) {}

  async productCreate(CreateProductDto: CreateProductDto): Promise<IProducts> {
    const newProduct = new this.ProductModel({
      productName: CreateProductDto.productName,
      description: CreateProductDto.description,
      price: CreateProductDto.price,
      stock: CreateProductDto.stock,
    });

    console.log(newProduct);

    return newProduct.save();
  }

  async getProductName(name: string, productId: string): Promise<IProducts> {
    const productName = await this.ProductModel.findOne(
      {
        name: name,
      },
      productId,
    ).exec();

    if (!productName) {
      throw new NotFoundException(`This product not found`);
    }

    return productName;
  }

  async getAllProducts(productName: string): Promise<IProducts[]> {
    const productData = await this.ProductModel.aggregate([
      {
        $match: { productData: productName },
      },
      { $group: { _id: '$CreateProductDto', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { productName: 0 } },
    ]);

    if (!productData || productData.length === 0) {
      throw new NotFoundException('product data not found');
    }
    return productData;
  }

  async getProductId(productId: string): Promise<IProducts> {
    const getProductData = await this.ProductModel.findById(productId);

    if (!getProductData) {
      throw new NotFoundException(`This product #${productId} not found`);
    }
    return getProductData;
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<IProducts> {
    const updateProduct = await this.ProductModel.findByIdAndUpdate(
      productId,
      updateProductDto,
      { new: true },
    );

    if (!updateProduct) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return updateProduct;
  }

  async deleteProduct(productId: string): Promise<IProducts> {
    const removeProduct = await this.ProductModel.findByIdAndDelete(productId);

    if (!removeProduct) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return removeProduct;
  }
}
