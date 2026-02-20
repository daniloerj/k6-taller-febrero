import http from 'k6/http';

export const options = {
    stages: [
        { duration: '10s', target: 50 },
        { duration: '60s', target: 500 },
        { duration: '60s', target: 500 },
        { duration: '10s', target: 0 }
    ],
};

export default function () {
    const users = http.get('https://jsonplaceholder.typicode.com/users');
}
