export const splitStringByLines = (context, maxWidth, string) => {
    const words = string.split(" ");
    const lines = [];
    let testLine = "";
    let line = "";

    for (let n = 0; n < words.length; n++) {

        testLine += `${words[n]} `;
        const lineMetrics = context.measureText(testLine);
        const testLineWidth = lineMetrics.width;

        if (testLineWidth > maxWidth) {
            lines.push(line);
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        } else {
            line += `${words[n]} `;
        }

        if (n === words.length - 1)
            lines.push(line);

    }

    if (!lines.length)
        lines.push(string)

    return lines;
}