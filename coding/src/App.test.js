import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Hero from './components/Hero.js'

describe('Homepage header test', () => {
  it('renders Homepage header', () => {
      render(<Hero />);
      const b = screen.getByTestId("signup-btn");
      const msg = 'Sign Up Today!'
      expect(b).toBeInTheDocument();
      expect(b.innerHTML).toMatch(msg);
  })
})