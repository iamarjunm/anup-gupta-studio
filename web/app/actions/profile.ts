'use server';

import { writeClient } from '@/lib/sanity';

export async function updateUserProfile({
  firebaseUid,
  name,
  phoneNumber,
  email,
}: {
  firebaseUid: string;
  name: string;
  phoneNumber: string;
  email: string | null;
}) {
  try {
    // Find the user document in Sanity by their Firebase UID
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && firebaseUid == $firebaseUid][0]`,
      { firebaseUid }
    );

    if (!existingUser) {
      // If for some reason they exist in Firebase but not Sanity, auto-create them now
      await writeClient.create({
        _type: 'user',
        firebaseUid,
        email: email || '',
        name: name,
        phoneNumber: phoneNumber,
        createdAt: new Date().toISOString(),
      });
      return { success: true, message: 'Profile updated successfully.' };
    }

    // Patch the document
    await writeClient
      .patch(existingUser._id)
      .set({
        name,
        phoneNumber,
      })
      .commit();

    return { success: true, message: 'Profile updated successfully.' };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, message: error.message || 'Failed to update profile.' };
  }
}
