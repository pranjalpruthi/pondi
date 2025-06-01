import { createFileRoute } from '@tanstack/react-router';
import MinimalShop from '../../components/shop/minimal-shop'; // Adjusted import path

export const Route = createFileRoute('/shop/')({
  component: ShopPage,
});

function ShopPage() {
  return <MinimalShop />;
}
