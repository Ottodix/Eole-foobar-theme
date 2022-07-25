# CryptoES

*A cryptography algorithms library compatible with ES6 and TypeScript*

- Inspired by and has the same API with [CryptoJS](https://code.google.com/archive/p/crypto-js/) 
- With types for TypeScript usage
- Witten in latest ECMAScript Standard
- Support ES6 module import and partially import

## Usage

Installation:

```
yarn add crypto-es
```

---

In Node.js projects, we recommend you to use ECMAScript Modules insead of CommonJS:

```
// package.json
{
  "type": "module"
}
```

```
# In same folder as above package.json
node --experimental-modules my-app.js # Runs as ES module
```

[See details](<https://nodejs.org/dist/latest-v12.x/docs/api/esm.html>)

---

Then you can import CryptoES:

```
import CryptoES from 'crypto-es';
const rst = CryptoES.MD5("Message").toString();
```

Or partially import the function to reduce the package weight:

```
import { MD5 } from 'crypto-es/lib/md5.js';
const rst = MD5("Message").toString();
```

## TypeScript Usage

Make sure to add this entry to your tsconfig.json:

```
{
  "compilerOptions": {
    ...
    
    "skipLibCheck": true,
    
    ...
  }
}

```

If you want to have type checks, make sure to use overall import:

```
import CryptoES from 'crypto-es';
```

## Guide

> Just the same as [CryptoJS](https://code.google.com/archive/p/crypto-js/)

---

- [Hashers](###Hashers)
- [HMAC](#HMAC)
- [Ciphers](#Ciphers)
- [Encoders](#Encoders)
- [ArrayBuffer and TypedArray](#ArrayBuffer-and-TypedArray)

---

### Hashers

#### The Hasher Algorithms

**MD5**

MD5 is a widely used hash function. It's been used in a variety of security applications and is also commonly used to check the integrity of files. Though, MD5 is not collision resistant, and it isn't suitable for applications like SSL certificates or digital signatures that rely on this property.

```
const hash = CryptoES.MD5("Message");
```

**SHA-1**

The SHA hash functions were designed by the National Security Agency (NSA). SHA-1 is the most established of the existing SHA hash functions, and it's used in a variety of security applications and protocols. Though, SHA-1's collision resistance has been weakening as new attacks are discovered or improved.

```
const hash = CryptoES.SHA1("Message");
```

**SHA-2**

SHA-256 is one of the four variants in the SHA-2 set. It isn't as widely used as SHA-1, though it appears to provide much better security.

```
const hash = CryptoES.SHA256("Message");
```

SHA-512 is largely identical to SHA-256 but operates on 64-bit words rather than 32.

```
const hash = CryptoES.SHA512("Message");
```

CryptoES also supports SHA-224 and SHA-384, which are largely identical but truncated versions of SHA-256 and SHA-512 respectively.

**SHA-3**

SHA-3 is the winner of a five-year competition to select a new cryptographic hash algorithm where 64 competing designs were evaluated.

**NOTE:** I made a mistake when I named this implementation SHA-3. It should be named Keccak[c=2d]. Each of the SHA-3 functions is based on an instance of the Keccak algorithm, which NIST selected as the winner of the SHA-3 competition, but those SHA-3 functions won't produce hashes identical to Keccak.

```
const hash = CryptoES.SHA3("Message");
```

SHA-3 can be configured to output hash lengths of one of 224, 256, 384, or 512 bits. The default is 512 bits.

```
const hash = CryptoES.SHA3("Message", { outputLength: 512 });
const hash = CryptoES.SHA3("Message", { outputLength: 384 });
const hash = CryptoES.SHA3("Message", { outputLength: 256 });
const hash = CryptoES.SHA3("Message", { outputLength: 224 });
```

**RIPEMD-160**

```
const hash = CryptoES.RIPEMD160("Message");
```

#### The Hasher Input

The hash algorithms accept either strings or instances of CryptoES.lib.WordArray. A WordArray object represents an array of 32-bit words. When you pass a string, it's automatically converted to a WordArray encoded as UTF-8.

#### The Hasher Output

The hash you get back isn't a string yet. It's a WordArray object. When you use a WordArray object in a string context, it's automatically converted to a hex string.

```
const hash = CryptoES.SHA256("Message");
alert(typeof hash); // object
alert(hash); // 2f77668a9dfbf8d5848b9eeb4a7145ca94c6ed9236e4a773f6dcafa5132b2f91
```

You can convert a WordArray object to other formats by explicitly calling the toString method and passing an encoder.

```
const hash = CryptoES.SHA256("Message");
alert(hash.toString(CryptoES.enc.Base64)); // L3dmip37+NWEi57rSnFFypTG7ZI25Kdz9tyvpRMrL5E= alert(hash.toString(CryptoES.enc.Latin1)); // /wf��ûøÕ���ëJqEÊ�Æí�6ä§söÜ¯¥+/�
alert(hash.toString(CryptoES.enc.Hex)); // 2f77668a9dfbf8d5848b9eeb4a7145ca94c6ed9236e4a773f6dcafa5132b2f91
```

#### Progressive Hashing

```
const sha256 = CryptoES.algo.SHA256.create();
sha256.update("Message Part 1");
sha256.update("Message Part 2");
sha256.update("Message Part 3");
const hash = sha256.finalize();
```

### HMAC

Keyed-hash message authentication codes (HMAC) is a mechanism for message authentication using cryptographic hash functions.

HMAC can be used in combination with any iterated cryptographic hash function.

```
const hash = CryptoES.HmacMD5("Message", "Secret Passphrase");
const hash = CryptoES.HmacSHA1("Message", "Secret Passphrase");
const hash = CryptoES.HmacSHA256("Message", "Secret Passphrase");
const hash = CryptoES.HmacSHA512("Message", "Secret Passphrase");
```

#### Progressive HMAC Hashing

```
const hmac = CryptoES.algo.HMAC.create(CryptoES.algo.SHA256, "Secret Passphrase");
hmac.update("Message Part 1");
hmac.update("Message Part 2");
hmac.update("Message Part 3");
const hash = hmac.finalize();
```

### PBKDF2

PBKDF2 is a password-based key derivation function. In many applications of cryptography, user security is ultimately dependent on a password, and because a password usually can't be used directly as a cryptographic key, some processing is required.

A salt provides a large set of keys for any given password, and an iteration count increases the cost of producing keys from a password, thereby also increasing the difficulty of attack.

```
const salt = CryptoES.lib.WordArray.random(128/8);
const key128Bits = CryptoES.PBKDF2("Secret Passphrase", salt, { keySize: 128/32 });
const key256Bits = CryptoES.PBKDF2("Secret Passphrase", salt, { keySize: 256/32 });
const key512Bits = CryptoES.PBKDF2("Secret Passphrase", salt, { keySize: 512/32 });
const key512Bits1000Iterations = CryptoES.PBKDF2("Secret Passphrase", salt, { keySize: 512/32, iterations: 1000 });
```

### Ciphers

#### The Cipher Algorithms

**AES**

The Advanced Encryption Standard (AES) is a U.S. Federal Information Processing Standard (FIPS). It was selected after a 5-year process where 15 competing designs were evaluated.

```
const encrypted = CryptoES.AES.encrypt("Message", "Secret Passphrase");
const decrypted = CryptoES.AES.decrypt(encrypted, "Secret Passphrase");
```

CryptoES supports AES-128, AES-192, and AES-256. It will pick the variant by the size of the key you pass in. If you use a passphrase, then it will generate a 256-bit key.

**DES, Triple DES**

DES is a previously dominant algorithm for encryption, and was published as an official Federal Information Processing Standard (FIPS). DES is now considered to be insecure due to the small key size.

```
const encrypted = CryptoES.DES.encrypt("Message", "Secret Passphrase");
const decrypted = CryptoES.DES.decrypt(encrypted, "Secret Passphrase");
```

Triple DES applies DES three times to each block to increase the key size. The algorithm is believed to be secure in this form.

```
const encrypted = CryptoES.TripleDES.encrypt("Message", "Secret Passphrase");
const decrypted = CryptoES.TripleDES.decrypt(encrypted, "Secret Passphrase");
```

**Rabbit**

Rabbit is a high-performance stream cipher and a finalist in the eSTREAM Portfolio. It is one of the four designs selected after a 3 1/2-year process where 22 designs were evaluated.

```
const encrypted = CryptoES.Rabbit.encrypt("Message", "Secret Passphrase");
const decrypted = CryptoES.Rabbit.decrypt(encrypted, "Secret Passphrase");
```

**RC4, RC4Drop**

RC4 is a widely-used stream cipher. It's used in popular protocols such as SSL and WEP. Although remarkable for its simplicity and speed, the algorithm's history doesn't inspire confidence in its security.

```
const encrypted = CryptoES.RC4.encrypt("Message", "Secret Passphrase");
const decrypted = CryptoES.RC4.decrypt(encrypted, "Secret Passphrase");
```

It was discovered that the first few bytes of keystream are strongly non-random and leak information about the key. We can defend against this attack by discarding the initial portion of the keystream. This modified algorithm is traditionally called RC4-drop.

By default, 192 words (768 bytes) are dropped, but you can configure the algorithm to drop any number of words.

```
const encrypted = CryptoES.RC4Drop.encrypt("Message", "Secret Passphrase");
const encrypted = CryptoES.RC4Drop.encrypt("Message", "Secret Passphrase", { drop: 3072/4 });
const decrypted = CryptoES.RC4Drop.decrypt(encrypted, "Secret Passphrase", { drop: 3072/4 });
```

#### Custom Key and IV

```
const key = CryptoES.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
const iv = CryptoES.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
const encrypted = CryptoES.AES.encrypt("Message", key, { iv: iv });
```

#### Block Modes and Padding

```
const encrypted = CryptoES.AES.encrypt("Message", "Secret Passphrase", { mode: CryptoES.mode.CFB, padding: CryptoES.pad.AnsiX923 });
```

CryptoES supports the following modes:

- CBC (the default)
- CFB
- CTR
- OFB
- ECB

And CryptoES supports the following padding schemes:

- Pkcs7 (the default)
- Iso97971
- AnsiX923
- Iso10126
- ZeroPadding
- NoPadding

#### The Cipher Input

For the plaintext message, the cipher algorithms accept either strings or instances of CryptoES.lib.WordArray.

For the key, when you pass a string, it's treated as a passphrase and used to derive an actual key and IV. Or you can pass a WordArray that represents the actual key. If you pass the actual key, you must also pass the actual IV.

For the ciphertext, the cipher algorithms accept either strings or instances of CryptoES.lib.CipherParams. A CipherParams object represents a collection of parameters such as the IV, a salt, and the raw ciphertext itself. When you pass a string, it's automatically converted to a CipherParams object according to a configurable format strategy.

#### The Cipher Output

The plaintext you get back after decryption is a WordArray object. See Hashers' Output for more detail.

The ciphertext you get back after encryption isn't a string yet. It's a CipherParams object. A CipherParams object gives you access to all the parameters used during encryption. When you use a CipherParams object in a string context, it's automatically converted to a string according to a format strategy. The default is an OpenSSL-compatible format.

```
const encrypted = CryptoES.AES.encrypt("Message", "Secret Passphrase"); alert(encrypted.key); // 74eb593087a982e2a6f5dded54ecd96d1fd0f3d44a58728cdcd40c55227522223
alert(encrypted.iv); // 7781157e2629b094f0e3dd48c4d786115
alert(encrypted.salt); // 7a25f9132ec6a8b34
alert(encrypted.ciphertext); // 73e54154a15d1beeb509d9e12f1e462a0
alert(encrypted); // U2FsdGVkX1+iX5Ey7GqLND5UFUoV0b7rUJ2eEvHkYqA=
```

You can define your own formats in order to be compatible with other crypto implementations. A format is an object with two methods—stringify and parse—that converts between CipherParams objects and ciphertext strings.

Here's how you might write a JSON formatter:

```
const JsonFormatter = { 
  stringify: function (cipherParams) { // create json object with ciphertext
    const jsonObj = { ct: cipherParams.ciphertext.toString(CryptoES.enc.Base64) }; // optionally add iv and salt
    if (cipherParams.iv) {
      jsonObj.iv = cipherParams.iv.toString();
    }
    if (cipherParams.salt) {
      jsonObj.s = cipherParams.salt.toString();
    }
    // stringify json object
    return JSON.stringify(jsonObj);
  },
  parse: function (jsonStr) { // parse json string
    const jsonObj = JSON.parse(jsonStr); // extract ciphertext from json object, and create cipher params object
    const cipherParams = CryptoES.lib.CipherParams.create(
      { ciphertext: CryptoES.enc.Base64.parse(jsonObj.ct) },
    ); // optionally extract iv and salt
    if (jsonObj.iv) {
      cipherParams.iv = CryptoES.enc.Hex.parse(jsonObj.iv)
    }
    if (jsonObj.s) {
      cipherParams.salt = CryptoES.enc.Hex.parse(jsonObj.s)
    }
    return cipherParams;
  },
};
const encrypted = CryptoES.AES.encrypt(
  "Message",
  "Secret Passphrase",
  { format: JsonFormatter },
);
alert(encrypted); // {"ct":"tZ4MsEnfbcDOwqau68aOrQ==","iv":"8a8c8fd8fe33743d3638737ea4a00698","s":"ba06373c8f57179c"}
const decrypted = CryptoES.AES.decrypt(
  encrypted,
  "Secret Passphrase",
  { format: JsonFormatter },
);
alert(decrypted.toString(CryptoES.enc.Utf8)); // Message
```

#### Progressive Ciphering

```
const key = CryptoES.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
const iv = CryptoES.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
const aesEncryptor = CryptoES.algo.AES.createEncryptor(key, { iv: iv });
const ciphertextPart1 = aesEncryptor.process("Message Part 1");
const ciphertextPart2 = aesEncryptor.process("Message Part 2");
const ciphertextPart3 = aesEncryptor.process("Message Part 3");
const ciphertextPart4 = aesEncryptor.finalize();
const aesDecryptor = CryptoES.algo.AES.createDecryptor(key, { iv: iv });
const plaintextPart1 = aesDecryptor.process(ciphertextPart1);
const plaintextPart2 = aesDecryptor.process(ciphertextPart2);
const plaintextPart3 = aesDecryptor.process(ciphertextPart3);
const plaintextPart4 = aesDecryptor.process(ciphertextPart4);
const plaintextPart5 = aesDecryptor.finalize();
```

#### Interoperability

With OpenSSL

Encrypt with OpenSSL:

```
openssl enc -aes-256-cbc -in infile -out outfile -pass pass:"Secret Passphrase" -e -base64
```

Decrypt with CryptoES:

```
const decrypted = CryptoES.AES.decrypt(openSSLEncrypted, "Secret Passphrase");
```

### Encoders

CryptoES can convert from encoding formats such as Base64, Latin1 or Hex to WordArray objects and vica versa.

```
const words = CryptoES.enc.Base64.parse('SGVsbG8sIFdvcmxkIQ==');
const base64 = CryptoES.enc.Base64.stringify(words);
const words = CryptoES.enc.Latin1.parse('Hello, World!');
const latin1 = CryptoES.enc.Latin1.stringify(words);
const words = CryptoES.enc.Hex.parse('48656c6c6f2c20576f726c6421');
const hex = CryptoES.enc.Hex.stringify(words);
const words = CryptoES.enc.Utf8.parse('𤭢');
const utf8 = CryptoES.enc.Utf8.stringify(words);
const words = CryptoES.enc.Utf16.parse('Hello, World!');
const utf16 = CryptoES.enc.Utf16.stringify(words);
const words = CryptoES.enc.Utf16LE.parse('Hello, World!');
const utf16 = CryptoES.enc.Utf16LE.stringify(words);
```

### ArrayBuffer and TypedArray

WordArray creator could recive an ArrayBuffer or TypedArray so that CryptoES algorisms could apply to them:

```
const words = CryptoES.lib.WordArray.create(new ArrayBuffer(8));
const rst = CryptoES.AES.encrypt(words, 'Secret Passphrase')
```

**NOTE**: ArrayBuffer could not directly passed to algorisms, you should change them to WordArray first.

With this, encrypting files would be easier:

```
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
const reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.onload = function () {
  const arrayBuffer = reader.result;
  const words = CryptoES.lib.WordArray.create(arrayBuffer);
  const rst = CryptoES.AES.encrypt(words, 'Secret Passphrase')
  ...
};
```

## Blogs

[Refactoring CryptoJS in Modern ECMAScript](https://medium.com/front-end-weekly/refactoring-cryptojs-in-modern-ecmascript-1d4e1837c272) 

[【重写 CryptoJS】一、ECMAScript 类与继承](https://zhuanlan.zhihu.com/p/52165088)

[【重写 CryptoJS】二、WordArray 与位操作](https://zhuanlan.zhihu.com/p/53411829) 