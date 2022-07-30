import {
  Base,
  WordArray,
  Hex,
  Latin1,
  Utf8,
  BufferedBlockAlgorithm,
  Hasher,
} from './core.js';
import {
  X64Word,
  X64WordArray,
} from './x64-core.js';
import {
  Cipher,
  StreamCipher,
  BlockCipherMode,
  CBC,
  Pkcs7,
  BlockCipher,
  CipherParams,
  OpenSSLFormatter,
  SerializableCipher,
  OpenSSLKdf,
  PasswordBasedCipher,
} from './cipher-core.js';

import { Utf16, Utf16BE, Utf16LE } from './enc-utf16.js';
import { Base64 } from './enc-base64.js';
import { HMAC } from './hmac.js';
import { MD5Algo, MD5, HmacMD5 } from './md5.js';
import { SHA1Algo, SHA1, HmacSHA1 } from './sha1.js';
import { SHA224Algo, SHA224, HmacSHA224 } from './sha224.js';
import { SHA256Algo, SHA256, HmacSHA256 } from './sha256.js';
import { SHA384Algo, SHA384, HmacSHA384 } from './sha384.js';
import { SHA512Algo, SHA512, HmacSHA512 } from './sha512.js';
import { SHA3Algo, SHA3, HmacSHA3 } from './sha3.js';
import { RIPEMD160Algo, RIPEMD160, HmacRIPEMD160 } from './ripemd160.js';
import { PBKDF2Algo, PBKDF2 } from './pbkdf2.js';
import { EvpKDFAlgo, EvpKDF } from './evpkdf.js';
import { AESAlgo, AES } from './aes.js';
import {
  DESAlgo,
  DES,
  TripleDESAlgo,
  TripleDES,
} from './tripledes.js';
import { RabbitAlgo, Rabbit } from './rabbit.js';
import { RabbitLegacyAlgo, RabbitLegacy } from './rabbit-legacy.js';
import {
  RC4Algo,
  RC4,
  RC4DropAlgo,
  RC4Drop,
} from './rc4.js';
import { CFB } from './mode-cfb.js';
import { CTR } from './mode-ctr.js';
import { CTRGladman } from './mode-ctr-gladman.js';
import { ECB } from './mode-ecb.js';
import { OFB } from './mode-ofb.js';
import { AnsiX923 } from './pad-ansix923.js';
import { Iso10126 } from './pad-iso10126.js';
import { Iso97971 } from './pad-iso97971.js';
import { NoPadding } from './pad-nopadding.js';
import { ZeroPadding } from './pad-zeropadding.js';
import { HexFormatter } from './format-hex.js';

export default {
  lib: {
    Base,
    WordArray,
    BufferedBlockAlgorithm,
    Hasher,
    Cipher,
    StreamCipher,
    BlockCipherMode,
    BlockCipher,
    CipherParams,
    SerializableCipher,
    PasswordBasedCipher,
  },

  x64: {
    Word: X64Word,
    WordArray: X64WordArray,
  },

  enc: {
    Hex,
    Latin1,
    Utf8,
    Utf16,
    Utf16BE,
    Utf16LE,
    Base64,
  },

  algo: {
    HMAC,
    MD5: MD5Algo,
    SHA1: SHA1Algo,
    SHA224: SHA224Algo,
    SHA256: SHA256Algo,
    SHA384: SHA384Algo,
    SHA512: SHA512Algo,
    SHA3: SHA3Algo,
    RIPEMD160: RIPEMD160Algo,

    PBKDF2: PBKDF2Algo,
    EvpKDF: EvpKDFAlgo,

    AES: AESAlgo,
    DES: DESAlgo,
    TripleDES: TripleDESAlgo,
    Rabbit: RabbitAlgo,
    RabbitLegacy: RabbitLegacyAlgo,
    RC4: RC4Algo,
    RC4Drop: RC4DropAlgo,
  },

  mode: {
    CBC,
    CFB,
    CTR,
    CTRGladman,
    ECB,
    OFB,
  },

  pad: {
    Pkcs7,
    AnsiX923,
    Iso10126,
    Iso97971,
    NoPadding,
    ZeroPadding,
  },

  format: {
    OpenSSL: OpenSSLFormatter,
    Hex: HexFormatter,
  },

  kdf: {
    OpenSSL: OpenSSLKdf,
  },

  MD5,
  HmacMD5,
  SHA1,
  HmacSHA1,
  SHA224,
  HmacSHA224,
  SHA256,
  HmacSHA256,
  SHA384,
  HmacSHA384,
  SHA512,
  HmacSHA512,
  SHA3,
  HmacSHA3,
  RIPEMD160,
  HmacRIPEMD160,

  PBKDF2,
  EvpKDF,

  AES,
  DES,
  TripleDES,
  Rabbit,
  RabbitLegacy,
  RC4,
  RC4Drop,
};
