import { Crypto } from '@/types/crypto';
import { Link } from '@inertiajs/react';

interface CryptoDashPillProps {
    crypto: Crypto;
}

const getEuroPrice = (crypto: Crypto) => {
    const pcArr = crypto.main_price_comparison.length !== 0 ? crypto.main_price_comparison : crypto.child_price_comparison;
    const priceComparison = pcArr.filter((pc) => {
        return pc.main_id === 1;
    });

    const price = priceComparison[0]?.price;
    const priceInverted = (1 / price).toString();
    const price2d = parseFloat(priceInverted).toFixed(2);
    const pId = `${crypto.id}-${crypto.name}-price`;
    return <p id={pId}>{price2d + ' €'}</p>;
};

export function CryptoDashPill({ crypto }: CryptoDashPillProps) {
    return (
        <Link
            href={route('crypto.show', { id: crypto.id })}
            className="flex max-w-7xl min-w-7xl flex-row items-center justify-between rounded border bg-neutral-950 p-3 font-sans transition duration-[0.2s] ease-in-out hover:cursor-pointer hover:bg-neutral-900"
        >
            <div className="flex flex-row gap-3">
                <p>{crypto.name.toLocaleUpperCase()}</p>
                <p>{crypto.symbol}</p>
            </div>
            {getEuroPrice(crypto)}
        </Link>
    );
}
