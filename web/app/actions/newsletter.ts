'use server';

import { writeClient } from '@/lib/sanity';

export async function submitNewsletter(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Email is required' };
  }

  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    await writeClient.create({
      _type: 'newsletterSubscriber',
      email,
      subscribedAt: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to submit newsletter:', error);
    return { success: false, error: 'Failed to subscribe. Please try again later.' };
  }
}
