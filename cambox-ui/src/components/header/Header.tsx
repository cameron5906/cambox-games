import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../types/interfaces/state/RootState';
import './Header.scss';

type Props = RootState;

const Header = ( { profile, room }: Props ) => {
    return (
        <div className="header">
            {room.roomCode && <div className="room-code--container">
                <p className="room-code">Room code: {room.roomCode}</p>
            </div>}
            {profile.authToken && <div className="user-info--container">
                <img className="avatar" src={profile.imageUrl} />
                <span className="name">{profile.firstName}</span>
            </div>}
        </div>
    )
}

export default connect(
    ( state: RootState) => state
)( Header );