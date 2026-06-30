import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoginForm } from './LoginForm';

// Mock next/router
const mockPush = vi.fn();
vi.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: mockPush,
  }),
}));

// Mock remote module components
vi.mock('shared_remote/Button', () => ({
  Button: ({ children, loading, ...props }: any) => (
    <button disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

vi.mock('shared_remote/Input', () => ({
  Input: ({ label, value, onChange, placeholder, type = 'text', required }: any) => (
    <div>
      <label data-testid={`label-${label}`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        data-testid={`input-${label}`}
      />
    </div>
  ),
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
    sessionStorage.clear();
  });

  it('should render username and password fields with submit button', async () => {
    render(<LoginForm />);
    expect(await screen.findByTestId('label-Username')).toBeInTheDocument();
    expect(await screen.findByTestId('label-Password')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /lanjutkan/i })).toBeInTheDocument();
  });

  it('should successfully submit form and redirect to /otp on correct credentials', async () => {
    render(<LoginForm />);
    expect(await screen.findByTestId('label-Username')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /lanjutkan/i });

    // Enable fake timers after component is mounted and resolved
    vi.useFakeTimers();

    // Submit form
    fireEvent.click(submitButton);

    // Fast-forward timers for sessionStorage write and router push
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    const tempUser = JSON.parse(sessionStorage.getItem('neocentra_temp_user') || '{}');
    expect(tempUser.username).toBe('admin');
    expect(mockPush).toHaveBeenCalledWith('/otp');

    vi.useRealTimers();
  });

  it('should show error message on wrong credentials', async () => {
    render(<LoginForm />);
    expect(await screen.findByTestId('label-Username')).toBeInTheDocument();

    const usernameInput = screen.getByTestId('input-Username');
    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByRole('button', { name: /lanjutkan/i });

    // Change inputs to invalid values
    fireEvent.change(usernameInput, { target: { value: 'wrong_user' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong_pass' } });

    // Enable fake timers
    vi.useFakeTimers();

    // Submit form
    fireEvent.click(submitButton);

    // Fast-forward timers
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
