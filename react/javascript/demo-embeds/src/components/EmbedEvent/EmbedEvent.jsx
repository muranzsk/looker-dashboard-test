import React from 'react'
import PropTypes from 'prop-types'
import { Tree, TreeItem } from '@looker/components'

export const EmbedEvent = ({ embedEvent }) => {
	const buildTree = (obj) => {
		return Object.keys(obj).map((key) => {
			const varType = typeof obj[key];
			if (
				varType === 'string' ||
				varType === 'number' ||
				varType === 'number' ||
				!obj[key]
			) {
				return (
					<TreeItem truncate={true} key={key}>
						{key + ' : ' + obj[key]}
					</TreeItem>
				);
			} else if (varType === 'object') {
				return (
					<Tree label={key} density={-3} key={key}>
						{buildTree(obj[key])}
					</Tree>
				);
			}
			return undefined;
    	});
	}

	const { type, ...rest } = embedEvent;
	return (
		<Tree label={type} density={-3}>
			{buildTree(rest)}
		</Tree>
	);
}

EmbedEvent.propTypes = {
	embedEvent: PropTypes.object,
}
