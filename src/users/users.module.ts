import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from 'src/items/items.module';
import { ListsModule } from 'src/lists/lists.module';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

import { User } from './entities/user.entity';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User]), ItemsModule, ListsModule],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
