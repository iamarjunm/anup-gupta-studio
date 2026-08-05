'use server';

import { client, writeClient } from '@/lib/sanity';

export async function fetchDocuments(type: string) {
  try {
    const docs = await client.fetch(`*[_type == $type] | order(_createdAt desc)`, { type });
    return { success: true, data: docs };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createDocument(type: string, data: any) {
  try {
    const doc = {
      _type: type,
      ...data,
    };
    const res = await writeClient.create(doc);
    return { success: true, data: res };
  } catch (error: any) {
    console.error('Error creating document:', error);
    return { success: false, message: error.message };
  }
}

export async function updateDocument(id: string, data: any) {
  try {
    const res = await writeClient.patch(id).set(data).commit();
    return { success: true, data: res };
  } catch (error: any) {
    console.error('Error updating document:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteDocument(id: string) {
  try {
    await writeClient.delete(id);
    return { success: true };
  } catch (error: any) {
    let message = error.message || 'Failed to delete document';
    
    // Check if it's a reference constraint error from Sanity
    if (message.toLowerCase().includes('referenced by document')) {
      message = 'Cannot delete because this item is currently being used by another document (like an Order, Collection, or Category). Please remove those connections first.';
    }

    return { success: false, message };
  }
}

export async function uploadImageToSanity(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: file.name,
    });
    
    return { 
      success: true, 
      asset: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      } 
    };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { success: false, message: error.message };
  }
}

export async function fetchReferences(type: string) {
  try {
    const docs = await client.fetch(`*[_type == $type]{ _id, title, name }`, { type });
    return { success: true, data: docs };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
