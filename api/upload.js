import { formidable } from 'formidable';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from '../src/config/firebase'; // Reutilizamos a configuração existente

// Desabilitamos o bodyParser padrão da Vercel para que possamos processar o stream de arquivo
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const file = files.file[0]; // O arquivo enviado pelo frontend
    const storagePath = fields.storagePath[0]; // O caminho do storage enviado pelo frontend

    if (!file || !storagePath) {
      return res.status(400).json({ error: 'Arquivo ou caminho de destino faltando.' });
    }

    // Lê o arquivo do disco temporário onde o formidable o salvou
    const fileData = require('fs').readFileSync(file.filepath);

    // Faz o upload para o Firebase Storage a partir do nosso servidor
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, fileData, { contentType: file.mimetype });

    // Se chegou até aqui, o upload foi bem-sucedido
    return res.status(200).json({ success: true, message: 'Arquivo enviado com sucesso.' });

  } catch (error) {
    console.error('Erro na API de Upload:', error);
    return res.status(500).json({ error: 'Erro interno do servidor durante o upload.' });
  }
}