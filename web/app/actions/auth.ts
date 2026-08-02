'use server';

import { writeClient, client } from '@/lib/sanity';

export async function getSanityUser(uid: string) {
  try {
    const user = await client.fetch(`*[_type == "user" && firebaseUid == $uid][0]`, { uid });
    return user;
  } catch (error) {
    console.error('Error fetching Sanity user:', error);
    return null;
  }
}

export async function syncUserWithSanity({
  uid,
  email,
  name,
  image,
  authProvider,
}: {
  uid: string;
  email: string | null;
  name: string | null;
  image?: string;
  authProvider?: string;
}) {
  try {
    // First, check if the user already exists to avoid duplicates
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && firebaseUid == $uid][0]`,
      { uid }
    );

    if (existingUser) {
      return { success: true, message: 'User already synced.', user: existingUser };
    }

    // Create the new user document
    const newUser = await writeClient.create({
      _type: 'user',
      firebaseUid: uid,
      email: email || '',
      name: name || '',
      image: image || undefined,
      authProvider: authProvider || 'email',
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: 'User synced successfully.', user: newUser };
  } catch (error: any) {
    console.error('Error syncing user to Sanity:', error);
    return { success: false, message: error.message };
  }
}
