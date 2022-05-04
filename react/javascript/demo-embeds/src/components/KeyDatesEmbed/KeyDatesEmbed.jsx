/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, {
  useContext,
  useState,
} from 'react'
import {
  Button,
  Layout,
  Page,
  Box,
  Text,
  FieldText,
  Form,
  Divider,
} from '@looker/components'
import {ExtensionContext2} from '@looker/extension-sdk-react'

export const KeyDatesEmbed = ({ embedType }) => {

  const extensionContext = useContext(ExtensionContext2)
const {extensionSDK} = extensionContext
  const [name, setYear] = useState("");
  const [data, setData] = useState ([{}])

  const handleSubmit = async (event) => {
    console.log(name)
    event.preventDefault();
      try {
        //GET
        const res = await
        extensionSDK.serverProxy("https://httpbin.org/post", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
          },
          body: JSON.stringify({
            name
      })
    })
	console.log(res)
      } catch (err) {
        console.log(err);
      }
  }
  return (
    <>
    <Page height="100%">
      <Form>
      <Divider size="8px" customColor="white" mt="u5" borderRadius="100px" />
      <Layout hasAside height="100%">
      <table width="100%">
          <tr>
            <td width="100px"><Text>Enter Year:</Text></td>
            <td width="200px"><FieldText value={name} onChange={(e) => setYear(e.target.value)} /></td>
          </tr>
        </table>
              <Button onClick={handleSubmit}>
                Enviar
              </Button>
      </Layout>
      </Form>
    </Page>
    </>
  )
}
