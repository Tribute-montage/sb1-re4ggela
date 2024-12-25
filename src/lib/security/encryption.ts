import { AES, enc } from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('Missing encryption key in environment variables');
}

export async function encryptFile(file: File): Promise<{ encryptedData: string; metadata: any }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const binary = e.target?.result;
        if (!binary) throw new Error('Failed to read file');

        // Encrypt the file data
        const encrypted = AES.encrypt(binary.toString(), ENCRYPTION_KEY);
        
        // Store metadata separately
        const metadata = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        };

        resolve({
          encryptedData: encrypted.toString(),
          metadata,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function decryptFile(
  encryptedData: string,
  metadata: any
): Promise<File> {
  try {
    // Decrypt the data
    const decrypted = AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const binaryString = decrypted.toString(enc.Utf8);

    // Convert back to a file
    const dataUrl = binaryString;
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    return new File([blob], metadata.name, {
      type: metadata.type,
      lastModified: metadata.lastModified,
    });
  } catch (error) {
    throw new Error('Failed to decrypt file');
  }
}