import Pusher from 'pusher-js';
window.Pusher = Pusher;

const echo = new Pusher('3651ae947087af488683', {
    cluster: 'eu',
});

// const echo = new Echo({
//     broadcaster: 'pusher',
//     // key: import.meta.env.VITE_REVERB_APP_KEY,
//     key: '3651ae947087af488683',
//     cluster: 'eu',
//     // wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
//     wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });

export default echo;
