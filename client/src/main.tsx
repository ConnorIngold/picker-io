import React, { useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import { Buffer } from 'buffer'
import { AppProvider } from '@shopify/polaris'
import { Provider } from '@shopify/app-bridge-react'

import translations from '@shopify/polaris/locales/en.json'
import { useNavigate } from '@shopify/app-bridge-react'
import Navigation from './components/Navigation'

import App from './App'
import './index.css'

function AppBridgeLink({ url, children, external, ...rest }: any): JSX.Element {
	const navigate = useNavigate()
	const handleClick = useCallback(() => {
		navigate(url)
	}, [url])

	const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/

	if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
		return (
			<a {...rest} href={url} target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		)
	}

	return (
		<a {...rest} onClick={handleClick}>
			{children}
		</a>
	)
}

const config = {
	apiKey: 'e0f06376ae46ef041a82b7b6f5b96f32',
	host: btoa('connor-charle-dev.myshopify.com/admin'),
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider config={config}>
			<AppProvider i18n={translations} linkComponent={AppBridgeLink}>
				<Navigation />
				<App />
			</AppProvider>
		</Provider>
	</React.StrictMode>
)
