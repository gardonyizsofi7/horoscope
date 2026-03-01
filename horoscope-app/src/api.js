// Mapping Hungarian zodiac sign ids to English ones expected by the API
const signMap = {
  'kos': 'aries',
  'bika': 'taurus',
  'ikrek': 'gemini',
  'rak': 'cancer',
  'oroszlan': 'leo',
  'szuz': 'virgo',
  'merleg': 'libra',
  'skorpio': 'scorpio',
  'nyilas': 'sagittarius',
  'bak': 'capricorn',
  'vizonto': 'aquarius',
  'halak': 'pisces'
};

const translateText = async (text) => {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hu&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const json = await res.json();

        let translatedText = '';
        if (json && json[0]) {
            json[0].forEach(part => {
                if (part[0]) translatedText += part[0];
            });
        }
        return translatedText || text;
    } catch(e) {
        console.error('Error translating text:', e.message);
        return text;
    }
};

const fetchEnglishHoroscope = async (signId, timeframe) => {
    try {
        const engSign = signMap[signId];
        if (!engSign) return null;

        let url = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/${timeframe}?sign=${engSign}`;
        if (timeframe === 'daily') {
            url += '&day=today';
        }

        const res = await fetch(url);
        const json = await res.json();

        if (json && json.data && json.data.horoscope_data) {
             return json.data.horoscope_data;
        } else if (json && json.horoscope) {
             return json.horoscope;
        }
        return null;
    } catch (e) {
        console.error('Error fetching english horoscope:', e.message);
        return null;
    }
};

export const fetchDailyHoroscope = async (signId) => {
    const text = await fetchEnglishHoroscope(signId, 'daily');
    if (text) {
        return await translateText(text);
    }
    return "Nem sikerült betölteni a napi horoszkópot.";
};

export const fetchWeeklyHoroscope = async (signId) => {
    const text = await fetchEnglishHoroscope(signId, 'weekly');
    if (text) {
        return await translateText(text);
    }
    return "Nem sikerült betölteni a heti horoszkópot.";
};

export const fetchMonthlyHoroscope = async (signId) => {
    const text = await fetchEnglishHoroscope(signId, 'monthly');
    if (text) {
        return await translateText(text);
    }
    return "Nem sikerült betölteni a havi horoszkópot.";
};

export const fetchHoroscope = async (signId, timeframe) => {
  switch (timeframe) {
    case 'daily':
      return await fetchDailyHoroscope(signId);
    case 'weekly':
      return await fetchWeeklyHoroscope(signId);
    case 'monthly':
      return await fetchMonthlyHoroscope(signId);
    default:
      return '';
  }
};