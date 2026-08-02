'use server';

import { writeClient } from '@/lib/sanity';

export async function updateUserProfile({
  firebaseUid,
  name,
  phoneNumber,
  email,
  address,
}: {
  firebaseUid: string;
  name: string;
  phoneNumber: string;
  email: string | null;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
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
        addresses: address ? [{
          _key: 'default',
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country
        }] : [],
        createdAt: new Date().toISOString(),
      });
      return { success: true, message: 'Profile updated successfully.' };
    }

    // Patch the document
    const patchData: any = {
      name,
      phoneNumber,
    };

    if (address) {
       patchData.addresses = [{
         _key: 'default',
         street: address.street,
         city: address.city,
         state: address.state,
         postalCode: address.postalCode,
         country: address.country
       }];
    }

    await writeClient
      .patch(existingUser._id)
      .set(patchData)
      .commit();

    return { success: true, message: 'Profile updated successfully.' };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, message: error.message || 'Failed to update profile.' };
  }
}

export async function updateUserAddresses(firebaseUid: string, addresses: any[]) {
  try {
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && firebaseUid == $firebaseUid][0]`,
      { firebaseUid }
    );

    if (!existingUser) {
      return { success: false, message: 'User not found.' };
    }

    await writeClient
      .patch(existingUser._id)
      .set({ addresses })
      .commit();

    return { success: true, message: 'Addresses updated successfully.' };
  } catch (error: any) {
    console.error('Error updating addresses:', error);
    return { success: false, message: error.message || 'Failed to update addresses.' };
  }
}
