import React from 'react';
import { connect } from 'react-redux';
import { Page } from '../../types/enums/Page';
import { ProfileState } from '../../types/interfaces/state/ProfileState';
import { RootState } from '../../types/interfaces/state/RootState';

type Props = ProfileState & {
    onNavigate: ( page: Page ) => void;
}

const SubMenu = ( { onNavigate }: Props ) => {
    return (
        <ul className="sub-menu">
            <li onClick={() => onNavigate( Page.MyProfile )}>My Profile</li>
            <li onClick={() => onNavigate( Page.DeveloperTools )}>Developer Tools</li>
        </ul>
    )
}

export default connect(
    ( state: RootState ) => state.profile
)( SubMenu );