// netlify/functions/proxy.js

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const prompt = `Buat artikel bahasa Indonesia minimal 3000 karakter dengan:
- Judul: ${data.title}
- Funnel: ${data.funnel}
- Kategori: ${data.category}
- Keyword: ${data.keyword}
- Long-Tail: ${data.longtail}
- Search Intent: ${data.intent}
- CTA: ${data.cta}
- Tone: ${data.tone}

Hasilkan JSON:
{ 
  metaTitle, 
  metaDesc, 
  slug, 
  article, 
  prompts: [prompt1, prompt2, prompt3] 
}`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const { choices } = await resp.json();
    return {
      statusCode: 200,
      body: choices[0].message.content
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Error' })
    };
  }
};
