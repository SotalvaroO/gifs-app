// To parse this data:
//
//   import { Convert, GifsResponse } from "./file";
//
//   const gifsResponse = Convert.toGifsResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface GifsResponse {
    results: Result[];
    next:    string;
}

export interface Result {
    id:                  string;
    title:               string;
    content_description: string;
    content_rating:      string;
    h1_title:            string;
    media:               { [key: string]: Media }[];
    bg_color:            string;
    created:             number;
    itemurl:             string;
    url:                 string;
    tags:                any[];
    flags:               any[];
    shares:              number;
    hasaudio:            boolean;
    hascaption:          boolean;
    source_id:           string;
    composite:           null;
}

export interface Media {
    size:      number;
    dims:      number[];
    url:       string;
    preview:   string;
    duration?: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toGifsResponse(json: string): GifsResponse {
        return cast(JSON.parse(json), r("GifsResponse"));
    }

    public static gifsResponseToJson(value: GifsResponse): string {
        return JSON.stringify(uncast(value, r("GifsResponse")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "GifsResponse": o([
        { json: "results", js: "results", typ: a(r("Result")) },
        { json: "next", js: "next", typ: "" },
    ], false),
    "Result": o([
        { json: "id", js: "id", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "content_description", js: "content_description", typ: "" },
        { json: "content_rating", js: "content_rating", typ: "" },
        { json: "h1_title", js: "h1_title", typ: "" },
        { json: "media", js: "media", typ: a(m(r("Media"))) },
        { json: "bg_color", js: "bg_color", typ: "" },
        { json: "created", js: "created", typ: 3.14 },
        { json: "itemurl", js: "itemurl", typ: "" },
        { json: "url", js: "url", typ: "" },
        { json: "tags", js: "tags", typ: a("any") },
        { json: "flags", js: "flags", typ: a("any") },
        { json: "shares", js: "shares", typ: 0 },
        { json: "hasaudio", js: "hasaudio", typ: true },
        { json: "hascaption", js: "hascaption", typ: true },
        { json: "source_id", js: "source_id", typ: "" },
        { json: "composite", js: "composite", typ: null },
    ], false),
    "Media": o([
        { json: "size", js: "size", typ: 0 },
        { json: "dims", js: "dims", typ: a(0) },
        { json: "url", js: "url", typ: "" },
        { json: "preview", js: "preview", typ: "" },
        { json: "duration", js: "duration", typ: u(undefined, 3.14) },
    ], false),
};
