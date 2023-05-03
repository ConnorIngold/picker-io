import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from '@shopify/app-bridge-react'
const host = 'connor-charle-dev.myshopify.com'
const apiKey = process.env.SHOPIFY_API_KEY || 'e0f06376ae46ef041a82b7b6f5b96f32'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider config={{ apiKey, host, forceRedirect: true }}>
			<App />
		</Provider>
	</React.StrictMode>
)
