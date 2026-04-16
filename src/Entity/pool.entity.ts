import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Check,
} from 'typeorm';

@Entity('pools')

export class Pool {
    save(pool: Pool): Pool | PromiseLike<Pool> {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    type_id: number;

    @Column({ type: 'text' })
    pool_name: string;

    @Column({ type: 'int' })
    team_id: number;

    // soft enable/disable this row
    @Column({ type: 'tinyint', default: 1 })
    isActive: boolean;


    @CreateDateColumn()
    createdAt: Date;
}
