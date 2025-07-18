import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Inicializa o Firebase Admin SDK
// Ele lê as credenciais da variável de ambiente que configuramos na Vercel
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.SERVICE_ACCOUNT_JSON)),
    storageBucket: "goframesite.appspot.com" // Use a URL .appspot.com aqui
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileType, creatorId, eventId } = req.body;
    if (!fileName || !fileType || !creatorId || !eventId) {
      return res.status(400).json({ error: 'Informações faltando.' });
    }

    const bucket = getStorage().bucket();
    const filePath = `media/${creatorId}/${eventId}/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    // Configura a URL assinada
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos de validade
      contentType: fileType,
    };

    // Gera a URL
    const [url] = await file.getSignedUrl(options);

    res.status(200).json({ signedUrl: url, filePath: filePath });

  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    res.status(500).json({ error: 'Não foi possível gerar a URL de upload.' });
  }
}