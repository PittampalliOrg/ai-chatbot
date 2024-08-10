// app/kiota/requestAdapter.ts

import {
    RequestAdapter,
    RequestInformation,
    ParsableFactory,
    Parsable,
    BackingStoreFactory,
    SerializationWriterFactory,
    ParseNodeFactory,
    PrimitiveTypesForDeserialization,
    ErrorMappings,
    enableBackingStoreForSerializationWriterFactory,
    PrimitiveTypesForDeserializationType
} from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";
import { NextAuthAuthProvider } from './nextAuthProvider';  // Adjust this path as needed

export class NextAuthRequestAdapter implements RequestAdapter {
    private baseAdapter: FetchRequestAdapter;

    constructor() {
        const authProvider = new NextAuthAuthProvider();
        this.baseAdapter = new FetchRequestAdapter(authProvider);
    }

    getSerializationWriterFactory(): SerializationWriterFactory {
        return this.baseAdapter.getSerializationWriterFactory();
    }

    async send<T extends Parsable>(requestInfo: RequestInformation, type: ParsableFactory<T>, errorMappings: ErrorMappings): Promise<T> {
        const response = await this.baseAdapter.send(requestInfo, type, errorMappings);
        if (!response) throw new Error("Unexpected null response");
        return response;
    }

    async sendCollection<T extends Parsable>(requestInfo: RequestInformation, type: ParsableFactory<T>, errorMappings: ErrorMappings): Promise<T[]> {
        const response = await this.baseAdapter.sendCollection(requestInfo, type, errorMappings);
        return response ?? [];
    }

    sendCollectionOfPrimitive<ResponseType extends Exclude<PrimitiveTypesForDeserializationType, ArrayBuffer>>(
        requestInfo: RequestInformation,
        responseType: "string" | "number" | "boolean" | "Date" | "DateOnly" | "TimeOnly" | "Duration",
        errorMappings: ErrorMappings | undefined
    ): Promise<ResponseType[] | undefined> {
        return this.baseAdapter.sendCollectionOfPrimitive(requestInfo, responseType, errorMappings);
    }

    sendPrimitive<ResponseType extends PrimitiveTypesForDeserializationType>(
        requestInfo: RequestInformation,
        responseType: PrimitiveTypesForDeserialization,
        errorMappings: ErrorMappings | undefined
    ): Promise<ResponseType | undefined> {
        return this.baseAdapter.sendPrimitive(requestInfo, responseType, errorMappings);
    }

    async sendNoResponseContent(requestInfo: RequestInformation, errorMappings: ErrorMappings): Promise<void> {
        return this.baseAdapter.sendNoResponseContent(requestInfo, errorMappings);
    }

    setBaseUrl(baseUrl: string): void {
        this.baseAdapter.baseUrl = baseUrl;
    }

    enableBackingStore(backingStoreFactory?: BackingStoreFactory): void {
        if (typeof (this.baseAdapter as any).enableBackingStore === 'function') {
            (this.baseAdapter as any).enableBackingStore(backingStoreFactory);
        }
    }

    get baseUrl(): string {
        return this.baseAdapter.baseUrl;
    }

    set baseUrl(value: string) {
        this.baseAdapter.baseUrl = value;
    }

    getParseNodeFactory(): ParseNodeFactory | undefined {
        return (this.baseAdapter as any).getParseNodeFactory();
    }

    convertToNativeRequest<T>(requestInfo: RequestInformation): Promise<T> {
        return this.baseAdapter.convertToNativeRequest(requestInfo);
    }

    sendEnum<EnumObject extends Record<string, unknown>>(
        requestInfo: RequestInformation,
        enumObject: EnumObject,
        errorMappings: ErrorMappings | undefined
    ): Promise<EnumObject[keyof EnumObject] | undefined> {
        return this.baseAdapter.sendEnum(requestInfo, enumObject, errorMappings);
    }

    sendCollectionOfEnum<EnumObject extends Record<string, unknown>>(
        requestInfo: RequestInformation,
        enumObject: EnumObject,
        errorMappings: ErrorMappings | undefined
    ): Promise<EnumObject[keyof EnumObject][] | undefined> {
        return this.baseAdapter.sendCollectionOfEnum(requestInfo, enumObject, errorMappings);
    }
}