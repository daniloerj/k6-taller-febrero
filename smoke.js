import { check } from 'k6';
import http from 'k6/http';

export const options = {
    stages: [
        { duration: '2s', target: 5 },
        { duration: '5s', target: 10 },
        { duration: '3s', target: 0 }
    ],
    thresholds: {
        http_req_duration: ['p(95)<50']
    }
};

export default function () {
    const users = http.get('https://jsonplaceholder.typicode.com/danilo');
    check(users, {
        'is status 200': (r) => r.status === 200,
        'is not empty': (r) => r.body.length > 0,
        'is time less than 50ms': (r) => r.timings.duration < 500
    });
}