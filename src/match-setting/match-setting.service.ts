import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pool } from 'src/Entity/pool.entity';
import { Type } from 'src/Entity/type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchSettingService {
    constructor(
        @InjectRepository(Pool)
        private readonly poolRepository: Repository<Pool>,

        @InjectRepository(Type)
        private readonly typeRepository: Repository<Type>,
    ) { }

    // ================= TYPE =================

    async createType(data: any) {
        try {
            if (!data.compitition || !data.name) {
                throw new BadRequestException('Competition and name are required');
            }

            const type = this.typeRepository.create({
                compitition: data.compitition,
                name: data.name,
            });

            return await this.typeRepository.save(type);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updateType(id: number, data: any) {
        try {
            const type = await this.typeRepository.findOneBy({ id });

            if (!type) {
                throw new NotFoundException('Type not found');
            }

            await this.typeRepository.update({ id }, data);
            return this.typeRepository.findOneBy({ id });
        } catch (error) {
            throw error;
        }
    }

    // ================= POOL =================

    async createPool(data: any) {
        try {
            if (!data.type_id || !data.team_id) {
                throw new BadRequestException('type_id and team_id are required');
            }

            const typeExists = await this.typeRepository.findOneBy({
                id: data.type_id,
            });

            if (!typeExists) {
                throw new NotFoundException('Type does not exist');
            }

            const teamIds = Array.isArray(data.team_id)
                ? data.team_id
                : [data.team_id];

            const pools = teamIds.map((teamId: number) =>
                this.poolRepository.create({
                    type_id: data.type_id,
                    pool_name: data.pool_name,
                    team_id: teamId,
                }),
            );

            return await this.poolRepository.save(pools);
        } catch (error) {
            throw error;
        }
    }

    async updatePool(data: any) {
        try {
            if (!Array.isArray(data.items)) {
                throw new BadRequestException('items must be an array');
            }

            for (const item of data.items) {
                if (item.id) {
                    const pool = await this.poolRepository.findOneBy({ id: item.id });

                    if (!pool) {
                        throw new NotFoundException(`Pool ID ${item.id} not found`);
                    }

                    await this.poolRepository.update(
                        { id: item.id },
                        {
                            team_id: Number(item.team_id),
                            pool_name: item.pool_name,
                            type_id: item.type_id,
                        },
                    );

                } else {
                    if (!item.type_id || !item.team_id) {
                        throw new BadRequestException(
                            'type_id and team_id required for new pool',
                        );
                    }

                    const newPool = this.poolRepository.create({
                        type_id: item.type_id,
                        team_id: item.team_id,
                        pool_name: item.pool_name, // 🔥 REQUIRED
                    });


                    await this.poolRepository.save(newPool);
                }
            }

            return {
                message: 'Pool updated successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    async getAllPools() {
        try {
            const pools = await this.poolRepository
                .createQueryBuilder('pool')
                .leftJoin('teams', 'team', 'team.id = pool.team_id')
                .leftJoin('type', 'type', 'type.id = pool.type_id')
                .select([
                    'pool.id AS pool_id',
                    'pool.pool_name AS pool_name',
                    'pool.team_id AS team_id',
                    'team.name AS team_name',
                    'team.shortName AS team_short_name',
                    'pool.type_id AS type_id',
                    'type.name AS type_name',
                    'type.compitition AS type_compitition',
                ])
                .where('pool.isActive = :isActive', { isActive: true })
                .orderBy('pool.pool_name', 'ASC')
                .getRawMany();

            if (!pools.length) {
                throw new NotFoundException('No active pools found');
            }

            return pools; // Flat list of all pools
        } catch (error) {
            throw error;
        }
    }

    // ================= DETAILS =================

    async getDetails() {
        try {
            const pools = await this.poolRepository
                .createQueryBuilder('pool')
                .leftJoin('teams', 'team', 'team.id = pool.team_id')
                .select([
                    'pool.id AS pool_id',
                    'pool.pool_name AS pool_name',
                    'pool.team_id AS team_id',
                    'team.name AS team_name',
                    'team.shortName As shortName'
                ])
                .where('pool.isActive = :isActive', { isActive: true })
                .orderBy('pool.pool_name', 'ASC')
                .getRawMany();

            if (!pools.length) {
                throw new NotFoundException('No active pools found');
            }

            const groupedPools = pools.reduce((acc: any, row: any) => {
                const key = row.pool_name;

                if (!acc[key]) acc[key] = [];

                acc[key].push({
                    pool_id: row.pool_id,
                    team_id: row.team_id,
                    team_name: row.team_name,
                    team_short_name: row.shortName,
                });

                return acc;
            }, {});

            return groupedPools;
        } catch (error) {
            throw error;
        }
    }
}
