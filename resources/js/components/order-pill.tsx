import { Crypto } from '@/types/crypto';
import { Order } from '@/types/order';
import { Button } from './ui/button';

export interface OrderPillProps {
    order: Order;
    sold: Crypto | undefined;
    purchased: Crypto | undefined;
}

const formatPrice = (n: number) => {
    return isNaN(n) ? 'Loading...' : n.toLocaleString('es-ES', { maximumFractionDigits: 8 });
};

export default function OrderPill({ order, sold, purchased }: Readonly<OrderPillProps>) {
    let statusClass = '';
    let textClass = '';
    if (order.status === 'completed') {
        statusClass = 'border-green-500 shadow-md shadow-green-500';
        textClass = 'text-green-500';
    } else if (order.status === 'pending') {
        statusClass = 'border-yellow-500 shadow-md shadow-yellow-500';
        textClass = 'text-yellow-500';
    } else {
        statusClass = 'border-red-500 shadow-md shadow-red-500';
        textClass = 'text-red-500';
    }

    return (
        <div className={`mb-5 flex w-[49.5%] flex-col items-center gap-3 rounded-xl border p-3 ${statusClass}`}>
            <div className="flex w-full flex-row justify-center gap-3 text-lg font-black">
                <p>Order id: {order.id}</p>
                <p>Sold: {sold?.name}</p>
                <p>Purchased: {purchased?.name}</p>
            </div>
            <div className="flex w-full flex-row flex-wrap gap-3">
                <div className="flex w-[32%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Type</p>
                    <p>{order.order_type}</p>
                </div>
                <div className="flex w-[32%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Amount</p>
                    <p>{formatPrice(parseFloat(order.purchased_amount.toString()))}</p>
                </div>
                <div className="flex w-[32%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Price</p>
                    <p>{formatPrice(parseFloat(order.price.toString()))}</p>
                </div>
                <div className="flex w-[32%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Total price</p>
                    <p>{formatPrice(parseFloat(order.sold_amount.toString()))}</p>
                </div>
                <div className="flex w-[32%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Filled</p>
                    <p>{formatPrice(parseFloat(order.filled.toString()))}</p>
                </div>
                <div className="flex w-[32%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>To sell</p>
                    <p>{formatPrice(parseFloat(order.remaining_to_sell.toString()))}</p>
                </div>
                <div className="flex w-full flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Status</p>
                    <p className={textClass}>{order.status}</p>
                </div>
            </div>
            <Button
                disabled={order.status === 'completed' || order.status === 'canceled'}
                onClick={() => {
                    window.location.href = route('cancel-order', { id: order.id });
                }}
                className="w-full bg-red-500 hover:cursor-pointer hover:bg-red-400"
            >
                Cancel
            </Button>
        </div>
    );
}
