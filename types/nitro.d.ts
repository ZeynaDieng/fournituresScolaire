// types/nitro.d.ts
// Déclarations globales pour les auto-imports Nitro

declare global {
  function defineEventHandler<T = any>(handler: (event: any) => T): any;
  function useRuntimeConfig(): any;
  function readBody<T = any>(event: any): Promise<T>;
  function getQuery(event: any): any;
  function getCookie(event: any, name: string): string | undefined;
  function setCookie(
    event: any,
    name: string,
    value: string,
    options?: any
  ): void;
  function setHeader(event: any, name: string, value: string): void;
  function setResponseStatus(event: any, status: number): void;
  function createError(options: {
    statusCode: number;
    statusMessage?: string;
    data?: any;
  }): Error;
}

export {};
