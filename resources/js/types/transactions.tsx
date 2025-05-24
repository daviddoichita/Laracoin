import { Crypto } from './crypto';

export interface Transaction {
    id: number;
    user_id: number;
    crypto_id: number;
    crypto: Crypto;
    target_uuid: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
}
