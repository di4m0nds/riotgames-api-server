import crypto from 'crypto'
import 'dotenv/config'

const algorithm = 'aes-256-ctr'
const secretKey = process.env.SECRET_KEY_CRYPTO
const iv = crypto.randomBytes(16)

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return `${iv.toString('hex')}-${encrypted.toString('hex')}`
}

const decrypt = (hash) => {
  const hashValues = hash.split('-')
  const hashSplited = { iv: hashValues[0], content: hashValues[1] }

  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hashSplited.iv, 'hex'))
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hashSplited.content, 'hex')), decipher.final()])

  return decrpyted.toString()
}

export {
  encrypt,
  decrypt
}
