import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginFormStandalone from "./LoginFormStandalone";

// Mock next/router
vi.mock("next/router", () => ({
  useRouter: () => ({
    query: {},
    push: vi.fn(),
  }),
}));

// Mock hook
const mockUseRemoteCSS = vi.fn();
vi.mock("../../hooks/useRemoteCSS", () => ({
  useRemoteCSS: (...args: any[]) => mockUseRemoteCSS(...args),
}));

// Mock LoginForm
vi.mock("./LoginForm", () => ({
  default: () => <div data-testid="login-form">LoginForm Mock</div>,
}));

describe("LoginFormStandalone Component", () => {
  it("should render loading when CSS is not loaded", () => {
    mockUseRemoteCSS.mockReturnValue({ loaded: false, error: null });
    render(<LoginFormStandalone />);
    expect(screen.getByText(/memuat komponen/i)).toBeInTheDocument();
  });

  it("should render error message when CSS load fails", () => {
    mockUseRemoteCSS.mockReturnValue({ loaded: false, error: new Error("Failed to fetch CSS") });
    render(<LoginFormStandalone />);
    expect(screen.getByText(/gagal memuat halaman/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch CSS/i)).toBeInTheDocument();
  });

  it("should render LoginForm when CSS loads successfully", () => {
    mockUseRemoteCSS.mockReturnValue({ loaded: true, error: null });
    render(<LoginFormStandalone />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
