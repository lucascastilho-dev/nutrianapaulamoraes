const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

const sheetURL = 'https://docs.google.com/spreadsheets/d/1wmDy44lNIKYjoqvTOUXdEKUJBXrW6qEAPN1NBv1FoYk/export?format=csv';
const postsDir = '_posts';

const path = require('path');

// Limpa posts gerados automaticamente
if (fs.existsSync(postsDir)) {
  fs.readdirSync(postsDir).forEach(file => {
    if (file.includes('-auto-')) {
      fs.unlinkSync(path.join(postsDir, file));
    }
  });
}
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir);

async function downloadSheet() {
  try {
    // Axios segue o redirecionamento automaticamente
    const response = await axios.get(sheetURL, { responseType: 'stream' });

    response.data
      .pipe(csv())
      .on('data', (row) => {
        // Verifica se a linha tem dados básicos e se está publicada
        if (!row.title || row.published?.toUpperCase() !== 'TRUE') return;

        //const filename = `${postsDir}/${row.date}-${row.slug}.md`;
        const filename = `${postsDir}/${row.date}-auto-${row.slug}.md`;
        
        // Tags
        const tagsArray = row.tags
          ? row.tags.split(',').map(t => `"${t.trim()}"`).join(', ')
          : '';

        // FAQ Schema (Seguro contra aspas e quebras de linha)
        let faqSchema = '';
        if (row.faq && row.faq.includes('|')) {
          const faqItems = row.faq.split('||').map(item => {
            const parts = item.split('|');
            if (parts.length < 2) return null;
            return {
              "@type": "Question",
              "name": parts[0].trim(),
              "acceptedAnswer": { "@type": "Answer", "text": parts[1].trim() }
            };
          }).filter(Boolean);

          if (faqItems.length > 0) {
            faqSchema = `\n<script type="application/ld+json">\n${JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqItems
            }, null, 2)}\n</script>\n`;
          }
        }

        const content = `---
layout: post
title: "${row.title.replace(/"/g, '\\"')}"
subtitle: "${row.subtitle.replace(/"/g, '\\"')}"
date: ${row.date}
description: "${(row.meta_description || '').replace(/"/g, '\\"')}"
categories: ["${row.category || 'blog'}"]
tags: [${tagsArray}]
image: "${row.featured_image || ''}"
robots: ${row.noindex?.toUpperCase() === 'TRUE' ? '"noindex, nofollow"' : '"index, follow"'}
---

${row.content}

${faqSchema}
`;

        fs.writeFileSync(filename, content);
        console.log(`✅ Post gerado: ${filename}`);
      })
      .on('end', () => console.log('Processamento concluído.'));

  } catch (error) {
    console.error('Erro ao baixar planilha:', error.message);
  }
}

downloadSheet();