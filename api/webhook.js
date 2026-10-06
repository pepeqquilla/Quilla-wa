export default async function handler(req, res) {
  // Respon status saat dibuka lewat browser biasa (GET)
  if (req.method !== 'POST') {
    return res.status(200).send('Webhook Gemini Wablas siap!');
  }

  try {
    const payload = req.body || {};
    const message = payload.message || '';
    const isGroup = payload.isGroup;

    // Abaikan jika pesan berasal dari grup atau teks kosong
    if (isGroup || !message.trim()) {
      return res.status(200).json({ status: false, message: 'Ignored' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        status: true,
        data: { reply: 'API Key Gemini belum terkonfigurasi di Vercel.' }
      });
    }

    const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey};

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await geminiResponse.json();
    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya belum bisa merespons pesan ini.';

    return res.status(200).json({
      status: true,
      data: {
        reply: aiReply
      }
    });
  } catch (err) {
    return res.status(200).json({
      status: true,
      data: {
        reply: 'Terjadi kendala pemrosesan AI.'
      }
    });
  }
}
