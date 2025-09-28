#!/usr/bin/env node

import yargs from 'yargs'
import tasksList from './tasks.json' with {type: "json"}
import { styleText } from 'node:util'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

let tasks = tasksList.tasks

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { argv } = yargs(process.argv)

function logFormattedList() {

    if (tasks.length > 0) {
        const greetingStr = styleText('bold', 'Here are your current tasks :')

        console.log(greetingStr)

        for (let i = 0; i < tasks.length; i++) {
            console.log(styleText(tasks[i].isDone ? ["strikethrough", "italic"] : ["reset"], `${String(i + 1)}) - ${tasks[i].text}`) + styleText(["reset"],tasks[i].isDone ? " ✔" : ""))
        }
    }
    else {
        const noTaskText = styleText('italic', 'It seems like you have no task registred...')
        console.log(noTaskText)
    }
}

function processCommand([key, value]) {
    let isUpdatableToJson = false

    if (key === "add") {
        if (value && typeof value === "string") {
            tasks.push({ text: value, isDone: false})

            console.log(styleText(['green', 'underline'], 'ADD : New task successfully added !'))

            isUpdatableToJson = true
        }
        else {
            console.log(styleText('red', 'ERROR : no value provided'))
        }
    }
    else if (key === "remove") {
        if (value && typeof value == "number") {

            const finalValue = Math.round(value)

            console.log(finalValue)

            tasks = tasks.filter((task, index) => index != finalValue - 1)

            console.log(styleText(['green', 'underline'], `REMOVE : Task n°${String(finalValue)} successfully removed !`))

            isUpdatableToJson = true
        }
        else {
            console.log(styleText('red', 'ERROR : no value provided'))
        }
    }
    else if (key === "check") {
        if (value && typeof value == "number") {

            const finalValue = Math.round(value)

            console.log(finalValue)

            tasks = tasks.map((task, index) => (index == finalValue - 1 ? 
                {...task, isDone: !(task.isDone)} : task
            ))

            console.log(styleText(['green', 'underline'], `REMOVE : Task n°${String(finalValue)} successfully removed !`))

            isUpdatableToJson = true
        }
        else {
            console.log(styleText('red', 'ERROR : no value provided'))
        }
    }

    if (isUpdatableToJson && tasks) {
        const newFile = `{\n"tasks" : ${JSON.stringify(tasks)}\n}` //new json file
        writeFileSync(path.resolve(__dirname, 'tasks.json'), newFile)
        logFormattedList()
    }
}

if (Object.entries(argv).length > 2) { //checks if there are arguments

    for (const [key, value] of Object.entries(argv)) {
        if (key !== "_" && key !== "$0") { //rules out other non-user commands
            console.log(argv)
            processCommand([key, value])
        }
    }
}
else {
    logFormattedList()
}