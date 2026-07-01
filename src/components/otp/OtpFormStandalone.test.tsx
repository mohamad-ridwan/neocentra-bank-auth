import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OtpFormStandalone from "./OtpFormStandalone";

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

// Mock OtpForm
vi.mock("./OtpForm", () => ({
  default: () => <div data-testid="otp-form">OtpForm Mock</div>,
}));

describe("OtpFormStandalone Component", () => {
  it("should render loading when CSS is not loaded", () => {
    mockUseRemoteCSS.mockReturnValue({ loaded: false, error: null });
    render(<OtpFormStandalone />);
    expect(screen.getByText(/memuat komponen/i)).toBeInTheDocument();
  });

  it("should render error message when CSS load fails", () => {
    mockUseRemoteCSS.mockReturnValue({ loaded: false, error: new Error("Failed to fetch CSS") });
    render(<OtpFormStandalone />);
    expect(screen.getByText(/gagal memuat halaman/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch CSS/i)).toBeInTheDocument();
  });

  it("should render OtpForm when CSS loads successfully", () => {
    mockUseRemoteCSS.mockReturnValue({ loaded: true, error: null });
    render(<OtpFormStandalone />);
    expect(screen.getByTestId("otp-form")).toBeInTheDocument();
  });
});
