import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../types/interfaces/state/RootState';
import Element from './Element';
import './GameUI.scss';

type Props = RootState & {
    onCommand: ( cmd: any ) => void;
}

const GameUI = ( { ui, onCommand }: Props ) => {
    return (
        <div className="game-ui">
            {ui.elements.map( element =>
                <Element 
                    element={element} 
                    onCommand={onCommand} 
                />
            )}
        </div>
    )
}

export default connect(
    ( state: RootState ) => state
)( GameUI );