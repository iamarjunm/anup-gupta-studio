'use server';

import { client, writeClient } from '@/lib/sanity';

export async function getAdminStats() {
  try {
    const orders = await client.fetch(`*[_type == "order"]{ total, status }`);
    const users = await client.fetch(`count(*[_type == "user"])`);
    const products = await client.fetch(`count(*[_type == "product"])`);

    let totalRevenue = 0;
    let activeOrders = 0;

    orders.forEach((order: any) => {
      totalRevenue += order.total || 0;
      if (order.status !== 'delivered' && order.status !== 'cancelled') {
        activeOrders++;
      }
    });

    return {
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        activeOrders,
        totalUsers: users,
        totalProducts: products,
      },
    };
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return { success: false, message: error.message };
  }
}

export async function getAdminRecentOrders() {
  try {
    const orders = await client.fetch(
      `*[_type == "order"] | order(createdAt desc)[0...5] {
        _id,
        orderNumber,
        customerName,
        customerEmail,
        total,
        status,
        createdAt
      }`
    );
    return { success: true, orders };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAdminOrders() {
  try {
    const orders = await client.fetch(
      `*[_type == "order"] | order(createdAt desc) {
        _id,
        orderNumber,
        customerName,
        customerEmail,
        total,
        status,
        createdAt,
        items
      }`
    );
    return { success: true, orders };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const updatedOrder = await writeClient
      .patch(orderId)
      .set({ status: newStatus })
      .commit();
    return { success: true, order: updatedOrder };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAdminUsers() {
  try {
    const users = await client.fetch(
      `*[_type == "user"] | order(createdAt desc) {
        _id,
        name,
        email,
        isAdmin,
        authProvider,
        createdAt
      }`
    );
    return { success: true, users };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateUserRole(userId: string, isAdmin: boolean) {
  try {
    const updatedUser = await writeClient
      .patch(userId)
      .set({ isAdmin })
      .commit();
    return { success: true, user: updatedUser };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getExportData() {
  try {
    const [orders, users, products, subscribers] = await Promise.all([
      client.fetch(`*[_type == "order"]`),
      client.fetch(`*[_type == "user"]`),
      client.fetch(`*[_type == "product"]`),
      client.fetch(`*[_type == "newsletterSubscriber"]`),
    ]);

    return {
      success: true,
      data: {
        orders,
        users,
        products,
        subscribers,
      },
    };
  } catch (error: any) {
    console.error('Error fetching export data:', error);
    return { success: false, message: error.message };
  }
}
