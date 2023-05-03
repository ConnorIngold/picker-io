import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from '@shopify/app-bridge-react'
const host = new URLSearchParams(location.search).get("host") || 'https://connor-charle-dev.myshopify.com'
const apiKey = 'e0f06376ae46ef041a82b7b6f5b96f32'




ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider config={{ apiKey, host, forceRedirect: true }}>
			<App />
		</Provider>
	</React.StrictMode>
)



https://connor-charle-dev.myshopify.com/admin/oauth/post_grant?access_change_uuid=1ea442a9-5998-4e4f-8601-fffa22f2a3a9&client_id=e0f06376ae46ef041a82b7b6f5b96f32