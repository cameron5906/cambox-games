import React from 'react';
import { GameDetails } from '@cambox/common/types/models/GameDetails';
import './GameTile.scss';

type Props = GameDetails & {
    onSelect: ( gameId: string ) => void;
}

export default ( { name, iconUrl, description, id, onSelect }: Props ) => {
    return (
        <div className="game-tile--container" onClick={() => onSelect( id )}>
            <img className="image" src={`http://localhost:3001/games/${id}/icon`} />
            <p className="name">{name}</p>
        </div>
    );
}