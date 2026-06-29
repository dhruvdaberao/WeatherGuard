import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Status } from './enums/status.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async count(filter: FilterQuery<UserDocument> = {}): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  async findWithFilters(
    status?: Status,
    search?: string,
    limit: number = 10,
    page: number = 1
  ): Promise<{ data: User[], total: number }> {
    const query: FilterQuery<UserDocument> = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(query).exec()
    ]);
    
    return { data, total };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateStatus(id: string, status: Status): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: { status, updatedAt: new Date() } },
      { new: true }
    ).exec();
    
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async updatePreferences(id: string, updatePreferencesDto: UpdatePreferencesDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updatePreferencesDto },
      { new: true }
    ).exec();
    
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }
}
