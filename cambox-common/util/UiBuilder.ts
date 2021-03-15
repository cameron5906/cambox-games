import { UiButton, UiContainer, UiImage, UiInput, UiList, UiText, UiListItem } from "@cambox/common/types/interfaces/ui";
import { UiElement } from "@cambox/common/types/types/UiElement";
import { UiStyleProperty } from "@cambox/common/types/enums";
import { UiType } from '@cambox/common/types/types/UiType';

class UiBuilder {
    private lastElement: UiElement | null = null;
    private elements: UiElement[] = [];

    constructor() {
        
    }

    public static create(): UiBuilder {
        return new UiBuilder();
    }

    public text( text: string ): UiBuilder {
        const textElement: UiText = { type: 'text', text };
        this.addElement( textElement );
        return this;
    }

    public button( id: string, text: string ): UiBuilder {
        const buttonElement: UiButton = { type: 'button', id, text };
        this.addElement( buttonElement );
        return this;
    }

    public list( id: string ): UiBuilder {
        const listElement: UiList = { type: 'list', id, items: [] };
        this.addElement( listElement );
        return this;
    }

    public item( text: string, id?: string ): UiBuilder {
        const listItemElement: UiListItem = { type: 'list_item', id, text };
        this.addElement( listItemElement );
        return this;
    }

    public input( id: string, accept: 'text' | 'number', placeholder?: string ): UiBuilder {
        const inputElement: UiInput = { type: 'input', id, accept, placeholder };
        this.addElement( inputElement );
        return this;
    }

    public image( id: string, url: string ): UiBuilder {
        const imageElement: UiImage = { id, type: 'image', url };
        this.addElement( imageElement );
        return this;
    }

    public container(): UiBuilder {
        const containerElement: UiContainer = { type: 'container', children: [] };
        this.addElement( containerElement );
        return this;
    }
    
    public withStyle( type: UiStyleProperty, value: string ): UiBuilder {
        if( !this.lastElement ) throw 'No elements have been added to apply styles to';
        
        this.lastElement.styles = [ ...( this.lastElement?.styles || [] ), { type, value } ];
        
        return this;
    }

    //#region Margin
    public margin( amount: string ): UiBuilder {
        return this.withStyle( UiStyleProperty.Margin, amount );
    }

    public marginTop( amount: string ): UiBuilder {
        return this.withStyle( UiStyleProperty.MarginTop, amount );
    }

    public marginBottom( amount: string ): UiBuilder {
        return this.withStyle( UiStyleProperty.MarginBottom, amount );
    }

    public marginLeft( amount: string ): UiBuilder {
        return this.withStyle( UiStyleProperty.MarginLeft, amount );
    }

    public marginRight( amount: string ): UiBuilder {
        return this.withStyle( UiStyleProperty.MarginRight, amount );
    }
    //#endregion

    public padding( amount: string ): UiBuilder {
        return this.withStyle( UiStyleProperty.Padding, amount );
    }

    //#region Flexbox
    public horizontal(): UiBuilder {
        this.withStyle( UiStyleProperty.Display, 'flex' );
        return this.withStyle( UiStyleProperty.FlexDirection, 'row' );
    }

    public vertical(): UiBuilder {
        this.withStyle( UiStyleProperty.Display, 'flex' );
        return this.withStyle( UiStyleProperty.FlexDirection, 'column' );
    }

    public spaceEvenly(): UiBuilder {
        this.withStyle( UiStyleProperty.Display, 'flex' );
        return this.withStyle( UiStyleProperty.JustifyContent, 'space-evenly' );
    }

    public spaceBetween(): UiBuilder {
        this.withStyle( UiStyleProperty.Display, 'flex' );
        return this.withStyle( UiStyleProperty.JustifyContent, 'space-between' );
    }
    //#endregion
    
    public withWidth( amount: number ): UiBuilder {
        return this.withStyle( UiStyleProperty.Width, `${amount}px` );
    }

    public withHeight( amount: number ): UiBuilder {
        return this.withStyle( UiStyleProperty.Height, `${amount}px` );
    }

    public withSize( amount: number ): UiBuilder {
        return this.withStyle( UiStyleProperty.FontSize, `${amount}px` );
    }

    public withBorderColor( color: string ): UiBuilder {
        return this.withStyle( UiStyleProperty.BorderColor, color );
    }

    public withBorderWidth( width: number ): UiBuilder {
        return this.withStyle( UiStyleProperty.BorderWidth, `${width}px` );
    }

    public withAlignment( alignment: 'left' | 'right' | 'center' ): UiBuilder {
        return this.withStyle( UiStyleProperty.TextAlign, alignment );
    }

    public withColor( color: string ): UiBuilder {
        return this.withStyle( UiStyleProperty.Color, color );
    }

    public withRadius( radius: number ): UiBuilder {
        return this.withStyle( UiStyleProperty.BorderRadius, `${radius}px` );
    }

    public asCircular(): UiBuilder {
        return this.withStyle( UiStyleProperty.BorderRadius, '50%' );
    }

    public animated( length?: number ): UiBuilder {
        return this.withStyle( UiStyleProperty.Transition, `${length}s ease all` );
    }

    public scale( amount: number ): UiBuilder {
        return this.withStyle( UiStyleProperty.Transform, `scale(${amount})` );
    }

    public rotate( amount: number ): UiBuilder {
        return this.withStyle( UiStyleProperty.Transform, `rotate(${amount}deg)` );
    }

    public bold(): UiBuilder {
        return this.addClass( 'bold ');
    }

    public underline(): UiBuilder {
        return this.addClass( 'underline' );
    }

    public italic(): UiBuilder {
        return this.addClass( 'italic' );
    }

    public withChildren( getChildren: ( children: UiBuilder ) => UiBuilder ): UiBuilder {
        if( !this.lastElement ) throw 'No elements have been added';
        if( this.lastElement.type !== 'container' ) throw 'Element may not contain children';

        this.lastElement.children = [ ...this.lastElement.children, ...getChildren( UiBuilder.create() ).build() ];

        return this;
    }

    public withItems( items: UiListItem[] ) {
        if( this.lastElement?.type !== 'list' ) throw 'Last element was not a List';
        ( this.lastElement as UiList ).items = items;
        return this;
    }

    public if( check: () => boolean, apply: ( ui: UiBuilder ) => UiBuilder, otherwise?: ( ui: UiBuilder ) => UiBuilder ) {
        if( check() ) {
            return apply( this );
        } else if( otherwise ) {
            return otherwise( this );
        }

        return this;
    }

    public build(): UiElement[] {
        return this.elements;
    }

    public get<T>( type: UiType ): T {
        return ( this.elements.find( e => e.type === type ) as any ) as T;
    }

    private addElement( element: UiElement ) {
        if( !element.styles ) {
            element.styles = [];
        }

        this.elements.push( element );
        this.lastElement = element;
    }

    private addClass( name: string ): UiBuilder {
        if( !this.lastElement ) throw 'No element to add class to';

        this.lastElement.classes = [ ...( this.lastElement?.classes || [] ), name ];
        return this;
    }
}

export default UiBuilder;