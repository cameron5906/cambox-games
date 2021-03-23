import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'GameCollaborator' })
export class GameCollaborator {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'game_id' })
    gameId: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @Column({ type: 'text' })
    role: string;
}