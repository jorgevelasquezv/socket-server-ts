import { v4 as uuidv4 } from 'uuid';

export class UuidAdapter {
    static v4() {
        return uuidv4();
    }
}