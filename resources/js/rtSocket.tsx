import echo from '@/echo';
import { User } from './types';

export default function getEchoConnection(user: User, pairId?: number) {
    const notifs = echo.subscribe('RTSocket.Client.' + user.id);
    let pairs;
    if (pairId) {
        pairs = echo.subscribe('RTSocket.Pair.' + pairId);
    }

    return { notifs, pairs };
}
