import { UiStyleProperty } from '@cambox/common/dist/types/enums/UiStyleProperty';
import { UiListItem, UiButton, UiInput, UiList, UiText, UiImage, UiContainer, UiCanvas } from '@cambox/common/dist/types/interfaces/ui';
import { UiStyle } from '@cambox/common/dist/types/interfaces/ui/UiStyle';
import { CommandType } from '@cambox/common/dist/types/enums/CommandType';
import { Command } from '@cambox/common/dist/types/models/Command';
import { UiElement } from '@cambox/common/dist/types/types/UiElement';
import React, { ChangeEvent, useState } from 'react';
import Drawpad from '../drawpad/Drawpad';


type Props = {
    element: UiElement;
    onCommand: ( cmd: Command<any> ) => void;
}

const Element = ( { element, onCommand }: Props ) => {
    const [ value, setValue ] = useState( '' );

    const onChange = ( evt: ChangeEvent<HTMLInputElement> ) => {
        onCommand({ type: CommandType.UiInputChange, data: { previous: value, current: evt.target.value } });
        setValue( evt.target.value );
    }

    const onKeyUp = ( { key }: KeyboardEvent ) => {
        if( key === 'Enter' ) {
            onCommand({ type: CommandType.UiInputSubmit, data: { id: (element as any).id, value } });
            setValue( '' );
        }
    }

    const onSelectListItem = ( { text, id }: UiListItem ) => {
        onCommand({ type: CommandType.UiClick, data: { id } } );
    }

    //Build the style object
    const style = (element.styles || []).reduce( ( styleObj: any, rule: UiStyle ) => {
        switch( rule.type ) {
            case UiStyleProperty.BackgroundColor:
                return { ...styleObj, backgroundColor: rule.value };
            case UiStyleProperty.BackgroundImage:
                return { ...styleObj, backgroundImage: `url('${rule.value}')` };
            case UiStyleProperty.BorderColor:
                return { ...styleObj, borderColor: rule.value, borderStyle: 'solid' };
            case UiStyleProperty.BorderWidth:
                return { ...styleObj, borderWidth: rule.value, borderStyle: 'solid' };
            case UiStyleProperty.FontSize:
                return { ...styleObj, fontSize: rule.value };
            case UiStyleProperty.Margin:
                return { ...styleObj, margin: rule.value };
            case UiStyleProperty.Padding:
                return { ...styleObj, padding: rule.value };
            case UiStyleProperty.Width:
                return { ...styleObj, width: rule.value };
            case UiStyleProperty.Height:
                return { ...styleObj, height: rule.value };
            case UiStyleProperty.Color:
                return { ...styleObj, color: rule.value };
            case UiStyleProperty.BorderRadius:
                return { ...styleObj, borderRadius: rule.value };
            case UiStyleProperty.TextAlign:
                return { ...styleObj, textAlign: rule.value };
            case UiStyleProperty.Display:
                return { ...styleObj, display: rule.value };
            case UiStyleProperty.FlexDirection:
                return { ...styleObj, flexDirection: rule.value };
            case UiStyleProperty.JustifyContent:
                return { ...styleObj, justifyContent: rule.value };
            case UiStyleProperty.AlignContent:
                return { ...styleObj, alignContent: rule.value };
            case UiStyleProperty.AlignItems:
                return { ...styleObj, alignItems: rule.value };
            case UiStyleProperty.Transition:
                return { ...styleObj, transition: rule.value };
            case UiStyleProperty.MarginTop:
                return { ...styleObj, marginTop: rule.value };
            case UiStyleProperty.MarginBottom:
                return { ...styleObj, marginBottom: rule.value };
            case UiStyleProperty.MarginLeft:
                return { ...styleObj, marginLeft: rule.value };
            case UiStyleProperty.MarginRight:
                return { ...styleObj, marginRight: rule.value };
            default:
                return styleObj;
        }
    }, {} );

    let props: any = {
        style,
        className: element.classes ? element.classes.join(' ') : undefined
    }

    if( (element as any)['id'] )
        props.onClick = () => onCommand({ type: CommandType.UiClick, data: { id: (element as any)['id'] } })

    //Render whichever element type this is
    switch( element.type ) {
        case 'button':
            return <button {...props}>{(element as UiButton).text}</button>;
        case 'input':
            return <input 
                {...props}
                type={(element as UiInput).accept} 
                placeholder={(element as UiInput).placeholder || ''} 
                value={value}
                onChange={onChange}
                onKeyUp={onKeyUp}
            />
        case 'list':
            return (
                <ul {...props}>
                    {(element as UiList).items.map( item =>
                        <Element element={item} onCommand={onCommand} />
                    )}
                </ul>
            );
        case 'list_item':
            return <li {...props}>{(element as UiListItem).text}</li>;
        case 'text':
            return <p {...props}>{(element as UiText).text}</p>;
        case 'image':
            return <img {...props} src={(element as UiImage).url} />;
        case 'container':
            return (
                <div {...props}>
                    {(element as UiContainer).children.map( child => 
                        <Element element={child} onCommand={onCommand} />
                    )}
                </div>
            );
        case 'canvas':
            return <Drawpad 
                width={(element as UiCanvas).width} 
                height={(element as UiCanvas).height}
                instructions={(element as UiCanvas).instructions} 
                backgroundColor="#FFF" 
                allowDrawing={(element as UiCanvas).allowDraw}
                onChange={b64 => onCommand({ type: CommandType.UiCanvasDrawing, data: { b64 } })}
            />;
    }
};

export default Element;