import React, {useContext, useState, useEffect } from 'react';
import { ExtensionContext2 } from '@looker/extension-sdk-react';
import * as htmlElements from '@looker/components';
import { CalendarDay } from '@looker/icons';
import { InputDate } from '@looker/components-date';
import i18n from 'i18next';
import { format } from 'date-fns';

export const IncidenciasEmbed = ({ embedType }) => {
	const [meses, setMeses] = useState();
	const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
	const [selectedDateFormated, setselectedDateFormated] = useState();
	const [cadenasOrigen, setCadenasOrigen] = useState();
	const [cadenasDestino, setCadenasDestino] = useState();
	const [tiendasOrigen, setTiendasOrigen] = useState();
	const [tiendasDestino, setTiendasDestino] = useState();
	const [progress, setProgress] = useState();
	const [cadenaOrigenVal, setCadenaOrigenVal] = useState();
	const [cadenaDestinoVal, setCadenaDestinoVal] = useState();
	const [tiendaOrigenVal, setTiendaOrigenVal] = useState();
	const [tiendaDestinoVal, setTiendaDestinoVal] = useState();

	const { coreSDK } = useContext(ExtensionContext2);

	// What's i18n?
	const callLang = () => i18n.on("load");

	useEffect(() => {
		setProgress(false);
		callLang();
		panelLoad();
	}, []);

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
					console.log(JSON.stringify(result));
					setCadenasOrigen(result.map((data) => ( {
						id: data.Cadena,
						value: data.Cadena,
						label: data.Cadena_DESC
					})));
					setCadenasDestino(result.map((data) => ( {
						id: data.Cadena,
						value: data.Cadena,
						label: data.Cadena_DESC
					})));
				});
		} catch (error) {
			alert({ message: 'Error al recuperar la información de las cadenas', type: 'error' });
		}
	}

	const state = {
		selectedOption: null,
	};

	const handleCadenaOrigen = async (selectedOption) => {
		setCadenaOrigenVal(selectedOption);
		console.log(selectedOption);
		try {
			const queryResponse = await coreSDK.ok(coreSDK.create_sql_query( {
				connection_name: 'piagui_connection',
				sql: "SELECT * "
				+ " FROM `piagui-analitica.Desarrollo_Vistas_Piagui.Cat_Tiendas_Ventas` "
				+ " WHERE cadena = '" + selectedOption + "'"
			}));
			const cadenas = await coreSDK.ok(coreSDK.run_sql_query(queryResponse.slug, 'json'))
				.then((result) => {
					setTiendasOrigen(result.map((data) => ( {
						id: data.Cadena,
						value: data.Tienda,
						label: data.Tienda
					})));
				});
		} catch (error) {
			alert({ message: 'Error al recuperar la información de las tiendas', type: 'error' });
		}
	};

	const handleCadenaDestino = async (selectedOption) => {
		setCadenaDestinoVal(selectedOption);
		try {
			const queryResponse = await coreSDK.ok(coreSDK.create_sql_query( {
				connection_name: 'piagui_connection',
				sql: "SELECT * "
					+ " FROM `piagui-analitica.Desarrollo_Vistas_Piagui.Cat_Tiendas_Ventas` "
					+ " WHERE cadena = '" + selectedOption + "'"
			}));
			const cadenas = await coreSDK.ok(coreSDK.run_sql_query(queryResponse.slug, 'json'))
				.then((result) => {
					setTiendasDestino(result.map((data) => ( {
						id: data.Cadena,
						value: data.Tienda,
						label: data.Tienda
					})));
				});
		} catch (error) {
			alert({ message: 'Error al recuperar la información de las tiendas', type: 'error' });
		}
	};

	const handleTiendaOrigen = (selectedOption) => {
		setTiendaOrigenVal(selectedOption);
	};

	const handleTiendaDestino = (selectedOption) => {
		setTiendaDestinoVal(selectedOption);
	};

	const handleDate = (date) => {
		setSelectedDate(date);
		setselectedDateFormated(format(date, 'dd-MM-yyyy'));
	};
  
	const runModel = async (event) => {
		event.preventDefault();
		setProgress(true);
		try {
    		const queryResponse = await coreSDK.ok(coreSDK.create_sql_query( {
				connection_name: 'piagui_connection',
				sql: "INSERT `piagui-analitica.Demo_Modelos_Tableros.Formato_Tiendas_Prueba` "
					+ " (cadena_origen, tienda_origen, cadena_destino, tienda_destino, mes_inicio) "
					+ "VALUES('" 
					+ cadenaOrigenVal + "','" 
					+ tiendaOrigenVal + "','" 
					+ cadenaDestinoVal + "','" 
					+ tiendaDestinoVal + "','" 
					+ format(selectedDate, 'yyyy-MM-dd') + "')"
        	}));
        	const cadenas = await coreSDK.ok(coreSDK.run_sql_query(queryResponse.slug, 'json_detail'))
				.then( (result) => {
            		setProgress(false);
				});
		} catch (err) {
			alert({ message: 'Error al actualizar la información del formato', type: 'error' });
		}
	};

	const { selectedOption } = state;
	
	return (
		<htmlElements.Page height="100%">
			<htmlElements.Form width="90%" mx="5%">
				<htmlElements.Grid columns={1}>
					<htmlElements.Box2 mt='u4'>
						<htmlElements.Heading as="h1" fontWeight="semiBold" textAlign="center">Cambio de Formatos en Tiendas</htmlElements.Heading>
					</htmlElements.Box2>
				</htmlElements.Grid>
				<htmlElements.Divider size="5px" mb="u6" borderRadius="100px" />
				<htmlElements.Flex width="100%" justifyContent="space-between">
					<htmlElements.Flex bg="ui2" alignContent="center"  width="48%">
						<htmlElements.Fieldset m="u3" legend="Origen">
							<htmlElements.Flex width="100%">
								<htmlElements.FlexItem width="20%"/>
								<htmlElements.FlexItem width="20%">
									<htmlElements.Text >Cadena</htmlElements.Text>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="40%">
									<htmlElements.Select placeholder="Seleccione una cadena" onChange={handleCadenaOrigen} options={cadenasOrigen}/>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="20%"/>
							</htmlElements.Flex>
							<htmlElements.Flex width="100%">
								<htmlElements.FlexItem width="20%"/>
								<htmlElements.FlexItem width="20%">
									<htmlElements.Text >Tienda</htmlElements.Text>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="40%">
									<htmlElements.FieldSelect placeholder="Seleccione una tienda" onChange={handleTiendaOrigen} options={tiendasOrigen}/>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="20%"/>
							</htmlElements.Flex>
							<htmlElements.Flex width="100%" alignItems="center" justifyContent="space-between">
									<htmlElements.FlexItem width="20%"/>
									<htmlElements.FlexItem width="20%">
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
					<htmlElements.Flex  bg="ui2" alignContent="center"  width="48%">
						<htmlElements.Fieldset m="u3" legend="Destino">
							<htmlElements.Flex width="100%">
								<htmlElements.FlexItem width="20%"/>
								<htmlElements.FlexItem width="20%">
									<htmlElements.Text >Cadena</htmlElements.Text>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="40%">
									<htmlElements.FieldSelect width="100%" placeholder="Seleccione una cadena" onChange={handleCadenaDestino} options={cadenasDestino}/>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="20%"/>
							</htmlElements.Flex>
							<htmlElements.Flex width="100%">
								<htmlElements.FlexItem width="20%"/>
								<htmlElements.FlexItem width="20%">
									<htmlElements.Text >Tienda</htmlElements.Text>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="40%">
									<htmlElements.FieldSelect placeholder="Seleccione una tienda" onChange={handleTiendaDestino} options={tiendasDestino}/>
								</htmlElements.FlexItem>
								<htmlElements.FlexItem width="20%"/>
							</htmlElements.Flex>
						</htmlElements.Fieldset>
					</htmlElements.Flex>
				</htmlElements.Flex>
				<htmlElements.Flex width="100%" justifyContent="space-between" alignItems="baseline">
					<htmlElements.FlexItem width="75%"></htmlElements.FlexItem>
					<htmlElements.FlexItem width="25%" textAlign="right" mr="1%">
						<htmlElements.Button onClick={runModel}>Ejecutar Modelo</htmlElements.Button>
					</htmlElements.FlexItem>
				</htmlElements.Flex>
			</htmlElements.Form>
		</htmlElements.Page>
	);
}