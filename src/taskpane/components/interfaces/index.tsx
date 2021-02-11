export interface FRIDA_Intents {
    [ID: string]: FRIDA_Intent;
}

export interface FRIDA_Intent {
    ID?: string;
    Name: string;
    Variables?: Array<FRIDA_Variable>
}

export interface FRIDA_Variable {
    ID?: string;
    Name: string;
    Type: "text" | "numeric" | "email" | "date";
    Value?: any;
}

export interface Entity {
    startIndex: number;
    endIndex: number;
    score: number;
    entity: string;
    type: string;
}

export interface AppData {
    FRIDA: {
        Processes: FRIDA_Intents;
        Suite: string;
    };
    LuisAPIKey: string;
    LuisAppId: string;
    LuisEndpointURL: string;
    Name: string;
}

export interface AppItem {
    index?: number;
    ID: string;
    Name: string;
}
