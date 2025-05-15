import getEchoConnection from '@/rtSocket';
import { SharedData } from '@/types';
import { Crypto } from '@/types/crypto';
import { Order } from '@/types/order';
import { Toast } from '@base-ui-components/react/toast';
import { usePage } from '@inertiajs/react';
import * as React from 'react';
import { useEffect } from 'react';

export default function Notifications() {
    return (
        <Toast.Provider limit={3} timeout={5000}>
            <OrderListener></OrderListener>
            <Toast.Viewport
                className={'fixed top-auto right-[1rem] bottom-auto mx-auto flex h-fit w-[250px] sm:right-[2rem] sm:bottom-[2rem] sm:w-[300px]'}
            >
                <ToastList></ToastList>
            </Toast.Viewport>
        </Toast.Provider>
    );
}

function OrderListener() {
    const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const { auth } = usePage<SharedData>().props;
    const { notifs } = getEchoConnection(auth.user);

    const toastManager = Toast.useToastManager();

    useEffect(() => {
        const handleOrderCreated = (data: any) => {
            const order: Order = data.order;
            const purchased: Crypto = data.purchased;
            const sold: Crypto = data.sold;

            toastManager.add({
                title: `${order.order_type} order created`,
                description: `purchasing: ${order.purchased_amount} ${purchased.symbol} selling: ${order.sold_amount} ${sold.symbol}`,
                data: { className: isDarkTheme ? 'bg-black text-white' : '' },
            });
        };

        const handleOrderCompleted = (data: any) => {
            const order: Order = data.order;

            toastManager.add({
                title: `order completed`,
                description: `${order.order_type} order with id: ${order.id} completed`,
            });
        };

        const handleOrderFilled = (data: any) => {
            const order: Order = data.order;

            toastManager.add({
                title: `order filled`,
                description: `order with id: ${order.id} has been filled. New amount: ${order.filled}`,
            });
        };

        notifs.bind('App\\Events\\OrderCreated', handleOrderCreated);
        notifs.bind('App\\Events\\OrderCompleted', handleOrderCompleted);
        notifs.bind('App\\Events\\OrderFilled', handleOrderFilled);

        return () => {
            notifs.unbind('App\\Events\\OrderCreated', handleOrderCreated);
            notifs.unbind('App\\Events\\OrderCompleted', handleOrderCompleted);
            notifs.unbind('App\\Events\\OrderFilled', handleOrderFilled);
        };
    }, [auth.user.id, toastManager]);

    return <></>;
}

function ToastList() {
    const { toasts } = Toast.useToastManager();
    return toasts.map((toast) => (
        <Toast.Root
            key={toast.id}
            toast={toast}
            className="absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 w-full [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+calc(var(--toast-index)*-15px)))_scale(calc(1-(var(--toast-index)*0.1)))] rounded-lg border border-gray-200 bg-gray-50 bg-clip-padding p-4 shadow-lg transition-all [transition-property:opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] select-none after:absolute after:bottom-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-[ending-style]:opacity-0 data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y)))] data-[starting-style]:[transform:translateY(150%)] data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:shadow dark:shadow-neutral-600 data-[ending-style]:[&:not([data-limited])]:[transform:translateY(150%)]"
            style={
                {
                    '--gap': '1rem',
                    '--offset-y': 'calc(var(--toast-offset-y) * -1 + (var(--toast-index) * var(--gap) * -1) + var(--toast-swipe-movement-y))',
                } as React.CSSProperties
            }
        >
            <Toast.Title className="text-[0.975rem] leading-5 font-medium" />
            <Toast.Description className="text-[0.925rem] leading-5" />
            <Toast.Close
                className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded border-none bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
            >
                <XIcon className="h-4 w-4" />
            </Toast.Close>
        </Toast.Root>
    ));
}

function XIcon(props: Readonly<React.ComponentProps<'svg'>>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
