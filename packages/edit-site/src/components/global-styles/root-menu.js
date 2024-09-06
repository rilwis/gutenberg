/**
 * WordPress dependencies
 */
import { __experimentalItemGroup as ItemGroup } from '@wordpress/components';
import {
	typography,
	color,
	layout,
	shadow as shadowIcon,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { privateApis as blockEditorPrivateApis } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { NavigationButtonAsItem } from './navigation-button';
import { unlock } from '../../lock-unlock';

const {
	useHasDimensionsPanel,
	useHasTypographyPanel,
	useHasColorPanel,
	useGlobalSetting,
	useSettingsForBlockElement,
} = unlock( blockEditorPrivateApis );

function RootMenu() {
	const [ rawSettings ] = useGlobalSetting( '' );
	const settings = useSettingsForBlockElement( rawSettings );
	const hasTypographyPanel = useHasTypographyPanel( settings );
	const hasColorPanel = useHasColorPanel( settings );
	const hasShadowPanel = true; // useHasShadowPanel( settings );
	const hasDimensionsPanel = useHasDimensionsPanel( settings );
	const hasLayoutPanel = hasDimensionsPanel;

	return (
		<>
			<ItemGroup>
				{ hasTypographyPanel && (
					<NavigationButtonAsItem
						icon={ typography }
						path="/typography"
					>
						{ __( 'Typography' ) }
					</NavigationButtonAsItem>
				) }
				{ hasColorPanel && (
					<NavigationButtonAsItem icon={ color } path="/colors">
						{ __( 'Colors' ) }
					</NavigationButtonAsItem>
				) }
				{ hasShadowPanel && (
					<NavigationButtonAsItem icon={ shadowIcon } path="/shadows">
						{ __( 'Shadows' ) }
					</NavigationButtonAsItem>
				) }
				{ hasLayoutPanel && (
					<NavigationButtonAsItem icon={ layout } path="/layout">
						{ __( 'Layout' ) }
					</NavigationButtonAsItem>
				) }
			</ItemGroup>
		</>
	);
}

export default RootMenu;
