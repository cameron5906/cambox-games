import { UiCanvasInstructionType } from '@cambox/common/dist/types/enums/UiCanvasInstructionType';
import { CanvasInstruction } from '@cambox/common/dist/types/interfaces/ui';
import React, { createContext, useEffect, useRef, useState } from 'react';
import './Drawpad.scss';

type Props = {
    width: number;
    height: number;
    backgroundColor: string;
    instructions: CanvasInstruction[];
    allowDrawing: boolean;
    onChange: ( b64: string ) => void;
}

const Drawpad = ( { width, height, backgroundColor, instructions, allowDrawing, onChange }: Props ) => {
    const canvas1Ref = useRef<HTMLCanvasElement>( null );
    const [ ctx, setCtx ] = useState( null as CanvasRenderingContext2D | null );
    const [ isDrawing, setIsDrawing ] = useState( false );
    const [ lastOnChange, setLastOnChange ] = useState( 0 );

    useEffect( () => {
        if( !canvas1Ref.current ) return;

        const context = canvas1Ref.current.getContext( '2d' );
        setCtx( context );

        context.fillStyle = backgroundColor;
        context.fillRect( 0, 0, width, height );
        
        context.lineWidth = 1;
        context.strokeStyle = 'black';
    }, [ canvas1Ref.current ] );

    useEffect( () => {
        if( !ctx ) return;

        //ctx.fillStyle = backgroundColor;
        //ctx.fillRect( 0, 0, width, height );
        for( const instruction of instructions ) {
            switch( instruction.type ) {
                case UiCanvasInstructionType.BeginPath:
                    ctx.beginPath();
                    break;
                case UiCanvasInstructionType.Clear:
                    const currentFillStyle = ctx.fillStyle;
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect( 0, 0, width, height );
                    ctx.fillStyle = currentFillStyle;
                    break;
                case UiCanvasInstructionType.DrawImage:
                    const image = new Image();
                    image.src = instruction.content;
                    image.onload = () => {
                        ctx.drawImage( image, instruction.x || 0, instruction.y || 0 );
                    }
                    break;
                case UiCanvasInstructionType.DrawRect:
                    ctx.fillRect( instruction.x, instruction.y, instruction.width, instruction.height );
                    break;
                case UiCanvasInstructionType.DrawText:
                    ctx.strokeText( instruction.content, instruction.x, instruction.y );
                    break;
                case UiCanvasInstructionType.EndPath:
                    ctx.closePath();
                    break;
                case UiCanvasInstructionType.Fill:
                    ctx.fill();
                    break;
                case UiCanvasInstructionType.FillStyle:
                    ctx.fillStyle = instruction.content;
                    break;
                case UiCanvasInstructionType.LineTo:
                    ctx.lineTo( instruction.x, instruction.y );
                    break;
                case UiCanvasInstructionType.MoveTo:
                    ctx.moveTo( instruction.x, instruction.y );
                    break;
                case UiCanvasInstructionType.Rotate:
                    ctx.rotate( instruction.amount );
                    break;
                case UiCanvasInstructionType.Scale:
                    ctx.scale( instruction.x, instruction. y );
                    break;
                case UiCanvasInstructionType.Stroke:
                    ctx.stroke();
                    break;
                case UiCanvasInstructionType.StrokeSize:
                    ctx.lineWidth = instruction.amount;
                    break;
                case UiCanvasInstructionType.StrokeStyle:
                    ctx.strokeStyle = instruction.content;
                    break;
                case UiCanvasInstructionType.Translate:
                    ctx.translate( instruction.x, instruction.y );
                    break;
            }
        }
    }, [ ctx, instructions ] );

    const startDrawing = ( x: number, y: number ) => {
        if( !allowDrawing ) return;
        const [ cX, cY ] = convertCoordinate( x, y );
        ctx.beginPath();
        ctx.moveTo( cX, cY );
        setIsDrawing( true );
    }
    const endDrawing = () => {
        ctx.stroke();
        setIsDrawing( false );
    }

    const drawPoint = ( x: number, y: number ) => {
        if( !isDrawing ) return;
        const [ cX, cY ] = convertCoordinate( x, y );
        ctx.lineTo( cX, cY );
        ctx.stroke();

        if( ( Date.now() - lastOnChange ) > 100 ) {
            onChange( canvas1Ref.current.toDataURL( 'image/png' ) );
            setLastOnChange( Date.now() );
        }
    }

    const convertCoordinate = ( x: number, y: number ) => {
        return [
            x - canvas1Ref.current.offsetLeft,
            y - canvas1Ref.current.offsetTop
        ];
    }

    return (
        <canvas 
            ref={canvas1Ref}
            style={{ width: `${width}px`, height: `${height}px` }}
            width={width}
            height={height}
            onTouchStart={evt => startDrawing( evt.touches[0].pageX, evt.touches[0].pageY )}
            onMouseDown={evt => startDrawing( evt.pageX, evt.pageY )}
            onTouchEnd={endDrawing}
            onMouseUp={endDrawing}
            onTouchMove={evt => drawPoint( evt.touches[0].clientX, evt.touches[0].clientY )}
            onMouseMove={evt => drawPoint( evt.clientX, evt.clientY )}
        ></canvas>
    )
}

export default Drawpad;