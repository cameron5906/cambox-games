import React from 'react';
import './PlayerTile.scss';

type Props = {
    name: string;
    avatarUrl: string;
}

export default ( { name, avatarUrl }: Props ) => {
    return (
        <div className="player-tile--container">
            <img className="avatar" src={avatarUrl} />
            <p className="name">{name}</p>
        </div>
    );
}