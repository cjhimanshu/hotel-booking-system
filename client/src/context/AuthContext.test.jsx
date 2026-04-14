import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, AuthProvider } from './AuthContext';
import API from '../services/api';

const apiPost = vi.hoisted(() => vi.fn());
const jwtDecodeMock = vi.hoisted(() => vi.fn());

vi.mock('../services/api', () => ({
  default: {
    post: apiPost,
  },
}));

vi.mock('jwt-decode', () => ({
  jwtDecode: jwtDecodeMock,
}));

function AuthHarness() {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <div>
      <p data-testid="user-name">{user ? user.name : 'guest'}</p>
      <button
        type="button"
        onClick={() =>
          login({ email: 'guest@example.com', password: 'secret' })
        }
      >
        Login
      </button>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  apiPost.mockReset();
  jwtDecodeMock.mockReset();
});

describe('AuthProvider', () => {
  it('hydrates from storage, logs in, and logs out', async () => {
    localStorage.setItem('token', 'stored-token');
    jwtDecodeMock.mockReturnValueOnce({ name: 'Stored User' });
    apiPost.mockResolvedValueOnce({ data: { token: 'fresh-token' } });
    jwtDecodeMock.mockReturnValueOnce({ name: 'Logged In User' });

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-name')).toHaveTextContent('Stored User');

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/auth/login', {
        email: 'guest@example.com',
        password: 'secret',
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent(
        'Logged In User'
      );
    });

    expect(localStorage.getItem('token')).toBe('fresh-token');

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('guest');
    });

    expect(localStorage.getItem('token')).toBeNull();
  });
});
