import { CryptoInfoDynamic } from './crypto-info-dynamic';

interface CoinInfoPillProps {
    name: string;
    value: string | number;
    rawValue?: string | number;
    latest: number;
    tooltip?: string;
    textClassName: string;
    additionalClassName?: string;
    dynamic?: boolean;
}

export default function CoinInfoPill({ name, value, rawValue, textClassName, additionalClassName, dynamic, latest }: Readonly<CoinInfoPillProps>) {
    const rv = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;

    return (
        <div
            data-tooltip-target={'tooltip-' + name}
            className={'flex w-full flex-col items-center rounded-md border p-3 shadow transition dark:shadow-neutral-500 ' + additionalClassName}
        >
            <p className={textClassName}>{name}</p>
            {dynamic ? (
                <CryptoInfoDynamic value={value.toString()} rawValue={rv ?? 0} latest={latest} />
            ) : (
                <p className={textClassName}>
                    {parseFloat(value.toString()) === -1 ? 'INF' : value} {name.match('Market Cap') || name.match('FDV') ? '€' : ''}
                </p>
            )}
        </div>
    );
}
