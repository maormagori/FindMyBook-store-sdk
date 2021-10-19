import { Md5 } from "ts-md5";

const md5 = (text: string) => {
    const strToHash = text.replace(/[^a-zA-Z0-9א-ת]/g, "");

    return Md5.hashStr(strToHash);
};

export default md5;
