"user strict"

import fs from 'fs'

let last_messages = ""

const notify = async (doctors, config) => {
    const messagesList = doctors.map(doctor => {
        const dates = (doctor.free.map(visit => visit.date)).join("\n")
        return `<a href="${doctor.book}"><strong>${doctor.type}</strong>\n${doctor.name}</a>\n${dates}`
    })
    const messages = messagesList.join("\n\n")

    // Prevent spaming about already notified
    if (messages === last_messages)
        return false
    
    last_messages = messages
    const { func, link, token, subscribers } = config.telegram_bot
    subscribers.map(async subscriber => {
        if (subscriber.enabled) {
            try {
                const response = await fetch(
                    func.send_message.replace("%%token%%", token),
                    {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            chat_id: subscriber.chat_id,
                            text: messages,
                            parse_mode: "HTML"
                        })
                    })
                if (response.status != 200) {
                    console.log(`Cannot send message to subscriber '${subscriber.name}':`)
                    console.log(response)
                }
            } catch (error) {
                console.log(`Cannot send message to subscriber '${subscriber.name}':\n${error}`)
            }
        }
    })
}

const fetchData = async (config) => {
    const responses = await Promise.all(config.doctors.map(doctor => {
        const doctorAPIRef = config.schedule_api_ref.replace("%%api_id%%", doctor.api_id)
        return fetch(doctorAPIRef)
    }))
    let data = {}
    const schedule = []
    try {
        data = await Promise.all(responses.map(response => response.json()))
    } catch (error) {
        console.log(error)
        return schedule
    }
    for (let i = 0; i < data.length; i++) {
        schedule.push({
            ...config.doctors[i],
            book: config.book_ref.replace("%%book_id%%", config.doctors[i].book_id),
            schedule: data[i]
        })
    }
    return schedule
}

const check = (schedule) => {
    const freeDoctors = []
    schedule.map(doctor => {
        const freeHours = []
        for (const [date, receptions] of Object.entries(doctor.schedule)) {
            const found = receptions.filter(reception => reception.status != "booked")
            if (found.length)
                freeHours.push({date: date, hours: (found.map(f => f.time)).join(", ")})
        }
        if (freeHours.length) {
            freeDoctors.push({
                name: doctor.name,
                type: doctor.type,
                book: doctor.book,
                free: freeHours
            })
        }
    })
    return freeDoctors
}

const process = async () => {
    const now = new Date()
    console.log(`[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] Checking...`)

    const bufferData = fs.readFileSync("./config.json")
    const config = JSON.parse(bufferData.toString())
    const schedule = await fetchData(config)
    const freeDoctors = check(schedule)
    if (freeDoctors.length)
        await notify(freeDoctors, config)
}

await process()
setInterval(async () => {
    await process()
}, 120000)




