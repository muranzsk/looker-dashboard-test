import styled from 'styled-components'

export const EmbedContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  & > iframe {
    width: 100%;
    height: 100%;
  }
`
