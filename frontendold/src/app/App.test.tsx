import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const element = screen.getByText(/welcome to our app/i);
  expect(element).toBeInTheDocument();
});
