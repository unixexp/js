export const loadImage = async (url) => {
    return await new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => {
            resolve(image);
        })
        image.addEventListener("error", (image) => reject(`Error load image ${url}`));
        image.src = url;
    })
}