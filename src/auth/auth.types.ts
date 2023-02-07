import { Request } from 'express';

export interface IExtendedRequest {
  user: string;
}
export type ExpressRequestType = Request;

export type ExtendedRequestType = IExtendedRequest & ExpressRequestType;
