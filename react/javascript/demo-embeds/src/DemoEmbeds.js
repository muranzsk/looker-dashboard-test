import React, { useEffect } from 'react';
import {
  ComponentsProvider,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  useTabs,
} from '@looker/components';
import styled from 'styled-components';
import { useCurrentRoute, useNavigate, useTargetResource } from './hooks';
import { VentasEmbed } from './components/VentasEmbed';
import { IncidenciasEmbed } from './components/IncidenciasEmbed';
import { ExploresEmbed } from './components/ExploresEmbed';
import { InventarioEmbed } from './components/InventarioEmbed';
import { KeyDatesEmbed } from './components/KeyDatesEmbed';
import { PlaygroundEmbed } from './components/PlaygroundEmbed';
import { AperturasEmbed } from './components/AperturasEmbed';

// const tabNames = ['ventas', 'incidencias', 'inventario', 'explores', 'keydates', 'playground'];
const tabNames = ['ventas', 'incidencias', 'inventario', 'aperturas', 'keydates', 'playground'];
/**
 *  Este es el menú de pestañas para looker
 */
export const DemoEmbeds = () => {
	const { embedType } = useCurrentRoute();
	const { updateEmbedType } = useNavigate(embedType);
	const hasTargetResource = useTargetResource();
	const tabs = useTabs({
		onChange: (index) => {
			if (tabNames[index] !== embedType) {
				updateEmbedType(tabNames[index]);
			}
		},
	});
	const { onSelectTab, selectedIndex } = tabs;

	useEffect(() => {
		if (embedType) {
			const routeTabIndex = tabNames.indexOf(embedType);
			if (routeTabIndex > -1 && embedType !== tabNames[selectedIndex]) {
				onSelectTab(routeTabIndex);
			}
		}
	}, [embedType]);

	if (hasTargetResource) {
		return <></>
	}

	return (
		<ComponentsProvider>
			<View>
				<TabList {...tabs}>
					<Tab>Ventas</Tab>
					<Tab>Incidencias</Tab>
					<Tab>Inventario</Tab>
					<Tab>Aperturas</Tab>
					<Tab>Keydates</Tab>
					<Tab>Testing</Tab>
				</TabList>
				<TabPanels {...tabs} pt="0">
					<TabPanel>
						<VentasEmbed embedType={tabNames[0]} />
					</TabPanel>
					<TabPanel>
						<IncidenciasEmbed embedType={tabNames[1]} />
					</TabPanel>
					<TabPanel>
						<InventarioEmbed embedType={tabNames[2]} />
					</TabPanel>
					<TabPanel>
						<AperturasEmbed embedType={tabNames[3]} />
					</TabPanel>
					<TabPanel>
						<KeyDatesEmbed embedType={tabNames[4]} />
					</TabPanel>
					<TabPanel>
						<PlaygroundEmbed embedType={tabNames[5]} />
					</TabPanel>
				</TabPanels>
			</View>
		</ComponentsProvider>
	);
}

const View = styled.div`
	width: 100%;
	height: calc(100vh - 50px);
`
