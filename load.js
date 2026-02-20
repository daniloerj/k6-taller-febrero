import http from 'k6/http';

export const options = {
    stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '30s', target: 250 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 0 }
    ],
};

export default function () {
    const users = http.get('https://jsonplaceholder.typicode.com/users');
}
