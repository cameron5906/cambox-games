import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/data/entities/User.entity';
import { SocialNetwork } from '@cambox/common/dist/types/types';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async userExists( platform: SocialNetwork, userId: string ) {
        const result = await this.userRepository.find({ where: { platform, userId }});
        return result.length !== 0;
    }

    async createUser( platform: SocialNetwork, email: string, userId: string, name: string, avatarUrl: string ) {
        const result = await this.userRepository.insert({
            platform,
            email,
            userId,
            name,
            avatarUrl
        });

        return result.identifiers[0];
    }

    async getUserByDevKey( developerKey: string ) {
        return await this.userRepository.findOne({ where: { developerKey } });
    }

    async getUser( platform: SocialNetwork, userId: string ) {
        return await this.userRepository.findOne({ where: { platform, userId }});
    }

    async getUserById( id: string ) {
        return await this.userRepository.findOne({ id });
    }
}
