import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Game' })
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', name: 'directory_name' })
    directoryName: string;

    @Column({ type: 'boolean', name: 'is_public' })
    isPublic: boolean;

    @Column({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'timestamp with time zone', name: 'last_updated_at' })
    lastUpdatedAt: Date;
}