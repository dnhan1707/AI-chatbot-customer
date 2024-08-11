'use client'

import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi, how can i help u today'
  }]);

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
  
    const response = await fetch('api/chat', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }])
    });
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
  
    let result = '';
    await reader.read().then(function processText({ done, value }) {
      if (done) {
        return result;
      }
      const text = decoder.decode(value || new Int8Array(), { stream: true });
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text,
          }
        ];
      });
  
      return reader.read().then(processText);
    });
  }
  

  const [message, setMessage] = useState('');
  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack direction="column" width="600px" height="700px" border="1px solid black" p={2} spacing={3}>
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
          {
            messages.map((message, index) => (
              <Box key={index} display="flex" justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                <Box bgcolor={
                  message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                  color='white'
                  borderRadius={16}
                  p={3}>
                    {message.content}
                </Box>
              </Box>
            ))
          }
        </Stack>

        <Stack direction='row' spacing={2}>
          <TextField label="message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)}></TextField>
          <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
