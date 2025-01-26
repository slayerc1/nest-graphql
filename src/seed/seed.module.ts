import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';

import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';
import { ListsModule } from 'src/lists/lists.module';
import { ListItemsModule } from 'src/list-items/list-items.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule,
    ListsModule,
    ListItemsModule,
  ],
})
export class SeedModule {}
