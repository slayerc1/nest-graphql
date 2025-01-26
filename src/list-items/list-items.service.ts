import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListItem } from './entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';

import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';

@Injectable()
export class ListItemsService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}
  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...data } = createListItemInput;

    const newListItem = this.listItemRepository.create({
      ...data,
      item: { id: itemId },
      list: { id: listId },
    });

    await this.listItemRepository.save(newListItem);
    return this.findOne(newListItem.id);
  }

  findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs) {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({ id });

    if (!listItem)
      throw new NotFoundException(`The list item with id: ${id} not found`);

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { listId, itemId, ...data } = updateListItemInput;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set(data)
      .where('id = :id', { id });

    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return this.findOne(id);
  }

  async listItemsCountByList(list: List): Promise<number> {
    return await this.listItemRepository.count({
      where: { list: { id: list.id } },
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }
}
