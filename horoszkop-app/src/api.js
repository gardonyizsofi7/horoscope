import axios from 'axios';
import * as cheerio from 'cheerio-without-node-native';

const baseUrl = 'https://zsozirisz.hu/horoszkopok/napi-heti-havi';

// Helper to remove HTML tags and HTML entities
const cleanText = (text) => {
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

export const fetchDailyHoroscope = async (signId) => {
  try {
    const year = new Date().getFullYear();
    const url = `${baseUrl}/${signId}/${signId}napi${year}.js`;
    const response = await axios.get(url);
    const scriptContent = response.data;

    // The daily JS file contains a initArray and a switch/array of strings for days.
    // We can evaluate or parse it. Let's try to extract the array of strings for days.
    // It looks like: function napok() { var napok = new initArray("...","...","..."); ... return napok[nap] }
    // Or it has a massive array of strings.
    // Since the format is roughly: " text ", " text ",
    // The current day is used to index it.

    // Actually, it returns an array of 31 strings for the month.
    // Let's use a regex to extract all string literals that look like horoscope entries.
    const matches = [...scriptContent.matchAll(/"\s*(.*?)\s*"/g)];
    const entries = matches.map(m => m[1]).filter(s => s.length > 50); // Filter out short strings like month names

    const day = new Date().getDate();
    // Assuming the entries correspond to days of the month (1-31).
    // The array might have empty strings or other data, but usually the first 31 long strings are the days.
    // JS arrays might be 1-indexed in their initArray function (this[i+1] = ...).
    if (entries.length >= day) {
        return cleanText(entries[day - 1]); // Try 0-indexed day
    }

    return "Nem sikerült betölteni a napi horoszkópot.";
  } catch (error) {
    console.error('Error fetching daily horoscope:', error);
    return "Hiba történt a napi horoszkóp betöltésekor.";
  }
};

export const fetchWeeklyHoroscope = async (signId) => {
  try {
    const year = new Date().getFullYear();
    const url = `${baseUrl}/${signId}/${signId}heti${year}.js`;
    const response = await axios.get(url);
    const scriptContent = response.data;

    // The weekly JS file might be an array of strings per week or day.
    const matches = [...scriptContent.matchAll(/"\s*(.*?)\s*"/g)];
    const entries = matches.map(m => m[1]).filter(s => s.length > 50);

    // Often weekly is just one long string for the week, or an array where the current week's text is accessed.
    // For simplicity, we just take the first long text found in the weekly JS.
    if (entries.length > 0) {
        return cleanText(entries[0]);
    }

    return "Nem sikerült betölteni a heti horoszkópot.";
  } catch (error) {
    console.error('Error fetching weekly horoscope:', error);
    return "Hiba történt a heti horoszkóp betöltésekor.";
  }
};

export const fetchMonthlyHoroscope = async (signId) => {
  try {
    const url = `${baseUrl}/${signId}horoszkop.html`;
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // The monthly horoscope is in a <p class="horoszkop"> right after an <h1> with the month name
    // Looking at the HTML structure:
    // <h1>március</h1>
    // <p class= horoszkop> <!-- Bika Havi Horoszkóp innen  --> ... </p>

    // It's usually the first <p class="horoszkop"> after the month <h1>
    // We can just find the first <p class="horoszkop"> that contains substantial text

    let monthlyText = '';
    $('p.horoszkop').each((i, el) => {
        const text = $(el).text().trim();
        // Skip script tags or short texts
        if (text.length > 100 && !text.includes('function')) {
            monthlyText = text;
            return false; // break
        }
    });

    if (monthlyText) {
        return cleanText(monthlyText);
    }

    return "Nem sikerült betölteni a havi horoszkópot.";
  } catch (error) {
    console.error('Error fetching monthly horoscope:', error);
    return "Hiba történt a havi horoszkóp betöltésekor.";
  }
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
