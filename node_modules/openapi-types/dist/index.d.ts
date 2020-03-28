export declare namespace OpenAPI {
    type Document = OpenAPIV2.Document | OpenAPIV3.Document;
    type Operation = OpenAPIV2.OperationObject | OpenAPIV3.OperationObject;
    type Parameter = OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject | OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter;
    type Parameters = Array<OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject> | Array<OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter>;
    interface Request {
        body?: any;
        headers?: object;
        params?: object;
        query?: object;
    }
}
export declare namespace OpenAPIV3 {
    interface Document {
        openapi: string;
        info: InfoObject;
        servers?: ServerObject[];
        paths: PathsObject;
        components?: ComponentsObject;
        security?: SecurityRequirementObject[];
        tags?: TagObject[];
        externalDocs?: ExternalDocumentationObject;
    }
    interface InfoObject {
        title: string;
        description?: string;
        termsOfService?: string;
        contact?: ContactObject;
        license?: LicenseObject;
        version: string;
    }
    interface ContactObject {
        name?: string;
        url?: string;
        email?: string;
    }
    interface LicenseObject {
        name: string;
        url?: string;
    }
    interface ServerObject {
        url: string;
        description?: string;
        variables?: {
            [variable: string]: ServerVariableObject;
        };
    }
    interface ServerVariableObject {
        enum?: string[];
        default: string;
        description?: string;
    }
    interface PathsObject {
        [pattern: string]: PathItemObject;
    }
    interface PathItemObject {
        $ref?: string;
        summary?: string;
        description?: string;
        get?: OperationObject;
        put?: OperationObject;
        post?: OperationObject;
        delete?: OperationObject;
        options?: OperationObject;
        head?: OperationObject;
        patch?: OperationObject;
        trace?: OperationObject;
        servers?: ServerObject[];
        parameters?: Array<ReferenceObject | ParameterObject>;
    }
    interface OperationObject {
        tags?: string[];
        summary?: string;
        description?: string;
        externalDocs?: ExternalDocumentationObject;
        operationId?: string;
        parameters?: Array<ReferenceObject | ParameterObject>;
        requestBody?: ReferenceObject | RequestBodyObject;
        responses?: ResponsesObject;
        callbacks?: {
            [callback: string]: ReferenceObject | CallbackObject;
        };
        deprecated?: boolean;
        security?: SecurityRequirementObject[];
        servers?: ServerObject[];
    }
    interface ExternalDocumentationObject {
        description?: string;
        url: string;
    }
    interface ParameterObject extends ParameterBaseObject {
        name: string;
        in: string;
    }
    interface HeaderObject extends ParameterBaseObject {
    }
    interface ParameterBaseObject {
        description?: string;
        required?: boolean;
        deprecated?: boolean;
        allowEmptyValue?: boolean;
        style?: string;
        explode?: boolean;
        allowReserved?: boolean;
        schema?: ReferenceObject | SchemaObject;
        example?: any;
        examples?: {
            [media: string]: ReferenceObject | ExampleObject;
        };
        content?: {
            [media: string]: MediaTypeObject;
        };
    }
    type NonArraySchemaObjectType = 'null' | 'boolean' | 'object' | 'number' | 'string' | 'integer';
    type ArraySchemaObjectType = 'array';
    type SchemaObject = ArraySchemaObject | NonArraySchemaObject;
    interface ArraySchemaObject extends BaseSchemaObject {
        type: ArraySchemaObjectType;
        items: ReferenceObject | SchemaObject;
    }
    interface NonArraySchemaObject extends BaseSchemaObject {
        type: NonArraySchemaObjectType;
    }
    interface BaseSchemaObject {
        title?: string;
        description?: string;
        format?: string;
        default?: any;
        multipleOf?: number;
        maximum?: number;
        exclusiveMaximum?: boolean;
        minimum?: number;
        exclusiveMinimum?: boolean;
        maxLength?: number;
        minLength?: number;
        pattern?: string;
        additionalProperties?: boolean | ReferenceObject | SchemaObject;
        maxItems?: number;
        minItems?: number;
        uniqueItems?: boolean;
        maxProperties?: number;
        minProperties?: number;
        required?: string[];
        enum?: any[];
        properties?: {
            [name: string]: ReferenceObject | SchemaObject;
        };
        allOf?: Array<ReferenceObject | SchemaObject>;
        oneOf?: Array<ReferenceObject | SchemaObject>;
        anyOf?: Array<ReferenceObject | SchemaObject>;
        not?: ReferenceObject | SchemaObject;
        nullable?: boolean;
        discriminator?: DiscriminatorObject;
        readOnly?: boolean;
        writeOnly?: boolean;
        xml?: XMLObject;
        externalDocs?: ExternalDocumentationObject;
        example?: any;
        deprecated?: boolean;
    }
    interface DiscriminatorObject {
        propertyName: string;
        mapping?: {
            [value: string]: string;
        };
    }
    interface XMLObject {
        name?: string;
        namespace?: string;
        prefix?: string;
        attribute?: boolean;
        wrapped?: boolean;
    }
    interface ReferenceObject {
        $ref: string;
    }
    interface ExampleObject {
        summary?: string;
        description?: string;
        value?: any;
        externalValue?: string;
    }
    interface MediaTypeObject {
        schema?: ReferenceObject | SchemaObject;
        example?: any;
        examples?: {
            [media: string]: ReferenceObject | ExampleObject;
        };
        encoding?: {
            [media: string]: EncodingObject;
        };
    }
    interface EncodingObject {
        contentType?: string;
        headers?: {
            [header: string]: ReferenceObject | HeaderObject;
        };
        style?: string;
        explode?: boolean;
        allowReserved?: boolean;
    }
    interface RequestBodyObject {
        description?: string;
        content: {
            [media: string]: MediaTypeObject;
        };
        required?: boolean;
    }
    interface ResponsesObject {
        [code: string]: ReferenceObject | ResponseObject;
    }
    interface ResponseObject {
        description: string;
        headers?: {
            [header: string]: ReferenceObject | HeaderObject;
        };
        content?: {
            [media: string]: MediaTypeObject;
        };
        links?: {
            [link: string]: ReferenceObject | LinkObject;
        };
    }
    interface LinkObject {
        operationRef?: string;
        operationId?: string;
        parameters?: {
            [parameter: string]: any;
        };
        requestBody?: any;
        description?: string;
        server?: ServerObject;
    }
    interface CallbackObject {
        [url: string]: PathItemObject;
    }
    interface SecurityRequirementObject {
        [name: string]: string[];
    }
    interface ComponentsObject {
        schemas?: {
            [key: string]: ReferenceObject | SchemaObject;
        };
        responses?: {
            [key: string]: ReferenceObject | ResponseObject;
        };
        parameters?: {
            [key: string]: ReferenceObject | ParameterObject;
        };
        examples?: {
            [key: string]: ReferenceObject | ExampleObject;
        };
        requestBodies?: {
            [key: string]: ReferenceObject | RequestBodyObject;
        };
        headers?: {
            [key: string]: ReferenceObject | HeaderObject;
        };
        securitySchemes?: {
            [key: string]: ReferenceObject | SecuritySchemeObject;
        };
        links?: {
            [key: string]: ReferenceObject | LinkObject;
        };
        callbacks?: {
            [key: string]: ReferenceObject | CallbackObject;
        };
    }
    type SecuritySchemeObject = HttpSecurityScheme | ApiKeySecurityScheme | OAuth2SecurityScheme | OpenIdSecurityScheme;
    interface HttpSecurityScheme {
        type: 'http';
        description?: string;
        scheme: string;
        bearerFormat?: string;
    }
    interface ApiKeySecurityScheme {
        type: 'apiKey';
        description?: string;
        name: string;
        in: string;
    }
    interface OAuth2SecurityScheme {
        type: 'oauth2';
        flows: {
            implicit?: {
                authorizationUrl: string;
                refreshUrl?: string;
                scopes: {
                    [scope: string]: string;
                };
            };
            password?: {
                tokenUrl: string;
                refreshUrl?: string;
                scopes: {
                    [scope: string]: string;
                };
            };
            clientCredentials?: {
                tokenUrl: string;
                refreshUrl?: string;
                scopes: {
                    [scope: string]: string;
                };
            };
            authorizationCode?: {
                authorizationUrl: string;
                tokenUrl: string;
                refreshUrl?: string;
                scopes: {
                    [scope: string]: string;
                };
            };
        };
    }
    interface OpenIdSecurityScheme {
        type: 'openIdConnect';
        description?: string;
        openIdConnectUrl: string;
    }
    interface TagObject {
        name: string;
        description?: string;
        externalDocs?: ExternalDocumentationObject;
    }
}
export declare namespace OpenAPIV2 {
    interface Document {
        basePath?: string;
        consumes?: MimeTypes;
        definitions?: DefinitionsObject;
        externalDocs?: ExternalDocumentationObject;
        host?: string;
        info: InfoObject;
        parameters?: ParametersDefinitionsObject;
        paths: PathsObject;
        produces?: MimeTypes;
        responses?: ResponsesDefinitionsObject;
        schemes?: string[];
        security?: SecurityRequirementObject[];
        securityDefinitions?: SecurityDefinitionsObject;
        swagger: string;
        tags?: TagObject[];
    }
    interface TagObject {
        name: string;
        description?: string;
        externalDocs?: ExternalDocumentationObject;
    }
    interface SecuritySchemeObjectBase {
        type: 'basic' | 'apiKey' | 'oauth2';
        description?: string;
    }
    interface SecuritySchemeBasic extends SecuritySchemeObjectBase {
        type: 'basic';
    }
    interface SecuritySchemeApiKey extends SecuritySchemeObjectBase {
        type: 'apiKey';
        name: string;
        in: string;
    }
    type SecuritySchemeOauth2 = SecuritySchemeOauth2Implicit | SecuritySchemeOauth2AccessCode | SecuritySchemeOauth2Password | SecuritySchemeOauth2Application;
    interface ScopesObject {
        [index: string]: any;
    }
    interface SecuritySchemeOauth2Base extends SecuritySchemeObjectBase {
        flow: 'implicit' | 'password' | 'application' | 'accessCode';
        scopes: ScopesObject;
    }
    interface SecuritySchemeOauth2Implicit extends SecuritySchemeOauth2Base {
        flow: 'implicit';
        authorizationUrl: string;
    }
    interface SecuritySchemeOauth2AccessCode extends SecuritySchemeOauth2Base {
        flow: 'accessCode';
        authorizationUrl: string;
        tokenUrl: string;
    }
    interface SecuritySchemeOauth2Password extends SecuritySchemeOauth2Base {
        flow: 'password';
        tokenUrl: string;
    }
    interface SecuritySchemeOauth2Application extends SecuritySchemeOauth2Base {
        flow: 'application';
        tokenUrl: string;
    }
    type SecuritySchemeObject = SecuritySchemeBasic | SecuritySchemeApiKey | SecuritySchemeOauth2;
    interface SecurityDefinitionsObject {
        [index: string]: SecuritySchemeObject;
    }
    interface SecurityRequirementObject {
        [index: string]: string[];
    }
    interface ReferenceObject {
        $ref: string;
    }
    type Response = ResponseObject | ReferenceObject;
    interface ResponsesDefinitionsObject {
        [index: string]: ResponseObject;
    }
    type Schema = SchemaObject | ReferenceObject;
    interface ResponseObject {
        description: string;
        schema?: Schema;
        headers?: HeadersObject;
        examples?: ExampleObject;
    }
    interface HeadersObject {
        [index: string]: HeaderObject;
    }
    interface HeaderObject extends ItemsObject {
    }
    interface ExampleObject {
        [index: string]: any;
    }
    interface ResponseObject {
        description: string;
        schema?: Schema;
        headers?: HeadersObject;
        examples?: ExampleObject;
    }
    interface OperationObject {
        tags?: string[];
        summary?: string;
        description?: string;
        externalDocs?: ExternalDocumentationObject;
        operationId?: string;
        consumes?: MimeTypes;
        produces?: MimeTypes;
        parameters?: Parameters;
        responses: ResponsesObject;
        schemes?: string[];
        deprecated?: boolean;
        security?: SecurityRequirementObject[];
        [index: string]: any;
    }
    interface ResponsesObject {
        [index: string]: Response | any;
        default: Response;
    }
    type Parameters = Array<ReferenceObject | Parameter>;
    type Parameter = InBodyParameterObject | GeneralParameterObject;
    interface InBodyParameterObject extends ParameterObject {
        schema: Schema;
    }
    interface GeneralParameterObject extends ParameterObject, ItemsObject {
        allowEmptyValue?: boolean;
    }
    interface PathItemObject {
        $ref?: string;
        get?: OperationObject;
        put?: OperationObject;
        post?: OperationObject;
        del?: OperationObject;
        delete?: OperationObject;
        options?: OperationObject;
        head?: OperationObject;
        patch?: OperationObject;
        parameters?: Parameters;
    }
    interface PathsObject {
        [index: string]: PathItemObject | any;
    }
    interface ParametersDefinitionsObject {
        [index: string]: ParameterObject;
    }
    interface ParameterObject {
        name: string;
        in: string;
        description?: string;
        required?: boolean;
        [index: string]: any;
    }
    type MimeTypes = string[];
    interface DefinitionsObject {
        [index: string]: SchemaObject;
    }
    interface SchemaObject extends IJsonSchema {
        [index: string]: any;
        discriminator?: string;
        readOnly?: boolean;
        xml?: XMLObject;
        externalDocs?: ExternalDocumentationObject;
        example?: any;
        default?: any;
        items?: ItemsObject;
        properties?: {
            [name: string]: SchemaObject;
        };
    }
    interface ExternalDocumentationObject {
        [index: string]: any;
        description?: string;
        url: string;
    }
    interface ItemsObject {
        type: string;
        format?: string;
        items?: ItemsObject;
        collectionFormat?: string;
        default?: any;
        maximum?: number;
        exclusiveMaximum?: boolean;
        minimum?: number;
        exclusiveMinimum?: boolean;
        maxLength?: number;
        minLength?: number;
        pattern?: string;
        maxItems?: number;
        minItems?: number;
        uniqueItems?: boolean;
        enum?: any[];
        multipleOf?: number;
        $ref?: string;
    }
    interface XMLObject {
        [index: string]: any;
        name?: string;
        namespace?: string;
        prefix?: string;
        attribute?: boolean;
        wrapped?: boolean;
    }
    interface InfoObject {
        title: string;
        description?: string;
        termsOfService?: string;
        contact?: ContactObject;
        license?: LicenseObject;
        version: string;
    }
    interface ContactObject {
        name?: string;
        url?: string;
        email?: string;
    }
    interface LicenseObject {
        name: string;
        url?: string;
    }
}
export interface IJsonSchema {
    id?: string;
    $schema?: string;
    title?: string;
    description?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalItems?: boolean | IJsonSchema;
    items?: IJsonSchema | IJsonSchema[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: boolean | IJsonSchema;
    definitions?: {
        [name: string]: IJsonSchema;
    };
    properties?: {
        [name: string]: IJsonSchema;
    };
    patternProperties?: {
        [name: string]: IJsonSchema;
    };
    dependencies?: {
        [name: string]: IJsonSchema | string[];
    };
    enum?: any[];
    type?: string | string[];
    allOf?: IJsonSchema[];
    anyOf?: IJsonSchema[];
    oneOf?: IJsonSchema[];
    not?: IJsonSchema;
}
