import { IconName } from 'lucide-react/dynamic';
import { PriceComparison } from './price-comparison';

export interface Crypto {
    id: number;
    name: string;
    symbol: string;
    icon: IconName;
    main_price_comparison: PriceComparison[];
    child_price_comparison: PriceComparison[];
}
