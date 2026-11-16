// Real-time Cloud Synchronization Bridge for The 7 Cafe
// Enables instant mobile-to-laptop order transmission across different devices and networks

const DEFAULT_SYNC_CHANNEL = 'the_7_cafe_kot_prod';

// Helper to get or create unique cafe sync channel ID
export function getSyncChannel(settings) {
  if (settings && settings.cloudSyncChannel) {
    return settings.cloudSyncChannel.trim();
  }
  return DEFAULT_SYNC_CHANNEL;
}

// 1. Publish order to Cloud Relay (called when customer submits order on mobile)
export async function publishOrderToCloud(order, channelName = DEFAULT_SYNC_CHANNEL) {
  try {
    const payload = {
      type: 'NEW_ORDER',
      order,
      timestamp: Date.now()
    };

    // Broadcast via global public lightweight real-time stream
    const res = await fetch(`https://ntfy.sh/${channelName}`, {
      method: 'POST',
      headers: {
        'Title': `New KOT Table ${order.tableNumber || ''}`,
        'Priority': 'urgent',
        'Tags': 'coffee,bell'
      },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.warn('Cloud relay publish notice:', err);
    return false;
  }
}

// 2. Publish order status change (e.g. Preparing -> Ready -> Served)
export async function publishStatusChangeToCloud(orderId, newStatus, tableId, channelName = DEFAULT_SYNC_CHANNEL) {
  try {
    const payload = {
      type: 'STATUS_CHANGED',
      orderId,
      newStatus,
      tableId,
      timestamp: Date.now()
    };

    await fetch(`https://ntfy.sh/${channelName}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Cloud relay status notice:', err);
  }
}

// 3. Subscribe to incoming cloud events on Laptop (Kitchen Screen / Admin Dashboard)
export function subscribeToCloudEvents(channelName = DEFAULT_SYNC_CHANNEL, onMessageCallback) {
  if (typeof window === 'undefined' || !('EventSource' in window)) {
    return () => {};
  }

  let eventSource = null;
  let isSubscribed = true;

  try {
    // Standard Server-Sent Events stream supported natively by all browsers
    eventSource = new EventSource(`https://ntfy.sh/${channelName}/sse`);

    eventSource.onmessage = (event) => {
      if (!isSubscribed) return;
      try {
        const raw = JSON.parse(event.data);
        if (raw && raw.message) {
          const parsed = JSON.parse(raw.message);
          if (parsed && parsed.type) {
            onMessageCallback(parsed);
          }
        }
      } catch (e) {
        // Ignore non-json pings
      }
    };

    eventSource.onerror = () => {
      // Reconnect automatically handled by EventSource
    };
  } catch (err) {
    console.warn('EventSource initialization notice:', err);
  }

  return () => {
    isSubscribed = false;
    if (eventSource) {
      eventSource.close();
    }
  };
}
