import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Navbar from './components/navbar/Navbar.js'

describe('Navbar header test', () => {
  it('renders Navbar header', () => {
      render(<Navbar />);
      const h1Element = screen.getByTestId("navbar-header");
      const msg = 'Code-Breaker'
      expect(h1Element).toBeInTheDocument();
      expect(h1Element.innerHTML).toMatch(msg);
  })
})
