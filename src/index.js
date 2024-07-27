import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import Debug from './debugging';
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
        <App/>
    </ChakraProvider>
);

