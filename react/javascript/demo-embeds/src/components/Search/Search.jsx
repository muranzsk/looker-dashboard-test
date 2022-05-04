import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as htmlElements from '@looker/components';
import { useNavigate } from '../../hooks';

export const Search = ({
	onSelected,
	data = [],
	error,
	loading,
	embedRunning,
	embedType,
}) => {
	
	const [criteria, setCriteria] = useState('');
	const { updateSearchCriteria } = useNavigate(embedType);

	useEffect(() => {
		updateSearchCriteria(criteria);
	}, [criteria]);

	const selectedData =
		criteria.length === 0 ? data : data.filter(({ description }) =>
			description.toLowerCase().includes(criteria.trim().toLowerCase())
		);
	const searchContent = (
		<htmlElements.PopoverLayout>
			<htmlElements.List mt="none" density={-2} height="25%"> {
				selectedData.map(({ description, id }) => (
					<htmlElements.ListItem
						key={id}
						onClick={() => onSelected(id)}
						disabled={embedRunning}
					>
					{ description }
					</htmlElements.ListItem>
				))
			}
			</htmlElements.List>
		</htmlElements.PopoverLayout>);

	return (
		<htmlElements.Page>
			<htmlElements.Form width="90%" mx="5%">
				<htmlElements.Grid columns={1}>
					<htmlElements.Box2 mt='u4'>
						<htmlElements.Heading as="h1" fontWeight="semiBold" textAlign="center"> Busqueda </htmlElements.Heading>
					</htmlElements.Box2>
				</htmlElements.Grid>
				<htmlElements.Space px="small"> {
					error && <MessageBar intent="critical">{ error }</MessageBar>
				}
					<htmlElements.Popover content= { searchContent } placement="bottom-start">
						<htmlElements.FieldText 
							placeholder="Criterio de búsqueda"
							value= { criteria }
							onChange={(e) => setCriteria(e.target.value)}
							disabled={loading} />
					</htmlElements.Popover>
      			</htmlElements.Space>
			</htmlElements.Form>
		</htmlElements.Page>
	);
}

Search.propTypes = {
  data: PropTypes.array,
  embedRunning: PropTypes.bool,
  embedType: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onSelected: PropTypes.func.isRequired,
}
