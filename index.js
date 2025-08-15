const express = require("express")

const app = express()
app.use(express.static("client")) // any of changes in client do not affect server

app.listen(5500, () => {
    console.log("app is listening on port 5500")
})