import React, { useCallback, useContext, useState, useEffect } from 'react';
import { EmbedContainer } from '../EmbedContainer';
import { ExtensionContext2 } from '@looker/extension-sdk-react';
import PropTypes from 'prop-types';
import * as htmlElements from '@looker/components';
import { LookerEmbedSDK } from '@looker/embed-sdk';
import { useCurrentRoute, useListenEmbedEvents, useNavigate } from '../../hooks';

export const InventarioEmbed = ({ embedType }) => {
	

	return (
    	<htmlElements.Page height="100%">
    		<htmlElements.Form bg="ui1" p="u8">
				<htmlElements.Grid columns={1}>
					<htmlElements.Heading as="h1" fontWeight="semiBold" textAlign="center">Inventario</htmlElements.Heading>
				</htmlElements.Grid>
				<htmlElements.Divider size="5px" mt="u5" borderRadius="100px" />
				<htmlElements.Fieldset m="u3">
					<htmlElements.Flex width="100%" bg="ui2" justifyContent="space-between">

					</htmlElements.Flex>
					<htmlElements.Flex alignItems="center" width="100%">
						<htmlElements.FlexItem width="75%"/>
						<htmlElements.FlexItem width="25%" textAlign="right" mr="1%">
							<htmlElements.Button>Ejecutar Modelo</htmlElements.Button>
						</htmlElements.FlexItem>
					</htmlElements.Flex>
				</htmlElements.Fieldset>
			</htmlElements.Form>
		</htmlElements.Page>
	);
}

InventarioEmbed.propTypes = {
	embedType: PropTypes.string.isRequired
}
