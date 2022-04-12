/*

 MIT License

 Copyright (c) 2022 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React, {useCallback, useContext, useState, useEffect } from 'react'
import { EmbedContainer } from '../EmbedContainer'
import { ExtensionContext2 } from '@looker/extension-sdk-react'
import PropTypes from 'prop-types'
import {
  Layout,
  Page,
  Form,
  Button,
  Box,
  Text,
  FieldText,
  Fieldset,
  Divider,
  Box2,
} from '@looker/components'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import {
  useCurrentRoute,
  useListenEmbedEvents,
  useNavigate,
} from '../../hooks'

export const InventarioEmbed = ({ embedType }) => {
  const { embedId } = useCurrentRoute(embedType)
  const { updateEmbedId } = useNavigate(embedType)
  const { extensionSDK } = useContext(ExtensionContext2)
  const [lookId, setLookId] = useState()
  const [message, setMessage] = useState()
  const [running, setRunning] = useState()
  const [dashboardId, setDashboardId] = useState()
  const [dashboard, setDashboard] = useState()
  const { embedEvents, listenEmbedEvents, clearEvents } = useListenEmbedEvents()

  const maybeCancel = () => {
    return { cancel: cancelEventsRef.current }
  }
  const updateRunButton = (running) => {
    setRunning(running)
  }
  const runDashboard = () => {
    console.log("setupDashboard " + dashboard)
    if (dashboard) {
      setDashboardId("21")
      dashboard.run()
    }
  }
  const setupDashboard = (dashboard) => {
    setDashboard(dashboard)
  }

  const embedCtrRef = useCallback((el) => {
    setMessage(undefined)
    if (el) {
      console.log("embedCtrRef");
      const hostUrl = extensionSDK.lookerHostData?.hostUrl
      if (hostUrl) {
        let initialId
        updateEmbedId('21')
        console.log(embedId)
        if (embedId && embedId !== '') {
          setDashboardId(embedId)
          initialId = embedId
        } else {
          initialId = 'preload'
        }
        console.log(initialId)
        console.log(hostUrl)
        LookerEmbedSDK.init(hostUrl)
        const embed = LookerEmbedSDK.createDashboardWithId('21')
          .withNext()
          .appendTo(el)
          .on('dashboard:run:start', updateRunButton.bind(null, true))
          .on('dashboard:run:complete', updateRunButton.bind(null, false))
          .on('drillmenu:click', maybeCancel)
          .on('drillmodal:explore', maybeCancel)
          .on('dashboard:tile:explore', maybeCancel)
          .on('dashboard:tile:view', maybeCancel)
        listenEmbedEvents(embed)
        if (initialId === 'preload') {
          embed.on('page:changed', updateRunButton.bind(null, false))
        }
        embed
          .build()
          .connect()
          .then(setupDashboard)
          .catch((error) => {
            console.error('Connection error', error)
            setMessage('Error setting up embed environment')
          })
      }
    }
  }, [])

  useEffect(() => {
    if (lookId !== embedId) {
      if (lookId) {
        updateEmbedId(lookId + '')
        setMessage(undefined)
      } else {
        if (embedId && embedId !== '') {
          setLookId(embedId)
        }
      }
    }
  }, [lookId, embedId])

  return (
    <Page height="100%">
      <Form>
      <Divider size="8px" customColor="white" mt="u5" borderRadius="100px" />
      <Box2 ml="u16">
        <Fieldset inline legend="Simulador de Inventario">
          <FieldText label="Canal de distribución" />
          <FieldText label="Zona de Ventas" />
          <FieldText label="Label 3" />
        </Fieldset>
        <Fieldset inline >
          <FieldText label="Label 4" />
          <FieldText label="Label 5" />
          <FieldText label="Label 6" />
        </Fieldset>
        <br />
        <div>
<Button>
                Enviar
              </Button>
</div>
</Box2>
          <EmbedContainer ref={embedCtrRef} />
      </Form>
    </Page>
  )
}

InventarioEmbed.propTypes = {
  embedType: PropTypes.string.isRequired,
}
