import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Page, Form, Divider, Grid, Box2, SelectMulti } from '@looker/components';
import { ExtensionContext2 } from '@looker/extension-sdk-react';

// Este es el módulo de ventas en Looker.
export const VentasEmbed = ({ embedType }) => {
	const [cadenas, setCadenas] = useState();
	const { coreSDK } = useContext(ExtensionContext2);
	
	const handleCadenas = async () => {
		// console.log("handleCadenas");
		try {
			// Obtener información de las cadenas disponibles
			const queryResponse = await coreSDK.ok(coreSDK.create_sql_query( {
				connection_name: 'piagui_connection',
				sql: 'SELECT * '
					+ 'FROM `piagui-analitica.Desarrollo_Vistas_Piagui.Cat_Cadenas_Ventas`'
        	}));
			const cadenas = await coreSDK.ok(coreSDK.run_sql_query(queryResponse.slug, 'json'))
				.then((result) => {
					setCadenas( result.map((data) => ( {
						id: data.Cadena,
						value: data.Cadena_DESC,
						label: data.Cadena_DESC
					}
				)))
			});

			// Si regresa información aquí deberíamos procesar algo relacionado a lo que se muestra en pantalla.
		} catch (error) {
			alert({ message: 'Error al recuperar la información de las cadenas', type: 'error' });
		}
	}

	const SendCadenas = async () => {
		try {
			console.log(cadenas);
		} catch (error) {
			alert({ message: 'Error al recuperar la información de las cadenas', type: 'error' });
    	}
	}

  
	useEffect(() => {
		handleCadenas();
	}, []);
  

	return (
		<Page height="100%">
			<Form>
				<Divider size="8px" customColor="white" mt="u5" borderRadius="100px" />
				<Heading as="h1" textAlign="center">
  					Ventas
				</Heading>
				<Divider size="8px" customColor="white" mt="u5" borderRadius="100px" />
				<Grid>
					<Box2 ml='u16'>
						<SelectMulti placeholder="Cadenas" options={cadenas}/>
					</Box2>
				</Grid>
			</Form>
		</Page>
  	)
}

VentasEmbed.propTypes = {
	embedType: PropTypes.string.isRequired,
}
