interface CoinInfoPillProps {
    name: string;
    value: string;
    tooltip?: string;
    textClassName: string;
    additionalClassName?: string;
}

export default function CoinInfoPill({ name, value, tooltip, textClassName, additionalClassName }: CoinInfoPillProps) {
    return (
        <div
            data-tooltip-target={'tooltip-' + name}
            className={'flex w-full flex-col items-center rounded-md border p-3 transition ' + additionalClassName}
        >
            <p className={textClassName}>{name}</p>
            <p className={textClassName}>{value}</p>
        </div>
    );
}
