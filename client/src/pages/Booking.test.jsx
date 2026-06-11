import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Booking from './Booking';
import API from '../services/api';

const navigateMock = vi.hoisted(() => vi.fn());
const paramsMock = vi.hoisted(() => vi.fn());
const apiGetMock = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => paramsMock(),
  };
});

vi.mock('../services/api', () => ({
  default: {
    get: apiGetMock,
    post: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  paramsMock.mockReturnValue({ id: 'room-123' });
  apiGetMock.mockImplementation((url) => {
    if (url === '/rooms/room-123') {
      return Promise.resolve({
        data: {
          name: 'Deluxe Suite',
          type: 'Suite',
          price: 5000,
          maxGuests: 2,
        },
      });
    }

    if (url === '/verify/verified-contacts') {
      return Promise.resolve({
        data: {
          verifiedEmail: 'guest@example.com',
        },
      });
    }

    return Promise.reject(new Error(`Unexpected GET ${url}`));
  });
});

describe('Booking page', () => {
  it('blocks guest counts above the room limit', async () => {
    window.alert = vi.fn();

    render(<Booking />);

    await screen.findByText('Deluxe Suite');

    fireEvent.change(screen.getByLabelText(/check-in date/i), {
      target: { value: '2026-06-15' },
    });
    fireEvent.change(screen.getByLabelText(/check-out date/i), {
      target: { value: '2026-06-17' },
    });
    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: '3' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /continue to guest details/i })
    );

    expect(window.alert).toHaveBeenCalledWith(
      'This room accommodates a maximum of 2 guests'
    );
    expect(
      screen.getByRole('button', { name: /continue to guest details/i })
    ).toBeEnabled();
  });

  it('autofills the guest email on step 2', async () => {
    render(<Booking />);

    await screen.findByText('Deluxe Suite');

    fireEvent.change(screen.getByLabelText(/check-in date/i), {
      target: { value: '2026-06-15' },
    });
    fireEvent.change(screen.getByLabelText(/check-out date/i), {
      target: { value: '2026-06-17' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /continue to guest details/i })
    );

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/verify/verified-contacts');
    });

    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      'guest@example.com'
    );
  });
});
