import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import HomeContent from './HomeContent';

test('renders the welcome message', () => {
    render(<HomeContent />);
    const welcomeMessage = screen.getByText('Welcome to ONIBAD!');
    expect(welcomeMessage.parentNode).not.toBeNull(); 
  });
  