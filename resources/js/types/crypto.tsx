import { PriceComparison } from "./price-comparison";

export interface Crypto {
    id: number;
    name: string;
    symbol: string;
    main_price_comparison: PriceComparison[];
    child_price_comparison: PriceComparison[];
}