export class CommonHelper {

    public static clone = (obj: any): any => {

        return JSON.parse(JSON.stringify(obj));

    }

}