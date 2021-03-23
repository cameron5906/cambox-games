import React from 'react';

type Props = {
    id: string;
    name: string;
    isPublic: boolean;
}

const Game = ( { id, name, isPublic }: Props ) => {
    return (
        <div className="game">
            <img src={`http://localhost:3001/games/${id}/icon`} />
            <p>{name}</p>
            <p>({ isPublic ? 'Public' : 'In Development'})</p>
        </div>
    )
}

export default Game;