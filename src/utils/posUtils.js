// posUtils.js - Tiện ích chuẩn hóa loại từ và ghi chú ngữ pháp HSK4

export const POS_MAP = {
  '名': {
    code: '名',
    label: 'Danh từ',
    en: 'Noun',
    icon: '🏷️',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.4)',
    note: 'Chỉ người, sự vật, địa điểm, thời gian. Thường kết hợp với Lượng từ hoặc đứng sau Định ngữ (đứng trước chữ 的).'
  },
  '动': {
    code: '动',
    label: 'Động từ',
    en: 'Verb',
    icon: '⚡',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.4)',
    note: 'Chỉ hành động, trạng thái hoặc biến đổi. Có thể đi sau phó từ phủ định 不 (bù) hoặc 没 (méi), và có thể mang Tân ngữ.'
  },
  '形': {
    code: '形',
    label: 'Tính từ',
    en: 'Adjective',
    icon: '🎨',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)',
    note: 'Chỉ đặc điểm, hình dáng, tính chất của người/vật. Thường đi kèm với phó từ mức độ như 很 (rất), 非常 (cực kỳ), 太 (quá).'
  },
  '副': {
    code: '副',
    label: 'Phó từ',
    en: 'Adverb',
    icon: '🚀',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)',
    note: 'Bổ nghĩa cho động từ hoặc tính từ (chỉ thời gian, mức độ, phạm vi, tần suất). Luôn đứng TRƯỚC Động từ/Tính từ.'
  },
  '代': {
    code: '代',
    label: 'Đại từ',
    en: 'Pronoun',
    icon: '👤',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.4)',
    note: 'Dùng để xưng hô hoặc thay thế cho người, sự vật, hành động, số lượng (VD: 我, 你, 这个, 什么).'
  },
  '介': {
    code: '介',
    label: 'Giới từ',
    en: 'Preposition',
    icon: '📍',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.4)',
    note: 'Nối danh từ/đại từ tạo thành cụm giới từ chỉ địa điểm, đối tượng, phương hướng, thời gian (VD: 在, 向, 对, 跟).'
  },
  '连': {
    code: '连',
    label: 'Liên từ',
    en: 'Conjunction',
    icon: '🔗',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.4)',
    note: 'Nối các từ, cụm từ hoặc vế câu biểu thị quan hệ nguyên nhân - kết quả, chuyển ngoặt, điều kiện (VD: 因为...所以..., 虽然).'
  },
  '量': {
    code: '量',
    label: 'Lượng từ',
    en: 'Classifier',
    icon: '📊',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.4)',
    note: 'Đơn vị đo lường hoặc đếm người, vật, hành động (VD: 个, 本, 张, 条). Thường đứng giữa Số từ và Danh từ.'
  },
  '助': {
    code: '助',
    label: 'Trợ từ',
    en: 'Particle',
    icon: '🧩',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.15)',
    border: 'rgba(20, 184, 166, 0.4)',
    note: 'Từ phụ trợ biểu thị quan hệ ngữ pháp (Structural particles: 的, 地, 得) hoặc sắc thái ngữ khí ở cuối câu (了, 过, 着, 吧).'
  },
  '数': {
    code: '数',
    label: 'Số từ',
    en: 'Numeral',
    icon: '🔢',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.15)',
    border: 'rgba(100, 116, 139, 0.4)',
    note: 'Biểu thị số đếm, số thứ tự, phân số hoặc số ước lượng (VD: 一, 二, 百, 第一).'
  },
  '叹': {
    code: '叹',
    label: 'Thán từ',
    en: 'Interjection',
    icon: '💬',
    color: '#e11d48',
    bg: 'rgba(225, 29, 72, 0.15)',
    border: 'rgba(225, 29, 72, 0.4)',
    note: 'Bộc lộ cảm xúc vui, buồn, ngạc nhiên, gọi đáp (VD: 啊, 喂, 哎呀). Thường đứng đầu câu.'
  },
  '拟声': {
    code: '拟声',
    label: 'Từ tượng thanh',
    en: 'Onomatopoeia',
    icon: '🔊',
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.15)',
    border: 'rgba(234, 179, 8, 0.4)',
    note: 'Mô phỏng âm thanh tự nhiên, vật thể hoặc tiếng động (VD: 哈哈, 哔哔, 叮咚).'
  }
};

// Hàm lấy thông tin chi tiết loại từ từ chuỗi thô (VD: "(名)", "((动))", "形")
export function getPosInfo(rawPos) {
  if (!rawPos) {
    return {
      code: 'Từ vựng',
      label: 'Cụm từ',
      en: 'Phrase',
      icon: '📖',
      color: '#94a3b8',
      bg: 'rgba(148, 163, 184, 0.15)',
      border: 'rgba(148, 163, 184, 0.3)',
      note: 'Từ vựng / Cụm từ giao tiếp HSK4.'
    };
  }

  // Làm sạch các dấu ngoặc kép hoặc lặp: "((动))" -> "动"
  const cleanCode = rawPos.replace(/[\(\)（）\s]/g, '').trim();

  // Tìm trong POS_MAP
  const match = POS_MAP[cleanCode];

  if (match) {
    return match;
  }

  return {
    code: cleanCode || 'Từ',
    label: cleanCode || 'Loại từ',
    en: 'Word',
    icon: '📌',
    color: '#818cf8',
    bg: 'rgba(129, 140, 248, 0.15)',
    border: 'rgba(129, 140, 248, 0.3)',
    note: `Loại từ: ${cleanCode || 'Cụm từ tiếng Trung'}.`
  };
}
