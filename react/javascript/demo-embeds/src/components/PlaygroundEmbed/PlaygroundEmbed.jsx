import React, { useCallback, useContext, useState, useEffect } from 'react';
import { EmbedContainer } from '../EmbedContainer';
import { ExtensionContext2 } from '@looker/extension-sdk-react';
import PropTypes from 'prop-types';
import * as htmlElements from '@looker/components';
import { LookerEmbedSDK } from '@looker/embed-sdk';
import { useCurrentRoute, useListenEmbedEvents, useNavigate } from '../../hooks';

export const PlaygroundEmbed = ({ embedType }) => {
	const { embedId } = useCurrentRoute(embedType);
	const { updateEmbedId } = useNavigate(embedType);
	const { extensionSDK } = useContext(ExtensionContext2);
	const [lookId, setLookId] = useState();
	const [message, setMessage] = useState();
	const [running, setRunning] = useState();
	const [dashboardId, setDashboardId] = useState();
	const [dashboard, setDashboard] = useState();
	const { embedEvents, listenEmbedEvents, clearEvents } = useListenEmbedEvents();

	const maybeCancel = () => {
		return { cancel: cancelEventsRef.current }
	};
	
	const updateRunButton = (running) => {
		setRunning(running)
	};

	const runDashboard = () => {
		// console.log("setupDashboard " + dashboard);
		if (dashboard) {
			setDashboardId("21");
			dashboard.run();
		}
	};

	const setupDashboard = (dashboard) => {
		setDashboard(dashboard);
	};

	const embedCtrRef = useCallback((el) => {
		setMessage(undefined);
		if (el) {
			// console.log("embedCtrRef");
			const hostUrl = extensionSDK.lookerHostData?.hostUrl;
			if (hostUrl) {
				let initialId;
				updateEmbedId('21');
        	// console.log(embedId);
    			if (embedId && embedId !== '') {
					setDashboardId(embedId);
					initialId = embedId;
				} else {
					initialId = 'preload';
				}
				// console.log(initialId);
				// console.log(hostUrl);
				LookerEmbedSDK.init(hostUrl);
    			const embed = LookerEmbedSDK.createDashboardWithId('21')
					.withNext()
					.appendTo(el)
					.on('dashboard:run:start', updateRunButton.bind(null, true))
					.on('dashboard:run:complete', updateRunButton.bind(null, false))
					.on('drillmenu:click', maybeCancel)
					.on('drillmodal:explore', maybeCancel)
					.on('dashboard:tile:explore', maybeCancel)
					.on('dashboard:tile:view', maybeCancel);
				
				listenEmbedEvents(embed);
				if (initialId === 'preload') {
					embed.on('page:changed', updateRunButton.bind(null, false));
				}
				embed
					.build()
					.connect()
					.then(setupDashboard)
					.catch((error) => {
						console.error('Connection error', error);
						setMessage('Error setting up embed environment');
					});
			}
		}
	}, []);

	useEffect(() => {
		if (lookId !== embedId) {
			if (lookId) {
				updateEmbedId(lookId + '');
				setMessage(undefined);
			} else {
				if (embedId && embedId !== '') {
					setLookId(embedId);
				}
			}
		}
	}, [lookId, embedId]);

	return (
    	<htmlElements.Page height="100%">
    		<htmlElements.Form>
    			{ /* <htmlElements.Divider size="8px" customColor="white" mt="u5" borderRadius="100px" />
    			<htmlElements.Box2 ml="u16">
    				<htmlElements.Fieldset inline legend="Simulador de Inventario">
        				<htmlElements.FieldText label="Canal de distribución" />
        				<htmlElements.FieldText label="Zona de Ventas" />
        				<htmlElements.FieldText label="Label 3" />
    				</htmlElements.Fieldset>
        			<htmlElements.Fieldset inline >
          				<htmlElements.FieldText label="Label 4" />
          				<htmlElements.FieldText label="Label 5" />
          				<htmlElements.FieldText label="Label 6" />
        			</htmlElements.Fieldset>
        			<br/>
        			<div>
						<htmlElements.Button> Enviar </htmlElements.Button>
					</div>
				</htmlElements.Box2> */ }
        		<EmbedContainer ref={embedCtrRef} />
			</htmlElements.Form>
			<htmlElements.Grid columns={1}>
				<htmlElements.Box2 mt='u4'>
					<htmlElements.Heading as="h1" fontWeight="semiBold" textAlign="center">Explorar Tableros</htmlElements.Heading>
				</htmlElements.Box2>
			</htmlElements.Grid>
			<htmlElements.Divider size="5px" mb="u6" borderRadius="100px" />
			
		</htmlElements.Page>
	);
}

PlaygroundEmbed.propTypes = {
	embedType: PropTypes.string.isRequired
}
