'use server';

import { writeClient } from '@/lib/sanity';

export async function submitContactForm(formData: FormData) {
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!email || !message) {
    return { success: false, error: 'Email and message are required' };
  }

  try {
    await writeClient.create({
      _type: 'contactForm',
      email,
      message,
      status: 'unread',
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return { success: false, error: 'Failed to submit form. Please try again later.' };
  }
}
