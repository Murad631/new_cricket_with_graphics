import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Check,
} from 'typeorm';

export enum EnumTypes {
    TOURNAMENT = 1,
    SERIES = 2,
}

@Entity('type')

export class Type {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        default: EnumTypes.TOURNAMENT,
        comment: '1 = Tournament, 2 = Series',
    })
    compitition: EnumTypes;

    @Column({ type: 'text' })
    name: string;

    @CreateDateColumn()
    createdAt: Date;
}
