import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Crypto } from '@/types/crypto';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crypto View',
        href: '/cryto-view',
    },
];

interface CryptoViewProps {
    crypto: Crypto;
}

export default function CryptoView({ crypto }: CryptoViewProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crypto View"></Head>
        </AppLayout>
    );
}
