// Audio Chime & SpeechSynthesis Engine for CafeFlow

let audioCtx = null;

// Initialize or get Web Audio Context
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Play pleasant cafe chime (dual tone chord)
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.85);
  } catch (e) {
    console.warn('Web Audio chime failed:', e);
  }
}

// Convert number to word string for quantities
function quantityToWords(qty) {
  const map = {
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine',
    10: 'Ten'
  };
  return map[qty] || `${qty}`;
}

// Format items for spoken voice: "Two Burgers and One Pizza"
export function formatOrderItemsForVoice(items = []) {
  if (!items || items.length === 0) return 'an empty order';
  
  const formattedItems = items.map(item => {
    const qtyWord = quantityToWords(item.quantity);
    // Pluralize slightly if quantity > 1 and doesn't end with s
    let name = item.name.replace(/\(.*?\)/g, '').trim(); // Remove brackets
    if (item.quantity > 1 && !name.endsWith('s') && !name.endsWith('Fries') && !name.endsWith('Tea') && !name.endsWith('Coffee')) {
      name = `${name}s`;
    }
    return `${qtyWord} ${name}`;
  });

  if (formattedItems.length === 1) {
    return formattedItems[0];
  }
  if (formattedItems.length === 2) {
    return `${formattedItems[0]} and ${formattedItems[1]}`;
  }
  return `${formattedItems.slice(0, -1).join(', ')}, and ${formattedItems[formattedItems.length - 1]}`;
}

// Voice announcement using SpeechSynthesis API
export function speakAnnouncement(text, options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API not supported');
    return;
  }

  try {
    // Play sound chime first
    playChimeSound();

    // Cancel any stuck speech
    window.speechSynthesis.cancel();

    // Small delay so chime completes its attack
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.95; // Slightly measured, clear cadence
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;
      utterance.lang = 'en-US';

      // Pick an English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Siri')))) ||
                           voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    }, 400);
  } catch (err) {
    console.error('SpeechSynthesis error:', err);
  }
}

// Dedicated helper to announce a new order
export function announceNewOrder(order, options = {}) {
  const tableNum = order.tableNumber || (order.tableName ? order.tableName.replace('Table ', '') : 'Unknown');
  const itemsText = formatOrderItemsForVoice(order.items);
  const speechText = `New Order Received. Table Number ${tableNum}. ${itemsText}.`;
  
  speakAnnouncement(speechText, options);
  return speechText;
}

// Voice test announcement
export function testVoiceAnnouncement(options = {}) {
  const testText = "Sairam Chahawala voice announcement system active. Ready for live customer orders.";
  speakAnnouncement(testText, options);
  return testText;
}
