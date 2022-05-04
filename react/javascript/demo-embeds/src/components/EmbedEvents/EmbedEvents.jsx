import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, List, ListItem, ButtonOutline } from '@looker/components'
import { EmbedEvent } from '../EmbedEvent'

export const EmbedEvents = ({ events, clearEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState()
  const onClearEvents = () => {
    clearEvents()
    setSelectedEvent()
  }
  return (
    <>
      <ButtonOutline width="100%" onClick={onClearEvents}>
        Clear Events
      </ButtonOutline>
      <Box
        height="33%"
        width="100%"
        borderBottom="solid 1px"
        pb="small"
        borderColor="ui2"
        overflowY="scroll"
      >
        <List mt="none" density={-3} width="100%" height="100%">
          {events.map((event, index) => (
            <ListItem
              key={events.length - index}
              onClick={() => setSelectedEvent(event)}
            >
              {event.type}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box height="33%" width="100%" pb="small">
        {selectedEvent && <EmbedEvent embedEvent={selectedEvent} />}
      </Box>
    </>
  )
}

EmbedEvents.propTypes = {
  clearEvents: PropTypes.func,
  events: PropTypes.array,
}
