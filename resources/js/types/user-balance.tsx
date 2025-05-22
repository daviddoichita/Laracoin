import { Crypto } from './crypto';

export interface UserBalance {
    id: number;
    uuid: string;
    user_id: number;
    crypto_id: number;
    balance: number;
    locked_balance: number;
    crypto: Crypto;
}
