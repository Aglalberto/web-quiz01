// Quiz Party — servidor gerado por "npm run build". Não edite.
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports2, module2) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module2.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports2, module2) {
    "use strict";
    var { websocketMask, websocketUnmask } = require("http");
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module2.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (websocketMask) {
      module2.exports.mask = function(source, mask, output, offset, length) {
        if (length < 24) _mask(source, mask, output, offset, length);
        else websocketMask(source, mask, output, offset, length);
      };
      module2.exports.unmask = function(buffer, mask) {
        if (buffer.length < 24) _unmask(buffer, mask);
        else websocketUnmask(buffer, mask);
      };
    } else if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require("bufferutil");
        module2.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module2.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports2, module2) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module2.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports2, module2) {
    "use strict";
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module2.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports2, module2) {
    "use strict";
    var { isUtf8 } = require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module2.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module2.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = require("utf-8-validate");
        module2.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports2, module2) {
    "use strict";
    var { Writable } = require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._numFragments = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            )
          );
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          const error = this.createError(
            RangeError,
            "Too many message fragments",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          );
          cb(error);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._numFragments = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module2.exports = Receiver2;
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports2, module2) {
    "use strict";
    var { Duplex } = require("stream");
    var { randomFillSync } = require("crypto");
    var {
      types: { isUint8Array }
    } = require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) {
          return dataLength ? [target, data] : [target];
        }
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (!dataLength) return [target];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else if (isUint8Array(data)) {
            buf.set(data, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module2.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports2, module2) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module2.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var https = require("https");
    var http = require("http");
    var net = require("net");
    var tls = require("tls");
    var { randomBytes, createHash } = require("crypto");
    var { Duplex, Readable } = require("stream");
    var { URL: URL2 } = require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            if (!options || options.protocols === void 0) {
              protocols = [];
            } else if (Array.isArray(options.protocols)) {
              protocols = options.protocols;
            } else {
              protocols = [options.protocols];
            }
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              if (options.protocols === void 0) {
                protocols = [];
              } else if (Array.isArray(options.protocols)) {
                protocols = options.protocols;
              } else {
                protocols = [options.protocols];
              }
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        this._readyState = _WebSocket.CLOSING;
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module2.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 256 * 1024,
        maxFragments: 16 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        protocols: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const i = opts.path.indexOf(":");
        if (i === -1) {
          opts.socketPath = opts.path;
          opts.path = "";
        } else {
          opts.socketPath = opts.path.slice(0, i);
          opts.path = opts.path.slice(i + 1);
        }
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports2, module2) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module2.exports = createWebSocketStream2;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module2.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var http = require("http");
    var { Duplex } = require("stream");
    var { createHash } = require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=16384] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 256 * 1024,
          maxFragments: 16 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server2 = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server2.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module2.exports = WebSocketServer2;
    function addListeners(server2, map) {
      for (const event of Object.keys(map)) server2.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server2.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server2) {
      server2._state = CLOSED;
      server2.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server2, req, socket, code, message, headers) {
      if (server2.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server2.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// server/index.ts
var index_exports = {};
__export(index_exports, {
  lanAddress: () => lanAddress
});
module.exports = __toCommonJS(index_exports);
var import_node_http = require("node:http");
var import_promises = require("node:fs/promises");
var import_node_fs = require("node:fs");
var import_node_child_process = require("node:child_process");
var import_node_os = require("node:os");
var import_node_path = require("node:path");

// node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_extension = __toESM(require_extension(), 1);
var import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_subprotocol = __toESM(require_subprotocol(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);

// shared/types.ts
var MAX_PLAYERS = 8;

// shared/game.ts
var DEFAULT_DURATIONS = {
  voting: 15e3,
  chosen: 3500,
  question: 15e3,
  reveal: 7e3
};
var Game = class {
  bank;
  winScore;
  questionsPerRound;
  durations;
  minPlayers;
  rng;
  phase = "lobby";
  players = [];
  hostId = null;
  themeOptions = [];
  themeId = null;
  roundQuestion = 0;
  round = 0;
  question = null;
  deadline = null;
  duration = null;
  suddenDeath = false;
  contenders = [];
  winnerId = null;
  used = /* @__PURE__ */ new Set();
  recentThemes = [];
  idCounter = 0;
  constructor(opts) {
    this.bank = opts.bank;
    this.winScore = opts.winScore ?? 15;
    this.questionsPerRound = opts.questionsPerRound ?? 3;
    this.durations = { ...DEFAULT_DURATIONS, ...opts.durations };
    this.minPlayers = opts.minPlayers ?? 2;
    this.rng = opts.rng ?? Math.random;
  }
  // ───────────────────────── jogadores ─────────────────────────
  newId() {
    this.idCounter++;
    return `p${Date.now().toString(36)}${this.idCounter}${Math.floor(this.rng() * 1e6).toString(36)}`;
  }
  getPlayer(id) {
    return id ? this.players.find((p) => p.id === id) : void 0;
  }
  /** Entra (ou reentra) um jogador. Retorna o id, ou um erro. */
  join(rawName, playerId) {
    const existing = this.getPlayer(playerId);
    if (existing) {
      existing.connected = true;
      const name2 = cleanName(rawName);
      if (name2) existing.name = this.uniqueName(name2, existing.id);
      this.ensureHost();
      return { ok: true, id: existing.id };
    }
    const name = cleanName(rawName);
    if (!name) return { ok: false, code: "name" };
    if (this.players.length >= MAX_PLAYERS) return { ok: false, code: "full" };
    const taken = new Set(this.players.map((p) => p.seat));
    let seat = 0;
    while (taken.has(seat)) seat++;
    const player = {
      id: this.newId(),
      name: this.uniqueName(name),
      seat,
      score: 0,
      streak: 0,
      connected: true,
      vote: null,
      choice: null,
      correct: null
    };
    this.players.push(player);
    this.players.sort((a, b) => a.seat - b.seat);
    this.ensureHost();
    return { ok: true, id: player.id };
  }
  /** Reconecta pelo id salvo no celular. */
  resume(playerId) {
    const p = this.getPlayer(playerId);
    if (!p) return false;
    p.connected = true;
    this.ensureHost();
    return true;
  }
  uniqueName(name, selfId) {
    const others = new Set(this.players.filter((p) => p.id !== selfId).map((p) => p.name.toLowerCase()));
    if (!others.has(name.toLowerCase())) return name;
    for (let i = 2; ; i++) {
      const candidate = `${name.slice(0, 12)} ${i}`;
      if (!others.has(candidate.toLowerCase())) return candidate;
    }
  }
  disconnect(playerId, now) {
    const p = this.getPlayer(playerId);
    if (!p) return;
    p.connected = false;
    if (this.hostId === playerId) {
      this.hostId = null;
      this.ensureHost();
    }
    this.checkEarlyEnd(now);
  }
  kick(byId, targetId, now) {
    if (byId !== this.hostId || byId === targetId) return false;
    const idx = this.players.findIndex((p) => p.id === targetId);
    if (idx < 0) return false;
    this.players.splice(idx, 1);
    this.contenders = this.contenders.filter((id) => id !== targetId);
    this.checkEarlyEnd(now);
    return true;
  }
  ensureHost() {
    if (this.hostId && this.getPlayer(this.hostId)) {
      const host = this.getPlayer(this.hostId);
      if (host.connected) return;
    }
    const next = this.players.find((p) => p.connected);
    this.hostId = next ? next.id : this.players[0]?.id ?? null;
  }
  connectedPlayers() {
    return this.players.filter((p) => p.connected);
  }
  /** Jogadores que podem responder a pergunta atual */
  answerers() {
    const list = this.connectedPlayers();
    return this.suddenDeath ? list.filter((p) => this.contenders.includes(p.id)) : list;
  }
  // ───────────────────────── ações ─────────────────────────
  start(byId, now) {
    if (byId !== this.hostId || this.phase !== "lobby") return false;
    if (this.connectedPlayers().length < this.minPlayers) return false;
    this.resetScores();
    this.startVoting(now);
    return true;
  }
  playAgain(byId, now) {
    if (byId !== this.hostId || this.phase !== "gameover") return false;
    this.resetScores();
    this.startVoting(now);
    return true;
  }
  endGame(byId) {
    if (byId !== this.hostId || this.phase === "lobby") return false;
    this.resetScores();
    this.phase = "lobby";
    this.setDeadline(null, 0);
    return true;
  }
  /** Host pula a fase atual (avança imediatamente). */
  skip(byId, now) {
    if (byId !== this.hostId) return false;
    if (this.phase === "lobby" || this.phase === "gameover") return false;
    this.advance(now);
    return true;
  }
  vote(playerId, themeId, now) {
    const p = this.getPlayer(playerId);
    if (!p || this.phase !== "voting" || !this.themeOptions.includes(themeId)) return false;
    p.vote = themeId;
    this.checkEarlyEnd(now);
    return true;
  }
  answer(playerId, index, now) {
    const p = this.getPlayer(playerId);
    if (!p || this.phase !== "question" || !this.question) return false;
    if (this.suddenDeath && !this.contenders.includes(p.id)) return false;
    if (p.choice !== null) return false;
    if (!Number.isInteger(index) || index < 0 || index >= this.question.options.length) return false;
    p.choice = index;
    this.checkEarlyEnd(now);
    return true;
  }
  /** Chamado pelo servidor quando o prazo da fase vence. */
  tick(now) {
    if (this.deadline !== null && now >= this.deadline) this.advance(now);
  }
  // ───────────────────────── fluxo ─────────────────────────
  resetScores() {
    for (const p of this.players) {
      p.score = 0;
      p.streak = 0;
      p.vote = null;
      p.choice = null;
      p.correct = null;
    }
    this.round = 0;
    this.roundQuestion = 0;
    this.suddenDeath = false;
    this.contenders = [];
    this.winnerId = null;
    this.question = null;
    this.themeId = null;
    this.themeOptions = [];
  }
  setDeadline(now, ms) {
    if (now === null) {
      this.deadline = null;
      this.duration = null;
    } else {
      this.deadline = now + ms;
      this.duration = ms;
    }
  }
  checkEarlyEnd(now) {
    if (this.phase === "voting") {
      const voters = this.connectedPlayers();
      if (voters.length > 0 && voters.every((p) => p.vote)) this.advance(now);
    } else if (this.phase === "question") {
      const list = this.answerers();
      if (list.length > 0 && list.every((p) => p.choice !== null)) this.advance(now);
    }
  }
  advance(now) {
    switch (this.phase) {
      case "voting":
        return this.finishVoting(now);
      case "chosen":
        return this.nextQuestion(now);
      case "question":
        return this.reveal(now);
      case "reveal":
        return this.afterReveal(now);
    }
  }
  availableThemes() {
    return Object.keys(this.bank).filter((t) => this.bank[t].length > 0);
  }
  startVoting(now) {
    this.round++;
    this.roundQuestion = 0;
    this.question = null;
    this.themeId = null;
    for (const p of this.players) p.vote = null;
    const all = this.availableThemes();
    let pool = all.filter((t) => !this.recentThemes.includes(t));
    if (pool.length < 3) pool = all;
    this.themeOptions = shuffle(pool, this.rng).slice(0, 3);
    this.phase = "voting";
    this.setDeadline(now, this.durations.voting);
  }
  finishVoting(now) {
    const counts = /* @__PURE__ */ new Map();
    for (const p of this.players) if (p.vote) counts.set(p.vote, (counts.get(p.vote) ?? 0) + 1);
    let best = [];
    let max = 0;
    for (const t of this.themeOptions) {
      const c = counts.get(t) ?? 0;
      if (c > max) {
        max = c;
        best = [t];
      } else if (c === max) best.push(t);
    }
    if (best.length === 0) best = [...this.themeOptions];
    this.themeId = best[Math.floor(this.rng() * best.length)];
    this.recentThemes = [this.themeId, ...this.recentThemes].slice(0, 6);
    this.phase = "chosen";
    this.setDeadline(now, this.durations.chosen);
  }
  pickQuestion(themeId) {
    const list = this.bank[themeId];
    let candidates = list.map((_, i) => i).filter((i) => !this.used.has(`${themeId}:${i}`));
    if (candidates.length === 0) {
      for (let i = 0; i < list.length; i++) this.used.delete(`${themeId}:${i}`);
      candidates = list.map((_, i) => i);
    }
    const idx = candidates[Math.floor(this.rng() * candidates.length)];
    this.used.add(`${themeId}:${idx}`);
    const raw = list[idx];
    const options = shuffle([raw.a, ...raw.w], this.rng);
    return {
      themeId,
      sub: raw.sub,
      text: raw.q,
      options,
      correct: options.indexOf(raw.a),
      fact: raw.fact ?? null
    };
  }
  nextQuestion(now) {
    if (!this.themeId) return this.startVoting(now);
    this.roundQuestion++;
    for (const p of this.players) {
      p.choice = null;
      p.correct = null;
    }
    this.question = this.pickQuestion(this.themeId);
    this.phase = "question";
    this.setDeadline(now, this.durations.question);
  }
  reveal(now) {
    const q = this.question;
    for (const p of this.players) {
      const eligible = !this.suddenDeath || this.contenders.includes(p.id);
      if (!eligible) {
        p.correct = null;
        continue;
      }
      p.correct = p.choice === q.correct;
      if (this.suddenDeath) continue;
      if (p.correct) {
        p.score++;
        p.streak++;
      } else {
        p.streak = 0;
      }
    }
    this.phase = "reveal";
    this.setDeadline(now, this.durations.reveal);
  }
  afterReveal(now) {
    if (this.suddenDeath) {
      const right = this.contenders.filter((id) => this.getPlayer(id)?.correct);
      const stillHere = this.contenders.filter((id) => this.getPlayer(id));
      if (right.length === 1) return this.finish(right[0]);
      if (stillHere.length === 1) return this.finish(stillHere[0]);
      if (stillHere.length === 0) return this.finish(this.leaderId());
      if (right.length >= 2) this.contenders = right;
      return this.suddenDeathQuestion(now);
    }
    const winners = this.players.filter((p) => p.score >= this.winScore);
    if (winners.length === 1) return this.finish(winners[0].id);
    if (winners.length > 1) {
      this.suddenDeath = true;
      this.contenders = winners.map((p) => p.id);
      return this.suddenDeathQuestion(now);
    }
    if (this.roundQuestion >= this.questionsPerRound) return this.startVoting(now);
    return this.nextQuestion(now);
  }
  suddenDeathQuestion(now) {
    const themes = this.availableThemes();
    this.themeId = themes[Math.floor(this.rng() * themes.length)];
    this.themeOptions = [];
    this.roundQuestion = 0;
    this.phase = "chosen";
    this.setDeadline(now, this.durations.chosen);
  }
  leaderId() {
    return [...this.players].sort((a, b) => b.score - a.score)[0]?.id ?? null;
  }
  finish(winnerId) {
    this.winnerId = winnerId;
    this.phase = "gameover";
    this.suddenDeath = false;
    this.setDeadline(null, 0);
  }
  // ───────────────────────── visão pública ─────────────────────────
  /** Escolha do próprio jogador (enviada só para o celular dele) */
  choiceOf(playerId) {
    if (this.phase !== "question" && this.phase !== "reveal") return null;
    return this.getPlayer(playerId)?.choice ?? null;
  }
  view(joinUrl, now) {
    const revealing = this.phase === "reveal";
    return {
      phase: this.phase,
      hostId: this.hostId,
      winScore: this.winScore,
      questionsPerRound: this.questionsPerRound,
      themeOptions: this.themeOptions,
      themeId: this.themeId,
      roundQuestion: this.roundQuestion,
      round: this.round,
      deadline: this.deadline,
      duration: this.duration,
      suddenDeath: this.suddenDeath,
      winnerId: this.winnerId,
      joinUrl,
      serverNow: now,
      question: this.question && (this.phase === "question" || this.phase === "reveal") ? {
        themeId: this.question.themeId,
        sub: this.question.sub,
        text: this.question.text,
        options: this.question.options,
        correct: revealing ? this.question.correct : null,
        fact: revealing ? this.question.fact : null
      } : null,
      players: this.players.map((p) => ({
        id: p.id,
        name: p.name,
        seat: p.seat,
        score: p.score,
        streak: p.streak,
        connected: p.connected,
        isHost: p.id === this.hostId,
        answered: (this.phase === "question" || revealing) && p.choice !== null,
        vote: this.phase === "voting" ? p.vote : null,
        choice: revealing ? p.choice : null,
        correct: revealing ? p.correct : null,
        contender: this.suddenDeath && this.contenders.includes(p.id)
      }))
    };
  }
};
function cleanName(raw) {
  return (raw ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 14);
}
function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// shared/questions/filmes.ts
var questions = [
  { q: "Qual filme de 1997, dirigido por James Cameron, ganhou 11 Oscars?", a: "Titanic", w: ["Gladiador", "Cora\xE7\xE3o Valente", "O Resgate do Soldado Ryan"], fact: "Leonardo DiCaprio e Kate Winslet viveram o casal Jack e Rose." },
  { q: 'Quem dirigiu "Jurassic Park" (1993)?', a: "Steven Spielberg", w: ["James Cameron", "George Lucas", "Ridley Scott"], fact: "O filme \xE9 baseado no livro de Michael Crichton." },
  { q: 'A frase "Que a For\xE7a esteja com voc\xEA" \xE9 de qual saga?', a: "Star Wars", w: ["Star Trek", "Duna", "Matrix"], fact: "O primeiro filme da saga estreou em 1977." },
  { q: 'Em "Matrix", de que cor \xE9 a p\xEDlula que Neo escolhe tomar?', a: "Vermelha", w: ["Azul", "Verde", "Amarela"], fact: "A p\xEDlula azul o faria voltar \xE0 vida comum, sem saber a verdade." },
  { q: 'Qual ator interpretou o capit\xE3o Jack Sparrow em "Piratas do Caribe"?', a: "Johnny Depp", w: ["Orlando Bloom", "Brad Pitt", "Leonardo DiCaprio"], fact: "Depp foi indicado ao Oscar de Melhor Ator pelo papel." },
  { q: 'Em "O M\xE1gico de Oz" (1939), de que cor s\xE3o os sapatos de Dorothy?', a: "Vermelhos", w: ["Dourados", "Azuis", "Verdes"], fact: "No livro original de L. Frank Baum, os sapatos eram prateados." },
  { q: "Qual filme deu ao Brasil seu primeiro Oscar de Melhor Filme Internacional, em 2025?", a: "Ainda Estou Aqui", w: ["Central do Brasil", "Cidade de Deus", "O Pagador de Promessas"], fact: "Dirigido por Walter Salles, conta a hist\xF3ria de Eunice Paiva." },
  { q: 'Qual atriz foi indicada ao Oscar de Melhor Atriz por "Central do Brasil"?', a: "Fernanda Montenegro", w: ["Fernanda Torres", "S\xF4nia Braga", "Gl\xF3ria Pires"], fact: "Sua filha, Fernanda Torres, foi indicada na mesma categoria em 2025." },
  { q: 'Quem dirigiu "Pulp Fiction: Tempo de Viol\xEAncia"?', a: "Quentin Tarantino", w: ["Martin Scorsese", "Guy Ritchie", "Francis Ford Coppola"], fact: "O filme venceu a Palma de Ouro no Festival de Cannes de 1994." },
  { q: 'A frase "Eu vejo gente morta" \xE9 de qual filme?', a: "O Sexto Sentido", w: ["Os Outros", "O Exorcista", "Atividade Paranormal"], fact: "O menino Haley Joel Osment foi indicado ao Oscar pelo papel." },
  { q: 'Em "De Volta para o Futuro", qual carro vira m\xE1quina do tempo?', a: "DeLorean", w: ["Ferrari", "Mustang", "Fusca"], fact: "O carro precisa atingir 88 milhas por hora para viajar no tempo." },
  { q: 'Quem interpretou o Coringa em "Batman: O Cavaleiro das Trevas" (2008)?', a: "Heath Ledger", w: ["Joaquin Phoenix", "Jared Leto", "Jack Nicholson"], fact: "Ele ganhou o Oscar de Ator Coadjuvante ap\xF3s sua morte." },
  { q: "Qual foi o primeiro filme em l\xEDngua n\xE3o inglesa a vencer o Oscar de Melhor Filme?", a: "Parasita", w: ["Roma", "O Tigre e o Drag\xE3o", "A Vida \xE9 Bela"], fact: "O sul-coreano foi dirigido por Bong Joon-ho e premiado em 2020." },
  { q: "Qual ator interpretou Forrest Gump?", a: "Tom Hanks", w: ["Robin Williams", "Kevin Costner", "Jim Carrey"], fact: "Hanks venceu o Oscar de Melhor Ator dois anos seguidos: Filad\xE9lfia e Forrest Gump." },
  { q: 'A frase "Hasta la vista, baby" ficou famosa em qual filme?', a: "O Exterminador do Futuro 2", w: ["RoboCop", "Predador", "O Vingador do Futuro"], fact: 'J\xE1 o bord\xE3o "Eu voltarei" vem do primeiro filme, de 1984.' },
  { q: "Em qual casa de Hogwarts Harry Potter \xE9 selecionado?", a: "Grifin\xF3ria", w: ["Sonserina", "Corvinal", "Lufa-Lufa"], fact: "O Chap\xE9u Seletor chegou a considerar mand\xE1-lo para a Sonserina." },
  { q: 'Quantos Oscars ganhou "O Senhor dos An\xE9is: O Retorno do Rei"?', a: "11", w: ["7", "9", "13"], fact: "Venceu todas as 11 categorias em que foi indicado." },
  { q: 'Qual diretor fez "A Origem", "Interestelar" e "Oppenheimer"?', a: "Christopher Nolan", w: ["Denis Villeneuve", "Ridley Scott", "David Fincher"], fact: 'Nolan ganhou seu primeiro Oscar de Dire\xE7\xE3o por "Oppenheimer".' },
  { q: "Qual \xE9 o \xFAnico ator a ganhar tr\xEAs Oscars de Melhor Ator?", a: "Daniel Day-Lewis", w: ["Jack Nicholson", "Marlon Brando", "Anthony Hopkins"], fact: 'Venceu por "Meu P\xE9 Esquerdo", "Sangue Negro" e "Lincoln".' },
  { q: 'Quem interpretou Vito Corleone no primeiro "O Poderoso Chef\xE3o"?', a: "Marlon Brando", w: ["Al Pacino", "Robert De Niro", "Robert Duvall"], fact: "De Niro viveu o jovem Vito na Parte II e tamb\xE9m levou um Oscar." },
  { q: "Em qual cidade americana Rocky Balboa sobe a famosa escadaria?", a: "Filad\xE9lfia", w: ["Nova York", "Boston", "Chicago"], fact: "Os degraus do Museu de Arte da Filad\xE9lfia viraram ponto tur\xEDstico." },
  { q: 'Quem dirigiu "Cidade de Deus" (2002)?', a: "Fernando Meirelles", w: ["Walter Salles", "Jos\xE9 Padilha", "Kleber Mendon\xE7a Filho"], fact: "O filme recebeu 4 indica\xE7\xF5es ao Oscar, incluindo Melhor Dire\xE7\xE3o." },
  { q: 'Qual ator interpretou o Capit\xE3o Nascimento em "Tropa de Elite"?', a: "Wagner Moura", w: ["Selton Mello", "L\xE1zaro Ramos", "Rodrigo Santoro"], fact: "O filme ganhou o Urso de Ouro no Festival de Berlim em 2008." },
  { q: "Qual monstro gigante japon\xEAs estreou no cinema em 1954?", a: "Godzilla", w: ["King Kong", "Mothra", "Gamera"], fact: '"Godzilla Minus One" ganhou o Oscar de Efeitos Visuais em 2024.' },
  { q: "Em qual filme de 1939 a protagonista se chama Scarlett O'Hara?", a: "E o Vento Levou", w: ["Casablanca", "Cidad\xE3o Kane", "O Morro dos Ventos Uivantes"], fact: "Hattie McDaniel foi a primeira pessoa negra a ganhar um Oscar, por esse filme." },
  { q: "Qual ator interpretou o Homem de Ferro nos filmes da Marvel?", a: "Robert Downey Jr.", w: ["Chris Evans", "Chris Hemsworth", "Mark Ruffalo"], fact: 'Ele ganhou o Oscar de Ator Coadjuvante por "Oppenheimer".' },
  { q: 'Qual \xE9 o nome do psiquiatra canibal de "O Sil\xEAncio dos Inocentes"?', a: "Hannibal Lecter", w: ["Norman Bates", "Jack Torrance", "Freddy Krueger"], fact: "\xC9 um dos tr\xEAs filmes a vencer os cinco principais Oscars." },
  { q: 'Quem dirigiu o cl\xE1ssico do suspense "Psicose" (1960)?', a: "Alfred Hitchcock", w: ["Stanley Kubrick", "Orson Welles", "Billy Wilder"], fact: "Hitchcock nunca venceu um Oscar competitivo de Melhor Dire\xE7\xE3o." },
  { q: 'Qual ator grita "Aqui est\xE1 o Johnny!" em "O Iluminado"?', a: "Jack Nicholson", w: ["Christopher Walken", "Al Pacino", "Dustin Hoffman"], fact: "O filme de Stanley Kubrick \xE9 baseado num livro de Stephen King." },
  { q: 'Quem dirigiu o filme "Barbie" (2023)?', a: "Greta Gerwig", w: ["Sofia Coppola", "Kathryn Bigelow", "Chlo\xE9 Zhao"], fact: "Foi a maior bilheteria mundial de 2023." }
];
var filmes_default = questions;

// shared/questions/animes-classicos.ts
var questions2 = [
  { q: "Em Cavaleiros do Zod\xEDaco, Seiya \xE9 o cavaleiro de qual constela\xE7\xE3o?", a: "P\xE9gaso", w: ["Drag\xE3o", "Cisne", "F\xEAnix"], fact: "No Brasil, o anime estreou na Rede Manchete em 1994 e virou febre." },
  { q: "Qual deusa os Cavaleiros do Zod\xEDaco juram proteger?", a: "Atena", w: ["Hera", "Afrodite", "\xC1rtemis"], fact: "Saori Kido \xE9 a reencarna\xE7\xE3o de Atena na Terra." },
  { q: "Qual Cavaleiro de Bronze \xE9 o irm\xE3o mais velho de Shun de Andr\xF4meda?", a: "Ikki de F\xEAnix", w: ["Seiya de P\xE9gaso", "Hyoga de Cisne", "Shiryu de Drag\xE3o"] },
  { q: "Em qual regi\xE3o gelada Hyoga de Cisne treinou?", a: "Sib\xE9ria", w: ["Alasca", "Groenl\xE2ndia", "Ant\xE1rtida"] },
  { q: "Quantos Cavaleiros de Ouro protegem o Santu\xE1rio?", a: "12", w: ["7", "10", "13"], fact: "Um para cada signo do zod\xEDaco, cada um guardando uma das Doze Casas." },
  { q: 'Qual Cavaleiro de Ouro de Virgem \xE9 chamado de "o homem mais pr\xF3ximo de Deus"?', a: "Shaka", w: ["Mu", "Aiolia", "Camus"] },
  { q: "Quantas Esferas do Drag\xE3o \xE9 preciso reunir para invocar o drag\xE3o?", a: "7", w: ["5", "9", "12"], fact: "Ao reunir todas, aparece o drag\xE3o Shenlong para realizar um desejo." },
  { q: "Qual \xE9 o nome saiyajin de Goku?", a: "Kakaroto", w: ["Bardock", "Raditz", "Nappa"] },
  { q: "Quem ensinou o Kamehameha a Goku?", a: "Mestre Kame", w: ["Senhor Kaioh", "Kami-Sama", "Mestre Karin"], fact: "Mestre Kame levou 50 anos para desenvolver a t\xE9cnica." },
  { q: "Qual vil\xE3o de Dragon Ball Z destruiu o planeta Vegeta?", a: "Freeza", w: ["Cell", "Majin Boo", "Cooler"] },
  { q: "Qual \xE9 o nome da fus\xE3o de Goten e Trunks?", a: "Gotenks", w: ["Vegetto", "Gogeta", "Kefla"], fact: "Eles se fundem usando a Dan\xE7a da Fus\xE3o." },
  { q: "Quem \xE9 o criador do mang\xE1 Dragon Ball?", a: "Akira Toriyama", w: ["Masami Kurumada", "Eiichiro Oda", "Masashi Kishimoto"], fact: "Toriyama tamb\xE9m criou o visual dos personagens de Dragon Quest." },
  { q: "Quem derrota Cell com um Kamehameha em Dragon Ball Z?", a: "Gohan", w: ["Goku", "Vegeta", "Trunks"], fact: "Foi nessa luta que Gohan virou Super Saiyajin 2 pela primeira vez." },
  { q: "Qual Pok\xE9mon acompanha Ash desde o primeiro epis\xF3dio?", a: "Pikachu", w: ["Bulbasaur", "Charmander", "Squirtle"], fact: "Pikachu se recusa a ficar dentro da Pok\xE9bola." },
  { q: "Como se chama o grupo vil\xE3o formado por Jessie, James e Meowth?", a: "Equipe Rocket", w: ["Equipe Aqua", "Equipe Magma", "Equipe Gal\xE1ctica"] },
  { q: "Qual Pok\xE9mon lend\xE1rio Ash v\xEA voando no fim do primeiro epis\xF3dio?", a: "Ho-Oh", w: ["Lugia", "Moltres", "Articuno"], fact: "Ho-Oh apareceu no anime antes mesmo de existir nos jogos." },
  { q: "Na dublagem brasileira, qual \xE9 o nome da garota que vira Sailor Moon?", a: "Serena", w: ["Ami", "Rei", "Lita"], fact: "No original japon\xEAs, ela se chama Usagi Tsukino." },
  { q: "Qual \xE9 o nome da gata preta com uma lua na testa que orienta Sailor Moon?", a: "Luna", w: ["Artemis", "Diana", "Kuro"] },
  { q: "Quem \xE9 o detetive sobrenatural protagonista de Yu Yu Hakusho?", a: "Yusuke Urameshi", w: ["Kazuma Kuwabara", "Hiei", "Kurama"], fact: "Yusuke morre logo no primeiro epis\xF3dio ao salvar uma crian\xE7a." },
  { q: "Em Yu Yu Hakusho, qual guia de almas voa montada em um remo?", a: "Botan", w: ["Keiko", "Yukina", "Genkai"] },
  { q: 'O "X" de Samurai X faz refer\xEAncia a qu\xEA?', a: "Cicatriz no rosto de Kenshin", w: ["Bras\xE3o da espada de Kenshin", "S\xEDmbolo do cl\xE3 de Kenshin", "Tatuagem no bra\xE7o de Kenshin"], fact: "A espada de Kenshin tem a l\xE2mina invertida para n\xE3o matar." },
  { q: "Em qual era da hist\xF3ria japonesa se passa Samurai X?", a: "Era Meiji", w: ["Era Edo", "Per\xEDodo Sengoku", "Era Showa"], fact: "A hist\xF3ria come\xE7a em 1878, o 11\xBA ano da Era Meiji." },
  { q: "Qual criatura est\xE1 selada dentro de Naruto?", a: "Raposa de Nove Caudas", w: ["Tanuki de Uma Cauda", "Gato de Duas Caudas", "Macaco de Quatro Caudas"] },
  { q: "Quem \xE9 o irm\xE3o mais velho de Sasuke Uchiha?", a: "Itachi", w: ["Obito", "Madara", "Shisui"] },
  { q: "Quem pilota o EVA-01 em Neon Genesis Evangelion?", a: "Shinji Ikari", w: ["Asuka Langley", "Rei Ayanami", "Kaworu Nagisa"], fact: "Seu pai, Gendo Ikari, \xE9 o comandante da NERV." },
  { q: "Como s\xE3o chamadas as criaturas que atacam T\xF3quio-3 em Evangelion?", a: "Anjos", w: ["Tit\xE3s", "Kaijus", "Hollows"], fact: "A s\xE9rie estreou na TV japonesa em 1995." },
  { q: "Qual filme do Studio Ghibli ganhou o Oscar de Melhor Anima\xE7\xE3o em 2003?", a: "A Viagem de Chihiro", w: ["Meu Amigo Totoro", "Princesa Mononoke", "O Castelo Animado"], fact: "Em 2024, O Menino e a Gar\xE7a deu a Miyazaki seu segundo Oscar." },
  { q: "Quem dirigiu o filme Meu Amigo Totoro (1988)?", a: "Hayao Miyazaki", w: ["Isao Takahata", "Mamoru Hosoda", "Makoto Shinkai"], fact: "Totoro virou o s\xEDmbolo do logotipo do Studio Ghibli." },
  { q: "Em Digimon Adventure, qual \xE9 o Digimon parceiro de Tai?", a: "Agumon", w: ["Gabumon", "Patamon", "Tentomon"], fact: "Agumon digievolui para Greymon." },
  { q: "Qual emissora exibiu Cavaleiros do Zod\xEDaco e Yu Yu Hakusho nos anos 90?", a: "Rede Manchete", w: ["SBT", "Rede Globo", "Band"], fact: "A Rede Manchete saiu do ar em 1999." }
];
var animes_classicos_default = questions2;

// shared/questions/animes-modernos.ts
var questions3 = [
  { q: "Quem \xE9 o protagonista de Attack on Titan?", a: "Eren Yeager", w: ["Levi Ackerman", "Armin Arlert", "Reiner Braun"], fact: "No Jap\xE3o, a obra se chama Shingeki no Kyojin." },
  { q: "Quais s\xE3o os nomes das tr\xEAs muralhas de Attack on Titan?", a: "Maria, Rose e Sina", w: ["Maria, Sina e Eldia", "Rose, Ymir e Sina", "Maria, Rose e Paradis"], fact: "A Muralha Maria, a mais externa, \xE9 a primeira a cair." },
  { q: 'Em Attack on Titan, quem \xE9 chamado de "o soldado mais forte da humanidade"?', a: "Capit\xE3o Levi", w: ["Erwin Smith", "Hange Zo\xEB", "Mikasa Ackerman"] },
  { q: "Em Demon Slayer, qual \xE9 o nome da irm\xE3 de Tanjiro que virou oni?", a: "Nezuko", w: ["Kanao", "Shinobu", "Mitsuri"], fact: "Nezuko anda com um bambu na boca para n\xE3o morder ningu\xE9m." },
  { q: "Em 2020, qual filme superou A Viagem de Chihiro como maior bilheteria do Jap\xE3o?", a: "Demon Slayer: Mugen Train", w: ["Your Name", "One Piece Film: Red", "Jujutsu Kaisen 0"], fact: "O filme arrecadou mais de 40 bilh\xF5es de ienes no Jap\xE3o." },
  { q: "Qual t\xE9cnica de respira\xE7\xE3o Tanjiro aprende primeiro em Demon Slayer?", a: "Respira\xE7\xE3o da \xC1gua", w: ["Respira\xE7\xE3o das Chamas", "Respira\xE7\xE3o do Trov\xE3o", "Respira\xE7\xE3o da Fera"], fact: "Depois ele passa a usar a Dan\xE7a do Deus do Fogo, herdada do pai." },
  { q: "Qual maldi\xE7\xE3o passa a habitar o corpo de Yuji Itadori em Jujutsu Kaisen?", a: "Ryomen Sukuna", w: ["Mahito", "Jogo", "Hanami"], fact: "Yuji engole um dos dedos de Sukuna para salvar os amigos." },
  { q: "Qual professor de Jujutsu Kaisen usa venda nos olhos e \xE9 o feiticeiro mais forte?", a: "Satoru Gojo", w: ["Kento Nanami", "Suguru Geto", "Masamichi Yaga"] },
  { q: "Qual est\xFAdio produziu o anime de Jujutsu Kaisen?", a: "MAPPA", w: ["Ufotable", "Wit Studio", "Bones"], fact: "A MAPPA tamb\xE9m animou Chainsaw Man e a fase final de Attack on Titan." },
  { q: "Quantos quil\xF4metros Saitama corria por dia no treino que o deixou careca?", a: "10", w: ["5", "21", "42"], fact: "Al\xE9m de 100 flex\xF5es, 100 abdominais e 100 agachamentos, todo dia." },
  { q: "Qual ciborgue se torna disc\xEDpulo de Saitama em One Punch Man?", a: "Genos", w: ["Mumen Rider", "King", "Sonic"] },
  { q: "Como se chama o poder herdado por Deku em My Hero Academia?", a: "One For All", w: ["All For One", "Explos\xE3o", "Meio-Frio Meio-Quente"] },
  { q: 'Qual her\xF3i de My Hero Academia \xE9 conhecido como o "S\xEDmbolo da Paz"?', a: "All Might", w: ["Endeavor", "Hawks", "Eraserhead"] },
  { q: "Qual shinigami deixa cair o Death Note no mundo humano?", a: "Ryuk", w: ["Rem", "Sidoh", "Gelus"], fact: "Ryuk \xE9 viciado em ma\xE7\xE3s do mundo humano." },
  { q: "Qual apelido o p\xFAblico d\xE1 a Light Yagami em Death Note?", a: "Kira", w: ["L", "Near", "Mello"] },
  { q: "Em Death Note, quantos segundos ap\xF3s o nome ser escrito a v\xEDtima morre?", a: "40", w: ["10", "30", "60"], fact: "Se nenhuma causa for escrita, a morte \xE9 por ataque card\xEDaco." },
  { q: "Qual \xE9 o poder secreto de Anya em Spy x Family?", a: "Ler mentes", w: ["Ver o futuro", "Ficar invis\xEDvel", "Falar com animais"] },
  { q: "Qual \xE9 a profiss\xE3o secreta de Yor Forger em Spy x Family?", a: "Assassina", w: ["Espi\xE3", "Policial secreta", "Hacker"], fact: "De dia, ela trabalha na prefeitura de Berlint." },
  { q: "Qual \xE9 o codinome do espi\xE3o Loid Forger em Spy x Family?", a: "Twilight", w: ["Midnight", "Sunset", "Eclipse"] },
  { q: "Como se chama o dem\xF4nio-cachorro motosserra de Denji em Chainsaw Man?", a: "Pochita", w: ["Meowy", "Kon", "Beam"], fact: "Pochita se torna o cora\xE7\xE3o de Denji." },
  { q: "Quem \xE9 o autor do mang\xE1 Chainsaw Man?", a: "Tatsuki Fujimoto", w: ["Gege Akutami", "Hajime Isayama", "Koyoharu Gotouge"], fact: "Fujimoto tamb\xE9m criou Fire Punch e Look Back." },
  { q: "Em Naruto Shippuden, qual organiza\xE7\xE3o usa mantos pretos com nuvens vermelhas?", a: "Akatsuki", w: ["Anbu", "Raiz", "Sete Espadachins"] },
  { q: "Com quem Naruto treina durante os dois anos e meio antes de Shippuden?", a: "Jiraiya", w: ["Kakashi", "Iruka", "Yamato"], fact: "Jiraiya \xE9 o autor da s\xE9rie de livros Icha Icha, que Kakashi adora." },
  { q: "Em Fullmetal Alchemist, o que Alphonse perde ao tentar ressuscitar a m\xE3e?", a: "O corpo inteiro", w: ["O bra\xE7o direito", "A perna esquerda", "A mem\xF3ria"], fact: "Edward prende a alma do irm\xE3o em uma armadura." },
  { q: "Qual \xE9 a ra\xE7a de Frieren, protagonista de Frieren e a Jornada para o Al\xE9m?", a: "Elfa", w: ["An\xE3", "Humana", "Dem\xF4nio"], fact: "Frieren tem mais de mil anos de idade." },
  { q: "Em Frieren, como se chama o Her\xF3i do antigo grupo, cuja morte abre a hist\xF3ria?", a: "Himmel", w: ["Heiter", "Eisen", "Stark"], fact: "O grupo levou dez anos para derrotar o Rei Dem\xF4nio." },
  { q: "Qual forma Luffy revela na luta contra Kaido em Wano?", a: "Gear 5", w: ["Gear 4", "Boundman", "Snakeman"], fact: "Sua fruta \xE9, na verdade, a Hito Hito no Mi, modelo Nika." },
  { q: "Qual Imperador do Mar Luffy derrota na saga de Wano?", a: "Kaido", w: ["Big Mom", "Barba Negra", "Shanks"] },
  { q: "Quem dirigiu o filme Your Name (2016)?", a: "Makoto Shinkai", w: ["Mamoru Hosoda", "Hayao Miyazaki", "Satoshi Kon"] },
  { q: "Qual esporte \xE9 o tema do anime Haikyu!!?", a: "V\xF4lei", w: ["Basquete", "Futebol", "Beisebol"], fact: "Hinata se inspira em um jogador baixinho apelidado de Pequeno Gigante." }
];
var animes_modernos_default = questions3;

// shared/questions/desenhos-classicos.ts
var questions4 = [
  { q: "Qual \xE9 o famoso grito de alegria de Fred Flintstone?", a: "Yabba Dabba Doo!", w: ["Cowabunga!", "Shazam!", "Uh-hu!"], fact: "Fred trabalha numa pedreira operando um dinossauro." },
  { q: "Como se chama o vizinho e melhor amigo de Fred Flintstone?", a: "Barney", w: ["Dino", "Bambam", "Sr. Pedregulho"], fact: "Barney \xE9 casado com Betty, melhor amiga de Wilma." },
  { q: "Em qual cidade vivem os Flintstones?", a: "Bedrock", w: ["Springfield", "Pat\xF3polis", "Townsville"], fact: "Na cidade, tudo \xE9 feito de pedra, at\xE9 os carros." },
  { q: "Qual desenho de 1960 foi a primeira sitcom animada do hor\xE1rio nobre da TV americana?", a: "Os Flintstones", w: ["Os Jetsons", "Scooby-Doo", "Os Simpsons"], fact: "Ficou no ar por seis temporadas, de 1960 a 1966, na rede americana ABC." },
  { q: "Que ra\xE7a de cachorro \xE9 o Scooby-Doo?", a: "Dogue alem\xE3o", w: ["S\xE3o-bernardo", "Basset hound", "Labrador"], fact: "O desenho estreou em 1969." },
  { q: "Como se chama o dono magricela e comil\xE3o do Scooby-Doo?", a: "Salsicha", w: ["Fred", "Dino", "Pateta"], fact: "No original, ele se chama Shaggy." },
  { q: "Como se chama o furg\xE3o da turma do Scooby-Doo?", a: "M\xE1quina de Mist\xE9rio", w: ["Mach 5", "Ecto-1", "Carro Maluco"], fact: "No original, o furg\xE3o se chama Mystery Machine." },
  { q: "Que animal \xE9 o Jerry, de Tom & Jerry?", a: "Rato", w: ["Gato", "Hamster", "Esquilo"], fact: "Na estreia, em 1940, o gato Tom se chamava Jasper." },
  { q: "Quem criou Tom & Jerry?", a: "William Hanna e Joseph Barbera", w: ["Walt Disney e Ub Iwerks", "Chuck Jones e Tex Avery", "Stan Lee e Jack Kirby"], fact: "Eles criaram a dupla em 1940, ainda no est\xFAdio MGM." },
  { q: "Quantos Oscars os curtas de Tom & Jerry ganharam?", a: "Sete", w: ["Tr\xEAs", "Cinco", "Dez"], fact: "Muitos epis\xF3dios quase n\xE3o t\xEAm falas: a gra\xE7a est\xE1 na a\xE7\xE3o." },
  { q: "Qual \xE9 a cor do topete do Pica-Pau?", a: "Vermelho", w: ["Azul", "Amarelo", "Laranja"], fact: "No Brasil, o desenho foi exibido por d\xE9cadas na TV aberta." },
  { q: "O Pica-Pau nasceu no est\xFAdio de qual produtor?", a: "Walter Lantz", w: ["Walt Disney", "Chuck Jones", "Max Fleischer"], fact: "O personagem estreou nos cinemas em 1940." },
  { q: "Qual destes \xE9 um inimigo cl\xE1ssico do Pica-Pau?", a: "Zeca Urubu", w: ["Frajola", "Dick Vigarista", "Tom"], fact: "No original, ele se chama Buzz Buzzard." },
  { q: "De qual empresa o Coiote compra as engenhocas para pegar o Papa-L\xE9guas?", a: "ACME", w: ["Wayne Enterprises", "Stark Industries", "Umbrella"], fact: "Apesar de tantas inven\xE7\xF5es, o Coiote nunca pega o Papa-L\xE9guas." },
  { q: "Qual gato vive tentando pegar o can\xE1rio Piu-Piu?", a: "Frajola", w: ["Tom", "Manda-Chuva", "Garfield"], fact: 'O bord\xE3o do Piu-Piu \xE9 "Eu acho que vi um gatinho!".' },
  { q: "Em qual parque vive o Z\xE9 Colmeia?", a: "Jellystone", w: ["Yellowstone", "Central Park", "Bedrock"], fact: "O nome brinca com o parque real de Yellowstone, nos EUA." },
  { q: "Como se chama o companheiro baixinho do Z\xE9 Colmeia?", a: "Catatau", w: ["Bambam", "Muttley", "Dino"], fact: "Z\xE9 Colmeia vive tentando roubar as cestas de piquenique dos visitantes." },
  { q: "Manda-Chuva \xE9 o l\xEDder de uma turma de qu\xEA?", a: "Gatos de rua", w: ["C\xE3es de rua", "Ratos", "Pombos"], fact: "No original, ele se chama Top Cat." },
  { q: "Em Corrida Maluca, qual vil\xE3o trapaceiro anda com o c\xE3o Muttley?", a: "Dick Vigarista", w: ["Peter Perfeito", "Professor A\xE9reo", "Bar\xE3o Vermelho"], fact: "Apesar de tanta trapa\xE7a, ele nunca vence uma corrida." },
  { q: "O que Popeye come para ficar forte?", a: "Espinafre", w: ["Cenoura", "Br\xF3colis", "Feij\xE3o"], fact: "A namorada de Popeye \xE9 a Ol\xEDvia Palito." },
  { q: "Quem criou a Turma da M\xF4nica?", a: "Mauricio de Sousa", w: ["Ziraldo", "Monteiro Lobato", "Laerte"], fact: "A M\xF4nica foi inspirada em uma das filhas de Mauricio." },
  { q: "Qual \xE9 o nome do coelhinho de pel\xFAcia da M\xF4nica?", a: "Sans\xE3o", w: ["Floquinho", "Bidu", "Mingau"], fact: "A M\xF4nica usa o Sans\xE3o como arma contra os meninos." },
  { q: "Qual personagem da Turma da M\xF4nica morre de medo de \xE1gua?", a: "Casc\xE3o", w: ["Cebolinha", "Chico Bento", "Franjinha"], fact: "Ele foge at\xE9 de chuva para n\xE3o se molhar." },
  { q: "Qual personagem da Turma da M\xF4nica troca o R pelo L ao falar?", a: "Cebolinha", w: ["Casc\xE3o", "Chico Bento", "Franjinha"], fact: 'Ele vive bolando "planos infal\xEDveis" contra a M\xF4nica.' },
  { q: "Qual \xE9 a fruta preferida da comilona Magali?", a: "Melancia", w: ["Banana", "Ma\xE7\xE3", "Morango"], fact: "O gatinho de estima\xE7\xE3o da Magali se chama Mingau." },
  { q: "Qual Menina Superpoderosa usa a cor verde?", a: "Docinho", w: ["Florzinha", "Lindinha", "Pen\xE9lope"], fact: "Foram criadas com a\xE7\xFAcar, tempero, tudo que h\xE1 de bom e o Elemento X." },
  { q: "Qual \xE9 o nome da irm\xE3 que vive invadindo o laborat\xF3rio de Dexter?", a: "Dee Dee", w: ["Dot", "Mandy", "Mary"], fact: "O Laborat\xF3rio de Dexter estreou no Cartoon Network em 1996." },
  { q: "Em que ano o canal Cartoon Network foi lan\xE7ado nos EUA?", a: "1992", w: ["1985", "1998", "2001"], fact: "No in\xEDcio, o canal exibia principalmente desenhos antigos da Hanna-Barbera." },
  { q: "Em que tipo de casa mora o Bob Esponja?", a: "Num abacaxi", w: ["Numa pedra", "Num coco", "Numa concha"], fact: "O desenho estreou na Nickelodeon em 1999." },
  { q: "O protagonista de Hey Arnold! tem a cabe\xE7a no formato de qu\xEA?", a: "Bola de futebol americano", w: ["L\xE2mpada", "Ovo", "Pera"], fact: "Hey Arnold! estreou na Nickelodeon em 1996." }
];
var desenhos_classicos_default = questions4;

// shared/questions/mundo-geek.ts
var questions5 = [
  { q: "Quem \xE9 o pai de Luke Skywalker em Star Wars?", a: "Darth Vader", w: ["Obi-Wan Kenobi", "Darth Sidious", "Han Solo"], fact: "A revela\xE7\xE3o acontece em O Imp\xE9rio Contra-Ataca, de 1980." },
  { q: "Como se chama a nave de Han Solo em Star Wars?", a: "Millennium Falcon", w: ["Star Destroyer", "Slave I", "Tantive IV"], fact: "Han se gaba de ter feito o Percurso de Kessel em menos de 12 parsecs." },
  { q: "Qual \xE9 a cor do sabre de luz de Mace Windu?", a: "Roxo", w: ["Verde", "Azul", "Vermelho"], fact: "Samuel L. Jackson pediu a George Lucas um sabre roxo." },
  { q: "Qual \xE9 o nome do droide dourado e falante de Star Wars?", a: "C-3PO", w: ["R2-D2", "BB-8", "K-2SO"], fact: "Ele \xE9 fluente em mais de seis milh\xF5es de formas de comunica\xE7\xE3o." },
  { q: "Em que dia os f\xE3s comemoram o Dia de Star Wars?", a: "4 de maio", w: ["25 de maio", "1\xBA de abril", "31 de outubro"], fact: 'Trocadilho com "May the Fourth be with you".' },
  { q: "Qual \xE9 o nome da nave comandada pelo Capit\xE3o Kirk em Star Trek?", a: "USS Enterprise", w: ["USS Voyager", "USS Discovery", "USS Defiant"] },
  { q: "Em Star Trek, Spock \xE9 metade humano e metade o qu\xEA?", a: "Vulcano", w: ["Klingon", "Romulano", "Betazoide"], fact: "Leonard Nimoy criou a sauda\xE7\xE3o vulcana inspirado numa b\xEAn\xE7\xE3o judaica." },
  { q: "Quem escreveu O Senhor dos An\xE9is?", a: "J.R.R. Tolkien", w: ["C.S. Lewis", "George R.R. Martin", "Terry Pratchett"] },
  { q: "Em qual montanha o Um Anel precisa ser destru\xEDdo?", a: "Montanha da Perdi\xE7\xE3o", w: ["Montanha Solit\xE1ria", "Caradhras", "Monte Gundabad"], fact: "Ela fica em Mordor e tamb\xE9m \xE9 chamada de Orodruin." },
  { q: "Quantos membros formam a Sociedade do Anel?", a: "9", w: ["7", "8", "12"], fact: "Nove companheiros, para fazer frente aos nove Nazg\xFBl." },
  { q: 'Qual criatura chama o Um Anel de "meu precioso"?', a: "Gollum", w: ["Smaug", "Sauron", "Saruman"] },
  { q: "Qual \xE9 a identidade secreta do Homem de Ferro?", a: "Tony Stark", w: ["Steve Rogers", "Bruce Banner", "Bruce Wayne"] },
  { q: "De qual metal s\xE3o feitas as garras de Wolverine?", a: "Adamantium", w: ["Vibranium", "Uru", "Tit\xE2nio"], fact: "J\xE1 o escudo do Capit\xE3o Am\xE9rica \xE9 feito de vibranium." },
  { q: "Em qual cidade fict\xEDcia o Batman protege os cidad\xE3os?", a: "Gotham City", w: ["Metr\xF3polis", "Central City", "Star City"] },
  { q: "Qual \xE9 o planeta natal do Superman?", a: "Krypton", w: ["Thanagar", "Oa", "Apokolips"], fact: "Superman estreou em 1938, na revista Action Comics #1." },
  { q: "Quem criou o Homem-Aranha junto com o desenhista Steve Ditko?", a: "Stan Lee", w: ["Jack Kirby", "Bob Kane", "Jerry Siegel"], fact: "O her\xF3i estreou em Amazing Fantasy #15, em 1962." },
  { q: "Como se chama o martelo do Thor?", a: "Mjolnir", w: ["Rompe-Tormentas", "Gungnir", "Excalibur"] },
  { q: "Quantas Joias do Infinito Thanos procura reunir?", a: "6", w: ["5", "7", "9"], fact: "Espa\xE7o, Mente, Realidade, Poder, Tempo e Alma." },
  { q: "Qual \xE9 a ilha natal da Mulher-Maravilha?", a: "Themyscira", w: ["Atl\xE2ntida", "Avalon", "Asgard"], fact: "\xC9 a ilha das amazonas, escondida do resto do mundo." },
  { q: "Quem escreveu a graphic novel Watchmen?", a: "Alan Moore", w: ["Frank Miller", "Neil Gaiman", "Grant Morrison"], fact: "Foi desenhada por Dave Gibbons e publicada entre 1986 e 1987." },
  { q: "Em RPG de mesa, como se chama quem narra a aventura e controla o mundo?", a: "Mestre", w: ["L\xEDder", "Capit\xE3o", "Comandante"], fact: "Em Dungeons & Dragons, ele \xE9 chamado de Dungeon Master." },
  { q: "Em que ano foi lan\xE7ado o primeiro Dungeons & Dragons?", a: "1974", w: ["1968", "1981", "1990"], fact: "O jogo foi criado por Gary Gygax e Dave Arneson." },
  { q: "Qual RPG brasileiro de fantasia se passa no mundo de Arton?", a: "Tormenta", w: ["Old Dragon", "Ordem Paranormal", "Space Dragon"], fact: "Tormenta nasceu em 1999, nas p\xE1ginas da revista Drag\xE3o Brasil." },
  { q: "Qual autor criou as famosas Tr\xEAs Leis da Rob\xF3tica?", a: "Isaac Asimov", w: ["Arthur C. Clarke", "Philip K. Dick", "Ray Bradbury"] },
  { q: "No Guia do Mochileiro das Gal\xE1xias, qual \xE9 a resposta para a vida, o universo e tudo mais?", a: "42", w: ["7", "13", "100"], fact: "Em homenagem a Douglas Adams, f\xE3s celebram o Dia da Toalha em 25 de maio." },
  { q: "Qual computador de 2001: Uma Odisseia no Espa\xE7o se recusa a abrir as portas?", a: "HAL 9000", w: ["Skynet", "M\xE3e", "JARVIS"] },
  { q: "Como se chama o planeta des\xE9rtico de Duna?", a: "Arrakis", w: ["Tatooine", "Jakku", "Caladan"], fact: "\xC9 a \xFAnica fonte da especiaria melange no universo." },
  { q: "Qual carro vira m\xE1quina do tempo em De Volta para o Futuro?", a: "DeLorean", w: ["Mustang", "Camaro", "Fusca"], fact: "Para viajar no tempo, ele precisa atingir 88 milhas por hora." },
  { q: "Em Matrix, qual p\xEDlula Neo escolhe tomar?", a: "Vermelha", w: ["Azul", "Verde", "Branca"] },
  { q: "Em que ano foi lan\xE7ado o primeiro iPhone?", a: "2007", w: ["2005", "2008", "2010"], fact: "Steve Jobs apresentou o aparelho em janeiro de 2007." }
];
var mundo_geek_default = questions5;

// shared/questions/games.ts
var questions6 = [
  { q: "Qual \xE9 a profiss\xE3o do Mario, mascote da Nintendo?", a: "Encanador", w: ["Mec\xE2nico", "Eletricista", "Pedreiro"], fact: "O nome homenageia Mario Segale, dono de um galp\xE3o alugado pela Nintendo nos EUA." },
  { q: "Em The Legend of Zelda, qual \xE9 o nome do her\xF3i controlado pelo jogador?", a: "Link", w: ["Zelda", "Ganon", "Navi"], fact: "Muita gente acha que Zelda \xE9 o her\xF3i, mas ela \xE9 a princesa do reino de Hyrule." },
  { q: "Qual \xE9 a cor do Sonic, o ouri\xE7o da Sega?", a: "Azul", w: ["Vermelho", "Verde", "Amarelo"], fact: "O azul foi escolhido para combinar com o logotipo da Sega." },
  { q: "Qual Pok\xE9mon el\xE9trico e amarelo \xE9 o mascote da franquia?", a: "Pikachu", w: ["Raichu", "Pichu", "Jolteon"], fact: 'O nome mistura "pika" (fa\xEDsca) e "chu" (som de ratinho) em japon\xEAs.' },
  { q: "Em Minecraft, qual criatura verde explode ao chegar perto do jogador?", a: "Creeper", w: ["Enderman", "Zumbi", "Slime"], fact: "O Creeper surgiu de um erro ao modelar o porco do jogo." },
  { q: "Qual empresa criou o Fortnite?", a: "Epic Games", w: ["Riot Games", "Valve", "Activision"], fact: "Fortnite saiu em 2017, e o modo Battle Royale virou febre mundial." },
  { q: "Como se chama o irm\xE3o do Mario, que usa roupa verde?", a: "Luigi", w: ["Wario", "Waluigi", "Toad"], fact: "Luigi estreou no jogo Mario Bros., de 1983." },
  { q: "O que significa a sigla GTA, da s\xE9rie da Rockstar?", a: "Grand Theft Auto", w: ["Grand Total Action", "Great Turbo Arena", "Grand Tactical Assault"], fact: 'Nos EUA, "grand theft auto" \xE9 o termo jur\xEDdico para roubo de ve\xEDculo.' },
  { q: "Em Super Mario Bros., qual item faz o Mario ficar grande?", a: "Super Cogumelo", w: ["Flor de Fogo", "Super Estrela", "Moeda"], fact: "J\xE1 a Flor de Fogo d\xE1 ao Mario o poder de lan\xE7ar bolas de fogo." },
  { q: "Qual personagem da Nintendo \xE9 uma bolinha rosa que engole inimigos e copia poderes?", a: "Kirby", w: ["Jigglypuff", "Yoshi", "Toad"], fact: "Kirby foi criado por Masahiro Sakurai, tamb\xE9m criador de Super Smash Bros." },
  { q: "Qual \xE9 o nome da raposa de duas caudas, melhor amiga do Sonic?", a: "Tails", w: ["Knuckles", "Amy Rose", "Shadow"], fact: 'O nome completo dele \xE9 Miles Prower, trocadilho com "miles per hour".' },
  { q: "Em Street Fighter, qual golpe do Ryu lan\xE7a uma bola de energia?", a: "Hadouken", w: ["Shoryuken", "Tatsumaki", "Sonic Boom"], fact: "O Shoryuken \xE9 o famoso soco girat\xF3rio para cima de Ryu e Ken." },
  { q: "Qual lutador de Street Fighter II \xE9 brasileiro e tem a pele verde?", a: "Blanka", w: ["Dhalsim", "Zangief", "E. Honda"], fact: "Blanka solta descargas el\xE9tricas e cresceu na selva brasileira." },
  { q: 'Qual ninja de Mortal Kombat usa um arp\xE3o e grita "Get over here!"?', a: "Scorpion", w: ["Sub-Zero", "Reptile", "Smoke"], fact: "Scorpion e Sub-Zero s\xE3o rivais desde o primeiro Mortal Kombat, de 1992." },
  { q: "Quem \xE9 o criador de Super Mario e The Legend of Zelda?", a: "Shigeru Miyamoto", w: ["Satoru Iwata", "Yuji Naka", "Hironobu Sakaguchi"], fact: "Miyamoto tamb\xE9m criou Donkey Kong, de 1981." },
  { q: "Em Pok\xE9mon Red e Blue, qual dos Pok\xE9mon iniciais \xE9 do tipo Fogo?", a: "Charmander", w: ["Squirtle", "Bulbasaur", "Pikachu"], fact: "Charmander evolui para Charmeleon e depois para Charizard." },
  { q: "Em qual cidade fict\xEDcia se passa GTA V?", a: "Los Santos", w: ["Vice City", "Liberty City", "San Fierro"], fact: "Los Santos \xE9 inspirada em Los Angeles." },
  { q: "GTA Vice City foi inspirado em qual cidade real dos EUA?", a: "Miami", w: ["Nova York", "Los Angeles", "Las Vegas"], fact: "O jogo se passa em 1986 e tem trilha sonora cheia de hits dos anos 80." },
  { q: "A s\xE9rie de futebol da EA virou EA Sports FC em 2023. Qual era o nome antigo?", a: "FIFA", w: ["PES", "Winning Eleven", "Football Manager"], fact: "A troca veio com o fim do acordo de licen\xE7a com a entidade FIFA." },
  { q: "Qual \xE9 o nome do cientista vil\xE3o que vive enfrentando o Sonic?", a: "Dr. Eggman", w: ["Dr. Wily", "Dr. Neo Cortex", "Dr. Mario"], fact: "No Ocidente, ele ficou conhecido por anos como Dr. Robotnik." },
  { q: "Em qual jogo de 1980 os fantasmas se chamam Blinky, Pinky, Inky e Clyde?", a: "Pac-Man", w: ["Space Invaders", "Galaga", "Frogger"], fact: "Pac-Man foi criado por Toru Iwatani, da Namco." },
  { q: 'Em Mortal Kombat, como se chama o golpe final dado ap\xF3s o "Finish Him!"?', a: "Fatality", w: ["Ultra Combo", "Super Arte", "Combo Breaker"], fact: "Pol\xEAmicas com jogos como Mortal Kombat levaram \xE0 cria\xE7\xE3o da ESRB, em 1994." },
  { q: "Qual s\xE9rie da Rockstar Games se passa no Velho Oeste americano?", a: "Red Dead Redemption", w: ["Max Payne", "Bully", "Midnight Club"], fact: "Red Dead Redemption 2 (2018) acompanha o fora da lei Arthur Morgan." },
  { q: "Em qual franquia de tiro o protagonista \xE9 o soldado Master Chief?", a: "Halo", w: ["Gears of War", "Destiny", "Call of Duty"], fact: "Halo: Combat Evolved estreou junto com o primeiro Xbox, em 2001." },
  { q: "Em Donkey Kong (1981), por qual nome o Mario era chamado?", a: "Jumpman", w: ["Hammerman", "Mr. Barrel", "Kong Kid"], fact: "Nesse jogo ele era carpinteiro, e n\xE3o encanador." },
  { q: "Em qual pa\xEDs foi criado o Tetris, em 1984?", a: "Uni\xE3o Sovi\xE9tica", w: ["Jap\xE3o", "Estados Unidos", "Alemanha Oriental"], fact: "O criador \xE9 o engenheiro Alexey Pajitnov, que o desenvolveu em Moscou." },
  { q: "Qual \xE9 o nome da fada que acompanha Link em Ocarina of Time?", a: "Navi", w: ["Tatl", "Midna", "Fi"], fact: 'Navi ficou famosa pelo bord\xE3o "Hey! Listen!".' },
  { q: "Qual designer japon\xEAs \xE9 o criador da s\xE9rie Metal Gear?", a: "Hideo Kojima", w: ["Shigeru Miyamoto", "Hironobu Sakaguchi", "Shinji Mikami"], fact: "Kojima tamb\xE9m criou Death Stranding, lan\xE7ado em 2019." },
  { q: "Quem \xE9 o criador da s\xE9rie The Sims?", a: "Will Wright", w: ["Sid Meier", "Peter Molyneux", "John Romero"], fact: "Will Wright tamb\xE9m criou SimCity, lan\xE7ado em 1989." },
  { q: "Qual programador sueco criou o Minecraft?", a: 'Markus "Notch" Persson', w: ["Gabe Newell", "John Carmack", "Toby Fox"], fact: "A Microsoft comprou a Mojang, dona do Minecraft, em 2014 por US$ 2,5 bilh\xF5es." }
];
var games_default = questions6;

// shared/questions/consoles.ts
var questions7 = [
  { q: "Qual empresa fabrica o PlayStation?", a: "Sony", w: ["Microsoft", "Nintendo", "Sega"], fact: "O PlayStation nasceu de uma parceria frustrada entre Sony e Nintendo." },
  { q: "Qual empresa fabrica o Xbox?", a: "Microsoft", w: ["Sony", "Nintendo", "Sega"], fact: 'O nome vem de "DirectX Box", refer\xEAncia \xE0 tecnologia gr\xE1fica DirectX.' },
  { q: "Quais s\xEDmbolos aparecem nos bot\xF5es do controle do PlayStation?", a: "Tri\xE2ngulo, c\xEDrculo, X e quadrado", w: ["A, B, X e Y", "Estrela, lua, sol e nuvem", "Seta, ponto, X e losango"], fact: "O tri\xE2ngulo representa ponto de vista e o quadrado, um menu ou folha de papel." },
  { q: "Qual console da Nintendo, de 2017, funciona na TV e tamb\xE9m como port\xE1til?", a: "Nintendo Switch", w: ["Wii U", "Nintendo 3DS", "Wii"], fact: "Seus controles destac\xE1veis se chamam Joy-Con." },
  { q: "Qual console da Nintendo popularizou o controle com sensor de movimento?", a: "Wii", w: ["GameCube", "Nintendo 64", "Super Nintendo"], fact: "O Wii vendeu mais de 100 milh\xF5es de unidades no mundo." },
  { q: "Qual console port\xE1til da Nintendo tinha duas telas?", a: "Nintendo DS", w: ["Game Boy Advance", "PSP", "Game Boy Color"], fact: "A tela de baixo era sens\xEDvel ao toque e usada com uma canetinha (stylus)." },
  { q: "Qual empresa lan\xE7ou o port\xE1til Game Boy, em 1989?", a: "Nintendo", w: ["Sega", "Sony", "Atari"], fact: "Nos EUA e na Europa, o Game Boy vinha com Tetris na caixa." },
  { q: "Qual console da Sony foi lan\xE7ado em novembro de 2020?", a: "PlayStation 5", w: ["PlayStation 4 Pro", "PlayStation 4", "PS Vita"], fact: "Foi lan\xE7ado em plena pandemia e ficou dif\xEDcil de achar nas lojas." },
  { q: "Qual console de 1977 marcou \xE9poca com jogos como Pitfall! e River Raid?", a: "Atari 2600", w: ["Odyssey", "Intellivision", "ColecoVision"], fact: "Seu controle cl\xE1ssico tinha um manche e um \xFAnico bot\xE3o." },
  { q: "O famoso Polystation imitava o visual de qual console?", a: "PlayStation", w: ["Nintendo 64", "Xbox", "Mega Drive"], fact: "Por dentro, era um clone do Nintendinho, com jogos de 8 bits." },
  { q: "Qual apelido o NES, da Nintendo, ganhou no Brasil?", a: "Nintendinho", w: ["Nintend\xE3o", "Ninjinha", "Famic\xE3o"], fact: "No Jap\xE3o, o console se chamava Famicom (Family Computer)." },
  { q: "Qual console da Nintendo tinha um controle com tr\xEAs pontas de empunhadura?", a: "Nintendo 64", w: ["GameCube", "Super Nintendo", "Wii U"], fact: "Foi o primeiro controle da Nintendo com direcional anal\xF3gico." },
  { q: "Como o Mega Drive se chamava nos Estados Unidos?", a: "Genesis", w: ["Saturn", "Pegasus", "Dreamcast"], fact: "O Mega Drive foi lan\xE7ado no Jap\xE3o em 1988." },
  { q: "Qual empresa lan\xE7ou oficialmente o Master System e o Mega Drive no Brasil?", a: "Tectoy", w: ["Gradiente", "Estrela", "Polyvox"], fact: "Por aqui, o Master System seguiu \xE0 venda por d\xE9cadas, bem depois do resto do mundo." },
  { q: "Qual mascote da Sega era o rosto do Master System antes do Sonic?", a: "Alex Kidd", w: ["Wonder Boy", "Ristar", "Opa-Opa"], fact: "Muitos Master System vendidos no Brasil vinham com Alex Kidd na mem\xF3ria." },
  { q: "Al\xE9m dos jogos, qual recurso fez o PlayStation 2 virar sucesso nas salas?", a: "Tocar filmes em DVD", w: ["Gravar programas de TV", "Tocar fitas VHS", "Acessar TV a cabo"], fact: "Para muita gente, o PS2 foi o primeiro aparelho de DVD da casa." },
  { q: "Qual port\xE1til da Sony, lan\xE7ado em 2004, usava discos chamados UMD?", a: "PSP", w: ["PS Vita", "Game Gear", "Nintendo DS"], fact: "O sucessor do PSP foi o PS Vita, lan\xE7ado em 2011." },
  { q: "Qual console da Microsoft foi lan\xE7ado em 2005?", a: "Xbox 360", w: ["Xbox One", "Xbox Series X", "Xbox One S"], fact: 'Ficou marcado pelo defeito das luzes vermelhas, o "Red Ring of Death".' },
  { q: "Qual acess\xF3rio de 2010 permitia jogar Xbox 360 s\xF3 com o corpo, sem controle?", a: "Kinect", w: ["EyeToy", "PlayStation Move", "Wii Balance Board"], fact: "Usava uma c\xE2mera e um sensor de profundidade para ler os movimentos." },
  { q: "Quais novidades o controle DualShock trouxe ao primeiro PlayStation?", a: "Anal\xF3gicos e vibra\xE7\xE3o", w: ["Touchpad e luz", "Microfone e alto-falante", "Tela e sensor de movimento"], fact: 'O nome "Dual Shock" vem dos dois motores de vibra\xE7\xE3o do controle.' },
  { q: "Antes dos videogames, a Nintendo era famosa por fabricar o qu\xEA?", a: "Cartas de baralho", w: ["R\xE1dios", "Bicicletas", "Rel\xF3gios"], fact: "A Nintendo foi fundada em 1889, em Kyoto, no Jap\xE3o." },
  { q: "O Super Nintendo e o Mega Drive eram consoles de quantos bits?", a: "16 bits", w: ["8 bits", "32 bits", "64 bits"], fact: 'A rivalidade entre os dois ficou conhecida como a "guerra dos consoles".' },
  { q: "Qual foi o primeiro console de videogame dom\xE9stico da hist\xF3ria, de 1972?", a: "Magnavox Odyssey", w: ["Atari 2600", "Intellivision", "Telejogo"], fact: 'Foi criado por Ralph Baer, chamado de "pai dos videogames".' },
  { q: 'Quem \xE9 conhecido como o "pai do PlayStation"?', a: "Ken Kutaragi", w: ["Satoru Iwata", "Masaya Nakamura", "Shigeru Miyamoto"], fact: "Kutaragi era engenheiro da Sony e liderou o projeto do console." },
  { q: "Qual engenheiro da Nintendo criou o Game Boy?", a: "Gunpei Yokoi", w: ["Satoru Iwata", "Ken Kutaragi", "Shigeru Miyamoto"], fact: "Yokoi tamb\xE9m criou os port\xE1teis da linha Game & Watch." },
  { q: "Em que ano o primeiro PlayStation foi lan\xE7ado no Jap\xE3o?", a: "1994", w: ["1992", "1996", "1998"], fact: "Nos EUA e na Europa, ele chegou s\xF3 em 1995." },
  { q: "Qual foi o \xFAltimo console de mesa lan\xE7ado pela Sega?", a: "Dreamcast", w: ["Saturn", "Mega Drive", "Master System"], fact: "Depois do Dreamcast, a Sega passou a fazer jogos para consoles de outras marcas." },
  { q: "Que tipo de disco o Nintendo GameCube usava?", a: "Mini DVD de 8 cm", w: ["Cartucho", "CD comum", "Blu-ray"], fact: "O GameCube tinha uma al\xE7a na parte de tr\xE1s para facilitar o transporte." },
  { q: "Qual empresa brasileira lan\xE7ou o Phantom System, clone do NES?", a: "Gradiente", w: ["Tectoy", "Dynacom", "CCE"], fact: "Outro clone famoso por aqui era o Dynavision, da Dynacom." },
  { q: "Que jogo do Atari 2600 teve cartuchos enterrados num deserto dos EUA?", a: "E.T.", w: ["Enduro", "Pitfall!", "Boxing"], fact: "Os cartuchos foram desenterrados em 2014 em Alamogordo, no Novo M\xE9xico." }
];
var consoles_default = questions7;

// shared/questions/musica.ts
var questions8 = [
  // ===== ROCK =====
  { sub: "rock", q: "Freddie Mercury foi o vocalista de qual banda brit\xE2nica?", a: "Queen", w: ["Led Zeppelin", "The Who", "Pink Floyd"], fact: "Freddie nasceu em Zanzibar, na \xC1frica, com o nome Farrokh Bulsara." },
  { sub: "rock", q: "Quem \xE9 o vocalista dos Rolling Stones?", a: "Mick Jagger", w: ["Keith Richards", "Roger Daltrey", "Robert Plant"], fact: "Keith Richards \xE9 o guitarrista e parceiro de composi\xE7\xE3o de Jagger." },
  { sub: "rock", q: 'Qual banda gravou "Smells Like Teen Spirit"?', a: "Nirvana", w: ["Pearl Jam", "Soundgarden", "Foo Fighters"], fact: "A m\xFAsica abre o \xE1lbum Nevermind, de 1991." },
  { sub: "rock", q: 'Qual banda brasileira gravou "Pais e Filhos"?', a: "Legi\xE3o Urbana", w: ["Tit\xE3s", "Paralamas do Sucesso", "Bar\xE3o Vermelho"], fact: "Est\xE1 no \xE1lbum As Quatro Esta\xE7\xF5es, de 1989." },
  { sub: "rock", q: 'Qual banda lan\xE7ou o \xE1lbum "The Dark Side of the Moon" (1973)?', a: "Pink Floyd", w: ["Genesis", "Yes", "Deep Purple"], fact: "Ficou mais de 900 semanas na parada de \xE1lbuns da Billboard." },
  { sub: "rock", q: "Antes de fundar o Foo Fighters, Dave Grohl era baterista de qual banda?", a: "Nirvana", w: ["Pearl Jam", "Soundgarden", "Alice in Chains"], fact: "Grohl gravou sozinho quase todos os instrumentos do 1\xBA disco do Foo Fighters." },
  { sub: "rock", q: "Quem foi o primeiro vocalista do Bar\xE3o Vermelho?", a: "Cazuza", w: ["Frejat", "Renato Russo", "Lob\xE3o"], fact: "Cazuza saiu em 1985 para seguir carreira solo, e Frejat assumiu o vocal." },
  { sub: "rock", q: "Em qual cidade inglesa os Beatles se formaram?", a: "Liverpool", w: ["Manchester", "Londres", "Birmingham"], fact: "O Cavern Club, em Liverpool, foi palco de centenas de shows da banda." },
  { sub: "rock", q: "Qual guitarrista do Queen \xE9 doutor em astrof\xEDsica?", a: "Brian May", w: ["John Deacon", "Roger Taylor", "Jimmy Page"], fact: "Brian May concluiu o doutorado em 2007, d\xE9cadas depois de come\xE7ar." },
  { sub: "rock", q: 'Qual banda lan\xE7ou o \xE1lbum "Appetite for Destruction" (1987)?', a: "Guns N' Roses", w: ["Bon Jovi", "M\xF6tley Cr\xFCe", "Aerosmith"], fact: `O disco traz "Sweet Child o' Mine" e "Welcome to the Jungle".` },
  // ===== POP =====
  { sub: "pop", q: 'Qual cantora \xE9 conhecida como a "Rainha do Pop"?', a: "Madonna", w: ["Britney Spears", "Lady Gaga", "Mariah Carey"], fact: "Madonna \xE9 a artista solo feminina com mais discos vendidos da hist\xF3ria." },
  { sub: "pop", q: 'Quem ganhou o t\xEDtulo de "Rei do Pop"?', a: "Michael Jackson", w: ["Prince", "Elvis Presley", "Justin Timberlake"], fact: 'Elvis Presley, por sua vez, \xE9 chamado de "Rei do Rock".' },
  { sub: "pop", q: 'Qual cantora fez a turn\xEA "The Eras Tour"?', a: "Taylor Swift", w: ["Beyonc\xE9", "Ariana Grande", "Katy Perry"], fact: "Virou a turn\xEA de maior bilheteria da hist\xF3ria, passando de US$ 2 bilh\xF5es." },
  { sub: "pop", q: "Qual \xE1lbum de Michael Jackson \xE9 considerado o mais vendido da hist\xF3ria?", a: "Thriller", w: ["Bad", "Off the Wall", "Dangerous"], fact: 'Thriller foi lan\xE7ado em 1982 e tem "Billie Jean" e "Beat It".' },
  { sub: "pop", q: "Qual \xE9 o nome verdadeiro de Lady Gaga?", a: "Stefani Germanotta", w: ["Alecia Moore", "Katheryn Hudson", "Robyn Fenty"], fact: "Os outros nomes s\xE3o de P!nk, Katy Perry e Rihanna." },
  { sub: "pop", q: "Rihanna nasceu em qual pa\xEDs?", a: "Barbados", w: ["Jamaica", "Trinidad e Tobago", "Bahamas"], fact: "Em 2021, Barbados declarou Rihanna hero\xEDna nacional." },
  { sub: "pop", q: 'Quem canta o hit "Shape of You" (2017)?', a: "Ed Sheeran", w: ["Sam Smith", "Shawn Mendes", "Harry Styles"], fact: "Foi uma das primeiras m\xFAsicas a passar de 3 bilh\xF5es de plays no Spotify." },
  { sub: "pop", q: "Antes da carreira solo, Beyonc\xE9 fazia parte de qual grupo?", a: "Destiny's Child", w: ["TLC", "Spice Girls", "Fifth Harmony"], fact: 'O grupo estourou com hits como "Say My Name" e "Survivor".' },
  { sub: "pop", q: "Bruno Mars nasceu em qual estado americano?", a: "Hava\xED", w: ["Calif\xF3rnia", "Fl\xF3rida", "Nevada"], fact: "Ele nasceu em Honolulu e imitava Elvis Presley quando crian\xE7a." },
  { sub: "pop", q: 'Qual Spice Girl era conhecida como "Posh Spice"?', a: "Victoria Beckham", w: ["Geri Halliwell", "Mel B", "Emma Bunton"], fact: "Victoria \xE9 casada com o ex-jogador de futebol David Beckham." },
  // ===== K-POP =====
  { sub: "kpop", q: 'Qual grupo de K-pop lan\xE7ou o hit "Dynamite" (2020)?', a: "BTS", w: ["EXO", "Stray Kids", "SEVENTEEN"], fact: "Foi a 1\xAA m\xFAsica do BTS toda em ingl\xEAs e estreou em 1\xBA na Billboard Hot 100." },
  { sub: "kpop", q: 'Qual artista coreano estourou no mundo com "Gangnam Style"?', a: "PSY", w: ["G-Dragon", "Rain", "Jay Park"], fact: "Foi o primeiro v\xEDdeo do YouTube a passar de 1 bilh\xE3o de visualiza\xE7\xF5es." },
  { sub: "kpop", q: "Quantas integrantes tem o BLACKPINK?", a: "Quatro", w: ["Tr\xEAs", "Cinco", "Seis"], fact: "Jisoo, Jennie, Ros\xE9 e Lisa formam o grupo." },
  { sub: "kpop", q: "Lisa, do BLACKPINK, nasceu em qual pa\xEDs?", a: "Tail\xE2ndia", w: ["Coreia do Sul", "Jap\xE3o", "Filipinas"], fact: "Lisa se mudou para a Coreia ainda adolescente para treinar como trainee." },
  { sub: "kpop", q: "Como se chama o fandom do BTS?", a: "ARMY", w: ["BLINK", "ONCE", "CARAT"], fact: "BLINK, ONCE e CARAT s\xE3o os f\xE3s de BLACKPINK, TWICE e SEVENTEEN." },
  { sub: "kpop", q: "Ros\xE9, do BLACKPINK, lan\xE7ou qual hit com Bruno Mars em 2024?", a: "APT.", w: ["Die With a Smile", "Flower", "Money"], fact: "O t\xEDtulo vem de um jogo de bebida popular entre jovens coreanos." },
  { sub: "kpop", q: 'Qual grupo feminino lan\xE7ou o hit "Super Shy" (2023)?', a: "NewJeans", w: ["IVE", "aespa", "LE SSERAFIM"], fact: "O NewJeans estreou em 2022 e virou fen\xF4meno logo no primeiro ano." },
  { sub: "kpop", q: "Qual empresa criou e lan\xE7ou o BTS?", a: "Big Hit (hoje HYBE)", w: ["SM Entertainment", "YG Entertainment", "JYP Entertainment"], fact: "Com o sucesso do BTS, a Big Hit cresceu e virou o conglomerado HYBE." },
  { sub: "kpop", q: "Quem \xE9 o l\xEDder do BTS?", a: "RM", w: ["Jin", "Suga", "Jungkook"], fact: "RM aprendeu ingl\xEAs assistindo \xE0 s\xE9rie Friends." },
  { sub: "kpop", q: 'Qual grupo feminino lan\xE7ou "Next Level" e tem avatares virtuais no conceito?', a: "aespa", w: ["ITZY", "Red Velvet", "(G)I-DLE"], fact: 'Cada integrante do aespa tem uma vers\xE3o virtual chamada "ae".' },
  // ===== METAL =====
  { sub: "metal", q: 'Qual vocalista do Black Sabbath ficou conhecido como "Pr\xEDncipe das Trevas"?', a: "Ozzy Osbourne", w: ["Ronnie James Dio", "Bruce Dickinson", "Rob Halford"], fact: "Ozzy morreu em julho de 2025, poucas semanas ap\xF3s seu show de despedida." },
  { sub: "metal", q: "Qual banda brasileira foi fundada pelos irm\xE3os Max e Iggor Cavalera?", a: "Sepultura", w: ["Angra", "Krisiun", "Ratos de Por\xE3o"], fact: "O Sepultura surgiu em Belo Horizonte, em 1984." },
  { sub: "metal", q: 'Qual banda gravou "Enter Sandman"?', a: "Metallica", w: ["Megadeth", "Slayer", "Anthrax"], fact: 'A m\xFAsica abre o "Black Album", de 1991.' },
  { sub: "metal", q: "Qual \xE9 o nome do mascote do Iron Maiden?", a: "Eddie", w: ["Vic Rattlehead", "Snaggletooth", "Deathbat"], fact: "Eddie aparece em praticamente todas as capas de disco da banda." },
  { sub: "metal", q: "Dave Mustaine foi expulso de qual banda antes de fundar o Megadeth?", a: "Metallica", w: ["Slayer", "Anthrax", "Exodus"], fact: "Ele foi demitido em 1983 e substitu\xEDdo por Kirk Hammett." },
  { sub: "metal", q: "Qual banda alem\xE3 canta em alem\xE3o e \xE9 famosa pelos shows com fogo?", a: "Rammstein", w: ["Scorpions", "Accept", "Kreator"], fact: "O vocalista Till Lindemann tem licen\xE7a oficial de pirot\xE9cnico." },
  { sub: "metal", q: "O cantor Andr\xE9 Matos ficou famoso como vocalista de qual banda?", a: "Angra", w: ["Sepultura", "Krisiun", "Korzus"], fact: "O Angra mistura heavy metal com m\xFAsica cl\xE1ssica e ritmos brasileiros." },
  { sub: "metal", q: "Al\xE9m de cantor do Iron Maiden, Bruce Dickinson tamb\xE9m \xE9:", a: "Piloto de avi\xE3o", w: ["M\xE9dico cirurgi\xE3o", "Professor de qu\xEDmica", "Chef de cozinha"], fact: 'Ele pilotou o jato da banda, apelidado de "Ed Force One".' },
  { sub: "metal", q: "Lemmy Kilmister foi o l\xEDder de qual banda?", a: "Mot\xF6rhead", w: ["Venom", "Saxon", "Judas Priest"], fact: 'O hino da banda \xE9 "Ace of Spades", de 1980.' },
  { sub: "metal", q: 'Rob Halford, o "Metal God", \xE9 vocalista de qual banda?', a: "Judas Priest", w: ["Saxon", "Dio", "Manowar"], fact: "O Judas Priest popularizou o visual de couro e tachas no metal." },
  // ===== MPB =====
  { sub: "mpb", q: 'Qual cantora era conhecida pelo apelido de "Pimentinha"?', a: "Elis Regina", w: ["Gal Costa", "Maria Beth\xE2nia", "Nara Le\xE3o"], fact: "O apelido foi dado por Vinicius de Moraes, por causa do temperamento dela." },
  { sub: "mpb", q: "Caetano Veloso \xE9 irm\xE3o de qual cantora?", a: "Maria Beth\xE2nia", w: ["Gal Costa", "Elis Regina", "Marisa Monte"], fact: "Os dois nasceram em Santo Amaro da Purifica\xE7\xE3o, na Bahia." },
  { sub: "mpb", q: 'Quem canta "Aquarela" (1983)?', a: "Toquinho", w: ["Vinicius de Moraes", "Chico Buarque", "Ivan Lins"], fact: "A m\xFAsica \xE9 uma vers\xE3o de uma can\xE7\xE3o italiana feita por Toquinho e Maurizio Fabrizio." },
  { sub: "mpb", q: "Qual movimento dos anos 60 foi liderado por Caetano Veloso e Gilberto Gil?", a: "Tropic\xE1lia", w: ["Jovem Guarda", "Bossa Nova", "Clube da Esquina"], fact: 'O disco-manifesto "Tropic\xE1lia ou Panis et Circencis" saiu em 1968.' },
  { sub: "mpb", q: "Milton Nascimento \xE9 um dos nomes centrais de qual movimento?", a: "Clube da Esquina", w: ["Tropic\xE1lia", "Vanguarda Paulista", "Manguebeat"], fact: "O nome vem de uma esquina de Belo Horizonte onde os amigos se reuniam." },
  { sub: "mpb", q: "Djavan nasceu em qual estado?", a: "Alagoas", w: ["Pernambuco", "Bahia", "Sergipe"], fact: "Djavan \xE9 de Macei\xF3 e lan\xE7ou seu primeiro disco em 1976." },
  { sub: "mpb", q: "Gilberto Gil foi ministro de qual pasta no governo federal?", a: "Cultura", w: ["Educa\xE7\xE3o", "Meio Ambiente", "Turismo"], fact: "Gil foi Ministro da Cultura de 2003 a 2008." },
  { sub: "mpb", q: "Qual trio \xE9 formado por Marisa Monte, Arnaldo Antunes e Carlinhos Brown?", a: "Tribalistas", w: ["Novos Baianos", "Doces B\xE1rbaros", "Quarteto em Cy"], fact: 'O primeiro disco do trio, de 2002, tem o sucesso "J\xE1 Sei Namorar".' },
  { sub: "mpb", q: 'Qual cantor e compositor lan\xE7ou o \xE1lbum "Constru\xE7\xE3o" (1971)?', a: "Chico Buarque", w: ["Caetano Veloso", "Gilberto Gil", "Milton Nascimento"], fact: "A faixa-t\xEDtulo tem versos que terminam sempre em palavras proparox\xEDtonas." },
  { sub: "mpb", q: "Ney Matogrosso ficou famoso nos anos 70 em qual grupo?", a: "Secos & Molhados", w: ["Os Mutantes", "Novos Baianos", "Joelho de Porco"], fact: "O grupo chamava aten\xE7\xE3o pelos rostos pintados e figurinos ousados." },
  // ===== SERTANEJO =====
  { sub: "sertanejo", q: "Zez\xE9 di Camargo faz dupla com qual irm\xE3o?", a: "Luciano", w: ["Leonardo", "Bruno", "Marrone"], fact: 'A hist\xF3ria da dupla virou o filme "2 Filhos de Francisco" (2005).' },
  { sub: "sertanejo", q: 'Qual cantora ficou conhecida como a "Rainha da Sofr\xEAncia"?', a: "Mar\xEDlia Mendon\xE7a", w: ["Naiara Azevedo", "Simone Mendes", "Paula Fernandes"], fact: "Mar\xEDlia morreu em 2021, aos 26 anos, em um acidente a\xE9reo." },
  { sub: "sertanejo", q: "Leonardo fez sucesso em dupla com qual irm\xE3o?", a: "Leandro", w: ["Luciano", "Marrone", "Xoror\xF3"], fact: "Leandro morreu em 1998, e Leonardo seguiu em carreira solo." },
  { sub: "sertanejo", q: 'Qual dupla gravou o cl\xE1ssico "Evid\xEAncias" (1990)?', a: "Chit\xE3ozinho & Xoror\xF3", w: ["Zez\xE9 di Camargo & Luciano", "Leandro & Leonardo", "Milion\xE1rio & Jos\xE9 Rico"], fact: "A m\xFAsica foi composta por Jos\xE9 Augusto e Paulo S\xE9rgio Valle." },
  { sub: "sertanejo", q: 'Quem fez sucesso mundial com "Ai Se Eu Te Pego"?', a: "Michel Tel\xF3", w: ["Luan Santana", "Gusttavo Lima", "Lucas Lucco"], fact: "At\xE9 Cristiano Ronaldo comemorou gol com a dancinha da m\xFAsica." },
  { sub: "sertanejo", q: "Qual \xE9 o apelido do cantor Gusttavo Lima?", a: "Embaixador", w: ["Fen\xF4meno", "Boiadeiro", "Imperador"], fact: "O apelido tamb\xE9m virou nome de suas turn\xEAs e shows." },
  { sub: "sertanejo", q: "Simone Mendes fazia dupla com qual irm\xE3?", a: "Simaria", w: ["Maiara", "Maraisa", "Mayra"], fact: "Simone & Simaria s\xE3o baianas e encerraram a dupla em 2022." },
  { sub: "sertanejo", q: "A dupla Jorge & Mateus \xE9 de qual estado?", a: "Goi\xE1s", w: ["Minas Gerais", "Mato Grosso do Sul", "Paran\xE1"], fact: "Os dois s\xE3o de Itumbiara, no sul de Goi\xE1s." },
  { sub: "sertanejo", q: 'Qual dupla caipira ficou conhecida como "A Dupla Cora\xE7\xE3o do Brasil"?', a: "Tonico & Tinoco", w: ["Pena Branca & Xavantinho", "Ti\xE3o Carreiro & Pardinho", "Milion\xE1rio & Jos\xE9 Rico"], fact: "Tonico e Tinoco eram irm\xE3os e formaram uma das duplas mais longevas da m\xFAsica caipira." },
  { sub: "sertanejo", q: "Com qual m\xFAsica Luan Santana estourou no Brasil em 2009?", a: "Meteoro", w: ["Sinais", "Qu\xEDmica do Amor", "Te Vivo"], fact: 'Luan tinha s\xF3 18 anos quando "Meteoro" tomou conta das r\xE1dios.' },
  // ===== BREGA =====
  { sub: "brega", q: 'Qual cantor pernambucano ficou conhecido como o "Rei do Brega"?', a: "Reginaldo Rossi", w: ["Odair Jos\xE9", "Amado Batista", "Wando"], fact: 'Seu maior sucesso \xE9 "Gar\xE7om", sobre um homem desabafando no bar.' },
  { sub: "brega", q: "O que as f\xE3s de Wando costumavam jogar no palco?", a: "Calcinhas", w: ["Rosas vermelhas", "Ursinhos de pel\xFAcia", "Chaveiros"], fact: "Wando guardava as pe\xE7as e dizia ter uma cole\xE7\xE3o enorme." },
  { sub: "brega", q: "Reginaldo Rossi nasceu em qual cidade?", a: "Recife", w: ["Fortaleza", "Salvador", "Bel\xE9m"], fact: "Antes do brega, Reginaldo Rossi come\xE7ou cantando rock nos anos 60." },
  { sub: "brega", q: "Qual apelido o cantor Odair Jos\xE9 ganhou nos anos 70?", a: "Terror das Empregadas", w: ["Pr\xEDncipe da Seresta", "Gal\xE3 do R\xE1dio", "Cowboy do Amor"], fact: "O apelido veio de m\xFAsicas que falavam de amores com empregadas dom\xE9sticas." },
  { sub: "brega", q: "Qual m\xFAsica de Odair Jos\xE9 foi censurada na ditadura?", a: "Pare de Tomar a P\xEDlula", w: ["Eu Vou Tirar Voc\xEA Desse Lugar", "Gar\xE7om", "Fogo e Paix\xE3o"], fact: "A can\xE7\xE3o falava de anticoncepcional, tema delicado para a censura da \xE9poca." },
  { sub: "brega", q: 'Quem gravou o sucesso brega "Fogo e Paix\xE3o"?', a: "Wando", w: ["Reginaldo Rossi", "Amado Batista", "Odair Jos\xE9"], fact: "Wando foi um dos cantores mais populares do brega rom\xE2ntico nos anos 80." },
  { sub: "brega", q: "Qual cantora paraense ficou famosa \xE0 frente da Banda Calypso?", a: "Joelma", w: ["Gaby Amarantos", "Faf\xE1 de Bel\xE9m", "Viviane Batid\xE3o"], fact: "A Calypso vendia milh\xF5es de discos de forma independente." },
  { sub: "brega", q: 'Qual cantora paraense ganhou o apelido de "Beyonc\xE9 do Par\xE1"?', a: "Gaby Amarantos", w: ["Joelma", "Viviane Batid\xE3o", "Faf\xE1 de Bel\xE9m"], fact: 'Ela ficou conhecida nacionalmente com "Ex Mai Love", tema de novela.' },
  { sub: "brega", q: "Qual era a fun\xE7\xE3o de Chimbinha na Banda Calypso?", a: "Guitarrista", w: ["Baterista", "Tecladista", "Baixista"], fact: "Seu jeito de tocar guitarra virou marca registrada do brega paraense." },
  { sub: "brega", q: "Em qual cidade nasceu o tecnobrega?", a: "Bel\xE9m", w: ["Recife", "Manaus", "S\xE3o Lu\xEDs"], fact: "O ritmo cresceu com as festas de aparelhagem e a venda de CDs nas ruas." },
  // ===== DANCE =====
  { sub: "dance", q: 'Quem canta o cl\xE1ssico dance "What Is Love" (1993)?', a: "Haddaway", w: ["Dr. Alban", "Corona", "Ice MC"], fact: 'Voltou a bombar em 1998 com o filme "A Night at the Roxbury".' },
  { sub: "dance", q: 'Qual grupo gravou "Blue (Da Ba Dee)"?', a: "Eiffel 65", w: ["Vengaboys", "Aqua", "Daft Punk"], fact: "O clipe tem tudo em azul, inclusive os integrantes." },
  { sub: "dance", q: 'Qual grupo gravou "Barbie Girl" (1997)?', a: "Aqua", w: ["Vengaboys", "Eiffel 65", "Whigfield"], fact: "A Mattel, fabricante da Barbie, processou a gravadora da banda, mas perdeu na Justi\xE7a." },
  { sub: "dance", q: "O grupo Eiffel 65 \xE9 de qual pa\xEDs?", a: "It\xE1lia", w: ["Fran\xE7a", "B\xE9lgica", "Alemanha"], fact: "Apesar do nome, o grupo \xE9 de Turim, na It\xE1lia." },
  { sub: "dance", q: 'Qual grupo gravou "Rhythm Is a Dancer" (1992)?', a: "Snap!", w: ["2 Unlimited", "Culture Beat", "La Bouche"], fact: 'O Snap! tamb\xE9m estourou antes com "The Power", de 1990.' },
  { sub: "dance", q: 'Qual dupla holandesa gravou "No Limit" (1993)?', a: "2 Unlimited", w: ["Snap!", "Real McCoy", "Technotronic"], fact: "O refr\xE3o quase sem palavras ajudou o hit a tocar no mundo todo." },
  { sub: "dance", q: 'Qual grupo gravou "Mr. Vain" (1993)?', a: "Culture Beat", w: ["Masterboy", "Captain Hollywood Project", "Cappella"], fact: 'O Culture Beat era alem\xE3o e "Mr. Vain" chegou ao 1\xBA lugar em v\xE1rios pa\xEDses.' },
  { sub: "dance", q: 'Qual grupo belga gravou "Pump Up the Jam" (1989)?', a: "Technotronic", w: ["Black Box", "C+C Music Factory", "Snap!"], fact: "A modelo do clipe dublava a voz da verdadeira cantora, Ya Kid K." },
  { sub: "dance", q: 'Qual projeto dance gravou "The Rhythm of the Night"?', a: "Corona", w: ["Cappella", "Ice MC", "Fun Factory"], fact: "O rosto do Corona era a brasileira Olga de Souza." },
  { sub: "dance", q: `Qual grupo gravou "We're Going to Ibiza!"?`, a: "Vengaboys", w: ["Aqua", "Whigfield", "Scooter"], fact: 'Os Vengaboys s\xE3o holandeses e tamb\xE9m cantam "Boom, Boom, Boom, Boom!!".' },
  // ===== DISCO =====
  { sub: "disco", q: `Qual grupo gravou "Stayin' Alive"?`, a: "Bee Gees", w: ["ABBA", "Village People", "Earth, Wind & Fire"], fact: 'A m\xFAsica \xE9 da trilha de "Os Embalos de S\xE1bado \xE0 Noite" (1977).' },
  { sub: "disco", q: 'Qual grupo gravou "Y.M.C.A."?', a: "Village People", w: ["Bee Gees", "KC and the Sunshine Band", "Boney M."], fact: "A coreografia com os bra\xE7os formando as letras virou febre nas festas." },
  { sub: "disco", q: 'Quem canta o hino disco "I Will Survive"?', a: "Gloria Gaynor", w: ["Donna Summer", "Diana Ross", "Chaka Khan"], fact: "A m\xFAsica foi lan\xE7ada em 1978 e ganhou o Grammy." },
  { sub: "disco", q: 'Qual cantora ficou conhecida como a "Rainha da Disco"?', a: "Donna Summer", w: ["Chaka Khan", "Diana Ross", "Grace Jones"], fact: 'Donna Summer estourou com "Love to Love You Baby" e "Hot Stuff".' },
  { sub: "disco", q: 'Qual ator protagonizou "Os Embalos de S\xE1bado \xE0 Noite" (1977)?', a: "John Travolta", w: ["Patrick Swayze", "Richard Gere", "Kevin Bacon"], fact: "O terno branco de Travolta virou s\xEDmbolo da era disco." },
  { sub: "disco", q: "O grupo ABBA \xE9 de qual pa\xEDs?", a: "Su\xE9cia", w: ["Noruega", "Dinamarca", "Holanda"], fact: 'O ABBA venceu o Eurovision de 1974 com "Waterloo".' },
  { sub: "disco", q: 'Qual grupo gravou "Le Freak" (1978)?', a: "Chic", w: ["Sister Sledge", "KC and the Sunshine Band", "Kool & the Gang"], fact: "O Chic era liderado pelo guitarrista e produtor Nile Rodgers." },
  { sub: "disco", q: 'Qual grupo gravou "Rasputin" e "Daddy Cool"?', a: "Boney M.", w: ["Village People", "Baccara", "Arabesque"], fact: "O Boney M. foi criado na Alemanha pelo produtor Frank Farian." },
  { sub: "disco", q: "Qual era a lend\xE1ria discoteca de Nova York frequentada por famosos nos anos 70?", a: "Studio 54", w: ["Studio 45", "Club 33", "Palace 88"], fact: "Andy Warhol, Liza Minnelli e Mick Jagger eram frequentadores." },
  { sub: "disco", q: `Qual grupo brasileiro gravou "Dancin' Days", tema da novela de 1978?`, a: "As Fren\xE9ticas", w: ["As Melindrosas", "Trio Esperan\xE7a", "Quarteto em Cy"], fact: `A novela "Dancin' Days" levou a febre das discotecas para todo o Brasil.` },
  // ===== ANOS 80 =====
  { sub: "anos80", q: 'A banda a-ha, de "Take On Me", \xE9 de qual pa\xEDs?', a: "Noruega", w: ["Su\xE9cia", "Dinamarca", "Finl\xE2ndia"], fact: "O clipe, que mistura desenho e filmagem real, \xE9 um dos mais famosos da MTV." },
  { sub: "anos80", q: 'Qual apresentadora lan\xE7ou o sucesso "Ilari\xEA" em 1988?', a: "Xuxa", w: ["Ang\xE9lica", "Mara Maravilha", "Eliana"], fact: 'Os discos "Xou da Xuxa" venderam milh\xF5es de c\xF3pias no Brasil.' },
  { sub: "anos80", q: `Qual banda gravou "Livin' on a Prayer" (1986)?`, a: "Bon Jovi", w: ["Def Leppard", "Journey", "Europe"], fact: 'Est\xE1 no \xE1lbum "Slippery When Wet", um dos mais vendidos dos anos 80.' },
  { sub: "anos80", q: 'Qual banda sueca gravou "The Final Countdown" (1986)?', a: "Europe", w: ["Scorpions", "Survivor", "Roxette"], fact: "O riff de teclado virou trilha cl\xE1ssica de est\xE1dios e competi\xE7\xF5es." },
  { sub: "anos80", q: 'Qual dupla gravou "Sweet Dreams (Are Made of This)" (1983)?', a: "Eurythmics", w: ["Pet Shop Boys", "Tears for Fears", "Soft Cell"], fact: "A vocalista Annie Lennox chamou aten\xE7\xE3o com o cabelo laranja curtinho." },
  { sub: "anos80", q: 'Qual banda brasileira gravou "Ursinho Blau-Blau" (1983)?', a: "Absyntho", w: ["Kid Abelha", "Ultraje a Rigor", "Magazine"], fact: "A m\xFAsica foi um dos maiores sucessos da New Wave brasileira." },
  { sub: "anos80", q: "Em que ano aconteceu a primeira edi\xE7\xE3o do Rock in Rio?", a: "1985", w: ["1980", "1988", "1990"], fact: "Queen, AC/DC e Iron Maiden tocaram na Cidade do Rock em janeiro de 1985." },
  { sub: "anos80", q: "Quem era a vocalista do Kid Abelha?", a: "Paula Toller", w: ["Marina Lima", "Fernanda Abreu", "Rita Lee"], fact: 'O Kid Abelha emplacou hits como "Como Eu Quero" e "Fixa\xE7\xE3o".' },
  { sub: "anos80", q: 'Quem canta "Girls Just Want to Have Fun" (1983)?', a: "Cyndi Lauper", w: ["Madonna", "Pat Benatar", "Debbie Harry"], fact: 'Cyndi Lauper tamb\xE9m gravou o sucesso "Time After Time".' },
  { sub: "anos80", q: 'Qual cantor fez sucesso com "Menina Veneno" (1983)?', a: "Ritchie", w: ["Lulu Santos", "Lob\xE3o", "Marcelo Nova"], fact: "Ritchie nasceu na Inglaterra e se mudou para o Brasil nos anos 70." },
  // ===== ANOS 2000 =====
  { sub: "anos2000", q: 'Qual cantora lan\xE7ou o hit "Toxic" (2004)?', a: "Britney Spears", w: ["Christina Aguilera", "Jessica Simpson", "Avril Lavigne"], fact: 'Com "Toxic", Britney ganhou seu primeiro Grammy.' },
  { sub: "anos2000", q: `Qual cantora gravou "Hips Don't Lie" (2006)?`, a: "Shakira", w: ["Jennifer Lopez", "Beyonc\xE9", "Nelly Furtado"], fact: "A m\xFAsica tem participa\xE7\xE3o do rapper haitiano Wyclef Jean." },
  { sub: "anos2000", q: 'Qual banda gravou "In the End", do \xE1lbum "Hybrid Theory" (2000)?', a: "Linkin Park", w: ["Evanescence", "Limp Bizkit", "Papa Roach"], fact: '"Hybrid Theory" \xE9 um dos \xE1lbuns de estreia mais vendidos do s\xE9culo.' },
  { sub: "anos2000", q: 'Qual cantora canadense estourou com "Complicated" (2002)?', a: "Avril Lavigne", w: ["Kelly Clarkson", "Michelle Branch", "Alanis Morissette"], fact: "A gravata com regata virou o visual marcante de Avril na \xE9poca." },
  { sub: "anos2000", q: 'Qual grupo feminino nasceu do reality "Popstars" em 2002?', a: "Rouge", w: ["KLB", "Twister", "Banda Calypso"], fact: 'O Rouge estourou com "Ragatanga", vers\xE3o de "Aserej\xE9".' },
  { sub: "anos2000", q: 'Qual banda brasileira fez sucesso com "Raz\xF5es e Emo\xE7\xF5es" (2006)?', a: "NX Zero", w: ["Fresno", "CPM 22", "Strike"], fact: "O NX Zero foi um dos s\xEDmbolos da onda emo no Brasil." },
  { sub: "anos2000", q: 'Qual dupla gravou "Hey Ya!" (2003)?', a: "OutKast", w: ["The Black Eyed Peas", "Daft Punk", "N.E.R.D"], fact: "No clipe, Andr\xE9 3000 interpreta todos os integrantes da banda." },
  { sub: "anos2000", q: 'Quem canta "Rehab" (2006)?', a: "Amy Winehouse", w: ["Adele", "Duffy", "Lily Allen"], fact: 'A m\xFAsica est\xE1 no \xE1lbum "Back to Black" e ganhou tr\xEAs Grammys.' },
  { sub: "anos2000", q: '"Crazy" (2006) foi o grande hit de qual dupla?', a: "Gnarls Barkley", w: ["The White Stripes", "MGMT", "Daft Punk"], fact: "A dupla \xE9 formada por CeeLo Green e o produtor Danger Mouse." },
  { sub: "anos2000", q: 'Qual cantor gravou "Festa no Ap\xEA" (2004)?', a: "Latino", w: ["Felipe Dylon", "MC Cr\xE9u", "Rodriguinho"], fact: '\xC9 uma vers\xE3o de "Dragostea Din Tei", do grupo moldavo O-Zone.' }
];
var musica_default = questions8;

// shared/questions/celebridades.ts
var questions9 = [
  { q: "Qual cantora brasileira estourou em 2013 com o hit 'Show das Poderosas'?", a: "Anitta", w: ["Ludmilla", "Pabllo Vittar", "IZA"], fact: "Anitta nasceu no Rio de Janeiro e seu nome de batismo \xE9 Larissa de Macedo Machado." },
  { q: "Em que pa\xEDs nasceu a cantora Shakira?", a: "Col\xF4mbia", w: ["M\xE9xico", "Venezuela", "Argentina"], fact: "Shakira nasceu em Barranquilla, em 1977." },
  { q: "Quantas Copas do Mundo Pel\xE9 conquistou como jogador?", a: "3", w: ["2", "4", "5"], fact: "Venceu em 1958, 1962 e 1970: \xE9 o \xFAnico jogador tricampe\xE3o mundial." },
  { q: "Qual ator interpretou o pirata Jack Sparrow em 'Piratas do Caribe'?", a: "Johnny Depp", w: ["Orlando Bloom", "Brad Pitt", "Keanu Reeves"], fact: "O primeiro filme da franquia foi lan\xE7ado em 2003." },
  { q: "Fernanda Torres ganhou o Globo de Ouro de Melhor Atriz em Drama por qual filme?", a: "Ainda Estou Aqui", w: ["Central do Brasil", "Cidade de Deus", "Que Horas Ela Volta?"], fact: "Ela venceu em janeiro de 2025, interpretando Eunice Paiva." },
  { q: "Fernanda Montenegro foi indicada ao Oscar de Melhor Atriz por qual filme?", a: "Central do Brasil", w: ["O Auto da Compadecida", "Ainda Estou Aqui", "Eles N\xE3o Usam Black-Tie"], fact: "Foi a primeira brasileira indicada ao Oscar de Melhor Atriz, em 1999." },
  { q: "Qual piloto brasileiro foi campe\xE3o da F\xF3rmula 1 em 1988, 1990 e 1991?", a: "Ayrton Senna", w: ["Nelson Piquet", "Emerson Fittipaldi", "Rubens Barrichello"], fact: "Senna conquistou os tr\xEAs t\xEDtulos pilotando pela McLaren." },
  { q: "Qual apresentador ficou famoso pelo bord\xE3o '\xD4 loco, meu!'?", a: "Faust\xE3o", w: ["Silvio Santos", "Gugu Liberato", "Chacrinha"], fact: "Fausto Silva comandou o Doming\xE3o do Faust\xE3o na Globo de 1989 a 2021." },
  { q: "Qual \xE9 o nome de batismo do apresentador Silvio Santos?", a: "Senor Abravanel", w: ["Samuel Abravanel", "Silvio Abrantes", "Saul Abramovich"], fact: "Ele fundou o SBT, que entrou no ar em 1981." },
  { q: "O velocista Usain Bolt representou qual pa\xEDs?", a: "Jamaica", w: ["Estados Unidos", "Trinidad e Tobago", "Bahamas"], fact: "Seu recorde mundial nos 100 metros \xE9 de 9s58, de 2009." },
  { q: "Qual cantor \xE9 conhecido mundialmente como o 'Rei do Pop'?", a: "Michael Jackson", w: ["Elvis Presley", "Prince", "Justin Timberlake"], fact: "Seu \xE1lbum 'Thriller', de 1982, \xE9 o mais vendido da hist\xF3ria." },
  { q: "Qual \xE9 o apelido mais famoso do cantor Roberto Carlos?", a: "O Rei", w: ["O Imperador", "O Pr\xEDncipe", "O Maestro"], fact: "Seu especial de fim de ano na TV Globo \xE9 tradi\xE7\xE3o desde 1974." },
  { q: "Qual jogadora brasileira foi eleita seis vezes a melhor do mundo pela FIFA?", a: "Marta", w: ["Formiga", "Cristiane", "Debinha"], fact: "Marta \xE9 a maior artilheira da hist\xF3ria das Copas, com 17 gols." },
  { q: "Qual ator protagonizou 'Titanic' (1997) ao lado de Kate Winslet?", a: "Leonardo DiCaprio", w: ["Brad Pitt", "Matt Damon", "Tom Cruise"], fact: "DiCaprio s\xF3 ganhou seu Oscar de Melhor Ator em 2016, por 'O Regresso'." },
  { q: "Qual ginasta brasileira ganhou o ouro no solo nos Jogos de Paris 2024?", a: "Rebeca Andrade", w: ["Daiane dos Santos", "Fl\xE1via Saraiva", "Jade Barbosa"], fact: "Ela ficou \xE0 frente da americana Simone Biles, que levou a prata." },
  { q: "Taylor Swift come\xE7ou a carreira em qual g\xEAnero musical?", a: "Country", w: ["Rock", "Hip-hop", "Jazz"], fact: "Seu primeiro \xE1lbum, chamado 'Taylor Swift', saiu em 2006." },
  { q: "Qual atriz interpretou Hermione Granger nos filmes de 'Harry Potter'?", a: "Emma Watson", w: ["Emma Stone", "Keira Knightley", "Natalie Portman"], fact: "Ela tinha 11 anos quando o primeiro filme da saga estreou, em 2001." },
  { q: "A supermodelo Gisele B\xFCndchen nasceu em qual estado brasileiro?", a: "Rio Grande do Sul", w: ["Santa Catarina", "Paran\xE1", "S\xE3o Paulo"], fact: "Gisele \xE9 natural de Horizontina, no noroeste ga\xFAcho." },
  { q: "Qual surfista brasileiro foi o primeiro campe\xE3o ol\xEDmpico da hist\xF3ria do surfe?", a: "\xCDtalo Ferreira", w: ["Gabriel Medina", "Filipe Toledo", "Adriano de Souza"], fact: "Ele levou o ouro em T\xF3quio 2020, quando o surfe estreou nos Jogos." },
  { q: "Qual atleta tem o maior n\xFAmero de medalhas ol\xEDmpicas da hist\xF3ria?", a: "Michael Phelps", w: ["Usain Bolt", "Carl Lewis", "Larisa Latynina"], fact: "O nadador americano somou 28 medalhas, sendo 23 de ouro." },
  { q: "Antes de virar astro de cinema, Will Smith fez sucesso em qual s\xE9rie?", a: "Um Maluco no Peda\xE7o", w: ["Friends", "Todo Mundo Odeia o Chris", "Eu, a Patroa e as Crian\xE7as"], fact: "O nome original da s\xE9rie \xE9 'The Fresh Prince of Bel-Air'." },
  { q: "Em qual clube Neymar come\xE7ou a carreira profissional?", a: "Santos", w: ["Corinthians", "S\xE3o Paulo", "Palmeiras"], fact: "Neymar estreou como profissional pelo Santos em 2009." },
  { q: "Qual cantora americana \xE9 conhecida como a 'Rainha do Pop'?", a: "Madonna", w: ["Britney Spears", "Lady Gaga", "Cher"], fact: "Em 2024, Madonna fez um show gratuito para mais de 1 milh\xE3o de pessoas em Copacabana." },
  { q: "De qual grupo Beyonc\xE9 fez parte antes da carreira solo?", a: "Destiny's Child", w: ["TLC", "Spice Girls", "Pussycat Dolls"], fact: "Beyonc\xE9 \xE9 a artista com mais pr\xEAmios Grammy da hist\xF3ria." },
  { q: "Qual tenista brasileiro foi n\xFAmero 1 do mundo e tricampe\xE3o de Roland Garros?", a: "Gustavo Kuerten", w: ["Fernando Meligeni", "Jo\xE3o Fonseca", "Thomaz Bellucci"], fact: "Guga venceu em Paris em 1997, 2000 e 2001." },
  { q: "Ivete Sangalo ficou conhecida como vocalista de qual banda antes da carreira solo?", a: "Banda Eva", w: ["Chiclete com Banana", "Asa de \xC1guia", "Timbalada"], fact: "Ela deixou a Banda Eva e partiu para a carreira solo em 1999." },
  { q: "Rodrigo Santoro interpretou qual rei persa no filme '300'?", a: "Xerxes", w: ["Dario", "Ciro", "Le\xF4nidas"], fact: "O filme, de 2006, \xE9 baseado na HQ de Frank Miller." },
  { q: "Qual dupla sertaneja lan\xE7ou o sucesso '\xC9 o Amor', em 1991?", a: "Zez\xE9 Di Camargo & Luciano", w: ["Chit\xE3ozinho & Xoror\xF3", "Leandro & Leonardo", "Bruno & Marrone"], fact: "A m\xFAsica foi composta pelo pr\xF3prio Zez\xE9 Di Camargo." },
  { q: "Wagner Moura interpretou qual personagem na s\xE9rie 'Narcos', da Netflix?", a: "Pablo Escobar", w: ["El Chapo", "Gilberto Rodr\xEDguez", "Javier Pe\xF1a"], fact: "Em 2025, ele ganhou o pr\xEAmio de Melhor Ator em Cannes por 'O Agente Secreto'." },
  { q: "Cristiano Ronaldo nasceu em qual ilha portuguesa?", a: "Madeira", w: ["S\xE3o Miguel", "Porto Santo", "Terceira"], fact: "O aeroporto da Madeira leva o nome do jogador." }
];
var celebridades_default = questions9;

// shared/questions/blind-items.ts
var questions10 = [
  { q: "Adivinhe quem: apresentadora, a \u201CRainha dos Baixinhos\u201D, tem uma filha chamada Sasha.", a: "Xuxa", w: ["Ang\xE9lica", "Eliana", "Mara Maravilha"], fact: "O Xou da Xuxa estreou na TV Globo em 1986." },
  { q: "Adivinhe quem: cantor baiano, foi ministro da Cultura e comp\xF4s 'Andar com F\xE9'.", a: "Gilberto Gil", w: ["Caetano Veloso", "Djavan", "Milton Nascimento"], fact: "Gil foi ministro da Cultura entre 2003 e 2008." },
  { q: "Adivinhe quem: cantora nascida em Barbados, estourou com o hit 'Umbrella'.", a: "Rihanna", w: ["Beyonc\xE9", "Nicki Minaj", "Alicia Keys"], fact: "'Umbrella' foi lan\xE7ada em 2007 e venceu um Grammy." },
  { q: "Adivinhe quem: ator, viveu o Homem de Ferro nos filmes da Marvel.", a: "Robert Downey Jr.", w: ["Chris Evans", "Chris Hemsworth", "Mark Ruffalo"], fact: "O primeiro 'Homem de Ferro' estreou em 2008 e abriu o universo Marvel no cinema." },
  { q: "Adivinhe quem: cantora, a \u201CRainha do Rock brasileiro\u201D, integrou Os Mutantes.", a: "Rita Lee", w: ["Gal Costa", "Elis Regina", "Pitty"], fact: "Ela \xE9 a voz de sucessos como 'Ovelha Negra' e 'Lan\xE7a Perfume'." },
  { q: "Adivinhe quem: piloto brit\xE2nico, heptacampe\xE3o mundial de F\xF3rmula 1.", a: "Lewis Hamilton", w: ["Michael Schumacher", "Max Verstappen", "Fernando Alonso"], fact: "Hamilton divide com Schumacher o recorde de sete t\xEDtulos mundiais." },
  { q: "Adivinhe quem: cantora apelidada de \u201CPimentinha\u201D, eternizou 'Como Nossos Pais'.", a: "Elis Regina", w: ["Gal Costa", "Maria Beth\xE2nia", "Clara Nunes"], fact: "'Como Nossos Pais' foi composta por Belchior." },
  { q: "Adivinhe quem: humorista, criou o personagem Didi Moc\xF3, de 'Os Trapalh\xF5es'.", a: "Renato Arag\xE3o", w: ["Ded\xE9 Santana", "Mussum", "Zacarias"], fact: "Renato Arag\xE3o nasceu em Sobral, no Cear\xE1." },
  { q: "Adivinhe quem: cantora, filha de Xoror\xF3, fez dupla com o irm\xE3o desde crian\xE7a.", a: "Sandy", w: ["Wanessa Camargo", "Kelly Key", "Paula Fernandes"], fact: "A dupla Sandy & Junior lan\xE7ou o primeiro disco em 1991." },
  { q: "Adivinhe quem: nadador brasileiro, campe\xE3o ol\xEDmpico dos 50 m livre em Pequim 2008.", a: "C\xE9sar Cielo", w: ["Gustavo Borges", "Thiago Pereira", "Bruno Fratus"], fact: "Foi o primeiro ouro ol\xEDmpico da nata\xE7\xE3o brasileira." },
  { q: "Adivinhe quem: escritor, autor de 'O Alquimista', membro da Academia Brasileira de Letras.", a: "Paulo Coelho", w: ["Jorge Amado", "Ariano Suassuna", "Machado de Assis"], fact: "'O Alquimista' foi traduzido para dezenas de idiomas." },
  { q: "Adivinhe quem: o \u201CRei do Bai\xE3o\u201D, tocava sanfona e gravou 'Asa Branca'.", a: "Luiz Gonzaga", w: ["Dominguinhos", "Jackson do Pandeiro", "Sivuca"], fact: "Luiz Gonzaga nasceu em Exu, no sert\xE3o de Pernambuco." },
  { q: "Adivinhe quem: atriz nascida em Israel, viveu a Mulher-Maravilha no cinema em 2017.", a: "Gal Gadot", w: ["Scarlett Johansson", "Margot Robbie", "Brie Larson"], fact: "Antes de atuar, ela foi Miss Israel em 2004." },
  { q: "Adivinhe quem: cantora, a \u201CRainha da Sofr\xEAncia\u201D, gravou o sucesso 'Infiel'.", a: "Mar\xEDlia Mendon\xE7a", w: ["Paula Fernandes", "Simone Mendes", "Naiara Azevedo"], fact: "Al\xE9m de cantora, foi uma compositora de muito sucesso no sertanejo." },
  { q: "Adivinhe quem: jogador, melhor do mundo pela FIFA em 2007, brilhou no Milan e no S\xE3o Paulo.", a: "Kak\xE1", w: ["Ronaldinho", "Ronaldo", "Rivaldo"], fact: "Em 2007 ele tamb\xE9m ganhou a Bola de Ouro." },
  { q: "Adivinhe quem: cantor, ex-One Direction, fez sucesso solo com 'As It Was'.", a: "Harry Styles", w: ["Zayn Malik", "Niall Horan", "Louis Tomlinson"], fact: "O One Direction foi formado em 2010, no programa The X Factor." },
  { q: "Adivinhe quem: apresentador, comandou o 'Caldeir\xE3o' e depois assumiu o Doming\xE3o.", a: "Luciano Huck", w: ["Rodrigo Faro", "Marcos Mion", "Celso Portiolli"], fact: "O Caldeir\xE3o do Huck esteve no ar aos s\xE1bados de 2000 a 2021." },
  { q: "Adivinhe quem: atriz, viveu a Bebel, do bord\xE3o \u201Ccatiguria\u201D, em 'Para\xEDso Tropical'.", a: "Camila Pitanga", w: ["Ta\xEDs Araujo", "Juliana Paes", "Grazi Massafera"], fact: "A novela das nove foi exibida pela TV Globo em 2007." },
  { q: "Adivinhe quem: o \u201CRei do Rock\u201D, nascido em Tupelo, no Mississippi.", a: "Elvis Presley", w: ["Chuck Berry", "Little Richard", "Jerry Lee Lewis"], fact: "Sua mans\xE3o, Graceland, em Memphis, virou museu." },
  { q: "Adivinhe quem: diretor de cinema, criou 'E.T.' e 'Tubar\xE3o'.", a: "Steven Spielberg", w: ["George Lucas", "James Cameron", "Martin Scorsese"], fact: "Ele tamb\xE9m dirigiu 'Jurassic Park' e 'A Lista de Schindler'." },
  { q: "Adivinhe quem: cantora baiana, lan\xE7ou 'O Canto da Cidade' em 1992.", a: "Daniela Mercury", w: ["Ivete Sangalo", "Claudia Leitte", "Margareth Menezes"], fact: "O disco ajudou a levar o ax\xE9 para todo o Brasil." },
  { q: "Adivinhe quem: ator brit\xE2nico, viveu o bruxo Harry Potter em oito filmes.", a: "Daniel Radcliffe", w: ["Rupert Grint", "Tom Felton", "Elijah Wood"], fact: "O primeiro filme da saga estreou em 2001." },
  { q: "Adivinhe quem: cantor e compositor, autor de 'Constru\xE7\xE3o' e 'A Banda'.", a: "Chico Buarque", w: ["Caetano Veloso", "Gilberto Gil", "Tom Jobim"], fact: "Chico tamb\xE9m \xE9 escritor e ganhou o Pr\xEAmio Cam\xF5es em 2019." },
  { q: "Adivinhe quem: o \u201CFen\xF4meno\u201D, artilheiro do Brasil na conquista do penta, em 2002.", a: "Ronaldo", w: ["Rivaldo", "Rom\xE1rio", "Ronaldinho"], fact: "Ele marcou 8 gols naquela Copa, incluindo os dois da final." },
  { q: "Adivinhe quem: cantora, chama os f\xE3s de \u201CLittle Monsters\u201D e ganhou o Oscar por 'Shallow'.", a: "Lady Gaga", w: ["Katy Perry", "Madonna", "Christina Aguilera"], fact: "'Shallow' \xE9 do filme 'Nasce uma Estrela' (2018)." },
  { q: "Adivinhe quem: apresentadora do 'Mais Voc\xEA', fez dupla por anos com o Louro Jos\xE9.", a: "Ana Maria Braga", w: ["F\xE1tima Bernardes", "Palmirinha", "Ang\xE9lica"], fact: "O 'Mais Voc\xEA' estreou na TV Globo em 1999." },
  { q: "Adivinhe quem: cantor jamaicano, o \u201CRei do Reggae\u201D, gravou 'No Woman, No Cry'.", a: "Bob Marley", w: ["Peter Tosh", "Jimmy Cliff", "Ziggy Marley"], fact: "Sua banda se chamava Bob Marley & The Wailers." },
  { q: "Adivinhe quem: atriz, viveu Katniss Everdeen na saga 'Jogos Vorazes'.", a: "Jennifer Lawrence", w: ["Emma Stone", "Shailene Woodley", "Kristen Stewart"], fact: "Ela ganhou o Oscar de Melhor Atriz por 'O Lado Bom da Vida'." },
  { q: "Adivinhe quem: skatista, a \u201CFadinha\u201D, ganhou medalha ol\xEDmpica aos 13 anos.", a: "Rayssa Leal", w: ["P\xE2mela Rosa", "Let\xEDcia Bufoni", "Dora Varella"], fact: "Ela levou a prata em T\xF3quio 2020 e o bronze em Paris 2024." },
  { q: "Adivinhe quem: cartunista, criou a Turma da M\xF4nica e o Cebolinha.", a: "Maur\xEDcio de Sousa", w: ["Ziraldo", "Monteiro Lobato", "Henfil"], fact: "A M\xF4nica foi inspirada em uma das filhas do pr\xF3prio Maur\xEDcio." }
];
var blind_items_default = questions10;

// shared/questions/natureza.ts
var questions11 = [
  { q: "Qual \xE9 a maior floresta tropical do mundo?", a: "Amaz\xF4nia", w: ["Mata Atl\xE2ntica", "Floresta do Congo", "Taiga"], fact: "Cerca de 60% da Floresta Amaz\xF4nica fica em territ\xF3rio brasileiro." },
  { q: "Qual \xE9 o planeta mais pr\xF3ximo do Sol?", a: "Merc\xFArio", w: ["V\xEAnus", "Marte", "Terra"], fact: "Merc\xFArio completa uma volta ao redor do Sol em apenas 88 dias." },
  { q: "Qual g\xE1s as plantas absorvem do ar para fazer a fotoss\xEDntese?", a: "G\xE1s carb\xF4nico", w: ["Oxig\xEAnio", "Nitrog\xEAnio", "H\xE9lio"], fact: "Na fotoss\xEDntese, as plantas usam luz, \xE1gua e g\xE1s carb\xF4nico e liberam oxig\xEAnio." },
  { q: "Qual \xE9 o maior oceano do planeta?", a: "Pac\xEDfico", w: ["Atl\xE2ntico", "\xCDndico", "\xC1rtico"], fact: "O Pac\xEDfico \xE9 maior do que todas as terras emersas do planeta somadas." },
  { q: "Qual \xE9 a montanha mais alta do mundo em rela\xE7\xE3o ao n\xEDvel do mar?", a: "Everest", w: ["K2", "Aconc\xE1gua", "Kilimanjaro"], fact: "O Everest, no Himalaia, tem cerca de 8.849 metros de altitude." },
  { q: "Qual bioma brasileiro \xE9 conhecido como a savana brasileira?", a: "Cerrado", w: ["Caatinga", "Pampa", "Pantanal"], fact: "O Cerrado \xE9 considerado a savana com maior biodiversidade do mundo." },
  { q: "Qual planeta \xE9 conhecido como o planeta vermelho?", a: "Marte", w: ["J\xFApiter", "V\xEAnus", "Saturno"], fact: "A cor avermelhada vem do \xF3xido de ferro, a famosa ferrugem, no solo marciano." },
  { q: "Qual \xE9 o maior planeta do Sistema Solar?", a: "J\xFApiter", w: ["Saturno", "Netuno", "Urano"], fact: "Caberiam mais de 1.300 planetas Terra dentro de J\xFApiter." },
  { q: "Qual planeta \xE9 famoso por seus an\xE9is bem vis\xEDveis?", a: "Saturno", w: ["J\xFApiter", "Urano", "Netuno"], fact: "J\xFApiter, Urano e Netuno tamb\xE9m t\xEAm an\xE9is, mas eles s\xE3o bem mais t\xEAnues." },
  { q: "Qual \xE9 a estrela mais pr\xF3xima da Terra?", a: "O Sol", w: ["Proxima Centauri", "Sirius", "Alfa Centauri A"], fact: "Depois do Sol, a estrela mais pr\xF3xima \xE9 Proxima Centauri, a cerca de 4,2 anos-luz." },
  { q: "Qual \xE1rvore deu nome ao Brasil?", a: "Pau-brasil", w: ["Ip\xEA", "Jatob\xE1", "Jacarand\xE1"], fact: "Da madeira do pau-brasil se extra\xEDa uma tinta vermelha, cor de brasa." },
  { q: "Quantos planetas existem no Sistema Solar?", a: "8", w: ["7", "9", "10"], fact: "Plut\xE3o foi reclassificado como planeta-an\xE3o em 2006." },
  { q: "Qual bioma brasileiro \xE9 considerado a maior plan\xEDcie alag\xE1vel cont\xEDnua do planeta?", a: "Pantanal", w: ["Caatinga", "Pampa", "Mata Atl\xE2ntica"], fact: "O Pantanal se estende pelo Brasil, Bol\xEDvia e Paraguai." },
  { q: "Qual \xE9 o \xFAnico bioma exclusivamente brasileiro?", a: "Caatinga", w: ["Cerrado", "Pantanal", "Mata Atl\xE2ntica"], fact: "A Caatinga ocupa boa parte do Nordeste e tem plantas adaptadas \xE0 seca." },
  { q: "Quanto tempo, aproximadamente, a luz do Sol leva para chegar \xE0 Terra?", a: "Cerca de 8 minutos", w: ["Cerca de 8 segundos", "Cerca de 1 hora", "Cerca de 1 dia"], fact: "Ou seja, quando olhamos o Sol, vemos como ele estava uns 8 minutos atr\xE1s." },
  { q: "Em qual camada da atmosfera fica a maior parte da camada de oz\xF4nio?", a: "Estratosfera", w: ["Troposfera", "Mesosfera", "Termosfera"], fact: "A camada de oz\xF4nio filtra boa parte da radia\xE7\xE3o ultravioleta do Sol." },
  { q: "Qual \xE9 o maior deserto quente do mundo?", a: "Saara", w: ["Atacama", "Gobi", "Kalahari"], fact: "Se contarmos os desertos frios, o maior de todos \xE9 a Ant\xE1rtida." },
  { q: "Como se chama o aquecimento anormal das \xE1guas do Pac\xEDfico que altera o clima global?", a: "El Ni\xF1o", w: ["La Ni\xF1a", "Mon\xE7\xE3o", "Corrente do Golfo"], fact: "La Ni\xF1a \xE9 o fen\xF4meno oposto: o resfriamento dessas \xE1guas." },
  { q: "Qual g\xE1s \xE9 o mais abundante na atmosfera da Terra?", a: "Nitrog\xEAnio", w: ["Oxig\xEAnio", "G\xE1s carb\xF4nico", "Arg\xF4nio"], fact: "O nitrog\xEAnio forma cerca de 78% do ar; o oxig\xEAnio, cerca de 21%." },
  { q: "Como se chama a rocha derretida que sai de um vulc\xE3o e escorre pela superf\xEDcie?", a: "Lava", w: ["Magma", "Basalto", "Cinza vulc\xE2nica"], fact: "Enquanto est\xE1 no subsolo, a rocha derretida \xE9 chamada de magma." },
  { q: "Qual \xE9 o ponto mais alto do Brasil?", a: "Pico da Neblina", w: ["Pico da Bandeira", "Pico 31 de Mar\xE7o", "Monte Roraima"], fact: "O Pico da Neblina, no Amazonas, tem cerca de 2.995 metros." },
  { q: "Qual \xE9 a maior ilha do mundo, sem contar os continentes?", a: "Groenl\xE2ndia", w: ["Madagascar", "Born\xE9u", "Nova Guin\xE9"], fact: "A Groenl\xE2ndia \xE9 um territ\xF3rio aut\xF4nomo ligado \xE0 Dinamarca." },
  { q: "Por que o c\xE9u \xE9 azul durante o dia?", a: "Espalhamento da luz solar", w: ["Reflexo dos oceanos", "Cor do oz\xF4nio", "Poeira no ar"], fact: "O ar espalha mais a luz azul, de onda curta, do que as outras cores." },
  { q: "Qual tipo de nuvem, alta e carregada, est\xE1 associada a tempestades e raios?", a: "Cumulonimbus", w: ["Cirrus", "Estratos", "C\xFAmulos"], fact: "Uma cumulonimbus pode passar de 10 km de altura." },
  { q: "Qual \xE9 o deserto mais seco do mundo, sem contar as regi\xF5es polares?", a: "Atacama", w: ["Saara", "Gobi", "Namibe"], fact: "O Atacama fica no Chile, e h\xE1 pontos nele onde quase nunca chove." },
  { q: "Qual escala mede a dureza dos minerais?", a: "Escala de Mohs", w: ["Escala Richter", "Escala Kelvin", "Escala Beaufort"], fact: "Na escala de Mohs, o talco tem dureza 1 e o diamante, dureza 10." },
  { q: "Qual \xE9 a montanha mais alta da Am\xE9rica do Sul?", a: "Aconc\xE1gua", w: ["Chimborazo", "Huascar\xE1n", "Ojos del Salado"], fact: "O Aconc\xE1gua fica na Argentina e tem cerca de 6.961 metros." },
  { q: "Qual planeta gira praticamente deitado, com o eixo inclinado cerca de 98 graus?", a: "Urano", w: ["Netuno", "V\xEAnus", "Saturno"], fact: "Por causa disso, cada polo de Urano passa d\xE9cadas seguidas iluminado pelo Sol." },
  { q: "Em qual planeta uma volta completa no pr\xF3prio eixo demora mais do que uma volta ao redor do Sol?", a: "V\xEAnus", w: ["J\xFApiter", "Marte", "Netuno"], fact: "V\xEAnus leva 243 dias terrestres para girar no pr\xF3prio eixo e 225 para orbitar o Sol." },
  { q: "Como se chama o ponto da \xF3rbita da Terra mais pr\xF3ximo do Sol?", a: "Peri\xE9lio", w: ["Af\xE9lio", "Solst\xEDcio", "Equin\xF3cio"], fact: "Ele ocorre no in\xEDcio de janeiro: as esta\xE7\xF5es v\xEAm da inclina\xE7\xE3o do eixo, n\xE3o da dist\xE2ncia." }
];
var natureza_default = questions11;

// shared/questions/animais.ts
var questions12 = [
  { q: "Qual \xE9 o maior animal que j\xE1 existiu na Terra, at\xE9 onde se sabe?", a: "Baleia-azul", w: ["Elefante-africano", "Cachalote", "Tubar\xE3o-baleia"], fact: "A baleia-azul pode passar de 30 metros e \xE9 mais pesada que qualquer dinossauro conhecido." },
  { q: "Qual \xE9 o animal terrestre mais r\xE1pido do mundo?", a: "Guepardo", w: ["Le\xE3o", "Ant\xEDlope", "Cavalo"], fact: "O guepardo pode passar de 100 km/h, mas s\xF3 aguenta arrancadas curtas." },
  { q: "Quantas patas tem uma aranha?", a: "8", w: ["6", "10", "12"], fact: "Aranhas s\xE3o aracn\xEDdeas, n\xE3o insetos. Os insetos t\xEAm 6 patas." },
  { q: "O golfinho pertence a qual grupo de animais?", a: "Mam\xEDferos", w: ["Peixes", "Anf\xEDbios", "R\xE9pteis"], fact: "Golfinhos respiram ar por um orif\xEDcio no alto da cabe\xE7a e amamentam os filhotes." },
  { q: "Qual \xE9 a maior ave do mundo?", a: "Avestruz", w: ["Ema", "Emu", "Condor"], fact: "O avestruz n\xE3o voa, mas bota o maior ovo entre as aves vivas." },
  { q: "Qual \xE9 o maior roedor do mundo?", a: "Capivara", w: ["Castor", "Porco-espinho", "Paca"], fact: "A capivara pode passar de 60 kg e vive sempre perto da \xE1gua." },
  { q: "Qual \xE9 o \xFAnico mam\xEDfero capaz de voar de verdade?", a: "Morcego", w: ["Esquilo-voador", "Colugo", "Petauro-do-a\xE7\xFAcar"], fact: "Esquilos-voadores e colugos apenas planam; s\xF3 o morcego bate asas." },
  { q: "Qual \xE9 o principal alimento do panda-gigante?", a: "Bambu", w: ["Eucalipto", "Peixe", "Frutas"], fact: "O bambu forma quase toda a dieta do panda, que passa horas por dia comendo." },
  { q: "Como se chama o filhote do cavalo?", a: "Potro", w: ["Bezerro", "Cabrito", "Leit\xE3o"], fact: "A f\xEAmea jovem do cavalo tamb\xE9m pode ser chamada de potra ou potranca." },
  { q: "Qual \xE9 o coletivo de lobos?", a: "Alcateia", w: ["Cardume", "Manada", "Enxame"], fact: "Cardume \xE9 de peixes, manada de bois e enxame de abelhas." },
  { q: "Do que o tamandu\xE1-bandeira se alimenta principalmente?", a: "Formigas e cupins", w: ["Frutas", "Peixes", "Folhas"], fact: "A l\xEDngua do tamandu\xE1-bandeira pode chegar a uns 60 cm de comprimento." },
  { q: "O jacar\xE9 pertence a qual grupo de animais?", a: "R\xE9pteis", w: ["Anf\xEDbios", "Mam\xEDferos", "Peixes"], fact: "O Brasil abriga seis esp\xE9cies de jacar\xE9s." },
  { q: "Qual \xE9 o maior felino das Am\xE9ricas?", a: "On\xE7a-pintada", w: ["Puma", "Jaguatirica", "Lince"], fact: "A on\xE7a-pintada \xE9 o terceiro maior felino do mundo, atr\xE1s do tigre e do le\xE3o." },
  { q: "Qual \xE9 a maior ave do Brasil?", a: "Ema", w: ["Tuiui\xFA", "Harpia", "Seriema"], fact: "A ema n\xE3o voa, mas \xE9 \xF3tima corredora. Quem choca os ovos \xE9 o macho." },
  { q: "Qual ave de pernas longas e pesco\xE7o preto e vermelho \xE9 o s\xEDmbolo do Pantanal?", a: "Tuiui\xFA", w: ["Arara-azul", "Gar\xE7a-branca", "Colhereiro"], fact: "Com as asas abertas, o tuiui\xFA pode passar de 2,5 metros de ponta a ponta." },
  { q: "Quantos cora\xE7\xF5es tem um polvo?", a: "3", w: ["1", "2", "8"], fact: "Al\xE9m de tr\xEAs cora\xE7\xF5es, o polvo tem sangue azul, por causa de uma prote\xEDna com cobre." },
  { q: "Qual primata de pelagem alaranjada \xE9 s\xEDmbolo da conserva\xE7\xE3o da Mata Atl\xE2ntica?", a: "Mico-le\xE3o-dourado", w: ["Sagui-de-tufo-branco", "Macaco-prego", "Bugio"], fact: "O mico-le\xE3o-dourado estampa a nota de 20 reais." },
  { q: "Qual cobra \xE9 considerada a mais pesada do mundo?", a: "Sucuri", w: ["P\xEDton-reticulada", "Jiboia", "Naja-real"], fact: "A p\xEDton-reticulada pode ser mais comprida, mas a sucuri \xE9 mais pesada." },
  { q: "Qual mam\xEDfero bota ovos e tem bico parecido com o de um pato?", a: "Ornitorrinco", w: ["Lontra", "Castor", "Tamandu\xE1"], fact: "O ornitorrinco vive na Austr\xE1lia, e o macho tem um espor\xE3o venenoso nas patas." },
  { q: "O bicho-pregui\xE7a desce da \xE1rvore cerca de uma vez por semana para fazer o qu\xEA?", a: "Fazer coc\xF4", w: ["Beber \xE1gua", "Dormir", "Ca\xE7ar"], fact: "A pregui\xE7a \xE9 t\xE3o lenta que algas chegam a crescer em seus pelos." },
  { q: "Qual \xE9 o maior peixe do mundo?", a: "Tubar\xE3o-baleia", w: ["Tubar\xE3o-branco", "Pirarucu", "Peixe-lua"], fact: "Apesar do tamanho, o tubar\xE3o-baleia se alimenta de pl\xE2ncton e pequenos peixes." },
  { q: "Qual ave consegue voar para tr\xE1s?", a: "Beija-flor", w: ["Andorinha", "Pica-pau", "Bem-te-vi"], fact: "Os beija-flores tamb\xE9m conseguem ficar parados no ar, batendo as asas muito r\xE1pido." },
  { q: "Qual animal aparece na nota de 200 reais?", a: "Lobo-guar\xE1", w: ["On\xE7a-pintada", "Mico-le\xE3o-dourado", "Garoupa"], fact: "A nota de 200 reais foi lan\xE7ada em 2020." },
  { q: "Em qual animal \xE9 o macho que carrega os ovos at\xE9 os filhotes nascerem?", a: "Cavalo-marinho", w: ["Tubar\xE3o-martelo", "Polvo", "Peixe-palha\xE7o"], fact: "A f\xEAmea deposita os ovos numa bolsa na barriga do macho." },
  { q: "Quantas v\xE9rtebras tem o pesco\xE7o de uma girafa?", a: "7", w: ["14", "21", "3"], fact: "\xC9 o mesmo n\xFAmero do pesco\xE7o humano; as v\xE9rtebras da girafa \xE9 que s\xE3o enormes." },
  { q: "Em qual estado brasileiro fica Abrolhos, principal ber\xE7\xE1rio das baleias-jubarte no pa\xEDs?", a: "Bahia", w: ["Santa Catarina", "Rio de Janeiro", "Pernambuco"], fact: "J\xE1 Santa Catarina \xE9 famosa por receber a baleia-franca no inverno." },
  { q: "Qual \xE9 o invertebrado mais pesado conhecido?", a: "Lula-colossal", w: ["Lula-gigante", "Polvo-gigante", "Caranguejo-aranha"], fact: "Um exemplar capturado em 2007 pesava cerca de 495 kg." },
  { q: "Qual animal tem impress\xF5es digitais muito parecidas com as dos humanos?", a: "Coala", w: ["Panda", "Bicho-pregui\xE7a", "Guaxinim"], fact: "As digitais do coala s\xE3o t\xE3o parecidas que poderiam confundir at\xE9 especialistas." },
  { q: "Qual animal terrestre \xE9 um dos parentes vivos mais pr\xF3ximos do peixe-boi?", a: "Elefante", w: ["Hipop\xF3tamo", "Porco", "Cavalo"], fact: "Peixes-bois e elefantes descendem de um ancestral comum que viveu h\xE1 milh\xF5es de anos." },
  { q: "Qual \xE9 o maior macaco das Am\xE9ricas?", a: "Muriqui", w: ["Bugio", "Macaco-prego", "Uacari"], fact: "O muriqui vive na Mata Atl\xE2ntica e est\xE1 amea\xE7ado de extin\xE7\xE3o." }
];
var animais_default = questions12;

// shared/questions/historia.ts
var questions13 = [
  { q: "Em que ano Crist\xF3v\xE3o Colombo chegou \xE0 Am\xE9rica?", a: "1492", w: ["1500", "1488", "1519"], fact: "Colombo desembarcou nas Bahamas achando que tinha chegado \xE0s \xCDndias." },
  { q: "Quem foi o primeiro ser humano a pisar na Lua?", a: "Neil Armstrong", w: ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins"], fact: "Foi em julho de 1969, na miss\xE3o Apollo 11." },
  { q: "Em que ano caiu o Muro de Berlim?", a: "1989", w: ["1991", "1985", "1961"], fact: "O muro foi erguido em 1961 e dividiu Berlim por 28 anos." },
  { q: "Qual civiliza\xE7\xE3o construiu Machu Picchu, no Peru?", a: "Incas", w: ["Maias", "Astecas", "Olmecas"], fact: "Machu Picchu foi constru\xEDda no s\xE9culo XV, no alto dos Andes." },
  { q: "Em que ano come\xE7ou a Primeira Guerra Mundial?", a: "1914", w: ["1939", "1918", "1905"], fact: "O estopim foi o assassinato do arquiduque Francisco Ferdinando, em Sarajevo." },
  { q: "Em que ano terminou a Segunda Guerra Mundial?", a: "1945", w: ["1944", "1939", "1950"], fact: "A guerra acabou oficialmente com a rendi\xE7\xE3o do Jap\xE3o, em setembro de 1945." },
  { q: "Qual cientista criou a Teoria da Relatividade?", a: "Albert Einstein", w: ["Isaac Newton", "Galileu Galilei", "Nikola Tesla"], fact: "Einstein publicou a relatividade restrita em 1905 e a geral em 1915." },
  { q: "Qual navio afundou em 1912 em sua viagem inaugural, ap\xF3s bater em um iceberg?", a: "Titanic", w: ["Lusitania", "Britannic", "Queen Mary"], fact: "O Titanic era tido como praticamente inafund\xE1vel." },
  { q: "A Guerra Fria foi a disputa entre os Estados Unidos e qual pa\xEDs?", a: "Uni\xE3o Sovi\xE9tica", w: ["China", "Alemanha", "Jap\xE3o"], fact: "A Guerra Fria terminou com o fim da Uni\xE3o Sovi\xE9tica, em 1991." },
  { q: "Qual l\xEDder franc\xEAs foi derrotado na Batalha de Waterloo, em 1815?", a: "Napole\xE3o Bonaparte", w: ["Lu\xEDs XVI", "Carlos Magno", "Robespierre"], fact: "Depois da derrota, Napole\xE3o foi exilado na ilha de Santa Helena." },
  { q: "Em qual pa\xEDs surgiram os Jogos Ol\xEDmpicos da Antiguidade?", a: "Gr\xE9cia", w: ["It\xE1lia", "Egito", "P\xE9rsia"], fact: "A tradi\xE7\xE3o situa os primeiros jogos em Ol\xEDmpia, no ano de 776 a.C." },
  { q: "Qual l\xEDder sul-africano ficou 27 anos preso e depois virou presidente do pa\xEDs?", a: "Nelson Mandela", w: ["Desmond Tutu", "Steve Biko", "Kofi Annan"], fact: "Mandela ganhou o Nobel da Paz em 1993 e foi eleito presidente em 1994." },
  { q: "Quem foi o primeiro ser humano a ir ao espa\xE7o?", a: "Yuri Gagarin", w: ["Neil Armstrong", "John Glenn", "Alan Shepard"], fact: "O sovi\xE9tico Gagarin orbitou a Terra em abril de 1961, a bordo da Vostok 1." },
  { q: "Em que ano come\xE7ou a Revolu\xE7\xE3o Francesa?", a: "1789", w: ["1776", "1815", "1848"], fact: "O marco inicial \xE9 a Queda da Bastilha, em 14 de julho de 1789." },
  { q: "Quem criou a prensa de tipos m\xF3veis que revolucionou a impress\xE3o na Europa?", a: "Johannes Gutenberg", w: ["Galileu Galilei", "Leonardo da Vinci", "Isaac Newton"], fact: "A prensa surgiu por volta de 1450, e a B\xEDblia foi um dos primeiros livros impressos." },
  { q: "Qual navegador portugu\xEAs chegou \xE0 \xCDndia por mar em 1498?", a: "Vasco da Gama", w: ["Pedro \xC1lvares Cabral", "Bartolomeu Dias", "Fern\xE3o de Magalh\xE3es"], fact: "Ele contornou a \xC1frica e chegou a Calicute, abrindo a rota das especiarias." },
  { q: "Quem comandou a expedi\xE7\xE3o que iniciou a primeira volta ao mundo, em 1519?", a: "Fern\xE3o de Magalh\xE3es", w: ["Vasco da Gama", "Crist\xF3v\xE3o Colombo", "Am\xE9rico Vesp\xFAcio"], fact: "Magalh\xE3es morreu nas Filipinas; a viagem foi conclu\xEDda por Juan Sebasti\xE1n Elcano." },
  { q: "Qual ataque japon\xEAs levou os Estados Unidos a entrar na Segunda Guerra Mundial?", a: "Pearl Harbor", w: ["Normandia", "Hiroshima", "Midway"], fact: "O ataque \xE0 base naval no Hava\xED ocorreu em 7 de dezembro de 1941." },
  { q: "Quem foi o primeiro imperador de Roma?", a: "Augusto", w: ["J\xFAlio C\xE9sar", "Nero", "Cal\xEDgula"], fact: "J\xFAlio C\xE9sar foi ditador, mas nunca imperador. Augusto assumiu em 27 a.C." },
  { q: "Qual cidade romana foi soterrada pela erup\xE7\xE3o do Ves\xFAvio em 79 d.C.?", a: "Pompeia", w: ["Atenas", "Cartago", "Troia"], fact: "As cinzas preservaram casas, pinturas e at\xE9 p\xE3es dentro dos fornos." },
  { q: "Quem descobriu a penicilina, o primeiro antibi\xF3tico, em 1928?", a: "Alexander Fleming", w: ["Louis Pasteur", "Marie Curie", "Edward Jenner"], fact: "Fleming notou que um fungo matava as bact\xE9rias de uma placa esquecida no laborat\xF3rio." },
  { q: "Quem foi a primeira mulher a ganhar um Pr\xEAmio Nobel?", a: "Marie Curie", w: ["Ada Lovelace", "Florence Nightingale", "Rosalind Franklin"], fact: "Ela ganhou dois Nobel: F\xEDsica em 1903 e Qu\xEDmica em 1911." },
  { q: "Quem publicou as 95 teses que deram in\xEDcio \xE0 Reforma Protestante, em 1517?", a: "Martinho Lutero", w: ["Jo\xE3o Calvino", "Henrique VIII", "Erasmo de Roterd\xE3"], fact: "Lutero criticava a venda de indulg\xEAncias pela Igreja Cat\xF3lica." },
  { q: "Gengis Khan fundou qual imp\xE9rio?", a: "Imp\xE9rio Mongol", w: ["Imp\xE9rio Otomano", "Imp\xE9rio Persa", "Imp\xE9rio Chin\xEAs"], fact: "O Imp\xE9rio Mongol se tornou o maior imp\xE9rio de terras cont\xEDnuas da hist\xF3ria." },
  { q: "Quem liderou os bolcheviques na Revolu\xE7\xE3o Russa de 1917?", a: "Vladimir L\xEAnin", w: ["Josef St\xE1lin", "Nicolau II", "Mikhail Gorbachev"], fact: "Os bolcheviques tomaram o poder na Revolu\xE7\xE3o de Outubro, que levou \xE0 cria\xE7\xE3o da Uni\xE3o Sovi\xE9tica em 1922." },
  { q: "Qual fara\xF3 mandou construir a Grande Pir\xE2mide de Giz\xE9?", a: "Qu\xE9ops", w: ["Tutanc\xE2mon", "Rams\xE9s II", "Akhenaton"], fact: "Ela foi a constru\xE7\xE3o humana mais alta do mundo por cerca de 3.800 anos." },
  { q: "Em que ano caiu o Imp\xE9rio Romano do Ocidente?", a: "476", w: ["1453", "313", "800"], fact: "A data marca tradicionalmente o fim da Antiguidade e o in\xEDcio da Idade M\xE9dia." },
  { q: "Qual explorador viking chegou \xE0 Am\xE9rica do Norte por volta do ano 1000?", a: "Leif Erikson", w: ["Erik, o Vermelho", "Ragnar Lothbrok", "Haroldo Dente-Azul"], fact: "Ru\xEDnas vikings foram encontradas em L'Anse aux Meadows, no Canad\xE1." },
  { q: "A tomada de Constantinopla pelos turcos, em 1453, marca o fim de qual per\xEDodo?", a: "Idade M\xE9dia", w: ["Idade Antiga", "Idade Moderna", "Idade Contempor\xE2nea"], fact: "Constantinopla, atual Istambul, era a capital do Imp\xE9rio Bizantino." },
  { q: "Qual tratado, assinado em 1919, encerrou oficialmente a Primeira Guerra Mundial?", a: "Tratado de Versalhes", w: ["Tratado de Tordesilhas", "Tratado de Utrecht", "Tratado de Westf\xE1lia"], fact: "O tratado imp\xF4s duras puni\xE7\xF5es \xE0 Alemanha, o que alimentou tens\xF5es futuras." }
];
var historia_default = questions13;

// shared/questions/paises.ts
var questions14 = [
  { q: "Qual pa\xEDs tem uma folha de bordo vermelha no centro da bandeira?", a: "Canad\xE1", w: ["Su\xED\xE7a", "\xC1ustria", "Peru"], fact: "A bandeira com a folha de bordo foi adotada oficialmente em 1965." },
  { q: "Qual pa\xEDs tem bandeira branca com um c\xEDrculo vermelho no centro?", a: "Jap\xE3o", w: ["China", "Coreia do Sul", "Vietn\xE3"], fact: 'A bandeira japonesa \xE9 chamada de Hinomaru, o "c\xEDrculo do sol".' },
  { q: "Qual pa\xEDs tem o territ\xF3rio em formato de bota?", a: "It\xE1lia", w: ["Gr\xE9cia", "Portugal", "Cro\xE1cia"], fact: 'A Ap\xFAlia forma o "salto" da bota e a Cal\xE1bria, a "ponta".' },
  { q: "Em que pa\xEDs fica o Coliseu?", a: "It\xE1lia", w: ["Gr\xE9cia", "Espanha", "Turquia"], fact: "Inaugurado em 80 d.C., recebia dezenas de milhares de espectadores." },
  { q: "Qual \xE9 a moeda oficial do Jap\xE3o?", a: "Iene", w: ["Yuan", "Won", "Baht"], fact: "O s\xEDmbolo do iene \xE9 \xA5, o mesmo usado para o yuan chin\xEAs." },
  { q: "Qual \xE9 o maior pa\xEDs do mundo em \xE1rea?", a: "R\xFAssia", w: ["Canad\xE1", "China", "Estados Unidos"], fact: "A R\xFAssia \xE9 t\xE3o extensa que tem 11 fusos hor\xE1rios." },
  { q: "Qual \xE9 o menor pa\xEDs do mundo?", a: "Vaticano", w: ["M\xF4naco", "San Marino", "Liechtenstein"], fact: "O Vaticano tem cerca de 0,44 km\xB2 e fica dentro da cidade de Roma." },
  { q: "Quantas estrelas h\xE1 na bandeira dos Estados Unidos?", a: "50", w: ["48", "13", "51"], fact: "Cada estrela \xE9 um estado; as 13 listras lembram as 13 col\xF4nias originais." },
  { q: "Em que pa\xEDs fica Machu Picchu?", a: "Peru", w: ["Bol\xEDvia", "Equador", "Chile"], fact: "A cidadela inca foi constru\xEDda no s\xE9culo XV, no alto da Cordilheira dos Andes." },
  { q: "Em que pa\xEDs fica o Taj Mahal?", a: "\xCDndia", w: ["Paquist\xE3o", "Ir\xE3", "Bangladesh"], fact: "Foi erguido pelo imperador Shah Jahan em mem\xF3ria da esposa Mumtaz Mahal." },
  { q: "Qual pa\xEDs deu de presente a Est\xE1tua da Liberdade aos Estados Unidos?", a: "Fran\xE7a", w: ["Reino Unido", "It\xE1lia", "Espanha"], fact: "Inaugurada em 1886, sua estrutura interna foi projetada por Gustave Eiffel." },
  { q: "Qual \xE9 a moeda oficial do Reino Unido?", a: "Libra esterlina", w: ["Euro", "D\xF3lar", "Franco"], fact: "Desde 1971, uma libra \xE9 dividida em 100 pence." },
  { q: "Qual \xE9 a capital da Austr\xE1lia?", a: "Canberra", w: ["Sydney", "Melbourne", "Perth"], fact: "Canberra foi planejada para encerrar a disputa entre Sydney e Melbourne." },
  { q: "Qual \xE9 a capital do Canad\xE1?", a: "Ottawa", w: ["Toronto", "Montreal", "Vancouver"], fact: "Toronto \xE9 a maior cidade do Canad\xE1, mas a capital \xE9 Ottawa, em Ont\xE1rio." },
  { q: "Qual \xE9 a capital da Turquia?", a: "Ancara", w: ["Istambul", "Esmirna", "Ant\xE1lia"], fact: "Ancara virou capital em 1923; Istambul segue sendo a maior cidade turca." },
  { q: "Qual \xE9 a capital da Nova Zel\xE2ndia?", a: "Wellington", w: ["Auckland", "Christchurch", "Queenstown"], fact: "Wellington \xE9 considerada a capital nacional mais ao sul do mundo." },
  { q: "Qual \xE9 a capital da Su\xED\xE7a?", a: "Berna", w: ["Zurique", "Genebra", "Basileia"], fact: "A Su\xED\xE7a tem quatro idiomas nacionais: alem\xE3o, franc\xEAs, italiano e romanche." },
  { q: "Qual \xE9 o idioma oficial de Angola?", a: "Portugu\xEAs", w: ["Franc\xEAs", "Ingl\xEAs", "Espanhol"], fact: "Angola tornou-se independente de Portugal em 1975." },
  { q: "Qual \xE9 o idioma oficial da \xC1ustria?", a: "Alem\xE3o", w: ["Franc\xEAs", "H\xFAngaro", "Holand\xEAs"], fact: "Mozart nasceu em Salzburgo, na \xC1ustria, em 1756." },
  { q: "Qual \xE9 a moeda oficial da \xCDndia?", a: "Rupia", w: ["Taka", "Baht", "Ringgit"], fact: "As notas de rupia indiana trazem o retrato de Mahatma Gandhi." },
  { q: "Em que pa\xEDs fica a cidade hist\xF3rica de Petra, esculpida na rocha?", a: "Jord\xE2nia", w: ["Egito", "Israel", "S\xEDria"], fact: "Petra foi eleita uma das Novas 7 Maravilhas do Mundo em 2007." },
  { q: "Em que cidade fica a bas\xEDlica da Sagrada Fam\xEDlia, de Gaud\xED?", a: "Barcelona", w: ["Madri", "Sevilha", "Val\xEAncia"], fact: "Projetada por Antoni Gaud\xED, a bas\xEDlica est\xE1 em constru\xE7\xE3o desde 1882." },
  { q: "Qual pa\xEDs tem um cedro verde no centro da bandeira?", a: "L\xEDbano", w: ["S\xEDria", "Jord\xE2nia", "Chipre"], fact: "O cedro fica entre duas faixas vermelhas horizontais." },
  { q: "Qual pa\xEDs tem bandeira vermelha com uma \xFAnica estrela amarela no centro?", a: "Vietn\xE3", w: ["China", "Coreia do Norte", "Laos"], fact: "A bandeira atual passou a valer para todo o Vietn\xE3 unificado em 1976." },
  { q: "Qual \xE9 a capital do Marrocos?", a: "Rabat", w: ["Casablanca", "Marrakech", "Fez"], fact: "Casablanca \xE9 a maior cidade do Marrocos, mas a capital \xE9 Rabat." },
  { q: "Qual \xE9 o idioma oficial do Ir\xE3?", a: "Persa", w: ["\xC1rabe", "Turco", "Urdu"], fact: "O persa tamb\xE9m \xE9 conhecido como farsi." },
  { q: "Qual pa\xEDs tem um drag\xE3o branco na bandeira?", a: "But\xE3o", w: ["Nepal", "China", "Mong\xF3lia"], fact: 'No idioma local, o But\xE3o \xE9 chamado de Druk Yul, "Terra do Drag\xE3o do Trov\xE3o".' },
  { q: "Qual pa\xEDs tem a \xFAnica bandeira nacional que n\xE3o \xE9 retangular?", a: "Nepal", w: ["But\xE3o", "Sri Lanka", "Mong\xF3lia"], fact: "A bandeira do Nepal \xE9 formada por dois tri\xE2ngulos sobrepostos." },
  { q: "Qual \xE9 a capital da Isl\xE2ndia?", a: "Reykjav\xEDk", w: ["Oslo", "Helsinque", "Nuuk"], fact: "Reykjav\xEDk \xE9 a capital de pa\xEDs soberano mais ao norte do mundo." },
  { q: "Em que pa\xEDs fica o templo de Angkor Wat?", a: "Camboja", w: ["Tail\xE2ndia", "Vietn\xE3", "Laos"], fact: "\xC9 o maior monumento religioso do mundo e aparece na bandeira do Camboja." }
];
var paises_default = questions14;

// shared/questions/culturas.ts
var questions15 = [
  { q: "Como se chama a tradi\xE7\xE3o japonesa de contemplar a florada das cerejeiras?", a: "Hanami", w: ["Obon", "Tanabata", "Setsubun"], fact: "Hanami significa, literalmente, \u201Cver as flores\u201D." },
  { q: "Em 2009, a UNESCO reconheceu o tango como patrim\xF4nio de quais pa\xEDses?", a: "Argentina e Uruguai", w: ["Argentina e Chile", "Uruguai e Paraguai", "Espanha e Argentina"], fact: "O tango nasceu na regi\xE3o do Rio da Prata, no fim do s\xE9culo XIX." },
  { q: "Qual prato t\xEDpico espanhol leva arroz, a\xE7afr\xE3o e, muitas vezes, frutos do mar?", a: "Paella", w: ["Risoto", "Tagine", "Jambalaya"], fact: "A paella tem origem na regi\xE3o de Val\xEAncia." },
  { q: "O D\xEDa de los Muertos, com altares coloridos e caveiras decoradas, \xE9 tradi\xE7\xE3o de qual pa\xEDs?", a: "M\xE9xico", w: ["Peru", "Espanha", "Col\xF4mbia"], fact: "Os altares s\xE3o enfeitados com flores laranja de cempas\xFAchil." },
  { q: "Qual \xE9 o idioma com mais falantes nativos no mundo?", a: "Mandarim", w: ["Ingl\xEAs", "Espanhol", "Hindi"], fact: "O mandarim tem cerca de 900 milh\xF5es de falantes nativos." },
  { q: "O Diwali, conhecido como \u201Cfestival das luzes\u201D, \xE9 uma grande celebra\xE7\xE3o de qual religi\xE3o?", a: "Hindu\xEDsmo", w: ["Xinto\xEDsmo", "Islamismo", "Juda\xEDsmo"], fact: "Durante o Diwali, casas s\xE3o iluminadas com pequenas lamparinas chamadas diyas." },
  { q: "Qual instrumento musical \xE9 um dos maiores s\xEDmbolos da Esc\xF3cia?", a: "Gaita de foles", w: ["Harpa", "Violino", "Flauta de P\xE3"], fact: "Os tocadores costumam se apresentar usando o tradicional kilt xadrez." },
  { q: "Qual \xE9 o nome da dan\xE7a cerimonial tradicional do povo maori, da Nova Zel\xE2ndia?", a: "Haka", w: ["Hula", "Tamur\xE9", "Siva"], fact: "A sele\xE7\xE3o de r\xFAgbi All Blacks apresenta o haka antes das partidas." },
  { q: "O que \xE9 o wasabi, condimento verde servido com sushi?", a: "Uma raiz-forte japonesa", w: ["Uma pasta de soja", "Uma alga marinha", "Um gengibre em conserva"], fact: "Fora do Jap\xE3o, muito \u201Cwasabi\u201D \xE9 feito com raiz-forte comum e corante." },
  { q: "Em qual pa\xEDs nasceu a Oktoberfest, famosa festa da cerveja?", a: "Alemanha", w: ["\xC1ustria", "B\xE9lgica", "Holanda"], fact: "Come\xE7ou em Munique, em 1810; Blumenau (SC) tem uma das vers\xF5es mais famosas do Brasil." },
  { q: "Quantos animais comp\xF5em o zod\xEDaco chin\xEAs?", a: "12", w: ["10", "8", "14"], fact: "O ciclo come\xE7a pelo Rato e termina no Porco." },
  { q: "Qual cor simboliza sorte e alegria nas festas tradicionais chinesas?", a: "Vermelho", w: ["Branco", "Verde", "Preto"], fact: "No Ano-Novo Chin\xEAs, \xE9 costume dar dinheiro em envelopes vermelhos." },
  { q: "Qual bebida quente de erva-mate \xE9 s\xEDmbolo cultural do sul do Brasil, Argentina e Uruguai?", a: "Chimarr\xE3o", w: ["Terer\xE9", "Quent\xE3o", "Ch\xE1 de boldo"], fact: "\xC9 tomado numa cuia, com uma bomba de metal, e costuma ser compartilhado na roda." },
  { q: "O persa, tamb\xE9m chamado de farsi, \xE9 a l\xEDngua oficial de qual pa\xEDs?", a: "Ir\xE3", w: ["Iraque", "Turquia", "Egito"], fact: "O persa \xE9 escrito com uma varia\xE7\xE3o do alfabeto \xE1rabe." },
  { q: "O Festival de Parintins, no Amazonas, \xE9 uma disputa entre quais bois?", a: "Garantido e Caprichoso", w: ["Estrela e Malhadinho", "Brilhante e Mimoso", "Tinoco e Pintadinho"], fact: "O Garantido \xE9 vermelho e o Caprichoso \xE9 azul." },
  { q: "A pizza Margherita, com tomate, mu\xE7arela e manjeric\xE3o, lembra a bandeira de qual pa\xEDs?", a: "It\xE1lia", w: ["Fran\xE7a", "Brasil", "Espanha"], fact: "Segundo a tradi\xE7\xE3o, homenageia a rainha Margherita, em N\xE1poles, em 1889." },
  { q: "Em qual destes pa\xEDses africanos o portugu\xEAs \xE9 l\xEDngua oficial?", a: "Mo\xE7ambique", w: ["Marrocos", "Senegal", "Qu\xEAnia"], fact: "Nove pa\xEDses fazem parte da Comunidade dos Pa\xEDses de L\xEDngua Portuguesa." },
  { q: "Qual bebida \xE9 o centro da tradicional cerim\xF4nia japonesa chamada chanoyu?", a: "Ch\xE1 verde matcha", w: ["Saqu\xEA", "Ch\xE1 preto", "Ch\xE1 de jasmim"], fact: "O matcha \xE9 um ch\xE1 verde em p\xF3, batido com um batedor de bambu." },
  { q: "Qual festa brasileira tem quadrilha, fogueira e comidas de milho?", a: "Festa Junina", w: ["Carnaval", "C\xEDrio de Nazar\xE9", "Folia de Reis"], fact: "Ela homenageia Santo Ant\xF4nio, S\xE3o Jo\xE3o e S\xE3o Pedro." },
  { q: "O que significa \u201CNamast\xEA\u201D, sauda\xE7\xE3o comum na \xCDndia e no Nepal?", a: "Eu me curvo a voc\xEA", w: ["Bom apetite", "At\xE9 amanh\xE3", "Boa viagem"], fact: "A sauda\xE7\xE3o costuma ser feita com as palmas das m\xE3os unidas." },
  { q: "Qual ave \xE9 o prato principal tradicional do Dia de A\xE7\xE3o de Gra\xE7as nos EUA?", a: "Peru", w: ["Frango", "Pato", "Ganso"], fact: "Nos EUA, o feriado \xE9 celebrado na quarta quinta-feira de novembro." },
  { q: "O flamenco, com seu canto, viol\xE3o e sapateado, \xE9 tradi\xE7\xE3o de qual pa\xEDs?", a: "Espanha", w: ["Portugal", "M\xE9xico", "It\xE1lia"], fact: "Nasceu na Andaluzia e \xE9 Patrim\xF4nio Imaterial da UNESCO desde 2010." },
  { q: "Qual \xE9 o nome do p\xE3o achatado indiano assado no forno tandoor?", a: "Naan", w: ["Pita", "Tortilla", "Focaccia"], fact: "O naan costuma acompanhar curries e pode levar alho ou manteiga." },
  { q: "No Holi, festival hindu da primavera, o que as pessoas jogam umas nas outras?", a: "P\xF3 colorido", w: ["Arroz cru", "Farinha de trigo", "Confete de papel"], fact: "O Holi celebra a chegada da primavera e a vit\xF3ria do bem sobre o mal." },
  { q: "Qual povo do \xC1rtico ficou conhecido por construir iglus?", a: "Inu\xEDtes", w: ["Maoris", "Tuaregues", "Qu\xE9chuas"], fact: "O iglu era usado principalmente como abrigo tempor\xE1rio em viagens de ca\xE7a." },
  { q: "O C\xEDrio de Nazar\xE9, uma das maiores prociss\xF5es cat\xF3licas do mundo, acontece em qual cidade?", a: "Bel\xE9m", w: ["Salvador", "Aparecida", "Recife"], fact: "A prociss\xE3o acontece no segundo domingo de outubro." },
  { q: "Em qual destes pa\xEDses o sua\xEDli \xE9 amplamente falado?", a: "Qu\xEAnia", w: ["Nig\xE9ria", "Egito", "Marrocos"], fact: "\u201CHakuna matata\u201D, de 'O Rei Le\xE3o', \xE9 uma express\xE3o em sua\xEDli." },
  { q: "Qual \xE9 o nome da veste tradicional feminina da \xCDndia, um longo tecido enrolado no corpo?", a: "S\xE1ri", w: ["Quimono", "Hanbok", "Qipao"], fact: "O s\xE1ri \xE9 feito de uma \xFAnica pe\xE7a de tecido, com v\xE1rios metros de comprimento." },
  { q: "O Ramad\xE3 \xE9 o m\xEAs sagrado de jejum de qual religi\xE3o?", a: "Islamismo", w: ["Juda\xEDsmo", "Hindu\xEDsmo", "Budismo"], fact: "Durante o Ramad\xE3, o jejum vai da alvorada ao p\xF4r do sol." },
  { q: "Qual \xE9 o nome do alfabeto usado para escrever a l\xEDngua coreana?", a: "Hangul", w: ["Kanji", "Hiragana", "Devan\xE1gari"], fact: "O hangul foi criado no s\xE9culo XV, durante o reinado do rei Sejong." }
];
var culturas_default = questions15;

// shared/questions/religiao.ts
var questions16 = [
  { q: "Qual \xE9 o livro sagrado do islamismo?", a: "Alcor\xE3o", w: ["Tor\xE1", "Vedas", "Tripitaka"], fact: "Escrito em \xE1rabe, o Alcor\xE3o \xE9 dividido em 114 cap\xEDtulos chamados suratas." },
  { q: "O que os crist\xE3os celebram na P\xE1scoa?", a: "A ressurrei\xE7\xE3o de Jesus", w: ["O nascimento de Jesus", "O batismo de Jesus", "A \xDAltima Ceia"], fact: "A P\xE1scoa \xE9 uma data m\xF3vel, ligada ao calend\xE1rio lunar." },
  { q: "Segundo os Evangelhos, quantos ap\xF3stolos Jesus escolheu?", a: "12", w: ["7", "10", "40"], fact: "Entre eles estavam Pedro, Jo\xE3o, Tiago e Mateus." },
  { q: "Quem \xE9 o deus dos mares na mitologia grega?", a: "Poseidon", w: ["Zeus", "Hades", "Apolo"], fact: "Seu s\xEDmbolo \xE9 o tridente; na mitologia romana, ele \xE9 Netuno." },
  { q: "Segundo a B\xEDblia, quem construiu uma grande arca antes do dil\xFAvio?", a: "No\xE9", w: ["Mois\xE9s", "Abra\xE3o", "Jonas"], fact: "Segundo o G\xEAnesis, a arca abrigou No\xE9, sua fam\xEDlia e casais de animais." },
  { q: "Qual \xE9 o primeiro livro da B\xEDblia?", a: "G\xEAnesis", w: ["\xCAxodo", "Salmos", "Lev\xEDtico"], fact: 'G\xEAnesis significa "origem"; o livro narra a cria\xE7\xE3o do mundo.' },
  { q: "Qual orix\xE1 \xE9 conhecida como a rainha do mar?", a: "Iemanj\xE1", w: ["Oxum", "Ians\xE3", "Nan\xE3"], fact: "Em Salvador, sua festa acontece em 2 de fevereiro, no bairro do Rio Vermelho." },
  { q: "Segundo a B\xEDblia, quem conduziu os hebreus na sa\xEDda do Egito?", a: "Mois\xE9s", w: ["Abra\xE3o", "Davi", "Salom\xE3o"], fact: "A sa\xEDda dos hebreus do Egito \xE9 narrada no livro do \xCAxodo." },
  { q: "Na mitologia n\xF3rdica, qual deus empunha um martelo e controla o trov\xE3o?", a: "Thor", w: ["Odin", "Loki", "Freyr"], fact: 'Seu martelo se chama Mj\xF6lnir; "Thursday", quinta em ingl\xEAs, homenageia Thor.' },
  { q: "Qual her\xF3i da mitologia greco-romana realizou os famosos 12 trabalhos?", a: "H\xE9rcules", w: ["Aquiles", "Perseu", "Teseu"], fact: "Na Gr\xE9cia ele era chamado de H\xE9racles; H\xE9rcules \xE9 o nome romano." },
  { q: "Quem \xE9 a deusa grega da sabedoria?", a: "Atena", w: ["Afrodite", "Hera", "\xC1rtemis"], fact: "Segundo o mito, Atena venceu Poseidon na disputa para ser padroeira de Atenas." },
  { q: "Quem \xE9 a padroeira do Brasil?", a: "Nossa Senhora Aparecida", w: ["Nossa Senhora de F\xE1tima", "Nossa Senhora de Lourdes", "Nossa Senhora de Guadalupe"], fact: "Sua imagem foi encontrada por pescadores no rio Para\xEDba do Sul em 1717." },
  { q: "Qual era o nome de nascimento de Buda, fundador do budismo?", a: "Sidarta Gautama", w: ["Lao-Ts\xE9", "Conf\xFAcio", "Mahavira"], fact: 'Buda significa "o desperto" ou "o iluminado".' },
  { q: "Em dire\xE7\xE3o a qual cidade os mu\xE7ulmanos se voltam para rezar?", a: "Meca", w: ["Medina", "Jerusal\xE9m", "Istambul"], fact: "A dire\xE7\xE3o da ora\xE7\xE3o, rumo \xE0 Caaba, \xE9 chamada de qibla." },
  { q: "Em que m\xEAs sagrado os mu\xE7ulmanos jejuam do amanhecer ao p\xF4r do sol?", a: "Ramad\xE3", w: ["Muharram", "Rajab", "Shawwal"], fact: "O Ramad\xE3 \xE9 o nono m\xEAs do calend\xE1rio isl\xE2mico." },
  { q: "Qual \xE9 o famoso festival hindu das luzes?", a: "Diwali", w: ["Holi", "Navratri", "Pongal"], fact: "O Diwali celebra a vit\xF3ria da luz sobre as trevas, com lamparinas e fogos." },
  { q: "Quantas noites dura a festa judaica de Hanuc\xE1?", a: "Oito", w: ["Sete", "Dez", "Doze"], fact: "Relembra a rededica\xE7\xE3o do Templo de Jerusal\xE9m; a cada noite, acende-se uma vela a mais no candelabro." },
  { q: "Como se chama o dia de descanso semanal no juda\xEDsmo?", a: "Shabat", w: ["Sucot", "Purim", "Shavuot"], fact: "O Shabat come\xE7a no p\xF4r do sol de sexta-feira e vai at\xE9 o anoitecer de s\xE1bado." },
  { q: "Qual divindade hindu \xE9 representada com cabe\xE7a de elefante?", a: "Ganesha", w: ["Shiva", "Vishnu", "Hanuman"], fact: "Ganesha \xE9 venerado como removedor de obst\xE1culos e patrono dos novos come\xE7os." },
  { q: "Qual capela do Vaticano tem o teto pintado por Michelangelo?", a: "Capela Sistina", w: ["Capela Paulina", "Capela M\xE9dici", "Capela Scrovegni"], fact: "\xC9 na Capela Sistina que os cardeais se re\xFAnem para eleger o papa." },
  { q: "Qual orix\xE1 \xE9 associado \xE0 justi\xE7a, aos raios e ao trov\xE3o?", a: "Xang\xF4", w: ["Ogum", "Ox\xF3ssi", "Oxal\xE1"], fact: "Seu s\xEDmbolo \xE9 o ox\xEA, um machado de duas l\xE2minas." },
  { q: "Quem \xE9 considerado o iniciador da Reforma Protestante, em 1517?", a: "Martinho Lutero", w: ["Jo\xE3o Calvino", "Henrique VIII", "Erasmo de Roterd\xE3"], fact: "Lutero divulgou suas 95 teses na cidade alem\xE3 de Wittenberg." },
  { q: "Qual deus eg\xEDpcio \xE9 representado com cabe\xE7a de chacal?", a: "An\xFAbis", w: ["H\xF3rus", "Os\xEDris", "R\xE1"], fact: "An\xFAbis era associado \xE0 mumifica\xE7\xE3o e \xE0 prote\xE7\xE3o dos mortos." },
  { q: "Na mitologia n\xF3rdica, como se chama o sal\xE3o de Odin para os guerreiros mortos em batalha?", a: "Valhala", w: ["Asgard", "Midgard", "Yggdrasil"], fact: "Segundo os mitos, as valqu\xEDrias escolhiam os guerreiros dignos do sal\xE3o." },
  { q: "No juda\xEDsmo, como se chamam os cinco primeiros livros da B\xEDblia hebraica?", a: "Tor\xE1", w: ["Talmude", "Mishn\xE1", "Cabala"], fact: "Nas sinagogas, a Tor\xE1 \xE9 lida em rolos de pergaminho escritos \xE0 m\xE3o." },
  { q: "Como se chama a peregrina\xE7\xE3o a Meca que todo mu\xE7ulmano deve fazer, se puder?", a: "Hajj", w: ["Zakat", "Salat", "Sawm"], fact: "O Hajj \xE9 um dos cinco pilares do Isl\xE3." },
  { q: "Segundo a tradi\xE7\xE3o, sob que \xE1rvore Buda alcan\xE7ou a ilumina\xE7\xE3o?", a: "Figueira-sagrada", w: ["Cerejeira", "Carvalho", "Palmeira"], fact: "Isso teria ocorrido em Bodh Gaya, na \xCDndia, hoje um grande local de peregrina\xE7\xE3o." },
  { q: "O Templo Dourado de Amritsar, na \xCDndia, \xE9 o local mais sagrado de qual religi\xE3o?", a: "Sikhismo", w: ["Hindu\xEDsmo", "Budismo", "Jainismo"], fact: "Sua cozinha comunit\xE1ria serve refei\xE7\xF5es gratuitas a milhares de pessoas por dia." },
  { q: "Qual religi\xE3o tradicional japonesa tem santu\xE1rios marcados por portais torii?", a: "Xinto\xEDsmo", w: ["Tao\xEDsmo", "Confucionismo", "Jainismo"], fact: "O xinto\xEDsmo cultua os kami, esp\xEDritos ligados \xE0 natureza e aos ancestrais." },
  { q: "Qual destes \xE9 um texto sagrado do hindu\xEDsmo?", a: "Bhagavad Gita", w: ["Tao Te Ching", "Talmude", "Avesta"], fact: "Faz parte do \xE9pico Mahabharata e traz um di\xE1logo entre Krishna e Arjuna." }
];
var religiao_default = questions16;

// shared/questions/brasil.ts
var questions17 = [
  { q: "Qual \xE9 a capital do Brasil?", a: "Bras\xEDlia", w: ["Rio de Janeiro", "S\xE3o Paulo", "Salvador"], fact: "Foi inaugurada em 21 de abril de 1960, no governo de Juscelino Kubitschek." },
  { q: "Quem proclamou a Independ\xEAncia do Brasil?", a: "Dom Pedro I", w: ["Dom Pedro II", "Dom Jo\xE3o VI", "Tiradentes"], fact: "O grito foi dado em 7 de setembro de 1822, \xE0s margens do riacho Ipiranga." },
  { q: "Qual lema est\xE1 escrito na bandeira do Brasil?", a: "Ordem e Progresso", w: ["Independ\xEAncia ou Morte", "P\xE1tria Amada", "Uni\xE3o e Liberdade"], fact: "O lema foi inspirado no positivismo do fil\xF3sofo franc\xEAs Auguste Comte." },
  { q: "Qual personagem do folclore tem uma perna s\xF3 e usa gorro vermelho?", a: "Saci-Perer\xEA", w: ["Curupira", "Boitat\xE1", "Mula sem cabe\xE7a"], fact: "Segundo a lenda, ele vive aprontando travessuras e some dentro de redemoinhos." },
  { q: "Qual \xE9 o maior estado brasileiro em \xE1rea?", a: "Amazonas", w: ["Par\xE1", "Mato Grosso", "Minas Gerais"], fact: "O Amazonas tem mais de 1,5 milh\xE3o de km\xB2, \xE1rea maior que a de muitos pa\xEDses." },
  { q: "Qual prato leva feij\xE3o-preto cozido com carnes de porco?", a: "Feijoada", w: ["Moqueca", "Vatap\xE1", "Bai\xE3o de dois"], fact: "Costuma ser servida com arroz, couve refogada, farofa e laranja." },
  { q: "Em qual cidade fica o Cristo Redentor?", a: "Rio de Janeiro", w: ["Salvador", "S\xE3o Paulo", "Belo Horizonte"], fact: "Inaugurado em 1931 no Corcovado, \xE9 uma das Novas 7 Maravilhas do Mundo." },
  { q: "Quem assinou a Lei \xC1urea, que aboliu a escravid\xE3o no Brasil?", a: "Princesa Isabel", w: ["Dom Pedro II", "Imperatriz Leopoldina", "Dona Maria I"], fact: "A Lei \xC1urea foi assinada em 13 de maio de 1888." },
  { q: "Qual navegador portugu\xEAs chegou ao Brasil em 1500?", a: "Pedro \xC1lvares Cabral", w: ["Vasco da Gama", "Crist\xF3v\xE3o Colombo", "Am\xE9rico Vesp\xFAcio"], fact: "A frota chegou em 22 de abril de 1500 ao litoral da atual Bahia." },
  { q: "Qual \xE9 o primeiro verso do Hino Nacional Brasileiro?", a: "Ouviram do Ipiranga \xE0s margens pl\xE1cidas", w: ["J\xE1 podeis da P\xE1tria filhos", "Salve, lindo pend\xE3o da esperan\xE7a", "Liberdade! Liberdade!"], fact: "A letra \xE9 de Os\xF3rio Duque Estrada e a m\xFAsica, de Francisco Manuel da Silva." },
  { q: 'Qual rio brasileiro \xE9 carinhosamente chamado de "Velho Chico"?', a: "S\xE3o Francisco", w: ["Paran\xE1", "Tiet\xEA", "Parna\xEDba"], fact: "O rio S\xE3o Francisco nasce na Serra da Canastra, em Minas Gerais." },
  { q: "Qual \xE9 a moeda oficial do Brasil desde 1994?", a: "Real", w: ["Cruzeiro", "Cruzado", "Cruzeiro Real"], fact: "O real substituiu o cruzeiro real e entrou em circula\xE7\xE3o em 1\xBA de julho de 1994." },
  { q: "Em que ano o Brasil conquistou sua primeira Copa do Mundo de futebol?", a: "1958", w: ["1950", "1962", "1970"], fact: "O t\xEDtulo veio na Su\xE9cia, com Pel\xE9 de apenas 17 anos no time." },
  { q: "Qual ser do folclore tem os p\xE9s virados para tr\xE1s para enganar ca\xE7adores?", a: "Curupira", w: ["Saci-Perer\xEA", "Boto-cor-de-rosa", "Iara"], fact: "O Curupira \xE9 conhecido como protetor das matas e dos animais." },
  { q: "Qual \xE9 a capital de Pernambuco?", a: "Recife", w: ["Olinda", "Caruaru", "Petrolina"], fact: 'Cortada por rios e cheia de pontes, Recife \xE9 chamada de "Veneza brasileira".' },
  { q: "Qual \xE9 a capital do Tocantins?", a: "Palmas", w: ["Aragua\xEDna", "Gurupi", "Porto Nacional"], fact: "Fundada em 1989, Palmas \xE9 a capital estadual mais jovem do Brasil." },
  { q: "Qual cidade foi a primeira capital do Brasil?", a: "Salvador", w: ["Rio de Janeiro", "Recife", "S\xE3o Vicente"], fact: "Salvador foi sede do governo da col\xF4nia de 1549 a 1763." },
  { q: "Em qual clube brasileiro Pel\xE9 jogou a maior parte da carreira?", a: "Santos", w: ["Corinthians", "Botafogo", "Flamengo"], fact: "Depois do Santos, Pel\xE9 encerrou a carreira no New York Cosmos, dos EUA." },
  { q: "Tiradentes foi o principal l\xEDder de qual movimento?", a: "Inconfid\xEAncia Mineira", w: ["Revolu\xE7\xE3o Farroupilha", "Cabanagem", "Balaiada"], fact: "Foi executado em 21 de abril de 1792, data que hoje \xE9 feriado nacional." },
  { q: "O acaraj\xE9, frito no azeite de dend\xEA, \xE9 s\xEDmbolo da culin\xE1ria de qual estado?", a: "Bahia", w: ["Pernambuco", "Maranh\xE3o", "Par\xE1"], fact: "O of\xEDcio das baianas de acaraj\xE9 \xE9 patrim\xF4nio cultural imaterial do Brasil." },
  { q: "Qual bebida t\xEDpica do Rio Grande do Sul \xE9 tomada quente na cuia?", a: "Chimarr\xE3o", w: ["Terer\xE9", "Quent\xE3o", "Caldo de cana"], fact: "\xC9 feito com erva-mate e \xE1gua quente e bebido com uma bomba de metal." },
  { q: "Quem foi o primeiro presidente do Brasil?", a: "Deodoro da Fonseca", w: ["Floriano Peixoto", "Get\xFAlio Vargas", "Prudente de Morais"], fact: "Deodoro proclamou a Rep\xFAblica em 15 de novembro de 1889." },
  { q: "Qual \xE9 o estado mais ao sul do Brasil?", a: "Rio Grande do Sul", w: ["Santa Catarina", "Paran\xE1", "Mato Grosso do Sul"], fact: "O ponto extremo sul do pa\xEDs fica no Arroio Chu\xED, na fronteira com o Uruguai." },
  { q: "Qual arquiteto projetou os principais pr\xE9dios de Bras\xEDlia?", a: "Oscar Niemeyer", w: ["L\xFAcio Costa", "Burle Marx", "Lina Bo Bardi"], fact: "L\xFAcio Costa fez o plano urban\xEDstico da cidade, o famoso Plano Piloto." },
  { q: "Qual \xE9 a capital de Roraima?", a: "Boa Vista", w: ["Macap\xE1", "Porto Velho", "Rio Branco"], fact: "Boa Vista \xE9 a \xFAnica capital brasileira inteiramente no hemisf\xE9rio norte." },
  { q: "Qual \xE9 a cidade mais populosa do Brasil?", a: "S\xE3o Paulo", w: ["Rio de Janeiro", "Bras\xEDlia", "Salvador"], fact: "A capital paulista tem mais de 11 milh\xF5es de habitantes." },
  { q: "Qual bioma existe exclusivamente no Brasil?", a: "Caatinga", w: ["Pantanal", "Cerrado", "Mata Atl\xE2ntica"], fact: "A Caatinga ocupa boa parte do Nordeste e tem plantas adaptadas \xE0 seca." },
  { q: "Quais dois pa\xEDses da Am\xE9rica do Sul N\xC3O fazem fronteira com o Brasil?", a: "Chile e Equador", w: ["Peru e Bol\xEDvia", "Uruguai e Paraguai", "Col\xF4mbia e Venezuela"], fact: "O Brasil faz fronteira com todos os outros pa\xEDses sul-americanos." },
  { q: "Com qual avi\xE3o Santos Dumont voou em Paris, em 1906?", a: "14-Bis", w: ["Demoiselle", "Bl\xE9riot XI", "Flyer"], fact: "O voo aconteceu no Campo de Bagatelle, diante de testemunhas e jornalistas." },
  { q: "Os bois Garantido e Caprichoso disputam o festival de qual cidade amazonense?", a: "Parintins", w: ["Manaus", "Tef\xE9", "Itacoatiara"], fact: "O Garantido \xE9 representado pelo vermelho e o Caprichoso, pelo azul." }
];
var brasil_default = questions17;

// shared/questions/carros.ts
var questions18 = [
  { q: "Qual montadora fabrica o Gol?", a: "Volkswagen", w: ["Fiat", "Chevrolet", "Ford"], fact: "O Gol foi o carro mais vendido do Brasil por 27 anos seguidos." },
  { q: "De qual montadora era o cl\xE1ssico Opala?", a: "Chevrolet", w: ["Ford", "Volkswagen", "Dodge"], fact: "O Opala foi o primeiro carro de passeio da Chevrolet no Brasil, lan\xE7ado em 1968." },
  { q: "Qual montadora tem um cavalo preto empinado no logotipo?", a: "Ferrari", w: ["Lamborghini", "Maserati", "Alfa Romeo"], fact: "O cavalo vinha do avi\xE3o de Francesco Baracca, piloto italiano da 1\xAA Guerra." },
  { q: "Quantos t\xEDtulos mundiais de F\xF3rmula 1 Ayrton Senna conquistou?", a: "3", w: ["2", "4", "5"], fact: "Os t\xEDtulos vieram em 1988, 1990 e 1991, todos pela McLaren." },
  { q: "Qual montadora fabrica o Uno?", a: "Fiat", w: ["Ford", "Renault", "Volkswagen"], fact: "O Uno Mille, de 1990, foi o primeiro carro popular com motor 1.0 do Brasil." },
  { q: "De qual pa\xEDs \xE9 a montadora Toyota?", a: "Jap\xE3o", w: ["Coreia do Sul", "China", "Alemanha"], fact: "O Toyota Corolla \xE9 considerado o carro mais vendido da hist\xF3ria." },
  { q: "Qual montadora fabrica o Civic?", a: "Honda", w: ["Toyota", "Nissan", "Hyundai"], fact: "O Civic foi lan\xE7ado em 1972 e \xE9 um dos modelos mais vendidos da Honda." },
  { q: 'Qual \xE9 o nome do carro de corrida protagonista de "Carros", da Pixar?', a: "Rel\xE2mpago McQueen", w: ["Mate", "Doc Hudson", "Francesco Bernoulli"], fact: "O n\xFAmero 95 dele homenageia 1995, ano de lan\xE7amento de Toy Story." },
  { q: "Qual carro o Mr. Bean dirige na famosa s\xE9rie de TV?", a: "Mini", w: ["Fusca", "Fiat 500", "Citro\xEBn 2CV"], fact: "O Mini mais famoso dele \xE9 verde-lim\xE3o com cap\xF4 preto." },
  { q: "Qual marca tem como logotipo uma estrela de tr\xEAs pontas?", a: "Mercedes-Benz", w: ["BMW", "Audi", "Porsche"], fact: "As tr\xEAs pontas simbolizam motores para terra, mar e ar." },
  { q: "Quantas argolas aparecem no logotipo da Audi?", a: "4", w: ["3", "5", "6"], fact: "Representam Audi, DKW, Horch e Wanderer, que se uniram em 1932." },
  { q: 'O que significa "Volkswagen" em portugu\xEAs?', a: "Carro do povo", w: ["Carro veloz", "Carro alem\xE3o", "Carro forte"], fact: "A Volkswagen foi fundada em 1937, na Alemanha." },
  { q: "Na Alemanha, o Fusca era chamado de K\xE4fer. O que significa essa palavra?", a: "Besouro", w: ["Tartaruga", "Joaninha", "Sapo"], fact: "Nos EUA e em v\xE1rios pa\xEDses, ele ficou conhecido como Beetle." },
  { q: "Qual brasileiro foi o primeiro campe\xE3o mundial de F\xF3rmula 1?", a: "Emerson Fittipaldi", w: ["Nelson Piquet", "Ayrton Senna", "Rubens Barrichello"], fact: "Ele foi campe\xE3o em 1972, pela Lotus, e em 1974, pela McLaren." },
  { q: "Al\xE9m de Senna, qual brasileiro \xE9 tricampe\xE3o mundial de F\xF3rmula 1?", a: "Nelson Piquet", w: ["Emerson Fittipaldi", "Rubens Barrichello", "Felipe Massa"], fact: "Piquet foi campe\xE3o em 1981, 1983 e 1987." },
  { q: "Quantos losangos vermelhos formam o logotipo da Mitsubishi?", a: "3", w: ["2", "4", "5"], fact: 'O nome junta "mitsu" (tr\xEAs) e "hishi" (losango) em japon\xEAs.' },
  { q: "Qual montadora popularizou a linha de montagem com o famoso Modelo T?", a: "Ford", w: ["General Motors", "Chrysler", "Cadillac"], fact: "O Modelo T foi lan\xE7ado em 1908 e vendeu mais de 15 milh\xF5es de unidades." },
  { q: "De qual pa\xEDs \xE9 a montadora Volvo?", a: "Su\xE9cia", w: ["Noruega", "Dinamarca", "Finl\xE2ndia"], fact: "A Volvo criou o cinto de seguran\xE7a de tr\xEAs pontos em 1959 e liberou a patente." },
  { q: "Qual piloto igualou, em 2020, o recorde de 7 t\xEDtulos de Michael Schumacher na F1?", a: "Lewis Hamilton", w: ["Sebastian Vettel", "Max Verstappen", "Fernando Alonso"], fact: "Seis desses t\xEDtulos vieram pela equipe Mercedes." },
  { q: "Em qual aut\xF3dromo \xE9 disputado o Grande Pr\xEAmio de F1 em S\xE3o Paulo?", a: "Interlagos", w: ["Jacarepagu\xE1", "Aut\xF3dromo de Goi\xE2nia", "Velo Citt\xE0"], fact: "Seu nome oficial homenageia o piloto Jos\xE9 Carlos Pace." },
  { q: "Qual carro da Volkswagen, lan\xE7ado em 1973, leva o nome da capital do Brasil?", a: "Bras\xEDlia", w: ["Variant", "Santana", "Passat"], fact: 'Ficou eternizado em "Pelados em Santos", dos Mamonas Assassinas.' },
  { q: "De qual montadora era o Corcel, sucesso dos anos 70?", a: "Ford", w: ["Chevrolet", "Volkswagen", "Fiat"], fact: "O Corcel nasceu de um projeto da Renault herdado da Willys." },
  { q: "Qual montadora francesa tem um le\xE3o no logotipo?", a: "Peugeot", w: ["Renault", "Citro\xEBn", "Bugatti"], fact: "Antes dos carros, a Peugeot fabricava ferramentas e moedores de pimenta." },
  { q: "Qual esportivo da Ford tem um cavalo galopando no logotipo?", a: "Mustang", w: ["GT40", "Maverick", "Thunderbird"], fact: "O Ford Mustang foi lan\xE7ado em 1964." },
  { q: "Qual foi o primeiro carro de s\xE9rie movido a \xE1lcool lan\xE7ado no Brasil?", a: "Fiat 147", w: ["Fusca", "Chevette", "Passat"], fact: "A vers\xE3o a \xE1lcool chegou \xE0s lojas em 1979, na \xE9poca do Pro\xE1lcool." },
  { q: 'O "B" da BMW vem de Bayerische. A que regi\xE3o alem\xE3 isso se refere?', a: "Baviera", w: ["Sax\xF4nia", "Pr\xFAssia", "Ren\xE2nia"], fact: "A BMW tem sede em Munique, capital da Baviera." },
  { q: "Qual brasileiro perdeu o t\xEDtulo da F1 de 2008 por apenas um ponto?", a: "Felipe Massa", w: ["Rubens Barrichello", "Nelson Piquet Jr.", "Bruno Senna"], fact: "Massa venceu a \xFAltima corrida, em casa, mas Hamilton chegou em 5\xBA e levou o t\xEDtulo." },
  { q: "Em que ano a Kombi deixou de ser fabricada no Brasil?", a: "2013", w: ["2003", "2008", "2018"], fact: "O Brasil foi o \xFAltimo pa\xEDs do mundo a produzir a Kombi." },
  { q: "Qual montadora brasileira fabricou o compacto BR-800?", a: "Gurgel", w: ["Puma", "Troller", "Miura"], fact: "O nome da marca vem do fundador, o engenheiro Jo\xE3o Augusto Gurgel." },
  { q: 'Qual marca brit\xE2nica de luxo tem no cap\xF4 a estatueta "Spirit of Ecstasy"?', a: "Rolls-Royce", w: ["Bentley", "Jaguar", "Aston Martin"], fact: "Desde 2003, os carros da Rolls-Royce s\xE3o produzidos sob o comando da BMW." }
];
var carros_default = questions18;

// shared/questions/disney.ts
var questions19 = [
  { q: 'Em "O Rei Le\xE3o", qual \xE9 o nome do filho de Mufasa?', a: "Simba", w: ["Kovu", "Rafiki", "Tim\xE3o"], fact: '"Simba" significa "le\xE3o" em sua\xEDli.' },
  { q: "Qual foi o primeiro longa-metragem de anima\xE7\xE3o da Disney?", a: "Branca de Neve e os Sete An\xF5es", w: ["Pin\xF3quio", "Fantasia", "Cinderela"], fact: "Estreou em 1937 e rendeu um Oscar honor\xE1rio: uma estatueta e sete miniaturas." },
  { q: 'Como se chama o boneco de neve falante de "Frozen"?', a: "Olaf", w: ["Sven", "Kristoff", "Hans"], fact: 'A m\xFAsica "Livre Estou" ganhou o Oscar de Melhor Can\xE7\xE3o Original.' },
  { q: "Qual princesa perde um sapatinho de cristal \xE0 meia-noite?", a: "Cinderela", w: ["Aurora", "Branca de Neve", "Bela"], fact: "O castelo da Cinderela \xE9 o s\xEDmbolo do Magic Kingdom, na Fl\xF3rida." },
  { q: 'Em "A Pequena Sereia", qual \xE9 o nome do caranguejo conselheiro do Rei Trit\xE3o?', a: "Sebasti\xE3o", w: ["Linguado", "\xDArsula", "Max"], fact: 'Ele canta "Under the Sea", vencedora do Oscar de Melhor Can\xE7\xE3o.' },
  { q: 'Em "Aladdin", quantos desejos o G\xEAnio da l\xE2mpada concede?', a: "Tr\xEAs", w: ["Dois", "Cinco", "Sete"], fact: "Na vers\xE3o original de 1992, o G\xEAnio tem a voz de Robin Williams." },
  { q: 'Em "A Bela e a Fera", que objeto \xE9 o Lumi\xE8re?', a: "Um candelabro", w: ["Um rel\xF3gio", "Um bule", "Uma x\xEDcara"], fact: "Foi a primeira anima\xE7\xE3o indicada ao Oscar de Melhor Filme, em 1992." },
  { q: "Qual hero\xEDna da Disney se disfar\xE7a de soldado para lutar no lugar do pai?", a: "Mulan", w: ["Pocahontas", "Raya", "Tiana"], fact: "Seu companheiro de aventura \xE9 o pequeno drag\xE3o Mushu." },
  { q: "Qual semideus acompanha Moana em sua jornada pelo oceano?", a: "Maui", w: ["H\xE9rcules", "Tamatoa", "Kronk"], fact: 'Na vers\xE3o original, Maui \xE9 dublado por Dwayne "The Rock" Johnson.' },
  { q: 'Em "Enrolados", como se chama o camale\xE3o de estima\xE7\xE3o de Rapunzel?', a: "Pascal", w: ["Maximus", "Abu", "Meeko"], fact: "Maximus \xE9 o cavalo da guarda real que vira aliado de Flynn." },
  { q: "Qual curta de 1928 marcou a estreia oficial do Mickey Mouse?", a: "Steamboat Willie", w: ["The Skeleton Dance", "Flowers and Trees", "Os Tr\xEAs Porquinhos"], fact: "Em 2024, essa vers\xE3o do Mickey entrou em dom\xEDnio p\xFAblico nos EUA." },
  { q: "Em qual estado americano fica a Disneyland original, inaugurada em 1955?", a: "Calif\xF3rnia", w: ["Fl\xF3rida", "Texas", "Nevada"], fact: "O Walt Disney World, na Fl\xF3rida, s\xF3 abriu em 1971, ap\xF3s a morte de Walt." },
  { q: "Em qual pa\xEDs foi aberto o primeiro parque da Disney fora dos EUA?", a: "Jap\xE3o", w: ["Fran\xE7a", "China", "Canad\xE1"], fact: "A Tokyo Disneyland foi inaugurada em 1983." },
  { q: "Qual fadinha acompanha Peter Pan?", a: "Sininho", w: ["Fauna", "Fada Azul", "Fada Madrinha"], fact: "Ela virou um s\xEDmbolo da Disney e ganhou sua pr\xF3pria s\xE9rie de filmes." },
  { q: 'Em "Zootopia", que animal \xE9 a policial Judy Hopps?', a: "Coelha", w: ["Raposa", "Ovelha", "Esquilo"], fact: "Zootopia ganhou o Oscar de Melhor Anima\xE7\xE3o em 2017." },
  { q: 'Qual \xE9 o sobrenome da fam\xEDlia m\xE1gica de "Encanto"?', a: "Madrigal", w: ["Rivera", "Herrera", "Morales"], fact: "A hist\xF3ria se passa nas montanhas da Col\xF4mbia." },
  { q: 'Em "Bambi", como se chama o coelho amigo do protagonista?', a: "Tambor", w: ["Flor", "Pernalonga", "Fa\xEDsca"], fact: "Flor \xE9 o nome do gamb\xE1 t\xEDmido do filme." },
  { q: "Cruella de Vil \xE9 a vil\xE3 de qual anima\xE7\xE3o da Disney?", a: "101 D\xE1lmatas", w: ["A Dama e o Vagabundo", "O C\xE3o e a Raposa", "Oliver e Sua Turma"], fact: "Ganhou um filme pr\xF3prio em 2021, estrelado por Emma Stone." },
  { q: 'Em "A Bela Adormecida", em que Mal\xE9vola se transforma na batalha final?', a: "Drag\xE3o", w: ["Corvo", "Serpente", "Lobo"], fact: "Em 2014, a vil\xE3 ganhou um live-action vivido por Angelina Jolie." },
  { q: 'Quem dirigiu o filme "O Rei Le\xE3o" de 2019?', a: "Jon Favreau", w: ["Guy Ritchie", "Tim Burton", "Bill Condon"], fact: 'Ele tamb\xE9m dirigiu "Mogli \u2013 O Menino Lobo" (2016).' },
  { q: 'Qual atriz viveu Bela no live-action "A Bela e a Fera" (2017)?', a: "Emma Watson", w: ["Lily James", "Emma Stone", "Keira Knightley"], fact: 'Antes, ela ficou famosa como Hermione em "Harry Potter".' },
  { q: 'Quem interpretou Ariel no live-action "A Pequena Sereia" (2023)?', a: "Halle Bailey", w: ["Zendaya", "Chloe Bailey", "Naomi Scott"], fact: "Ela faz dupla musical com a irm\xE3 no grupo Chloe x Halle." },
  { q: 'Em "Lilo & Stitch", qual \xE9 o n\xFAmero de experimento do Stitch?', a: "626", w: ["625", "262", "601"], fact: "A hist\xF3ria se passa na ilha de Kauai, no Hava\xED." },
  { q: 'Em "Mogli \u2013 O Menino Lobo", qual \xE9 o nome do urso amigo de Mogli?', a: "Balu", w: ["Baguera", "Shere Khan", "Kaa"], fact: "A hist\xF3ria \xE9 baseada no livro do escritor Rudyard Kipling." },
  { q: 'Qual personagem \xE9 a "consci\xEAncia" de Pin\xF3quio?', a: "Grilo Falante", w: ["Gepeto", "F\xEDgaro", "Jo\xE3o Honesto"], fact: 'Ele canta "When You Wish Upon a Star", que virou um hino da Disney.' },
  { q: 'Em "Fantasia" (1940), qual papel o Mickey interpreta?', a: "Aprendiz de feiticeiro", w: ["Maestro", "Pirata", "Bombeiro"], fact: "Nesse trecho, ele enfeiti\xE7a vassouras para carregar baldes de \xE1gua." },
  { q: "Qual princesa da Disney tem um tigre de estima\xE7\xE3o chamado Rajah?", a: "Jasmine", w: ["Pocahontas", "Moana", "Aurora"], fact: "Jasmine \xE9 a princesa da cidade fict\xEDcia de Agrabah." },
  { q: 'Como se chama o rob\xF4 enfermeiro infl\xE1vel de "Opera\xE7\xE3o Big Hero"?', a: "Baymax", w: ["WALL-E", "Ultron", "Bender"], fact: "O filme ganhou o Oscar de Melhor Anima\xE7\xE3o em 2015." },
  { q: "Qual \xE9 o nome da namorada do Mickey Mouse?", a: "Minnie", w: ["Margarida", "Clarabela", "Vov\xF3 Donalda"], fact: "Margarida \xE9 a namorada do Pato Donald." },
  { q: 'Qual papagaio brasileiro da Disney estreou em "Al\xF4, Amigos" (1942)?', a: "Z\xE9 Carioca", w: ["Panchito", "Iago", "Blu"], fact: "Ele foi criado ap\xF3s a visita de Walt Disney ao Brasil em 1941." }
];
var disney_default = questions19;

// shared/questions/pixar.ts
var questions20 = [
  { q: "Qual foi o primeiro longa-metragem da Pixar, lan\xE7ado em 1995?", a: "Toy Story", w: ["Vida de Inseto", "Monstros S.A.", "Procurando Nemo"], fact: "Foi o primeiro longa-metragem feito totalmente por computador." },
  { q: 'Como se chama o caub\xF3i de brinquedo de "Toy Story"?', a: "Woody", w: ["Buzz", "Slinky", "Rex"], fact: "Na vers\xE3o original, Woody tem a voz de Tom Hanks." },
  { q: "Qual \xE9 o bord\xE3o de Buzz Lightyear?", a: "Ao infinito e al\xE9m!", w: ["Rumo \xE0s estrelas!", "Miss\xE3o cumprida!", "Avante, patrulheiros!"], fact: 'Buzz ganhou um filme pr\xF3prio, "Lightyear", em 2022.' },
  { q: 'Qual \xE9 o nome do menino dono dos brinquedos em "Toy Story"?', a: "Andy", w: ["Sid", "Bonnie", "Al"], fact: 'Woody tem o nome "Andy" escrito na sola da bota.' },
  { q: 'Qual urso de pel\xFAcia com cheiro de morango \xE9 o vil\xE3o de "Toy Story 3"?', a: "Lotso", w: ["Zurg", "Ken", "Porquinho"], fact: '"Toy Story 3" foi indicado ao Oscar de Melhor Filme.' },
  { q: 'Em "Procurando Nemo", que tipo de peixe \xE9 a Dory?', a: "Cirurgi\xE3o-patela", w: ["Peixe-palha\xE7o", "Peixe-anjo", "Baiacu"], fact: "Nemo e seu pai, Marlin, s\xE3o peixes-palha\xE7o." },
  { q: 'Em "Procurando Nemo", para qual cidade australiana Nemo \xE9 levado?', a: "Sydney", w: ["Melbourne", "Perth", "Brisbane"], fact: "Ele vai parar no aqu\xE1rio do consult\xF3rio de um dentista." },
  { q: 'Em "Up \u2013 Altas Aventuras", o que faz a casa de Carl voar?', a: "Bal\xF5es", w: ["Um foguete", "H\xE9lices", "Um dirig\xEDvel"], fact: "O escoteiro que embarca junto, sem querer, se chama Russell." },
  { q: 'Em "Up \u2013 Altas Aventuras", como se chama o cachorro que fala por uma coleira?', a: "Dug", w: ["Kevin", "Dante", "Bolt"], fact: "Kevin, a ave gigante do filme, na verdade \xE9 uma f\xEAmea." },
  { q: 'Qual \xE9 o nome do rato cozinheiro de "Ratatouille"?', a: "Remy", w: ["Linguini", "Emile", "Gusteau"], fact: "A hist\xF3ria se passa em Paris." },
  { q: 'Qual \xE9 o n\xFAmero do Rel\xE2mpago McQueen em "Carros"?', a: "95", w: ["43", "86", "33"], fact: '\xC9 uma refer\xEAncia a 1995, ano de lan\xE7amento de "Toy Story".' },
  { q: 'Em "Carros", qual \xE9 o nome do guincho enferrujado amigo de McQueen?', a: "Mate", w: ["Doc Hudson", "Luigi", "Sargento"], fact: 'Mate ganhou ainda mais destaque como protagonista de "Carros 2".' },
  { q: 'Qual monstro verde de um olho s\xF3 \xE9 parceiro de Sulley em "Monstros S.A."?', a: "Mike Wazowski", w: ["Randall", "Waternoose", "Fungus"], fact: "A energia de Monstr\xF3polis vem dos gritos das crian\xE7as." },
  { q: 'Em "Os Incr\xEDveis", qual \xE9 o nome do beb\xEA que revela v\xE1rios superpoderes?', a: "Zez\xE9", w: ["Flecha", "Violeta", "Beto"], fact: "No Brasil, a fam\xEDlia de super-her\xF3is tem o sobrenome P\xEAra." },
  { q: 'Qual estilista de "Os Incr\xEDveis" \xE9 totalmente contra capas em uniformes?', a: "Edna Moda", w: ["Helena P\xEAra", "Mirage", "Evelyn"], fact: "Na vers\xE3o original, Edna \xE9 dublada pelo pr\xF3prio diretor, Brad Bird." },
  { q: "Por qual rob\xF4 WALL-E se apaixona?", a: "EVA", w: ["AUTO", "M-O", "Rosie"], fact: '"WALL-E" ganhou o Oscar de Melhor Anima\xE7\xE3o em 2009.' },
  { q: 'Em "Divertida Mente", as emo\xE7\xF5es vivem na cabe\xE7a de qual garota?', a: "Riley", w: ["Mei", "Boo", "Lila"], fact: "Na sequ\xEAncia de 2024, surge a emo\xE7\xE3o Ansiedade." },
  { q: 'Em "Divertida Mente", qual emo\xE7\xE3o \xE9 azul?', a: "Tristeza", w: ["Medo", "Nojinho", "Raiva"], fact: "Nojinho \xE9 verde, Raiva \xE9 vermelha e Medo \xE9 roxo." },
  { q: 'Em qual pa\xEDs se passa "Viva \u2013 A Vida \xE9 uma Festa"?', a: "M\xE9xico", w: ["Espanha", "Col\xF4mbia", "Peru"], fact: "A hist\xF3ria gira em torno do Dia dos Mortos." },
  { q: 'Em "Viva \u2013 A Vida \xE9 uma Festa", qual instrumento Miguel sonha em tocar?', a: "Viol\xE3o", w: ["Trompete", "Piano", "Bateria"], fact: "Seu cachorro, Dante, \xE9 da ra\xE7a xoloitzcuintle." },
  { q: "Como se chama a lumin\xE1ria que pula na vinheta de abertura da Pixar?", a: "Luxo Jr.", w: ["Pixie", "Lumi", "Lampy"], fact: 'Ela pula sobre a letra "I" do logotipo e o amassa.' },
  { q: "Qual ve\xEDculo amarelo aparece escondido em quase todos os filmes da Pixar?", a: "Caminhonete da Pizza Planet", w: ["\xD4nibus escolar", "T\xE1xi nova-iorquino", "Carrinho de sorvete"], fact: 'Ela estreou em "Toy Story", dando carona a Woody e Buzz.' },
  { q: "Qual c\xF3digo, nome de uma sala da escola CalArts, aparece em v\xE1rios filmes da Pixar?", a: "A113", w: ["B42", "A51", "K19"], fact: "Era a sala de anima\xE7\xE3o onde estudaram v\xE1rios artistas da Pixar." },
  { q: "Qual empres\xE1rio comprou da Lucasfilm, em 1986, a divis\xE3o que virou a Pixar?", a: "Steve Jobs", w: ["Bill Gates", "Michael Eisner", "Jeff Bezos"], fact: "A Disney comprou a Pixar em 2006 por cerca de US$ 7,4 bilh\xF5es." },
  { q: 'Quem dirigiu o primeiro "Toy Story"?', a: "John Lasseter", w: ["Pete Docter", "Andrew Stanton", "Brad Bird"], fact: "Ele recebeu um Oscar especial pelo primeiro longa feito em computa\xE7\xE3o." },
  { q: 'Qual \xE9 o nome da formiga protagonista de "Vida de Inseto"?', a: "Flik", w: ["Z", "Hopper", "Atta"], fact: "Foi o segundo longa da Pixar, lan\xE7ado em 1998." },
  { q: 'Em "Valente", em que animal a m\xE3e de Merida \xE9 transformada?', a: "Urso", w: ["Lobo", "Cavalo", "Raposa"], fact: "O filme se passa na Esc\xF3cia e ganhou o Oscar de Melhor Anima\xE7\xE3o." },
  { q: 'Em qual pa\xEDs se passa a anima\xE7\xE3o "Luca"?', a: "It\xE1lia", w: ["Gr\xE9cia", "Espanha", "Portugal"], fact: "Os monstros marinhos ganham forma humana quando ficam secos." },
  { q: 'Em "Soul", o professor Joe Gardner sonha em tocar qual estilo musical?', a: "Jazz", w: ["Rock", "Blues", "Country"], fact: '"Soul" ganhou o Oscar de Melhor Anima\xE7\xE3o em 2021.' },
  { q: 'Em "Elementos" (2023), de que elemento \xE9 feita a protagonista?', a: "Fogo", w: ["\xC1gua", "Terra", "Ar"], fact: "Ela se apaixona por um rapaz feito de \xE1gua." }
];
var pixar_default = questions20;

// shared/questions/dreamworks.ts
var questions21 = [
  { q: "Qual \xE9 a cor do ogro Shrek?", a: "Verde", w: ["Azul", "Marrom", "Cinza"], fact: "O primeiro Shrek estreou nos cinemas em 2001." },
  { q: "Qual animal falante \xE9 o fiel companheiro de Shrek?", a: "Burro", w: ["Cavalo", "Bode", "Lhama"], fact: "No original, quem d\xE1 voz ao Burro \xE9 Eddie Murphy." },
  { q: "Onde Shrek mora no come\xE7o do primeiro filme?", a: "Num p\xE2ntano", w: ["Numa caverna", "Num castelo", "Numa torre"], fact: "Ele tenta expulsar os personagens de contos de fadas que invadem seu lar." },
  { q: "Em que a Princesa Fiona se transforma quando o sol se p\xF5e?", a: "Numa ogra", w: ["Num drag\xE3o", "Num sapo", "Numa bruxa"], fact: "O feiti\xE7o s\xF3 seria quebrado com um beijo de amor verdadeiro." },
  { q: "Em Shrek, quem guarda o castelo onde Fiona est\xE1 presa?", a: "Uma dragoa", w: ["Um gigante", "Um troll", "Uma bruxa"], fact: "A dragoa se apaixona pelo Burro, e os dois t\xEAm filhotes em Shrek 2." },
  { q: "Qual vil\xE3o baixinho governa Duloc no primeiro Shrek?", a: "Lorde Farquaad", w: ["Pr\xEDncipe Encantado", "Rumpelstiltskin", "Capit\xE3o Gancho"], fact: "Ele quer se casar com Fiona s\xF3 para virar rei." },
  { q: "Em Shrek 2, como se chama o reino dos pais de Fiona?", a: "T\xE3o T\xE3o Distante", w: ["Reino Encantado", "Duloc", "Terra do Nunca"], fact: "No original, o reino se chama Far Far Away." },
  { q: "Quem d\xE1 voz ao Gato de Botas na vers\xE3o original?", a: "Antonio Banderas", w: ["Javier Bardem", "Andy Garc\xEDa", "Benicio del Toro"], fact: "O personagem ganhou filmes solo em 2011 e 2022." },
  { q: "Shrek foi o primeiro vencedor de qual categoria do Oscar?", a: "Melhor Filme de Anima\xE7\xE3o", w: ["Melhor Trilha Sonora", "Melhores Efeitos Visuais", "Melhor Can\xE7\xE3o Original"], fact: "Venceu em 2002, superando Monstros S.A. e Jimmy Neutron." },
  { q: "Shrek foi inspirado no livro infantil de qual autor?", a: "William Steig", w: ["Dr. Seuss", "Roald Dahl", "Maurice Sendak"], fact: "O livro original foi publicado em 1990." },
  { q: 'Qual banda canta "All Star", que toca na abertura de Shrek?', a: "Smash Mouth", w: ["Sugar Ray", "Weezer", "Barenaked Ladies"], fact: `A mesma banda canta "I'm a Believer" no final do filme.` },
  { q: "Qual \xE9 o nome da zebra de Madagascar?", a: "Marty", w: ["Melman", "Alex", "Julien"], fact: "A fuga come\xE7a no anivers\xE1rio de 10 anos de Marty." },
  { q: "De qual zool\xF3gico os animais de Madagascar escapam?", a: "Zool\xF3gico do Central Park", w: ["Zool\xF3gico do Bronx", "Zool\xF3gico de San Diego", "Zool\xF3gico de Londres"], fact: "Eles queriam voltar a Nova York, mas foram parar em Madagascar." },
  { q: "Que animal \xE9 o Rei Julien, de Madagascar?", a: "L\xEAmure", w: ["Macaco", "Suricato", "Bicho-pregui\xE7a"], fact: 'Sua m\xFAsica-tema \xE9 "I Like to Move It".' },
  { q: "Como se chama o l\xEDder dos pinguins de Madagascar?", a: "Capit\xE3o", w: ["Kowalski", "Recruta", "Rico"], fact: "Os pinguins ganharam s\xE9rie pr\xF3pria em 2008 e filme em 2014." },
  { q: "Qual \xE9 o nome do panda protagonista de Kung Fu Panda?", a: "Po", w: ["Shifu", "Oogway", "Ping"], fact: "No original, Po \xE9 dublado por Jack Black." },
  { q: "Que animal \xE9 o Mestre Shifu, de Kung Fu Panda?", a: "Panda-vermelho", w: ["Guaxinim", "Raposa", "Fur\xE3o"], fact: "No original, ele \xE9 dublado por Dustin Hoffman." },
  { q: "Que t\xEDtulo lend\xE1rio Po recebe em Kung Fu Panda?", a: "Drag\xE3o Guerreiro", w: ["Tigre de Jade", "Mestre Supremo", "Punho Lend\xE1rio"], fact: "O Pergaminho do Drag\xE3o estava em branco: o segredo era acreditar em si." },
  { q: "Quem \xE9 o vil\xE3o do primeiro Kung Fu Panda?", a: "Tai Lung", w: ["Lorde Shen", "Kai", "Fenghuang"], fact: "Ele \xE9 um leopardo-das-neves e ex-aluno de Shifu." },
  { q: "Em Como Treinar o Seu Drag\xE3o, qual \xE9 o nome do drag\xE3o de Solu\xE7o?", a: "Banguela", w: ["Tempestade", "Dentu\xE7o", "Fa\xEDsca"], fact: "No original em ingl\xEAs, ele se chama Toothless." },
  { q: "Banguela pertence a qual esp\xE9cie de drag\xE3o?", a: "F\xFAria da Noite", w: ["Nadder Mortal", "Pesadelo Monstruoso", "Gronckel"], fact: "Ele perde parte da cauda, e Solu\xE7o cria uma pr\xF3tese para ele voar." },
  { q: "Como se chama a ilha viking de Como Treinar o Seu Drag\xE3o?", a: "Berk", w: ["Asgard", "Valhala", "Midgard"], fact: "A saga \xE9 baseada nos livros da autora brit\xE2nica Cressida Cowell." },
  { q: "Qual \xE9 o nome do pai de Solu\xE7o, chefe dos vikings de Berk?", a: "Stoico", w: ["Boc\xE3o", "Melequento", "Perna-de-Peixe"], fact: "No original, ele \xE9 dublado por Gerard Butler." },
  { q: "Qual diretor famoso foi um dos fundadores da DreamWorks?", a: "Steven Spielberg", w: ["George Lucas", "James Cameron", "Martin Scorsese"], fact: "Ele fundou o est\xFAdio em 1994 com Jeffrey Katzenberg e David Geffen." },
  { q: "Qual foi o primeiro longa animado da DreamWorks?", a: "FormiguinhaZ", w: ["O Pr\xEDncipe do Egito", "Shrek", "A Fuga das Galinhas"], fact: "Saiu em 1998, mesmo ano de Vida de Inseto, da Pixar." },
  { q: "O Pr\xEDncipe do Egito (1998) conta a hist\xF3ria de qual personagem b\xEDblico?", a: "Mois\xE9s", w: ["Jos\xE9", "Davi", "No\xE9"], fact: 'A can\xE7\xE3o "When You Believe" ganhou o Oscar de Melhor Can\xE7\xE3o Original.' },
  { q: "Qual est\xFAdio brit\xE2nico fez A Fuga das Galinhas com a DreamWorks?", a: "Aardman", w: ["Laika", "Blue Sky", "Illumination"], fact: "\xC9 o mesmo est\xFAdio de Wallace & Gromit." },
  { q: "Quem \xE9 o protagonista de Spirit: O Corcel Indom\xE1vel?", a: "Um cavalo selvagem", w: ["Um lobo", "Uma \xE1guia", "Um b\xFAfalo"], fact: "Os cavalos do filme n\xE3o falam: Spirit s\xF3 narra seus pensamentos." },
  { q: "Qual \xE9 a cor da Princesa Poppy, de Trolls?", a: "Rosa", w: ["Azul", "Roxo", "Verde"], fact: `"Can't Stop the Feeling!", de Justin Timberlake, foi indicada ao Oscar.` },
  { q: "Os Croods s\xE3o uma fam\xEDlia de qu\xEA?", a: "Homens das cavernas", w: ["Vikings", "Piratas", "Astronautas"], fact: "No original, Nicolas Cage dubla o pai da fam\xEDlia, Grug." }
];
var dreamworks_default = questions21;

// shared/questions/warner.ts
var questions22 = [
  { q: "Quantos irm\xE3os Warner fundaram o est\xFAdio Warner Bros.?", a: "Quatro", w: ["Dois", "Tr\xEAs", "Cinco"], fact: "Harry, Albert, Sam e Jack Warner fundaram o est\xFAdio em 1923." },
  { q: "Qual filme da Warner, de 1927, ficou famoso como o primeiro longa falado?", a: "O Cantor de Jazz", w: ["Casablanca", "E o Vento Levou", "Cantando na Chuva"], fact: "Estrelado por Al Jolson, marcou o in\xEDcio do cinema falado." },
  { q: "Qual cachorro foi um dos primeiros grandes astros da Warner, nos anos 1920?", a: "Rin Tin Tin", w: ["Lassie", "Benji", "Beethoven"], fact: "Seus filmes de sucesso ajudaram a salvar o est\xFAdio da fal\xEAncia." },
  { q: "Em qual cidade da Calif\xF3rnia ficam os est\xFAdios da Warner Bros.?", a: "Burbank", w: ["Santa Monica", "Pasadena", "San Diego"], fact: "A caixa-d'\xE1gua do est\xFAdio virou um dos s\xEDmbolos da Warner." },
  { q: "Qual ator protagoniza o cl\xE1ssico Casablanca (1942)?", a: "Humphrey Bogart", w: ["Cary Grant", "Clark Gable", "James Stewart"], fact: "Casablanca venceu o Oscar de Melhor Filme." },
  { q: "Qual filme de terror da Warner, de 1973, mostra uma menina possu\xEDda?", a: "O Exorcista", w: ["O Iluminado", "A Profecia", "Poltergeist"], fact: "Foi o primeiro filme de terror indicado ao Oscar de Melhor Filme." },
  { q: "Em Gremlins, depois de que hor\xE1rio n\xE3o se deve alimentar o mogwai?", a: "Meia-noite", w: ["Meio-dia", "18h", "22h"], fact: "As outras regras: evitar luz forte e nunca molh\xE1-lo." },
  { q: "Qual \xE9 o bord\xE3o do Pernalonga?", a: "O que \xE9 que h\xE1, velhinho?", w: ["Eu acho que vi um gatinho!", "Yabba Dabba Doo!", "Bip bip!"], fact: "Ele sempre aparece mastigando uma cenoura ao dizer a frase." },
  { q: 'Qual personagem encerra os Looney Tunes dizendo "Isso \xE9 tudo, pessoal!"?', a: "Gaguinho", w: ["Patolino", "Hortelino", "Frajola"], fact: `No original em ingl\xEAs, a frase \xE9 "That's all, folks!".` },
  { q: "Qual ca\xE7ador vive tentando pegar o Pernalonga?", a: "Hortelino Troca-Letras", w: ["Gaguinho", "Patolino", "Frangolino"], fact: "No original, ele se chama Elmer Fudd." },
  { q: "Como se chama o marciano dos Looney Tunes que quer explodir a Terra?", a: "Marvin", w: ["Zorak", "Gazoo", "Kang"], fact: "Ele diz que a Terra atrapalha sua vista de V\xEAnus." },
  { q: "Quem dublava Pernalonga, Patolino e Gaguinho na vers\xE3o original?", a: "Mel Blanc", w: ["Walt Disney", "Chuck Jones", "Tex Avery"], fact: 'Era conhecido como "o homem das mil vozes".' },
  { q: "Em Space Jam (1996), qual astro do basquete joga com os Looney Tunes?", a: "Michael Jordan", w: ["LeBron James", "Shaquille O'Neal", "Magic Johnson"], fact: "Em 2021, LeBron James estrelou a continua\xE7\xE3o." },
  { q: "Em Animaniacs, onde vivem Yakko, Wakko e Dot?", a: "Na caixa-d'\xE1gua da Warner", w: ["No por\xE3o da Warner", "Num trailer", "Num farol"], fact: "Os Animaniacs estrearam na TV em 1993." },
  { q: "Qual \xE9 o nome da coruja de Harry Potter?", a: "Edwiges", w: ["Errol", "P\xEDchi", "Hermes"], fact: "Ela foi presente de Hagrid no anivers\xE1rio de 11 anos de Harry." },
  { q: "Qual \xE9 o nome do gato de Hermione em Harry Potter?", a: "Bichento", w: ["Perebas", "Madame Nor-r-ra", "Trevo"], fact: "Bichento \xE9 meio amasso, uma criatura m\xE1gica parecida com um gato." },
  { q: "Quem interpreta Harry Potter nos cinemas?", a: "Daniel Radcliffe", w: ["Rupert Grint", "Tom Felton", "Elijah Wood"], fact: "Ele tinha 11 anos quando come\xE7ou a filmar o primeiro filme." },
  { q: "Em qual posi\xE7\xE3o Harry joga no time de Quadribol?", a: "Apanhador", w: ["Goleiro", "Artilheiro", "Batedor"], fact: "Ele foi o jogador mais jovem de uma casa em um s\xE9culo." },
  { q: "Qual \xE9 o nome verdadeiro de Lord Voldemort?", a: "Tom Riddle", w: ["Gerardo Grindelwald", "Bart\xF4 Crouch", "Pedro Pettigrew"], fact: '"Tom Servolo Riddle" \xE9 um anagrama de "Eis Lord Voldemort".' },
  { q: "Qual elfo dom\xE9stico ajuda Harry Potter e \xE9 libertado com uma meia?", a: "Dobby", w: ["Monstro", "Winky", "Grampo"], fact: "Harry engana L\xFAcio Malfoy para que ele entregue a meia a Dobby." },
  { q: "Qual ator que viveu Cedrico Diggory em Harry Potter depois virou Batman?", a: "Robert Pattinson", w: ["Ben Affleck", "Christian Bale", "Tom Felton"], fact: "Ele estrelou Batman (2022), dirigido por Matt Reeves." },
  { q: "Qual ator viveu o Coringa em O Cavaleiro das Trevas (2008)?", a: "Heath Ledger", w: ["Joaquin Phoenix", "Jared Leto", "Jack Nicholson"], fact: "Ele ganhou o Oscar p\xF3stumo de Melhor Ator Coadjuvante." },
  { q: "Qual diretor fez a trilogia O Cavaleiro das Trevas?", a: "Christopher Nolan", w: ["Zack Snyder", "Tim Burton", "Matt Reeves"], fact: "A trilogia vai de Batman Begins (2005) a O Cavaleiro das Trevas Ressurge (2012)." },
  { q: "Qual \xE9 a identidade secreta do Batman?", a: "Bruce Wayne", w: ["Clark Kent", "Barry Allen", "Oliver Queen"], fact: "Ele mora na Mans\xE3o Wayne, em Gotham City." },
  { q: "Quem interpretou a Mulher-Maravilha nos filmes de 2017 e 2020?", a: "Gal Gadot", w: ["Margot Robbie", "Amber Heard", "Brie Larson"], fact: "A atriz israelense foi Miss Israel em 2004." },
  { q: "Quem interpreta Morpheus em Matrix?", a: "Laurence Fishburne", w: ["Samuel L. Jackson", "Morgan Freeman", "Denzel Washington"], fact: "\xC9 Morpheus quem oferece a Neo a escolha entre a p\xEDlula vermelha e a azul." },
  { q: "Quem interpreta Neo em Matrix?", a: "Keanu Reeves", w: ["Laurence Fishburne", "Hugo Weaving", "Tom Cruise"], fact: "Matrix estreou em 1999 e ganhou 4 Oscars." },
  { q: "Quem dirigiu Matrix (1999)?", a: "As irm\xE3s Wachowski", w: ["Os irm\xE3os Coen", "Os irm\xE3os Russo", "Christopher Nolan"], fact: 'Na \xE9poca do lan\xE7amento, elas assinavam como "irm\xE3os Wachowski".' },
  { q: 'Matrix popularizou qual efeito de c\xE2mera lenta que "congela" a a\xE7\xE3o?', a: "Bullet time", w: ["Dolly zoom", "Stop motion", "Time-lapse"], fact: "O efeito ficou famoso na cena em que Neo desvia das balas." },
  { q: "Quem dirigiu o filme Barbie (2023), da Warner?", a: "Greta Gerwig", w: ["Sofia Coppola", "Olivia Wilde", "Margot Robbie"], fact: "Foi a maior bilheteria mundial de 2023." }
];
var warner_default = questions22;

// shared/questions/index.ts
var BANK = {
  filmes: filmes_default,
  "animes-classicos": animes_classicos_default,
  "animes-modernos": animes_modernos_default,
  "desenhos-classicos": desenhos_classicos_default,
  "mundo-geek": mundo_geek_default,
  games: games_default,
  consoles: consoles_default,
  musica: musica_default,
  celebridades: celebridades_default,
  "blind-items": blind_items_default,
  natureza: natureza_default,
  animais: animais_default,
  historia: historia_default,
  paises: paises_default,
  culturas: culturas_default,
  religiao: religiao_default,
  brasil: brasil_default,
  carros: carros_default,
  disney: disney_default,
  pixar: pixar_default,
  dreamworks: dreamworks_default,
  warner: warner_default
};

// server/hub.ts
var Hub = class {
  constructor(game2, joinUrl, now = Date.now) {
    this.game = game2;
    this.joinUrl = joinUrl;
    this.now = now;
    this.heartbeat = setInterval(() => {
      for (const c of this.conns) {
        if (!c.alive) {
          c.ws.terminate();
          continue;
        }
        c.alive = false;
        try {
          c.ws.ping();
        } catch {
        }
      }
    }, 1e4);
  }
  conns = /* @__PURE__ */ new Set();
  timer = null;
  heartbeat;
  close() {
    clearInterval(this.heartbeat);
    if (this.timer) clearTimeout(this.timer);
  }
  add(ws) {
    const conn = { ws, role: "unknown", playerId: null, alive: true };
    this.conns.add(conn);
    ws.on("pong", () => conn.alive = true);
    ws.on("message", (data) => {
      conn.alive = true;
      let msg;
      try {
        msg = JSON.parse(String(data));
      } catch {
        return;
      }
      this.handle(conn, msg);
    });
    this.send(conn, { type: "state", state: this.game.view(this.joinUrl(), this.now()) });
    ws.on("close", () => {
      this.conns.delete(conn);
      if (conn.playerId && !this.isConnected(conn.playerId)) {
        this.game.disconnect(conn.playerId, this.now());
        this.changed();
      }
    });
  }
  isConnected(playerId) {
    for (const c of this.conns) if (c.playerId === playerId) return true;
    return false;
  }
  send(conn, msg) {
    if (conn.ws.readyState === conn.ws.OPEN) conn.ws.send(JSON.stringify(msg));
  }
  handle(conn, msg) {
    const g = this.game;
    const now = this.now();
    const me = conn.playerId;
    switch (msg.type) {
      case "hello":
        conn.role = "tv";
        break;
      case "resume": {
        if (g.resume(msg.playerId)) {
          conn.role = "player";
          conn.playerId = msg.playerId;
          this.send(conn, { type: "joined", playerId: msg.playerId });
        } else {
          this.send(conn, { type: "error", code: "unknown", message: "Jogador n\xE3o encontrado" });
          return;
        }
        break;
      }
      case "join": {
        const res = g.join(msg.name, msg.playerId);
        if (!res.ok) {
          this.send(conn, {
            type: "error",
            code: res.code,
            message: res.code === "full" ? "A sala est\xE1 cheia (8 jogadores)!" : "Digite seu nome \u{1F609}"
          });
          return;
        }
        conn.role = "player";
        conn.playerId = res.id;
        this.send(conn, { type: "joined", playerId: res.id });
        break;
      }
      case "vote":
        if (me) g.vote(me, msg.themeId, now);
        break;
      case "answer":
        if (me) g.answer(me, msg.index, now);
        break;
      case "start":
        if (me) g.start(me, now);
        break;
      case "skip":
        if (me) g.skip(me, now);
        break;
      case "playAgain":
        if (me) g.playAgain(me, now);
        break;
      case "endGame":
        if (me) g.endGame(me);
        break;
      case "kick":
        if (me && g.kick(me, msg.playerId, now)) {
          for (const c of this.conns) {
            if (c.playerId === msg.playerId) {
              this.send(c, { type: "kicked" });
              c.playerId = null;
              c.role = "unknown";
            }
          }
        }
        break;
      default:
        return;
    }
    this.changed();
  }
  /** Re-envia o estado e reprograma o timer da fase. */
  changed() {
    this.broadcast();
    this.schedule();
  }
  schedule() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    const deadline = this.game.deadline;
    if (deadline === null) return;
    const wait = Math.max(0, deadline - this.now());
    this.timer = setTimeout(() => {
      this.timer = null;
      this.game.tick(this.now());
      this.changed();
    }, wait + 20);
  }
  broadcast() {
    const state = this.game.view(this.joinUrl(), this.now());
    for (const c of this.conns) {
      if (c.role !== "player" || !c.playerId) this.send(c, { type: "state", state });
      else {
        this.send(c, {
          type: "state",
          state,
          meId: c.playerId,
          myChoice: this.game.choiceOf(c.playerId)
        });
      }
    }
  }
};

// server/index.ts
var PORT = Number(process.env.PORT) || 3e3;
var FAST = process.env.FAST === "1";
var HERE = typeof __dirname !== "undefined" ? __dirname : process.cwd();
var PUBLIC_DIR = [(0, import_node_path.resolve)(HERE, "public"), (0, import_node_path.resolve)(process.cwd(), "release/public")].find(
  (d) => (0, import_node_fs.existsSync)((0, import_node_path.join)(d, "index.html"))
);
var MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};
function lanAddress() {
  const candidates = [];
  try {
    for (const list of Object.values((0, import_node_os.networkInterfaces)())) {
      for (const a of list ?? []) {
        if (a.family === "IPv4" && !a.internal) candidates.push(a.address);
      }
    }
  } catch {
    for (const cmd of ["ifconfig 2>/dev/null", "ip -4 addr 2>/dev/null"]) {
      try {
        const out = (0, import_node_child_process.execSync)(cmd, { encoding: "utf8", timeout: 2e3 });
        for (const m of out.matchAll(/inet (?:addr:)?(\d+\.\d+\.\d+\.\d+)/g)) {
          if (!m[1].startsWith("127.")) candidates.push(m[1]);
        }
        if (candidates.length) break;
      } catch {
      }
    }
  }
  const score = (ip2) => ip2.startsWith("192.168.") ? 3 : ip2.startsWith("10.") ? 2 : /^172\.(1[6-9]|2\d|3[01])\./.test(ip2) ? 1 : 0;
  candidates.sort((a, b) => score(b) - score(a));
  return candidates[0] ?? null;
}
var ip = process.env.PUBLIC_HOST || lanAddress();
var baseUrl = ip ? `http://${ip}:${PORT}` : `http://localhost:${PORT}`;
var game = new Game({
  bank: BANK,
  durations: FAST ? { voting: 2500, chosen: 800, question: 2500, reveal: 1200 } : void 0,
  winScore: Number(process.env.WIN_SCORE) || 15
});
var server = (0, import_node_http.createServer)(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://x");
  if (url.pathname === "/api/info") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ baseUrl }));
    return;
  }
  if (!PUBLIC_DIR) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end('Site n\xE3o encontrado. Rode "npm run build" primeiro.');
    return;
  }
  let file = (0, import_node_path.normalize)((0, import_node_path.join)(PUBLIC_DIR, decodeURIComponent(url.pathname)));
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const s = await (0, import_promises.stat)(file);
    if (s.isDirectory()) file = (0, import_node_path.join)(file, "index.html");
  } catch {
    file = (0, import_node_path.join)(PUBLIC_DIR, "index.html");
  }
  try {
    const body = await (0, import_promises.readFile)(file);
    const ext = (0, import_node_path.extname)(file);
    res.writeHead(200, {
      "content-type": MIME[ext] ?? "application/octet-stream",
      "cache-control": file.includes(`${(0, import_node_path.join)("public", "assets")}`) ? "public, max-age=31536000, immutable" : "no-cache"
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
var wss = new import_websocket_server.default({ server, path: "/ws" });
var hub = new Hub(game, () => `${baseUrl}/play`);
wss.on("connection", (ws) => hub.add(ws));
server.listen(PORT, "0.0.0.0", () => {
  const line = "\u2550".repeat(52);
  console.log(`
\u2554${line}\u2557`);
  console.log(`  \u{1F389}  QUIZ PARTY rodando!`);
  console.log(`  \u{1F4FA}  Abra na TV:   ${baseUrl}`);
  console.log(`  \u{1F4F1}  Celulares:    leiam o QR Code na TV`);
  if (!ip) console.log(`  \u26A0\uFE0F   N\xE3o achei o IP do Wi-Fi. Veja em Configura\xE7\xF5es > Wi-Fi
      e abra http://SEU-IP:${PORT} na TV.`);
  if (FAST) console.log(`  \u26A1  Modo r\xE1pido (FAST=1)`);
  console.log(`\u255A${line}\u255D
`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  lanAddress
});
