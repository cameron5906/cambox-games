import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../types/interfaces/state/RootState';
import { Page } from '../../types/enums/Page';
import SubMenu from './SubMenu';
import { changePage } from '../../redux/actions/app.actions';
import './Header.scss';

type Props = RootState & {
    changePage: ( page: Page ) => void;
};

const Header = ( { profile, room, changePage }: Props ) => {
    const [ showMenu, setShowMenu ] = useState( false );

    useEffect( () => {
        const clickHandler = (evt: MouseEvent) => {
            if( !(evt as any).path.filter( x => x.className ).some( x => x.className.indexOf( 'user-info--container' ) !== -1 ) ) {
                setShowMenu( false );
            }
        }

        document.addEventListener( 'click', clickHandler, false );

        return () => document.removeEventListener( 'click', clickHandler, false );
    }, [] );

    return (
        <div className="header">
            {!room.roomCode && <h2 onClick={() => changePage( Page.Main )}>Cambox Games</h2>}
            {room.roomCode && <div className="room-code--container">
                <p className="room-code">Room code: {room.roomCode}</p>
            </div>}
            {profile.authToken && <div className="user-info--container" onClick={() => setShowMenu( !showMenu )}>
                <img className="avatar" src={profile.imageUrl} />
                <span className="name">{profile.name}</span>
                {showMenu && <SubMenu onNavigate={page => changePage( page )} />}
            </div>}
        </div>
    )
}

export default connect(
    ( state: RootState) => state,
    ( dispatch: Dispatch ) => ({
        changePage: ( page: Page ) => dispatch( changePage( page ) )
    })
)( Header );