'use client';

import { useState } from 'react';
import { submitContactForm } from '@/app/actions/contact';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || 'Something went wrong');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 border-b border-gray-200 pb-4 mb-6">
        Send us a Message
      </h2>
      
      {success ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-md font-light text-sm">
          Thank you for reaching out. Your message has been received and we will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md font-light text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-gray-900">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-gray-400 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="block text-xs font-semibold tracking-widest uppercase text-gray-900">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-gray-400 transition-colors resize-none"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white font-medium text-sm tracking-widest uppercase py-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
