export interface LocationResponse {
    plus_code: LocationPlusCode;
    status: string;
    results;
}

export interface LocationPlusCode {
    compound_code: string;
    global_code: string;
}

export interface LocationSave {
    address_plus: string;
    firstResult;
}