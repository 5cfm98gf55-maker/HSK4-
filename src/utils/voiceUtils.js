// voiceUtils.js - Chuẩn hóa giọng đọc Tiếng Trung (Standard Mandarin Speech Synthesis)

export function getMandarinVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { female: null, male: null, allChinese: [] };
  }

  const voices = window.speechSynthesis.getVoices();
  const chineseVoices = voices.filter(v => 
    v.lang.includes('zh') || v.lang.includes('ZH') || v.name.includes('Chinese') || v.name.includes('Mandarin')
  );

  // Tìm giọng nữ chuẩn
  const femaleVoice = chineseVoices.find(v => 
    v.name.includes('Xiaoxiao') || v.name.includes('Tingting') || v.name.includes('HsiaoChen') || v.name.includes('Yaoyao') || v.name.includes('Female')
  ) || chineseVoices[0] || null;

  // Tìm giọng nam chuẩn
  const maleVoice = chineseVoices.find(v => 
    v.name.includes('Yunxi') || v.name.includes('Kangkang') || v.name.includes('Yunyang') || v.name.includes('Male')
  ) || chineseVoices[1] || femaleVoice || null;

  return {
    female: femaleVoice,
    male: maleVoice,
    allChinese: chineseVoices
  };
}

// Hàm phát âm tiếng Trung chuẩn
export function speakMandarin(text, options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Browser does not support SpeechSynthesis');
    return;
  }

  const {
    rate = 0.9,      // Tốc độ đọc chuẩn cho người học (0.8 ~ 1.0)
    pitch = 1.0,     // Cao độ
    gender = 'female', // 'female' hoặc 'male'
    onEnd = null,
    onError = null
  } = options;

  // Dừng âm thanh cũ nếu đang đọc
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = rate;
  utterance.pitch = pitch;

  const voicesObj = getMandarinVoices();
  const selectedVoice = gender === 'male' ? voicesObj.male : voicesObj.female;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
}

export function stopMandarinSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
