import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(
    createBlogDto: CreateBlogDto,
  ): Promise<{ message: string; data: Blog }> {
    try {
      const createdBlog = new this.blogModel(createBlogDto);
      const savedBlog = await createdBlog.save();
      return {
        message: 'Blog created successfully',
        data: savedBlog,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create blog: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<{ message: string; data: Blog[] }> {
    try {
      const blogs = await this.blogModel.find().exec();
      return {
        message: 'Blogs retrieved successfully',
        data: blogs,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve blogs: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Blog }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid blog ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const blog = await this.blogModel.findById(id).exec();
      if (!blog) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Blog not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Blog retrieved successfully',
        data: blog,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve blog: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<{ message: string; data: Blog }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid blog ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedBlog = await this.blogModel
        .findByIdAndUpdate(id, updateBlogDto, { new: true })
        .exec();
      if (!updatedBlog) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Blog not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Blog updated successfully',
        data: updatedBlog,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update blog: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string; data: null }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid blog ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deletedBlog = await this.blogModel.findByIdAndDelete(id).exec();
      if (!deletedBlog) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Blog not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Blog deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete blog: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
