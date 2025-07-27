import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import NewsletterSignup from '../components/NewsletterSignup';

// Mock the analytics hook
vi.mock('../utils/analytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn()
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ContactForm Component', () => {
  it('renders contact form with all required fields', () => {
    renderWithRouter(<ContactForm variant="full" />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderWithRouter(<ContactForm variant="full" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderWithRouter(<ContactForm variant="full" />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it('shows success message on successful submission', async () => {
    renderWithRouter(<ContactForm variant="full" />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message content' } });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('NewsletterSignup Component', () => {
  it('renders newsletter signup with email field', () => {
    renderWithRouter(<NewsletterSignup variant="inline" />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('renders with name field when showName is true', () => {
    renderWithRouter(<NewsletterSignup variant="inline" showName={true} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('validates email format in newsletter signup', async () => {
    renderWithRouter(<NewsletterSignup variant="inline" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(subscribeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('shows success message on successful subscription', async () => {
    renderWithRouter(<NewsletterSignup variant="inline" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(subscribeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders different variants correctly', () => {
    const { rerender } = renderWithRouter(<NewsletterSignup variant="inline" />);
    expect(screen.getByRole('form')).toHaveClass('newsletter-signup--inline');
    
    rerender(
      <BrowserRouter>
        <NewsletterSignup variant="modal" />
      </BrowserRouter>
    );
    expect(screen.getByRole('form')).toHaveClass('newsletter-signup--modal');
    
    rerender(
      <BrowserRouter>
        <NewsletterSignup variant="sidebar" />
      </BrowserRouter>
    );
    expect(screen.getByRole('form')).toHaveClass('newsletter-signup--sidebar');
  });
});
