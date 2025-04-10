import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { UserBalance } from '@/types/user-balance';
import { Head, usePage } from '@inertiajs/react';

export interface BalancesProps {
    userBalances: UserBalance[];
}

export default function Balances({ userBalances }: BalancesProps) {
    const { auth } = usePage<SharedData>().props;
    console.log(auth.user);

    return (
        <AppLayout>
            <Head title="My balances" />
        </AppLayout>
    );
}
