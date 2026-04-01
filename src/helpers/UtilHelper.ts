import { compare } from 'bcryptjs';

export async function Comparepassword(plainText: string, hash: string) {
  return new Promise(function (resolve, reject) {
    compare(plainText, hash, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
