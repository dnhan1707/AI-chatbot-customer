'use client'

import { Box } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi, this is how can i help u today'
  }]);


  const [message, setMessage] = useState('');
  return (
    <Box>

    </Box>
  )
}
