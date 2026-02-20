import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
    vus: 1, // Number of virtual users
    duration: '10s', // Duration of the test
};

export default function () {
    const users = http.get('https://jsonplaceholder.typicode.com/users');
    const posts = http.get('https://jsonplaceholder.typicode.com/posts');
    //sleep(1); // Sleep for 1 second between requests
}
