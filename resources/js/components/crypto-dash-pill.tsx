import { Crypto } from "@/types/crypto";

interface CryptoDashPillProps {
    crypto: Crypto;
}

export function CryptoDashPill({ crypto }: CryptoDashPillProps) {
    return (
        <div className="w-full flex flex-row items-center justify-between border rounded p-3 bg-neutral-950 hover:bg-neutral-900 transition duration-[0.2s] ease-in-out hover:cursor-pointer">
            <div className="flex flex-row gap-3">
                <p>{crypto.name.toLocaleUpperCase()}</p>
                <p>{crypto.symbol}</p>
            </div>
            <p>{crypto.main_price_comparison[0]?.price}</p>
        </div>
    )
}