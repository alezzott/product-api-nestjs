import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Res() response,
    @Body() CreateProductDto: CreateProductDto,
  ) {
    try {
      const newProduct = await this.productService.productCreate(
        CreateProductDto,
      );

      return response.status(HttpStatus.CREATED).json({
        message: 'Product created successfully',
        newProduct,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Product not created',
        error: 'Bad Request',
      });
    }
  }

  @Get()
  async getProducts(@Res() response) {
    try {
      const productData = await this.productService.getAllProducts();
      console.log(productData);
      return response.status(HttpStatus.OK).json({
        message: 'success',
        productData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getProductId(@Res() response, @Param('id') productId: string) {
    try {
      const getProductId = await this.productService.getProductId(productId);
      console.log(getProductId);

      return response.status(HttpStatus.OK).json({
        message: `This product ${productId} has successfully`,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: `Product ${productId} has not found`,
      });
    }
  }

  @Get('product-name/:name/')
  async getProductName(
    @Res() response,
    @Param('name')
    name: string,
    productId: string,
  ) {
    try {
      const productName = await this.productService.getProductName(
        name,
        productId,
      );
      console.log(productName);

      return response.status(HttpStatus.OK).json({
        message: `This product has successfully`,
        productName,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: `Product has not found`,
      });
    }
  }

  @Put('/:id')
  async updateProduct(
    @Res() response,
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const updateProduct = await this.productService.updateProduct(
        productId,
        updateProductDto,
      );

      return response.status(HttpStatus.OK).json({
        message: 'product updated successfully',
        updateProduct,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: `Product ${productId} has not found`,
      });
    }
  }

  @Delete('/:id')
  async deleteProduct(@Res() response, @Param('id') productId: string) {
    try {
      await this.productService.deleteProduct(productId);

      return response.status(HttpStatus.OK).json({
        message: 'product deleted successfully',
      });
    } catch (err) {
      return response.status(err.status).json({
        message: `Product ${productId} has not found`,
      });
    }
  }
}
