import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {store, persistor} from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import theme from './theme.js'
import { CssBaseline, ThemeProvider } from '@mui/material'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <>
        <App />
      </>
      </ThemeProvider>
   </PersistGate>
  </Provider>
)

 // React.StrictMode
