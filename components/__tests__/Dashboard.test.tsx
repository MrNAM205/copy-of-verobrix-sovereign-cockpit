import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  it('renders the dashboard title', () => {
    render(<Dashboard />);
    const titleElement = screen.getByText(/Sovereign Cockpit/i);
    expect(titleElement).toBeInTheDocument();
  });
});
