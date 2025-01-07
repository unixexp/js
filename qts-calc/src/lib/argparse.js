import fs from "fs"

export const argparse = (mArgs) => {
    const cArgs = {}
    if ((process.argv.filter(el => el == "--help")).length) {
        showArgsHelp(mArgs)
        process.exit(1)
    } else {
        process.argv.forEach((val, index, array) => {
            if (val.indexOf("=") != -1) {
                let k, v
                [k, v]  = val.split("=")
                const _index = mArgs.findIndex(el => el.key == k)
                if (_index == -1) {
                    showArgsHelp(mArgs)
                    process.exit(1)
                } else {
                    const arg = mArgs[_index]
                    let err = ""
                    switch (arg.validation) {
                        case "<regexp>":
                            if (!v.match(arg.regexp))
                                err = `param ${k} is invalid`
                            break
                        case "<path_exists>":
                            if (!fs.existsSync(v))
                                err = `path ${v} does not exists`
                            break
                        default:
                            cArgs[k.replace("--", "")] = v
                    }
                    if (err) {
                        console.log(err)
                        process.exit(1)
                    } else {
                        cArgs[k.replace("--", "")] = v
                    }
                }
            }
        })
        return cArgs
    }
}

const showArgsHelp = (cArgs) => {
    const args = [...cArgs]
    args.push({key: "--help", validation: null, help: "Show this help"})
    const kLL = args.map(el => el.key.length)
    const maxKL = Math.max(...kLL)
    console.log("Usage:\n")
    args.forEach(el => {
        const curL = el.key.length
        const splitter = " ".repeat(maxKL - curL + 4)
        console.log(`    ${el.key}${splitter}${el.help}`)
    })
    console.log()
}
