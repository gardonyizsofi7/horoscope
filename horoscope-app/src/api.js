import axios from 'axios';
import * as cheerio from 'cheerio-without-node-native';

const baseUrl = 'https://zsozirisz.hu/horoszkopok/napi-heti-havi';

const cleanText = (text) => {
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const fetchHoroscope = async (signId, timeframe) => {
  try {
    const pageUrl = `${baseUrl}/${signId}horoszkop.html`;
    const response = await axios.get(pageUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    // ================= HAVI HOROSZKÓP =================
    if (timeframe === 'monthly') {
      let monthlyText = '';
      
      $('p.horoszkop').each((i, el) => {
          const text = $(el).text().trim();
          if (text.length > 100 && !text.includes('function')) {
              monthlyText += text + '\n\n';
          }
      });

      if (!monthlyText) {
          $('p').each((i, el) => {
              const text = $(el).text().trim();
              if (text.length > 150 && !text.includes('function') && !text.includes('document.write')) {
                  monthlyText = text;
                  return false; 
              }
          });
      }

      return monthlyText ? cleanText(monthlyText) : "Jelenleg nem érhető el a havi horoszkóp.";
    }

    // ================= NAPI ÉS HETI HOROSZKÓP =================
    let targetScriptSrc = null;
    $('script').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        const lowerSrc = src.toLowerCase();
        if (timeframe === 'daily' && lowerSrc.includes('napi') && lowerSrc.includes(signId)) {
          targetScriptSrc = src;
          return false; 
        } else if (timeframe === 'weekly' && lowerSrc.includes('heti') && lowerSrc.includes(signId)) {
          targetScriptSrc = src;
          return false; 
        }
      }
    });

    if (targetScriptSrc) {
      let finalScriptUrl = targetScriptSrc;
      if (targetScriptSrc.startsWith('/')) {
          finalScriptUrl = `https://zsozirisz.hu${targetScriptSrc}`;
      } else if (!targetScriptSrc.startsWith('http')) {
          finalScriptUrl = `${baseUrl}/${targetScriptSrc}`;
      }
      
      const scriptResponse = await axios.get(finalScriptUrl);
      const scriptContent = scriptResponse.data;

      // Mivel a napi és a heti adatfájl szerkezete tökéletesen megegyezik,
      // összevontuk a keresést. Mindkettőnél az adott hónapot és napot keressük.
      if (timeframe === 'daily' || timeframe === 'weekly') {
        const month = new Date().getMonth() + 1; // Aktuális hónap (1-12)
        
        let startIndex = scriptContent.indexOf(`if (ho==${month})`);
        if (startIndex === -1) startIndex = scriptContent.indexOf(`if(ho==${month})`);
        
        let monthBlock = scriptContent; 
        if (startIndex !== -1) {
            let endIndex = scriptContent.indexOf('if (ho=', startIndex + 10);
            if (endIndex === -1) endIndex = scriptContent.indexOf('if(ho=', startIndex + 10);
            if (endIndex === -1) endIndex = scriptContent.length; 
            
            monthBlock = scriptContent.substring(startIndex, endIndex);
        }

        const matches = [...monthBlock.matchAll(/"([\s\S]*?)"/g)];
        const entries = matches.map(m => cleanText(m[1])).filter(t => t.length > 30);

        const day = new Date().getDate(); // Aktuális nap
        
        if (entries.length >= day) {
          return entries[day - 1]; 
        } else if (entries.length > 0) {
           return entries[entries.length - 1];
        }
      }
    } else {
        // Végső B-Terv a HTML-ből, ha a script hivatkozás nem létezne
        let foundText = '';
        const keyword = timeframe === 'daily' ? 'napi' : 'heti';
        
        $('h1, h2, h3, h4, b, strong').each((i, el) => {
            const headerText = $(el).text().toLowerCase();
            if (headerText.includes(keyword) && headerText.includes(signId)) {
                let nextP = $(el).nextAll('p').first().text();
                if (nextP && nextP.length > 50) {
                    foundText = nextP;
                    return false; 
                }
            }
        });

        if (foundText) return cleanText(foundText);
    }

    return `Sajnos nem sikerült betölteni a ${timeframe === 'daily' ? 'napi' : 'heti'} horoszkópot.`;

  } catch (error) {
    console.error(`Hiba a horoszkóp betöltésekor:`, error);
    return "Hiba történt a horoszkóp betöltésekor. Kérjük, ellenőrizd az internetkapcsolatot.";
  }
};