import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MyBookings from './MyBookings';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const navigateMock = vi.hoisted(() => vi.fn());
const apiGetMock = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../services/api', () => ({
  default: {
    get: apiGetMock,
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  apiGetMock.mockResolvedValue({ data: [] });
});

function renderWithAuth(ui) {
  return render(
    <AuthContext.Provider value={{ logout: vi.fn(), user: null }}>
      {ui}
    </AuthContext.Provider>
  );
}

describe('MyBookings', () => {
  it('loads bookings and shows the empty state', async () => {
    renderWithAuth(<MyBookings />);

    expect(screen.getByText(/loading your bookings/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/bookings/user');
    });

    expect(await screen.findByText(/no bookings yet/i)).toBeInTheDocument();
  });
});
