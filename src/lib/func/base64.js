import axios from 'axios';

export async function getImageBase64(url) {
  try {
    
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    return base64;

  } catch (error) {
    console.error('Erro ao obter Base64 da imagem:', error);
    throw error;
  }
}