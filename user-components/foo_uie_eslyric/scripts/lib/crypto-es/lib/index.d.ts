declare namespace CryptoES {
  namespace lib {
    /**
     * Base class for inheritance.
     */
    export class Base {
      /**
       * Extends this object and runs the init method.
       * Arguments to create() will be passed to init().
       *
       * @return {Object} The new object.
       *
       * @static
       *
       * @example
       *
       *     var instance = MyType.create();
       */
      static create(...args?: Array<any>): Base;
      constructor(...args?: Array<any>);

      /**
       * Copies properties into this object.
       *
       * @param {Object} properties The properties to mix in.
       *
       * @example
       *
       *     MyType.mixIn({
       *         field: 'value'
       *     });
       */
      mixIn(properties?: object): Base;

      /**
       * Creates a copy of this object.
       *
       * @return {Object} The clone.
       *
       * @example
       *
       *     var clone = instance.clone();
       */
      clone(): Base
    }

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    export class WordArray extends Base {
      words: Array<number>;

      sigBytes: number;

      /**
       * Initializes a newly created word array.
       *
       * @param {Array} words (Optional) An array of 32-bit words.
       * @param {number} sigBytes (Optional) The number of significant bytes in the words.
       *
       * @example
       *
       *     var wordArray = CryptoJS.lib.WordArray.create();
       *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
       *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
       */
      static create(
        words?: Array<number> | ArrayBuffer | Uint8Array | Int8Array | Uint8ClampedArray
          | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array,
        sigBytes?: number,
      ): WordArray;
      constructor(
        words?: Array<number> | ArrayBuffer | Uint8Array | Int8Array | Uint8ClampedArray
          | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array,
        sigBytes?: number,
      );

      /**
       * Creates a word array filled with random bytes.
       *
       * @param {number} nBytes The number of random bytes to generate.
       *
       * @return {WordArray} The random word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.lib.WordArray.random(16);
       */
      static random(nBytes?: number): WordArray;

      /**
       * Converts this word array to a string.
       *
       * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
       *
       * @return {string} The stringified word array.
       *
       * @example
       *
       *     var string = wordArray + '';
       *     var string = wordArray.toString();
       *     var string = wordArray.toString(CryptoJS.enc.Utf8);
       */
      toString(encoder?: enc.Encoder): string;

      /**
       * Concatenates a word array to this word array.
       *
       * @param {WordArray} wordArray The word array to append.
       *
       * @return {WordArray} This word array.
       *
       * @example
       *
       *     wordArray1.concat(wordArray2);
       */
      concat(wordArray?: WordArray): WordArray;

      /**
       * Removes insignificant bits.
       *
       * @example
       *
       *     wordArray.clamp();
       */
      clamp(): void;

      /**
       * Creates a copy of this word array.
       *
       * @return {WordArray} The clone.
       *
       * @example
       *
       *     var clone = wordArray.clone();
       */
      clone(): WordArray;
    }

    /**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize
     *
     *     The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    export class BufferedBlockAlgorithm extends Base {
      _minBufferSize: number;

      static create(): BufferedBlockAlgorithm;
      constructor();

      /**
       * Resets this block algorithm's data buffer to its initial state.
       *
       * @example
       *
       *     bufferedBlockAlgorithm.reset();
       */
      reset(): void;

      /**
       * Adds new data to this block algorithm's buffer.
       *
       * @param {WordArray|string} data
       *
       *     The data to append. Strings are converted to a WordArray using UTF-8.
       *
       * @example
       *
       *     bufferedBlockAlgorithm._append('data');
       *     bufferedBlockAlgorithm._append(wordArray);
       */
      _append(data?: WordArray | string): void;

      /**
       * Processes available data blocks.
       *
       * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
       *
       * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
       *
       * @return {WordArray} The processed data.
       *
       * @example
       *
       *     var processedData = bufferedBlockAlgorithm._process();
       *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
       */
      _process(doFlush?: boolean): WordArray;

      /**
       * Creates a copy of this object.
       *
       * @return {Object} The clone.
       *
       * @example
       *
       *     var clone = bufferedBlockAlgorithm.clone();
       */
      clone(): BufferedBlockAlgorithm;
    }

    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize
     *
     *     The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    export class Hasher extends BufferedBlockAlgorithm {
      blockSize: number;

      static create(cfg?: object): Hasher;
      constructor(cfg?: object);

      /**
       * Creates a shortcut function to a hasher's object interface.
       *
       * @param {Hasher} SubHasher The hasher to create a helper for.
       *
       * @return {Function} The shortcut function.
       *
       * @static
       *
       * @example
       *
       *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
       */
      static _createHelper(SubHasher?: Hasher): HashFn;

      /**
       * Creates a shortcut function to the HMAC's object interface.
       *
       * @param {Hasher} SubHasher The hasher to use in this HMAC helper.
       *
       * @return {Function} The shortcut function.
       *
       * @static
       *
       * @example
       *
       *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
       */
      static _createHmacHelper(SubHasher?: Hasher): HMACHashFn;

      /**
       * Resets this hasher to its initial state.
       *
       * @example
       *
       *     hasher.reset();
       */
      reset(): void;

      /**
       * Updates this hasher with a message.
       *
       * @param {WordArray|string} messageUpdate The message to append.
       *
       * @return {Hasher} This hasher.
       *
       * @example
       *
       *     hasher.update('message');
       *     hasher.update(wordArray);
       */
      update(messageUpdate?: WordArray | string): Hasher;

      /**
       * Finalizes the hash computation.
       * Note that the finalize operation is effectively a destructive, read-once operation.
       *
       * @param {WordArray|string} messageUpdate (Optional) A final message update.
       *
       * @return {WordArray} The hash.
       *
       * @example
       *
       *     var hash = hasher.finalize();
       *     var hash = hasher.finalize('message');
       *     var hash = hasher.finalize(wordArray);
       */
      finalize(messageUpdate?: WordArray | string): WordArray;
    }

    /**
     * Abstract base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
     */
    export class Cipher extends BufferedBlockAlgorithm {
      keySize: number;

      ivSize: number;

      _ENC_XFORM_MODE: number;

      _DEC_XFORM_MODE: number;

      /**
       * Initializes a newly created cipher.
       *
       * @param {number} xformMode Either the encryption or decryption transormation mode constant.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @example
       *
       *     const cipher = CryptoJS.algo.AES.create(
       *       CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray }
       *     );
       */
      static create(xformMode?: number, key?: WordArray, cfg?: object): Cipher;
      constructor(xformMode?: number, key?: WordArray, cfg?: object);

      /**
       * Creates this cipher in encryption mode.
       *
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {Cipher} A cipher instance.
       *
       * @static
       *
       * @example
       *
       *     const cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
       */
      static createEncryptor(key?: WordArray, cfg?: object): Cipher;
      /**
       * Creates this cipher in decryption mode.
       *
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {Cipher} A cipher instance.
       *
       * @static
       *
       * @example
       *
       *     const cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
       */
      static createDecryptor(key?: WordArray, cfg?: object): Cipher;

      /**
       * Creates shortcut functions to a cipher's object interface.
       *
       * @param {Cipher} cipher The cipher to create a helper for.
       *
       * @return {Object} An object with encrypt and decrypt shortcut functions.
       *
       * @static
       *
       * @example
       *
       *     const AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
       */
      static _createHelper(SubCipher?: Cipher): CipherObj;

      /**
       * Resets this cipher to its initial state.
       *
       * @example
       *
       *     cipher.reset();
       */
      reset(): void;

      /**
       * Adds data to be encrypted or decrypted.
       *
       * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
       *
       * @return {WordArray} The data after processing.
       *
       * @example
       *
       *     const encrypted = cipher.process('data');
       *     const encrypted = cipher.process(wordArray);
       */
      process(dataUpdate?: WordArray | string): WordArray;

      /**
       * Finalizes the encryption or decryption process.
       * Note that the finalize operation is effectively a destructive, read-once operation.
       *
       * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
       *
       * @return {WordArray} The data after final processing.
       *
       * @example
       *
       *     const encrypted = cipher.finalize();
       *     const encrypted = cipher.finalize('data');
       *     const encrypted = cipher.finalize(wordArray);
       */
      finalize(dataUpdate?: WordArray | string): WordArray;
    }

    /**
     * Abstract base stream cipher template.
     *
     * @property {number} blockSize
     *
     *     The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
     */
    export class StreamCipher extends Cipher {
      blockSize: number;

      static create(...args?: Array<any>): StreamCipher;
      constructor(...args?: Array<any>);

      _doFinalize(): WordArray;
    }

    /**
     * Abstract base block cipher mode template.
     */
    export class BlockCipherMode extends Base {
      /**
       * Initializes a newly created mode.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @example
       *
       *     const mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
       */
      static create(cipher?: Cipher, iv?: Array<number>): BlockCipherMode;
      constructor(cipher?: Cipher, iv?: Array<number>);

      /**
       * Creates this mode for encryption.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @static
       *
       * @example
       *
       *     const mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
       */
      static createEncryptor(cipher?: Cipher, iv?: Array<number>): BlockCipherMode;

      /**
       * Creates this mode for decryption.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @static
       *
       * @example
       *
       *     const mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
       */
      static createDecryptor(cipher?: Cipher, iv?: Array<number>): BlockCipherMode;
    }

    /**
     * Abstract base block cipher template.
     *
     * @property {number} blockSize
     *
     *    The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */
    export class BlockCipher extends Cipher {
      static create(xformMode?: number, key?: WordArray, cfg?: object): BlockCipher;    
    }

    /**
     * A collection of cipher parameters.
     *
     * @property {WordArray} ciphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Cipher} algorithm The cipher algorithm.
     * @property {Mode} mode The block mode used in the ciphering operation.
     * @property {Padding} padding The padding scheme used in the ciphering operation.
     * @property {number} blockSize The block size of the cipher.
     * @property {Format} formatter
     *    The default formatting strategy to convert this cipher params object to a string.
     */
    export class CipherParams extends Base {
      ciphertext: WordArray;

      key: WordArray;

      iv: WordArray;

      salt: WordArray;

      algorithm: Cipher;

      mode: BlockCipherMode;

      padding: pad.Padding;

      blockSize: number;

      formatter: format.Format;

      /**
       * Initializes a newly created cipher params object.
       *
       * @param {Object} cipherParams An object with any of the possible cipher parameters.
       *
       * @example
       *
       *     var cipherParams = CryptoJS.lib.CipherParams.create({
       *         ciphertext: ciphertextWordArray,
       *         key: keyWordArray,
       *         iv: ivWordArray,
       *         salt: saltWordArray,
       *         algorithm: CryptoJS.algo.AES,
       *         mode: CryptoJS.mode.CBC,
       *         padding: CryptoJS.pad.PKCS7,
       *         blockSize: 4,
       *         formatter: CryptoJS.format.OpenSSL
       *     });
       */
      static create(cipherParams?: object): CipherParams;
      constructor(cipherParams?: object);

      /**
       * Converts this cipher params object to a string.
       *
       * @param {Format} formatter (Optional) The formatting strategy to use.
       *
       * @return {string} The stringified cipher params.
       *
       * @throws Error If neither the formatter nor the default formatter is set.
       *
       * @example
       *
       *     var string = cipherParams + '';
       *     var string = cipherParams.toString();
       *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
       */
      toString(formatter?: format.Format): string;
    }

    /**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */
    export class SerializableCipher extends Base {
      cfg: object;

      /**
       * Encrypts a message.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {WordArray|string} message The message to encrypt.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {CipherParams} A cipher params object.
       *
       * @static
       *
       * @example
       *
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher
       *       .encrypt(CryptoJS.algo.AES, message, key);
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher
       *       .encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher
       *       .encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
       */
      static encrypt(cipher?: Cipher, message?: WordArray | string, key?: WordArray, cfg?: object): CipherParams;

      /**
       * Decrypts serialized ciphertext.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {WordArray} The plaintext.
       *
       * @static
       *
       * @example
       *
       *     var plaintext = CryptoJS.lib.SerializableCipher
       *       .decrypt(CryptoJS.algo.AES, formattedCiphertext, key,
       *         { iv: iv, format: CryptoJS.format.OpenSSL });
       *     var plaintext = CryptoJS.lib.SerializableCipher
       *       .decrypt(CryptoJS.algo.AES, ciphertextParams, key,
       *         { iv: iv, format: CryptoJS.format.OpenSSL });
       */
      static decrypt(cipher?: Cipher, ciphertext?: WordArray | string, key?: WordArray, cfg?: object): WordArray;

      /**
       * Converts serialized ciphertext to CipherParams,
       * else assumed CipherParams already and returns ciphertext unchanged.
       *
       * @param {CipherParams|string} ciphertext The ciphertext.
       * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
       *
       * @return {CipherParams} The unserialized ciphertext.
       *
       * @static
       *
       * @example
       *
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher
       *       ._parse(ciphertextStringOrParams, format);
       */
      static _parse(ciphertext?: CipherParams | string, format?: format.Format): CipherParams;
    }

    /**
     * A serializable cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */
    export class PasswordBasedCipher extends SerializableCipher {
      cfg: object;

      /**
       * Encrypts a message using a password.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {WordArray|string} message The message to encrypt.
       * @param {string} password The password.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {CipherParams} A cipher params object.
       *
       * @static
       *
       * @example
       *
       *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher
       *       .encrypt(CryptoJS.algo.AES, message, 'password');
       *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher
       *       .encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
       */
      static encrypt(cipher?: Cipher, message?: WordArray | string, password?: string, cfg?: object): CipherParams;

      /**
       * Decrypts serialized ciphertext using a password.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
       * @param {string} password The password.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {WordArray} The plaintext.
       *
       * @static
       *
       * @example
       *
       *     var plaintext = CryptoJS.lib.PasswordBasedCipher
       *       .decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password',
       *         { format: CryptoJS.format.OpenSSL });
       *     var plaintext = CryptoJS.lib.PasswordBasedCipher
       *       .decrypt(CryptoJS.algo.AES, ciphertextParams, 'password',
       *         { format: CryptoJS.format.OpenSSL });
       */
      static decrypt(cipher?: Cipher, ciphertext?: CipherParams | string, password?: string, cfg?: object): WordArray;
    }
  }

  namespace x64 {
    /**
     * A 64-bit word.
     */
    export class Word extends lib.Base {
      high: number;

      low: number;

      /**
       * Initializes a newly created 64-bit word.
       *
       * @param {number} high The high 32 bits.
       * @param {number} low The low 32 bits.
       *
       * @example
       *
       *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
       */
      static create(high?: number, low?: number): Word;
      constructor(high?: number, low?: number);
    }

    /**
     * An array of 64-bit words.
     *
     * @property {Array} words The array of CryptoJS.x64.Word objects.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    export class WordArray extends Base {
      words: Array<Word>;

      sigBytes: number;

      /**
       * Initializes a newly created word array.
       *
       * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
       * @param {number} sigBytes (Optional) The number of significant bytes in the words.
       *
       * @example
       *
       *     var wordArray = CryptoJS.x64.WordArray.create();
       *
       *     var wordArray = CryptoJS.x64.WordArray.create([
       *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
       *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
       *     ]);
       *
       *     var wordArray = CryptoJS.x64.WordArray.create([
       *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
       *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
       *     ], 10);
       */
      static create(words?: Array<Word>, sigBytes?: number): WordArray;
      constructor(words?: Array<Word>, sigBytes?: number);

      /**
       * Converts this 64-bit word array to a 32-bit word array.
       *
       * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
       *
       * @example
       *
       *     var x32WordArray = x64WordArray.toX32();
       */
      toX32(): lib.WordArray;

      /**
       * Creates a copy of this word array.
       *
       * @return {X64WordArray} The clone.
       *
       * @example
       *
       *     var clone = x64WordArray.clone();
       */
      clone(): WordArray;
    }
  }

  namespace enc {
    interface Encoder {
      stringify(wordArray?: lib.WordArray): string;
      parse(str?: string): lib.WordArray;
    }

    export const Hex: Encoder;
    export const Latin1: Encoder;
    export const Utf8: Encoder;
    export const Utf16: Encoder;
    export const Utf16BE: Encoder;
    export const Utf16LE: Encoder;
    export const Base64: Encoder;
  }

  namespace algo {
    /**
     * HMAC algorithm.
     */
    export class HMAC extends Base {
      /**
       * Initializes a newly created HMAC.
       *
       * @param {Hasher} SubHasher The hash algorithm to use.
       * @param {WordArray|string} key The secret key.
       *
       * @example
       *
       *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
       */
      static create(SubHasher?: lib.Hasher, key?: lib.WordArray | string): HMAC;
      constructor(SubHasher?: lib.Hasher, key?: lib.WordArray | string);

      /**
       * Resets this HMAC to its initial state.
       *
       * @example
       *
       *     hmacHasher.reset();
       */
      reset();

      /**
       * Updates this HMAC with a message.
       *
       * @param {WordArray|string} messageUpdate The message to append.
       *
       * @return {HMAC} This HMAC instance.
       *
       * @example
       *
       *     hmacHasher.update('message');
       *     hmacHasher.update(wordArray);
       */
      update(messageUpdate?: lib.WordArray | string): HMAC;

      /**
       * Finalizes the HMAC computation.
       * Note that the finalize operation is effectively a destructive, read-once operation.
       *
       * @param {WordArray|string} messageUpdate (Optional) A final message update.
       *
       * @return {WordArray} The HMAC.
       *
       * @example
       *
       *     var hmac = hmacHasher.finalize();
       *     var hmac = hmacHasher.finalize('message');
       *     var hmac = hmacHasher.finalize(wordArray);
       */
      finalize(messageUpdate?: lib.WordArray | string): lib.WordArray;
    }

    export class MD5 extends lib.Hasher {};
    export class SHA1 extends lib.Hasher {};
    export class SHA224 extends lib.Hasher {};
    export class SHA256 extends lib.Hasher {};
    export class SHA384 extends lib.Hasher {};
    export class SHA512 extends lib.Hasher {};
    export class SHA3 extends lib.Hasher {};
    export class RIPEMD160 extends lib.Hasher {};

    export class PBKDF2 extends lib.Base {
      static create(cfg?: object): PBKDF2;
      constructor(cfg?: object);

      compute(password?: lib.WordArray | string, salt?: lib.WordArray | string): lib.WordArray;
    };
    export class EvpKDF extends lib.Base {
      static create(cfg?: object): EvpKDF;
      constructor(cfg?: object);

      compute(password?: lib.WordArray | string, salt?: lib.WordArray | string): lib.WordArray;
    };

    export class AES extends lib.BlockCipher {};
    export class DES extends lib.BlockCipher {};
    export class TripleDES extends lib.BlockCipher {};
    export class Rabbit extends lib.StreamCipher {};
    export class RabbitLegacy extends lib.StreamCipher {};
    export class RC4 extends lib.StreamCipher {};
    export class RC4Drop extends lib.StreamCipher {};
  }

  namespace mode {
    export class CBC extends lib.BlockCipherMode {};
    export class CFB extends lib.BlockCipherMode {};
    export class CTR extends lib.BlockCipherMode {};
    export class CTRGladman extends lib.BlockCipherMode {};
    export class ECB extends lib.BlockCipherMode {};
    export class OFB extends lib.BlockCipherMode {};
  }

  namespace pad {
    interface Padding {
      pad(data?: lib.WordArray, blockSize?: number): void;
      unpad(data?: lib.WordArray): void;
    }

    export const Pkcs7: Padding;
    export const AnsiX923: Padding;
    export const Iso10126: Padding;
    export const Iso97971: Padding;
    export const NoPadding: Padding;
    export const ZeroPadding: Padding;
  }

  namespace format {
    interface Format {
      stringify(cipherParams?: lib.CipherParams): string;
      parse(str?: string): lib.CipherParams;
    }

    export const OpenSSL: Format;
    export const Hex: Format;
  }

  namespace kdf {
    interface Kdf {
      execute(password?: string, keySize?: number, ivSize?: number, salt?: lib.WordArray | string): lib.CipherParams;
    }

    export const OpenSSL: Kdf;
  }

  type HashFn = (message?: lib.WordArray | string) => lib.WordArray;
  type HMACHashFn = (message?: lib.WordArray | string, key?: lib.WordArray | string) => lib.WordArray;

  export const MD5: HashFn;
  export const HmacMD5: HMACHashFn;
  export const SHA1: HashFn;
  export const HmacSHA1: HMACHashFn;
  export const SHA224: HashFn;
  export const HmacSHA224: HMACHashFn;
  export const SHA256: HashFn;
  export const HmacSHA256: HMACHashFn;
  export const SHA384: HashFn;
  export const HmacSHA384: HMACHashFn;
  export const SHA512: HashFn;
  export const HmacSHA512: HMACHashFn;
  export const SHA3: HashFn;
  export const HmacSHA3: HMACHashFn;
  export const RIPEMD160: HashFn;
  export const HmacRIPEMD160: HMACHashFn;

  type KDFFn = (password?: lib.WordArray | string, salt?: lib.WordArray | string, cfg?: object) => lib.WordArray;

  export const PBKDF2: KDFFn;
  export const EvpKDF: KDFFn;

  interface CipherObj {
    encrypt(message?: lib.WordArray | string, key?: lib.WordArray | string, cfg?: object): lib.CipherParams;
    decrypt(ciphertext?: lib.CipherParams | string, key?: lib.WordArray | string, cfg?: object): lib.WordArray;
  }

  export const AES: CipherObj;
  export const DES: CipherObj;
  export const TripleDES: CipherObj;
  export const Rabbit: CipherObj;
  export const RabbitLegacy: CipherObj;
  export const RC4: CipherObj;
  export const RC4Drop: CipherObj;
}

export default CryptoES;
