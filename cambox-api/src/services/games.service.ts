import { GameDetails } from '@cambox/common/types/models/GameDetails';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/data/entities/Game.entity';
import { User } from 'src/data/entities/User.entity';
import { GameCollaborator } from 'src/data/entities/GameCollaborator';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        @InjectRepository(GameCollaborator) private gameCollaboratorRepository: Repository<GameCollaborator>
    ) {}

    async upsertGame( { id, name, description }: GameDetails, creator: User ) {
        const row = await this.gameRepository.findOne({ where: { directoryName: id } });

        if( !row ) {
            const result = await this.gameRepository.insert({
                directoryName: id,
                isPublic: false,
                createdAt: new Date,
                lastUpdatedAt: new Date
            });

            await this.gameCollaboratorRepository.insert({
                userId: creator.id,
                role: 'Owner',
                gameId: result.identifiers[0].id
            });
        } else {
            await this.gameRepository.update({ directoryName: id }, {
                lastUpdatedAt: new Date
            });
        }
    }

    async isAllowedToUpload({ id }: GameDetails, user: User ) {
        const row = await this.gameRepository.findOne({ where: { directoryName: id } });

        if( !row ) return true;
        const collaborators = await this.gameCollaboratorRepository.find({ where: { gameId: row.id } });

        return collaborators.some( x => x.userId === user.id );
    }

    async getUserDevelopedGames( userId: string ) {
        const collaborations = await this.gameCollaboratorRepository.find({ where: { userId } });
        let gameList: GameDetails[] = [];

        for( const collaboration of collaborations ) {
            const game = await this.gameRepository.findOne({ where: { id: collaboration.gameId } });
            const manifest: GameDetails = JSON.parse( fs.readFileSync( path.join( __dirname, '../', 'games', game.directoryName, 'manifest.json' ) ).toString() );
            gameList.push( manifest );
        }

        return gameList;
    }
}
