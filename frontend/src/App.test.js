import { render, screen } from '@testing-library/react';
import App from './App';

test('renders splyt test title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Splyt Test/i);
  expect(linkElement).toBeInTheDocument();
});
