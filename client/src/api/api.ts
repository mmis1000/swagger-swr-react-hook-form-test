/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ErrorResponse {
  error?: string;
}

export interface PageObject {
  /** current */
  current: number;
  /** size */
  size: number;
  /** total */
  total: number;
}

export interface LoginResult {
  token?: string;
}

export interface AddPostRequest {
  title: string;
  content: string;
}

export interface PostSimple {
  /** id */
  id: number;
  /** title */
  title: string;
  /** author */
  author: string;
  /** editor */
  editor: string;
}

export type PostSimpleArray = PostSimple[];

export interface PatchPostRequest {
  /** title */
  title?: string;
  /** content */
  content?: string;
}

export interface Post {
  /** id */
  id: number;
  /** title */
  title: string;
  /** content */
  content: string;
  /** author */
  author: string;
  /** editor */
  editor?: string;
}

export interface LoginCreatePayload {
  /** @default "johndoe" */
  username: string;
  /** @default "johnDoe20!@" */
  password: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8080/" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Mini Blog API
 * @version 1.0.0
 * @baseUrl http://localhost:8080/
 * @contact Desmond Obisi <info@miniblog.com> (https://github.com/DesmondSanctity/node-js-swagger)
 *
 * API endpoints for a mini blog services documented on swagger
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  login = {
    /**
     * No description
     *
     * @tags api:User Controller
     * @name LoginCreate
     * @summary Login as an user
     * @request POST:/login
     */
    loginCreate: (body: LoginCreatePayload, params: RequestParams = {}) =>
      this.request<LoginResult, ErrorResponse>({
        path: `/login`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @tags api:User Controller
     * @name LogoutCreate
     * @summary Logout as an user
     * @request POST:/logout
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/logout`,
        method: "POST",
        ...params,
      }),
  };
  me = {
    /**
     * No description
     *
     * @tags api:User Controller
     * @name GetMe
     * @summary get user info
     * @request GET:/me
     */
    getMe: (params: RequestParams = {}) =>
      this.request<
        {
          username: string;
        },
        ErrorResponse
      >({
        path: `/me`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  post = {
    /**
     * No description
     *
     * @tags api:Post Controller
     * @name PostDetail
     * @summary Get post
     * @request GET:/post/{id}
     */
    postDetail: (id?: any, params: RequestParams = {}) =>
      this.request<Post, ErrorResponse>({
        path: `/post/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api:Post Controller
     * @name PostDelete
     * @summary Delete post
     * @request DELETE:/post/{id}
     */
    postDelete: (id?: any, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/post/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api:Post Controller
     * @name PostPartialUpdate
     * @summary Modify post
     * @request PATCH:/post/{id}
     */
    postPartialUpdate: (body: PatchPostRequest, id?: any, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/post/${id}`,
        method: "PATCH",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post Controller
     * @name PostCreate
     * @summary Create a post
     * @request POST:/post
     */
    postCreate: (body: AddPostRequest, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/post`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post Controller
     * @name PostList
     * @summary Get posts
     * @request GET:/post
     */
    postList: (
      query?: {
        /** Page number */
        current?: any;
        /** Page size */
        pageSize?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: PostSimpleArray;
          page: PageObject;
        },
        ErrorResponse
      >({
        path: `/post`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
