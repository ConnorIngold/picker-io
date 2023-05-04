import { Frame, Navigation } from '@shopify/polaris'
import { HomeMinor, OrdersMinor, ProductsMinor } from '@shopify/polaris-icons'

function NavigationExample() {
	return (
		<Frame>
			<Navigation location="/">
				<Navigation.Section
					items={[
						{
							url: '#',
							label: 'Home',
							icon: HomeMinor,
						},
						{
							url: '#',
							excludePaths: ['#'],
							label: 'Orders',
							icon: OrdersMinor,
							badge: '15',
						},
						{
							url: '#',
							excludePaths: ['#'],
							label: 'Products',
							icon: ProductsMinor,
						},
					]}
				/>
			</Navigation>
		</Frame>
	)
}

export default NavigationExample
