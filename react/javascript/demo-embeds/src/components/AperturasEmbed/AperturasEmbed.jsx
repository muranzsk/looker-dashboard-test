import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as htmlElements from '@looker/components';
import i18n from 'i18next';
import { ExtensionContext2 } from '@looker/extension-sdk-react';

export const AperturasEmbed = ({ embedType }) => {

	const [niveles, setNiveles] = useState();
	const [selectedNivel, setSelectedNivel] = useState();
	const [cadenas, setCadenas] = useState();
	const [selectedCadena, setSelectedCadena] = useState();
	const [tiendas, setTiendas] = useState();
	const [selectedTienda, setSelectedTiendas] = useState();

	const { coreSDK } = useContext(ExtensionContext2);

	const state = {
		selectedOption: null,
	};

	const { selectedOption } = state;

	// What's i18n?
	const callLang = () => i18n.on("load");

	const panelLoad = async () => {
		const listaNiveles = [{ id: '01', value: '01', label: 'Tienda' },
		{ id: '02', value: '02', label: 'Marca' }];
		setNiveles(listaNiveles.map((data) => ({
			id: data.id,
			value: data.value,
			label: data.label
		})));
		try {
			const queryResponse = await coreSDK.ok(coreSDK.create_sql_query( {
				connection_name: 'piagui_connection',
				sql: 'SELECT * '
					+ 'FROM `piagui-analitica.Desarrollo_Vistas_Piagui.Cat_Cadenas_Ventas`'
        	}));
			const cadenas = await coreSDK.ok(coreSDK.run_sql_query(queryResponse.slug, 'json'))
				.then((result) => {
					setCadenas( result.map((data) => ( {
						id: data.Cadena,
						value: data.Cadena,
						label: data.Cadena_DESC
					}
				)))
			});

		} catch (error) {
			alert({ message: 'Error al recuperar la información de las cadenas', type: 'error' });
		}
	};

	useEffect(() => {
		panelLoad();
		callLang();
	}, []);

	return (
		<htmlElements.Page height="100%">
			<htmlElements.Form width="90%" mx="5%">
				<htmlElements.Grid columns={1}>
					<htmlElements.Box2 mt='u4'>
						<htmlElements.Heading as="h1" fontWeight="semiBold" textAlign="center">Aperturas</htmlElements.Heading>
					</htmlElements.Box2>
				</htmlElements.Grid>
				<htmlElements.Divider size="5px" mb="u6" borderRadius="100px" />
				<htmlElements.Fieldset m="u3">
					<htmlElements.Flex width="100%" bg="ui2" justifyContent="space-between">
						<htmlElements.Fieldset m="u3">
							<htmlElements.Flex alignItems="center" width="100%">
								<htmlElements.FlexItem width="10%"/>
								<htmlElements.FlexItem width="10%">
									<htmlElements.Text >Nivel</htmlElements.Text>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="20%">
									<htmlElements.Select placeholder="Seleccione un nivel" options={niveles}/>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="60%"/>
							</htmlElements.Flex>
							<htmlElements.Flex alignItems="center" width="100%">
								<htmlElements.FlexItem width="10%"/>
								<htmlElements.FlexItem width="10%">
									<htmlElements.Text >Cadena</htmlElements.Text>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="20%">
									<htmlElements.Select placeholder="Seleccione una cadena" options={cadenas}/>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="20%"/>
								<htmlElements.FlexItem width="10%">
									<htmlElements.Text >Tienda</htmlElements.Text>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="20%">
									<htmlElements.Select placeholder="Seleccione una tienda"/>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="10%"/>
							</htmlElements.Flex>
						</htmlElements.Fieldset>
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

AperturasEmbed.propTypes = {
	embedType: PropTypes.string.isRequired
}

