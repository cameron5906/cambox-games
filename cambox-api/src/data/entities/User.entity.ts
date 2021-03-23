import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    platform: string;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text', name: 'user_id' })
    userId: string;

    @Column({ type: 'text', name: 'avatar_url' })
    avatarUrl: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'uuid', name: 'dev_key' })
    developerKey: string;
}