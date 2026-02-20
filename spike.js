import http from 'k6/http';

export const options = {
    stages: [
        { duration: '60s', target: 30 }, // Ramp up to 50 users over 60 seconds
        { duration: '10s', target: 300 }, // Stay at 500 users for 10 seconds
        { duration: '30s', target: 300 },
        { duration: '30s', target: 0 }   // Ramp down to 0 users over 30 seconds
    ],
};

export default function () {
    const users = http.get('https://jsonplaceholder.typicode.com/users');
}
