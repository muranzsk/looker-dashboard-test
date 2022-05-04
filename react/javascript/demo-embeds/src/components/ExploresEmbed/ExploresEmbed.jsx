import React, { useCallback, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as htmlElements from '@looker/components';
import { ExtensionContext2 } from '@looker/extension-sdk-react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import {
  useAllExplores,
  useCurrentRoute,
  useNavigate,
  useListenEmbedEvents,
} from '../../hooks'

import { Search } from '../Search'
import { EmbedContainer } from '../EmbedContainer'
import { EmbedEvents } from '../EmbedEvents'

// Este es aperturas
export const ExploresEmbed = ({ embedType }) => {
  const { embedId } = useCurrentRoute(embedType)
  const { updateEmbedId } = useNavigate(embedType)
  const { extensionSDK } = useContext(ExtensionContext2)
  const [message, setMessage] = useState()
  const [running, setRunning] = useState()
  const [exploreId, setExploreId] = useState()
  const [explore, setExplore] = useState()
  const { embedEvents, listenEmbedEvents, clearEvents } = useListenEmbedEvents()
  const { data, isLoading, error } = useAllExplores()
  const results = (data || []).map(({ id, title }) => ({
    description: title,
    id,
  }))

  useEffect(() => {
    if (exploreId !== embedId) {
      if (exploreId && exploreId !== '') {
        updateEmbedId(exploreId)
        setMessage(undefined)
      } else {
        if (embedId && embedId !== '') {
          setExploreId(embedId)
        }
      }
    }
  }, [exploreId, embedId])

  const updateRunButton = (running) => {
    setRunning(running)
  }

  const setupExplore = (explore) => {
    setExplore(explore)
  }

  const embedCtrRef = useCallback(
    (el) => {
      console.log(exploreId)
      setMessage(undefined)
	  
      if (exploreId) {
        if (el) {
          setRunning(true)
          el.innerHTML = ''
          const hostUrl = extensionSDK.lookerHostData?.hostUrl
          if (hostUrl) {
            //hostUrl = https://piagui1.cloud.looker.com
            LookerEmbedSDK.init(hostUrl)
            const embed = LookerEmbedSDK.createExploreWithId(exploreId)
              .appendTo(el)
              .on('explore:ready', updateRunButton.bind(null, false))
              .on('explore:run:start', updateRunButton.bind(null, true))
              .on('explore:run:complete', updateRunButton.bind(null, false))
            listenEmbedEvents(embed)
            embed
              .build()
              .connect()
              .then(setupExplore)
              .catch((error) => {
                console.error('Connection error', error)
                setMessage('Error loading embed')
              })
          }
        }
      }
    },
    [exploreId]
  )

  const onSelected = (id) => {
    if (id !== exploreId) {
      // updateRunButton(true)
      setExploreId(id)
    }
  }

  const runDashboard = () => {
    if (explore) {
      explore.run()
    }
  }

	return (
		<htmlElements.Page height="100%">
			<htmlElements.Grid columns={1}>
				<htmlElements.Box2 mt='u4'>
					<htmlElements.Heading as="h1" fontWeight="semiBold" textAlign="center">Explorar Tableros</htmlElements.Heading>
				</htmlElements.Box2>
			</htmlElements.Grid>
			<htmlElements.Divider size="5px" mb="u6" borderRadius="100px" />
			<htmlElements.Layout hasAside height="100%">
				<htmlElements.Section height="100%" px="small"> {
					message && 
					<htmlElements.MessageBar intent="critical">{ message }</htmlElements.MessageBar>
				}
					<EmbedContainer ref={embedCtrRef} />
				</htmlElements.Section>
				<htmlElements.Aside width="25%" height="100%" pr="small">
					<htmlElements.Grid columns={1}>
						<Search onSelected={onSelected} loading={isLoading}
								error={error} data={results} embedRunning={running} />
					</htmlElements.Grid>
					<EmbedEvents events={embedEvents} clearEvents={clearEvents} />
				</htmlElements.Aside>
			</htmlElements.Layout>
		</htmlElements.Page>
	)
}

ExploresEmbed.propTypes = {
  embedType: PropTypes.string.isRequired,
}
