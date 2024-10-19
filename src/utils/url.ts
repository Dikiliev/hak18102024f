import {BASE_URL} from "./constans";

export const getAbsoluteUrl = (url: string) => {
    return (BASE_URL + url.replace(BASE_URL, ''))
}