import React, {useContext, useState, useEffect } from 'react';
import { ExtensionContext2 } from '@looker/extension-sdk-react';
import { Page, Form, Button, Text, FieldText, Fieldset, Divider, Box2, Space, Select, Grid, Popover, IconButton, ProgressCircular } from '@looker/components';
import { CalendarDay } from '@looker/icons';
import { InputDate } from '@looker/components-date';
import i18n from 'i18next';
import { format } from 'date-fns';

export const IncidenciasEmbed = ({ embedType }) => {
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
		GetCadenas();
	}, []);

	const GetCadenas = async () => {
		// console.log("handleCadenas");
		try {
			const queryResponse = await coreSDK.ok(coreSDK.create_sql_query( {
				connection_name: 'piagui_connection',
				sql: 'SELECT * '
					+ 'FROM `piagui-analitica.Desarrollo_Vistas_Piagui.Cat_Cadenas_Ventas`'
			}));
			const cadenas = await coreSDK.ok(coreSDK.run_sql_query(queryResponse.slug, 'json'))
				.then((result) => {
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
		try {
			const queryResponse = await coreSDK.ok(coreSDK.create_sql_query( {
				connection_name: 'piagui_connection',
				sql: "SELECT * "
				+ " FROM `piagui-analitica.Desarrollo_Vistas_Piagui.Cat_Tiendas_Ventas` "
				+ " WHERE cadena = '" + selectedOption + "'"
			}));
			const cadenas = await coreSDK.ok(coreSDK.run_sql_query(queryResponse.slug, 'json'))
				.then((result) => {
					setTiendasO(result.map((data) => ( {
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
					setTiendasD(result.map((data) => ( {
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
		<Page height="100%">
			<Form>
				<Divider size="8px" customColor="white" mt="u5" borderRadius="100px" />
      <Grid columns={4}>
        <Box2 ml='u16'>
          <Fieldset display="inline-block" legend="Cambio de Formatos en Tiendas">
          </Fieldset>
        </Box2>
        <Box2 ml='u16'>
        </Box2>
        <Box2 ml='u16'>
        </Box2>
        <Box2 ml='u16'>
        </Box2>

        <Box2 ml='u16'>
          <Text>Origen</Text>
        </Box2>
        <Box2 ml='u16'>
        </Box2>
        <Box2 ml='u16'>
          <Text>Destino</Text>
        </Box2>
        <Box2 ml='u16'>
        </Box2>

        <Box2 ml='u16'>
          <label>Cadena</label>
        </Box2>
        <Box2 minWidth="200px">
          <Select
              placeholder="Cadenas"
              onChange={handleCadenaOrigen}
              options={cadenasOrigen}
            />
        </Box2>
        <Box2 ml='u16'>
          <label>Cadena</label>
        </Box2>
        <Box2 minWidth="200px">
          <Select
              placeholder="Cadenas"
              onChange={handleCadenaDestino}
              options={cadenasDestino}
            />
        </Box2>

        <Box2 ml='u16'>
          <label>Tienda</label>
        </Box2>
        <Box2 minWidth="200px">
          <Select
              placeholder="Tiendas"
              onChange={handleTiendaOrigen}
              options={tiendasOrigen}
            />
        </Box2>
        <Box2 ml='u16'>
          <label>Tienda</label>
        </Box2>
        <Box2 minWidth="200px">
          <Select
              placeholder="Tiendas"
              onChange={handleTiendaDestino}
              options={tiendasDestino}
          />
        </Box2>


        <Box2 ml='u16'>
        </Box2>
        <Box2 ml='u16'>
        </Box2>
        <Box2 ml='u16'>
        <label>Mes Inicio</label>
        </Box2>
        <Box2 minWidth="200px">
          <Space gap="u15">
          <Popover
            content={
              <Box2 p="u3">
                <InputDate defaultValue={selectedDate} onChange={handleDate} />
              </Box2>
              }>
            <IconButton icon={<CalendarDay />} label="Calendar" />
          </Popover>
          <FieldText readOnly value={selectedDateFormated}></FieldText>
          </Space>
        </Box2>
        
        <Box2 ml='u8'>
        </Box2>
        <Box2 ml='u16'>
        </Box2>
        <Box2 ml='u16'>
          <Button onClick={runModel}>
                Ejecutar Modelo
          </Button>
        </Box2>
        <Box2 ml='u16'>
        </Box2>
        
      </Grid>
      <Space justifyContent="center">
        <ProgressCircular progress={progress} />
      </Space>
      </Form>
    </Page>
  )
}