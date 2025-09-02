const axios = require("axios")
const githubToken = process.env.GITHUB_TOKEN;

// GitHub request fonksiyonu
async function getUserRepositories(user) {
    const response = await axios.get(`https://api.github.com/users/${user}/repos`, {
        timeout: 1000,
        headers: {
            'X-Custom-Header': 'foobar',
            Authorization: `${githubToken}`
        }
    });
    return response.data;
}


module.exports = {getUserRepositories}