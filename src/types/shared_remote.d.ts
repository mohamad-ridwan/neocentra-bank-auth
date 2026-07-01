declare module "shared_remote/store" {
  export const store: any;
  export const logout: any;
  export const toggleTheme: any;
  export const loginSuccess: any;
  export type RootState = any;
  export type AppDispatch = any;
}

declare module "shared_remote/Button" {
  import React from "react";
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
  }
  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
}

declare module "shared_remote/Input" {
  import React from "react";
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
  }
  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;
}

declare module "shared_remote/apiHelper" {
  import { QueryClient } from "@tanstack/react-query";
  export const queryClient: QueryClient;
  export function apiFetch<T>(path: string, options?: RequestInit): Promise<T>;
}

declare module "shared_remote/AuthWrapper" {
  import React from "react";
  export interface AuthWrapperProps {
    children: React.ReactNode;
  }
  export const AuthWrapper: React.ComponentType<AuthWrapperProps>;
  export default AuthWrapper;
}

declare module "shared_remote/federatedStats" {
  import type { NextApiHandler } from "next";
  const handler: NextApiHandler;
  export default handler;
}

declare module "shared_remote/Tooltip" {
  import React from "react";
  export const Tooltip: React.ComponentType<any>;
  export const TooltipTrigger: React.ComponentType<any>;
  export const TooltipContent: React.ComponentType<any>;
  export const TooltipProvider: React.ComponentType<any>;
}

declare module "shared_remote/useRemoteCSS" {
  export function useRemoteCSS(
    remoteBaseUrl: string,
    remoteName: string,
    exposedModule: string,
  ): { loaded: boolean; error: Error | null };
}

