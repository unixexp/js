"use strict";

import express from "express"
import path from "path"
import { argparse } from "./lib/argparse.js"

const mArgs = [
    {key: "--ip", validation: "<regexp>", regexp: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3,3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/, help: "Listen on IP"},
    {key: "--port", validation: "<regexp>", regexp: /^\d{1,5}$/, help: "Listen on port"}
]
    
const cArgs = argparse(mArgs)

const ip = cArgs.ip != null ? cArgs.ip : '127.0.0.1'
const port = cArgs.port != null ? cArgs.port : 3000

const app = express()

app.get("/", (req, res) => {
    res.sendFile(path.join(import.meta.dirname, "qts-calc.html"))
})

app.listen(port, ip, () => {
    console.log(`QTS-Calculator server started on ${ip}:${port}`)
})
