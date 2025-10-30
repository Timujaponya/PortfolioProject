require("dotenv").config();


module.exports = {
    githubToken:process.env.GITHUB_TOKEN,
    port:process.env.PORT || 3000,
    mongoUri:process.env.MONGODB_URI
}