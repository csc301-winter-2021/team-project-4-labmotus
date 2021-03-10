import { render } from '@testing-library/react';
import LoginPage from './pages/LoginPage';

test('renders login page without crashing', () => {
  const { baseElement } = render(<LoginPage />);
  expect(baseElement).toBeDefined();
});
