export interface Order {
    id: number;
    user_id: number;
    sold_id: number;
    purchased_id: number;
    order_type: string;
    purchased_amount: number;
    sold_amount: number;
    remaining_to_sell: number;
    filled: number;
    price: number;
    status: string;
}
