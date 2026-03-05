async function fetchAPI() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.warn('fetchAPI: Could not reach API endpoint.', error.message);
    }
}
