import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as htmlElements from '@looker/components';
import i18n from 'i18next';
import { InputDate } from '@looker/components-date';
import { ExtensionContext2 } from '@looker/extension-sdk-react';

// Este es el módulo de ventas en Looker.
export const VentasEmbed = ({ embedType }) => {
	const [porcentaje, setPorcentaje] = useState();
	const [cadenas, setCadenas] = useState();
	const [tiendas, setTiendas] = useState();
	const [marcas, setMarcas] = useState();
	const [meses, setMeses] = useState();
	const [selectedDate, setSelectedDate] = useState(new Date());

	const [seleccionCadena, setSeleccionCadena] = useState();

	const { coreSDK } = useContext(ExtensionContext2);

	const state = {
		selectedOption: null,
	};

	const { selectedOption } = state;

	// What's i18n?
	const callLang = () => i18n.on("load");

	const panelLoad = async () => {
		const listaMeses = [{ id: '01', value: '01', label: 'ENE' },
		{ id: '02', value: '02', label: 'FEB' },
		{ id: '03', value: '03', label: 'MAR' },
		{ id: '04', value: '04', label: 'ABR' },
		{ id: '05', value: '05', label: 'MAY' },
		{ id: '06', value: '06', label: 'JUN' },
		{ id: '07', value: '07', label: 'JUL' },
		{ id: '08', value: '08', label: 'AGO' },
		{ id: '09', value: '09', label: 'SEP' },
		{ id: '10', value: '10', label: 'OCT' },
		{ id: '11', value: '11', label: 'NOV' },
		{ id: '12', value: '12', label: 'DIC' }]
		setMeses(listaMeses.map((data) => ( {
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

	const loadTestData = async () => {
		const testMarcas = [{
			id: '001',
			value: '001',
			label: 'Test Marca 01'
		},
		{
			id: '002',
			value: '002',
			label: 'Test Marca 02'
		},
		{
			id: '003',
			value: '003',
			label: 'Test Marca 03'
		}]
		setMarcas(testMarcas.map((data) => ( {
			id: data.id,
			value: data.value,
			label: data.label
		})));

	};
	
	const handleCadenas = async (selectedOption) => {
		try {
			setSeleccionCadena(selectedOption);
			// Obtener información de las tiendas disponibles
			const queryResponse = await coreSDK.ok(coreSDK.create_sql_query( {
				connection_name: 'piagui_connection',
				sql: "SELECT * "
				+ " FROM `piagui-analitica.Desarrollo_Vistas_Piagui.Cat_Tiendas_Ventas` "
				+ " WHERE Cadena = '" + selectedOption + "'"
			}));
			const resultTiendas = await coreSDK.ok(coreSDK.run_sql_query(queryResponse.slug, 'json'))
				.then((result) => {
					setTiendas(result.map((data) => ( {
						id: data.Cadena,
						value: data.Tienda,
						label: data.Tienda
					})));
			});
			// Si regresa información aquí deberíamos procesar algo relacionado a lo que se muestra en pantalla.
		} catch (error) {
			alert({ message: 'Error al recuperar la información de las tiendas', type: 'error' });
		}
	};

	const handlePorcentaje = (selectedPorcentaje) => {
		setPorcentaje(selectedPorcentaje);
	}

	const handleDate = (date) => {
		setSelectedDate(date);
	}

  
	useEffect(() => {
		panelLoad();
		callLang();
		loadTestData();
	}, []);
  

	return (
		<htmlElements.Page height="100%">
			<htmlElements.Form bg="ui1" p="u8">
				<htmlElements.Grid columns={1}>
					<htmlElements.Heading as="h1" fontWeight="semiBold" textAlign="center">Ventas</htmlElements.Heading>
				</htmlElements.Grid>
				<htmlElements.Divider size="5px" mt="u5" borderRadius="100px" />
				<htmlElements.Fieldset m="u3" legend="Variacion de Precios">
					<htmlElements.Flex width="100%" bg="ui2" justifyContent="space-between">
						<htmlElements.Flex alignContent="center"  width="45%">
							<htmlElements.Fieldset m="u3">
								<htmlElements.Flex alignItems="center" width="100%">
									<htmlElements.FlexItem width="20%"/>
									<htmlElements.FlexItem width="25%">
										<htmlElements.Text >Porcentaje</htmlElements.Text>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="17%">
										<htmlElements.InputText type="number" min="0" max="100" defaultValue="100"/>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="3%" textAlign="right">
										<htmlElements.Span>%</htmlElements.Span>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="35%"/>
								</htmlElements.Flex>
								<htmlElements.Flex alignItems="center" width="100%">
									<htmlElements.FlexItem width="20%"/>
									<htmlElements.FlexItem width="25%">
										<htmlElements.Text >Cadena</htmlElements.Text>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="40%">
										<htmlElements.Select placeholder="Seleccione una cadena" onChange={handleCadenas}  options={cadenas}/>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="15%"/>
								</htmlElements.Flex>
								<htmlElements.Flex alignItems="center" width="100%">
									<htmlElements.FlexItem width="20%"/>
									<htmlElements.FlexItem width="25%">
										<htmlElements.Text >Marca</htmlElements.Text>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="40%">
										<htmlElements.Select placeholder="Seleccione una marca" options={marcas}/>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="15%"/>
								</htmlElements.Flex>
								<htmlElements.Flex alignItems="center" width="100%">
									<htmlElements.FlexItem width="20%"/>
									<htmlElements.FlexItem width="25%">
										<htmlElements.Text >Tienda</htmlElements.Text>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="40%">
										<htmlElements.Select placeholder="Seleccione una tienda" options={tiendas}/>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="15%"/>
								</htmlElements.Flex>
							</htmlElements.Fieldset>
						</htmlElements.Flex>
						<htmlElements.Flex alignContent="center"  width="45%">
							<htmlElements.Fieldset m="u3">
								<htmlElements.Flex width="100%">
									<htmlElements.FlexItem alignItems="center" width="100%" m="u3">
										<p></p>
									</htmlElements.FlexItem>
								</htmlElements.Flex>
								<htmlElements.Flex alignItems="center" width="100%">
									<htmlElements.FlexItem width="15%"/>
									<htmlElements.FlexItem width="25%">
										<htmlElements.Text >Sector</htmlElements.Text>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="40%">
										<htmlElements.Select placeholder="Seleccione un sector"/>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="20%"/>
								</htmlElements.Flex>
								<htmlElements.Flex alignItems="center" width="100%">
									<htmlElements.FlexItem width="15%"/>
									<htmlElements.FlexItem width="25%">
										<htmlElements.Text >Categoria</htmlElements.Text>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="40%">
										<htmlElements.Select placeholder="Seleccione una categoria"/>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="20%"/>
								</htmlElements.Flex>
								<htmlElements.Flex width="100%" alignItems="center" justifyContent="space-between">
									<htmlElements.FlexItem width="15%"/>
									<htmlElements.FlexItem width="25%">
										<htmlElements.Text >Mes, Año</htmlElements.Text>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="20%">
										<htmlElements.Select placeholder="MES" options={meses}/>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="5%" textAlign="center">
										<htmlElements.Span> , </htmlElements.Span>
									</htmlElements.FlexItem>
									<htmlElements.FlexItem width="15%">
										<htmlElements.InputText type="number" min="1990" max="2030" defaultValue="2022"/>
									</htmlElements.FlexItem>	
									<htmlElements.FlexItem width="20%"/>								
								</htmlElements.Flex>
							</htmlElements.Fieldset>
						</htmlElements.Flex>
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
  	)
}

VentasEmbed.propTypes = {
	embedType: PropTypes.string.isRequired,
}
