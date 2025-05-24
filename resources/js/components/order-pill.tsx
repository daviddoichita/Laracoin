import { Crypto } from '@/types/crypto';
import { Order } from '@/types/order';
import { AlertDialog } from '@base-ui-components/react/alert-dialog';

interface CancelDialogProps {
    disabled: boolean;
    onClick: () => void;
}

function CancelDialog({ disabled, onClick }: Readonly<CancelDialogProps>) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger
                disabled={disabled}
                className={'w-full rounded p-1 ' + (disabled ? 'hidden' : 'bg-red-500 hover:cursor-pointer hover:bg-red-400')}
            >
                Cancel
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Backdrop className="fixed inset-0 bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70" />
                <AlertDialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:bg-neutral-950 dark:text-white dark:outline-gray-300 dark:outline-neutral-800">
                    <AlertDialog.Title className="-mt-1.5 mb-1 text-lg font-medium">Cancel order?</AlertDialog.Title>
                    <AlertDialog.Description className="mb-6 text-base text-gray-600 dark:text-white">
                        You can’t undo this action.
                    </AlertDialog.Description>
                    <div className="flex justify-end gap-4">
                        <AlertDialog.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:cursor-pointer hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
                            Cancel
                        </AlertDialog.Close>
                        <AlertDialog.Close
                            onClick={onClick}
                            className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-red-500 select-none hover:cursor-pointer hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            Confirm
                        </AlertDialog.Close>
                    </div>
                </AlertDialog.Popup>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}

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
        <div className={`mb-5 flex w-[49%] flex-col items-center gap-3 rounded-xl border p-3 ${statusClass}`}>
            <div className="flex w-full flex-row justify-center gap-3 text-lg font-black">
                <p>Order id: {order.id}</p>
                <p>Sold: {sold?.name}</p>
                <p>Purchased: {purchased?.name}</p>
            </div>
            <div className="flex w-full flex-row flex-wrap gap-3">
                <div className="flex w-[31%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Type</p>
                    <p>{order.order_type}</p>
                </div>
                <div className="flex w-[31%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Amount</p>
                    <p>{formatPrice(parseFloat(order.purchased_amount.toString()))}</p>
                </div>
                <div className="flex w-[31%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Price</p>
                    <p>{formatPrice(parseFloat(order.price.toString()))}</p>
                </div>
                <div className="flex w-[31%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Total price</p>
                    <p>{formatPrice(parseFloat(order.sold_amount.toString()))}</p>
                </div>
                <div className="flex w-[31%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Filled</p>
                    <p>{formatPrice(parseFloat(order.filled.toString()))}</p>
                </div>
                <div className="flex w-[31%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>To sell</p>
                    <p>{formatPrice(parseFloat(order.remaining_to_sell.toString()))}</p>
                </div>
                <div className="flex w-full flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Status</p>
                    <p className={textClass}>{order.status}</p>
                </div>
            </div>
            <CancelDialog
                disabled={order.status === 'completed' || order.status === 'canceled'}
                onClick={() => {
                    window.location.href = route('cancel-order', { id: order.id });
                }}
            ></CancelDialog>
        </div>
    );
}
