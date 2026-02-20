import http from 'k6/http';

export const options = {
    stages: [
        { duration: '2m', target: 50 },
        { duration: '3h30m', target: 300 },
        { duration: '2m', target: 0 }
    ],
};

export default function () {
    const users = http.get('https://jsonplaceholder.typicode.com/users');
}
