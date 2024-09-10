/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';
import { useStoreState } from '@ariakit/react';

/**
 * WordPress dependencies
 */
import warning from '@wordpress/warning';
import { forwardRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { TabListProps } from './types';
import { useTabsContext } from './context';
import { TabListWrapper } from './styles';
import type { WordPressComponentProps } from '../context';
import clsx from 'clsx';
import { useTrackElementOffsetRect } from '../utils/element-rect';
import { useOnValueUpdate } from '../utils/hooks/use-on-value-update';

export const TabList = forwardRef<
	HTMLDivElement,
	WordPressComponentProps< TabListProps, 'div', false >
>( function TabList( { children, ...otherProps }, ref ) {
	const context = useTabsContext();

	const selectedId = useStoreState( context?.store, 'selectedId' );
	const selectedElement = context?.store.item( selectedId )?.element;
	const indicatorPosition = useTrackElementOffsetRect( selectedElement );

	const [ animationEnabled, setAnimationEnabled ] = useState( false );
	useOnValueUpdate( selectedId, ( { previousValue } ) => {
		selectedElement?.scrollIntoView( { behavior: 'instant' } );
		if ( previousValue ) {
			setAnimationEnabled( true );
		}
	} );

	const activeId = useStoreState( context?.store, 'activeId' );
	const selectOnMove = useStoreState( context?.store, 'selectOnMove' );

	if ( ! context || ! context.store ) {
		warning( '`Tabs.TabList` must be wrapped in a `Tabs` component.' );
		return null;
	}

	const { store } = context;
	const { setActiveId } = store;

	const onBlur = () => {
		if ( ! selectOnMove ) {
			return;
		}

		// When automatic tab selection is on, make sure that the active tab is up
		// to date with the selected tab when leaving the tablist. This makes sure
		// that the selected tab will receive keyboard focus when tabbing back into
		// the tablist.
		if ( selectedId !== activeId ) {
			setActiveId( selectedId );
		}
	};

	return (
		<Ariakit.TabList
			ref={ ref }
			store={ store }
			render={
				<TabListWrapper
					onTransitionEnd={ ( event ) => {
						if ( event.pseudoElement === '::after' ) {
							setAnimationEnabled( false );
						}
					} }
				/>
			}
			onBlur={ onBlur }
			tabIndex={ -1 }
			{ ...otherProps }
			style={ {
				'--indicator-left': `${ indicatorPosition.left }px`,
				'--indicator-top': `${ indicatorPosition.top }px`,
				'--indicator-width': `${ indicatorPosition.width }px`,
				'--indicator-height': `${ indicatorPosition.height }px`,
				...otherProps.style,
			} }
			className={ clsx(
				animationEnabled ? 'is-animation-enabled' : '',
				otherProps.className
			) }
		>
			{ children }
		</Ariakit.TabList>
	);
} );
