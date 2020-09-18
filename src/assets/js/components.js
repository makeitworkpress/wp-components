(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],2:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this,require("buffer").Buffer)
},{"base64-js":1,"buffer":2,"ieee754":3}],3:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],6:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],7:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":6,"_process":4,"inherits":5}],8:[function(require,module,exports){
/**
 * All modules are bundled into one application
 */
'use strict';
var utils = require('./utils');

var App = {
    atoms: {
        map: require('./atoms/map'),
        menu: require('./atoms/menu'),
        modal: require('./atoms/modal'),
        rate: require('./atoms/rate'),
        scroll: require('./atoms/scroll'),
        search: require('./atoms/search'),
        share: require('./atoms/share'),
        tabs: require('./atoms/tabs')
    },     
    molecules: {
        header: require('./molecules/header'),
        posts: require('./molecules/posts'),
        slider: require('./molecules/slider'),
    },  
    initialize: function() {

        // Initialize atoms
        for( var key in this.atoms ) {
            this.atoms[key].initialize();
        }
        
        // Initialize molecules
        for( var key in this.molecules ) {
            this.molecules[key].initialize();
        }
        
        // Execute our scroll-reveal
        utils.scrollReveal();
        
        // Execute parallax backgrounds
        utils.parallax();     
        
    }
}

// Boot our application
jQuery(document).ready( function() {
    App.initialize();
});
},{"./atoms/map":9,"./atoms/menu":10,"./atoms/modal":11,"./atoms/rate":12,"./atoms/scroll":13,"./atoms/search":14,"./atoms/share":15,"./atoms/tabs":16,"./molecules/header":17,"./molecules/posts":18,"./molecules/slider":19,"./utils":20}],9:[function(require,module,exports){
const { minify } = require("uglify-js");

/**
 * Creates a Google Map
 */
module.exports.initialize = function() {

    // Google Should be defined
    if( typeof(google) == 'undefined' ) {
        return;
    }

    jQuery('.atom-map').each( function(index) {
        var mapCanvas = jQuery('.components-maps-canvas', this).get(0),
            mapBounds = new google.maps.LatLngBounds(),
            mapVars = window[mapCanvas.dataset.id],
            mapOptions = {
                center: new google.maps.LatLng(parseFloat(mapVars.center.lat), parseFloat(mapVars.center.lng)),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false,
                zoom: parseInt(mapVars.zoom)
            },   
            map = new google.maps.Map(mapCanvas, mapOptions),
            markers = [],
            markerOptions = {
                draggable: false,
                map: map
            }; 
            
        // Exposes the map to the global scope so other scripts may act on it
        mapVars.map = map;

        if( ! mapVars.markers ) {
            return;
        }
            
        mapVars.markers.forEach( function(item, index) {

            var geocoder     = null;
                markerLatLng = null;
                markers[index] = new google.maps.Marker(markerOptions);

            // Geocodes the address
            if( typeof(item.address) !== 'undefined' && item.address ) {

                geocoder = geocoder !== null ? geocoder : new google.maps.Geocoder();

                geocoder.geocode( { 'address': item.address}, function(results, status) {
                    if (status == 'OK') {
                        markerLatLng = results[0].geometry.location
                    } else {
                        console.log('Geocoding was not successful for the following reason: ' + status);
                    }
                });

            } else if( item.lat && item.lng ) {
                markerLatLng = new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
            }

            // Set the position and extends the bounds
            if( markerLatLng !== null ) {
                markers[index].setPosition( markerLatLng );
                mapBounds.extend(markerLatLng);
            }

        });

        // Fit the bounds
        mapBounds.extend(mapOptions.center);
        map.fitBounds(mapBounds);

    });

};
},{"uglify-js":32}],10:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.atom-menu').each( function(index) {
        
        var menu = this;
    
        jQuery(this).find(".atom-menu-hamburger").click( function(event) {
            event.preventDefault();
            
            jQuery(menu).toggleClass('atom-menu-expanded');
            jQuery(menu).find('.atom-menu-hamburger').toggleClass('active');
            jQuery(menu).find('.menu').toggleClass('active');
            
        }); 
        
        if( jQuery(this).hasClass('atom-menu-collapse') ) {
            jQuery(this).find('.menu-item-has-children > a').append('<i class="fa fa-angle-down"></i>');
            
            var expandable = jQuery(this).find('.fa-angle-down');
            
            jQuery('body').on('click', '.menu-item-has-children a > i', function(event) {
                
                event.preventDefault();
                
                jQuery(this).closest('.menu-item').find('> .sub-menu').slideToggle();
                jQuery(this).toggleClass('fa-angle-down');
                jQuery(this).toggleClass('fa-angle-up');
                
            });
            
        }
        
    });      
        
};
},{}],11:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.atom-modal').each( function(index) {
        
        var modal = this;
    
        jQuery(this).find(".atom-modal-close").click( function(event) {
            event.preventDefault();
            jQuery(modal).fadeOut();
        });  
        
    });      
        
};
},{}],12:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
var utils = require('./../utils');

module.exports.initialize = function() {

    // Check if we are rating
    var isRating = false;
    
    // Rating at blog posts
    jQuery('body').on('mouseenter', '.atom-rate-rate i', function() {
        
        // Items at and left of the mouse
        jQuery(this).addClass('fa-star');
        jQuery(this).prevAll().addClass('fa-star');
        jQuery(this).removeClass('fa-star-o');
        jQuery(this).prevAll().removeClass('fa-star-o'); 
        
        // Items right of the mouse
        jQuery(this).nextAll().removeClass('fa-star');
        jQuery(this).nextAll().addClass('fa-star-o');
        
    });
    
    // Leaving
    jQuery('body').on('mouseleave', '.atom-rate-rate', function() {
        
        // Items at and left of the mouse
        jQuery(this).find('i').addClass('fa-star-o');
        jQuery(this).find('i').removeClass('fa-star');
        
    }); 
    
    // Clicking
    jQuery('body').on('click', '.atom-rate a', function (event) {
        
        event.preventDefault();

        // Prevent action if we're still rating
        if( isRating ) {
            return;
        }
        
        var id = jQuery(this).data('id'),
            max = jQuery(this).data('max'),
            min = jQuery(this).data('min'),
            module = (this).closest('.atom-rate'),
            rating = jQuery(this).find('.atom-rate-rate i.fa-star').length;

        // Append a spinner
        jQuery(module).append('<i class="fa fa-spin fa-circle-o-notch"></i>');

        // We're rating
        isRating = true;
        
        // Perform the ajax action
        utils.ajax({
            data: {
                action: 'publicRate',
                id: id,
                max: max,
                min: min,
                rating: rating
            },
            success: function(response) {
                
                // Logging for debugging purposes
                if( components.debug )
                    console.log(response);
                
                // Replaces the element with the updated rating
                if(response.success === true && response.data.output !== '')
                    jQuery(module).replaceWith(response.data.output);    
                    
            },
            complete: function() {
                setTimeout( function() {
                    // Remove the circle
                    jQuery(module).find('.fa-circle-o-notch').remove();

                    // We finished rating
                    isRating = false;
                    
                }, 500);
            }
        });

    });      
        
};
},{"./../utils":20}],13:[function(require,module,exports){
/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-scroll').each( function(index) {
        
        var away = jQuery(this).parent(),
            buttonPosition = jQuery(this).offset().top,
            awayHeight = jQuery(away).height(),
            scroll = jQuery(away).offset().top + awayHeight,
            self = this;
    
        // Scroll down using the arrow 
        jQuery(this).click( function(event) {
            
            event.preventDefault();
            
            if( jQuery(this).hasClass('atom-scroll-top') ) {
                scroll = jQuery('body').offset().top;    
            }
            
            jQuery('html, body').animate({
                scrollTop: scroll
            }, 555);            
            
        }); 
        
        // Hide the scroller if we're past
        jQuery(window).scroll( function() {
            
            var scrollPosition = jQuery(this).scrollTop();
            
            if( jQuery(self).hasClass('atom-scroll-top') ) {
                if( (scrollPosition + jQuery(window).height() - 80) > jQuery(window).height() ) {
                    jQuery(self).fadeIn();    
                } else {
                    jQuery(self).fadeOut();     
                }                
                
            } else {          
            
                if( scrollPosition > buttonPosition ) {
                    jQuery(self).fadeOut();    
                } else {
                    jQuery(self).fadeIn();     
                }
            }
            
        });
        
    });       
        
};
},{}],14:[function(require,module,exports){
/**
 * Custom scripts for a search element
 * If enabled, the script will loads results through ajax
 * @todo Might make this more OOP and split up functionalities in different methods.
 */
var utils = require('./../utils');

module.exports.initialize = function() {
    
    jQuery('.atom-search').each( function(index) {
        
        var appear = jQuery(this).data('appear'),
            delay = jQuery(this).data('delay'),
            form = jQuery(this).find('.search-form'),
            length = jQuery(this).data('length'),
            loadIcon = '<i class="fa fa-spin fa-circle-o-notch"></i>',
            input = jQuery(this).find('.search-field'),
            more = jQuery(this).find('.atom-search-all'),
            moreLink = jQuery(more).attr('href'),
            none = jQuery(this).data('none'),
            number = jQuery(this).data('number'),
            results = jQuery(this).find('.atom-search-results'),
            self = this,
            timer = false,
            value = '';
        
        if( jQuery(this).hasClass('atom-search-ajax') ) {
        
            // Upon entering results, we'll look if we can search
            jQuery(input).keyup( function(event) {

                // Clear out the timer so we do not fire events immediately after each other once the delay is passed
                clearTimeout(timer);

                var currentEvent = event;

                // If we are surpassing our lengt and have a value, we go search
                if( event.currentTarget.value.length >= length && value != jQuery.trim(event.currentTarget.value) ) {

                    timer = setTimeout( function(event) {

                        value = currentEvent.currentTarget.value;
                        
                        // Substitute our more link
                        jQuery(more).attr('href', moreLink + encodeURI(value) );

                        utils.ajax({
                            data: {
                                action: 'publicSearch', 
                                appear: appear, 
                                none: none,
                                number: number,
                                search: value
                            },
                            beforeSend: function() {
                                jQuery(form).append(loadIcon);    
                                jQuery(results).find('.atom-search-all').remove();    
                                jQuery(results).addClass('components-loading');    
                            },
                            success: function(response) {

                                if( components.debug )
                                    console.log(response); 

                                if( response.data ) {
                                    jQuery(results).fadeIn();
                                    jQuery(results).html(response.data);    
                                    jQuery(results).append(more);    
                                }

                                
                                // Sync scrollReveal with newly added items
                                if( typeof sr !== "undefined" ) {
                                    
                                    // Reinit if we have not initialzied
                                    if( sr.initialized === false )                                 
                                        utils.scrollReveal();
                                    
                                    sr.sync();                   
                                }

                            },
                            complete: function() {
                                jQuery(self).find('.fa-circle-o-notch').remove();
                                jQuery(results).removeClass('components-loading'); 
                            }
                        });

                    }, delay);

                // Else, we hide the thing
                } else {
                    jQuery(results).fadeOut();
                }    

            });
            
        }
        
        // If we have a smaller form, we can expand it
        jQuery(this).find('.atom-search-expand').click( function(event) {
            
            event.preventDefault();
            
            // Toggle display of expand
            jQuery(this).find('.fa').toggleClass('fa-search');
            jQuery(this).find('.fa').toggleClass('fa-times');
            
            jQuery(form).fadeToggle();
            jQuery(form).find('.search-field').focus();
            jQuery(results).fadeOut();
            jQuery(self).toggleClass('atom-search-expanded');
                                                       
        });
    });       
        
};
},{"./../utils":20}],15:[function(require,module,exports){
/**
 * Defines a scroll element
 * The scroll element always scrolls away from it's parent element
 */
module.exports.initialize = function() {
    
    jQuery('.atom-share-fixed').each( function(index) {
        
        var self = this;
        
        if ( jQuery(document).height() > jQuery(window).height()) {
            // Hide the scroller if we're past
            jQuery(window).scroll( function() {

                var scrollPosition = jQuery(this).scrollTop();

                if( scrollPosition > 5 ) {
                    jQuery(self).fadeIn();    
                } else {
                    jQuery(self).fadeOut();     
                }

            });
        } else {
            jQuery(this).fadeIn();
        }
        
        // Show whats-app sharing on mobiles
        if( navigator.userAgent.toLowerCase().match(/(iphone|android|windows phone|iemobile|wpdesktop)/) ) {
            jQuery(this).find('.components-whatsapp').show();
        }        
        
    });       
        
};
},{}],16:[function(require,module,exports){
module.exports.initialize = function() {
    
    jQuery('.atom-tabs').each( function(index) {
        
        var tabButton = jQuery(this).find('.atom-tabs-navigation a'),
            tabContent = jQuery(this).find('.atom-tabs-content section');
    
        jQuery(tabButton).click( function(event) {

            var target = jQuery(this).data("target"),
                activeContent = jQuery(this).closest('.atom-tabs').find('.atom-tabs-content section[data-id="' + target + '"]');
            
            // If the tab has a real link, we use that
            if( tabButton.attr('href') === '#' ) {
                
                event.preventDefault();

                // Remove current active classes
                jQuery(tabButton).removeClass("active");
                jQuery(tabContent).removeClass("active");

                // Add active class to our new things
                jQuery(this).addClass("active");      
                jQuery(activeContent).addClass("active");
                
            }

        });
        
    });
    
};
},{}],17:[function(require,module,exports){
/**
 * Defines the custom header scripts
 */
module.exports.initialize = function() {
    
    jQuery('.molecule-header').each( function(index) {
    
        var current = jQuery(window).scrollTop(),
            height = jQuery(this).height(),
            self = this,
            up = false;
        
        if( jQuery(this).hasClass('molecule-header-fixed') ) {
            
            jQuery(this).next('.main').css({
                'paddingTop' : height
            });    
        }

        // Allows our header to behave as a headroom
        jQuery(window).scroll( function() {
            
            var position = jQuery(this).scrollTop();
            
            // Dynamic header classes
            if( jQuery(self).hasClass('molecule-header-fixed') ) {
                
                if( position > 5 ) {
                    jQuery(self).addClass('molecule-header-scrolled');
                    jQuery(self).removeClass('molecule-header-top');
                } else {
                    jQuery(self).removeClass('molecule-header-scrolled');
                    jQuery(self).addClass('molecule-header-top');
                }
                
                
            }

            // Headroom navigation
            if( jQuery(self).hasClass('molecule-header-headroom') ) {

                if( position > current && ! up ) {
                    jQuery(self).stop().slideToggle();
                    up = ! up;
                } else if( position < current && up ) {
                    jQuery(self).stop().slideToggle();
                    up = ! up;
                }

                current = position;

            }

        });
        
        
        // The behaviour of a cart element is different within headers
        jQuery('.molecule-header .atom-cart-icon').click( function(event) {
            event.preventDefault();
            jQuery(this).next('.atom-cart-content').fadeToggle();
        });
        
    });       
        
};
},{}],18:[function(require,module,exports){
/**
 * Defines the custom posts scripts
 */
var utils = require('./../utils');

module.exports.initialize = function() {
    
    jQuery('.molecule-posts').each( function(index) {
        
        var id = jQuery(this).data('id'),
            isSet = false,
            paginate = jQuery(this).find('.atom-pagination .page-numbers'),
            position = jQuery(this).offset().top,
            pageNumber = 1,
            self = this;
        
        /**
         * Infinite scrolling
         * In the future, we might want to link this to a custom ajax action so that we only load the posts and not the whole page.
         */
        if( jQuery(this).hasClass('molecule-posts-infinite') ) {
            
            // Pagination is hidden by JS instead of css. Clients that don't support JS, do see pagination
            jQuery(this).find('.atom-pagination').hide();
            
            jQuery(window).scroll( function() {
                
                var url = false,
                    postsHeight = jQuery(self).height();

                if( (jQuery(window).scrollTop() + jQuery(window).height()) > (position + postsHeight) ) {
                    
                    if( ! isSet ) {
                        
                        pageNumber++;

                        // Check our pagination and retrieve our urls
                        jQuery(paginate).each( function(index) {

                            if( jQuery(this).text() == pageNumber ) {
                                url = jQuery(this).attr('href');
                                isSet = true;
                            }

                        });
                        
                    }

                    // We've exceeded our urls
                    if( ! url ) {
                        isSet = true;
                        return;
                    }

                    jQuery.get(url, function(data) {
                        var posts = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .molecule-post');

                        jQuery(self).find('.molecule-posts-wrapper').append(posts);
                        
                        // Update our pagenumber and posts height
                        isSet = false;
                        
                        // Sync scrollReveal with newly added items
                        if( typeof sr !== "undefined" ) 
                            sr.sync();

                    });


                }

            });
            
        }
        
        /**
         * Normal Pagination
         * In the future, we might want to link this to a custom ajax action so that we only load the posts and not the whole page.
         */
        if( jQuery(this).hasClass('molecule-posts-ajax') ) {
            
            // These are not supported yet
            jQuery('body').on('click', '.molecule-posts .atom-pagination a', function(event) {
                
                event.preventDefault();

                var self = jQuery(this).closest('.molecule-posts'),
                    target = jQuery(this).attr('href');

                /**
                 * Update our pagination and add the right classes
                 */
                jQuery(self).addClass('components-loading');

                // Load our data
                jQuery.get(target, function(data) {
                    var pagination = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .atom-pagination'),
                        posts = jQuery(data).find('.molecule-posts[data-id="' + id + '"] .molecule-post'),
                        scrollHeight = jQuery('.molecule-header').hasClass('molecule-header-fixed') ? jQuery('.molecule-header').height() : 0;

                    jQuery(self).removeClass('components-loading');
                    jQuery(self).find('.molecule-posts-wrapper').html(posts);
                    jQuery(self).find('.atom-pagination').replaceWith(pagination);
                    
                    jQuery('html, body').animate({
                        scrollTop: jQuery(self).offset().top - (scrollHeight + 100)
                    }, 555);                    
                    
                    // Sync scrollReveal with newly added items
                    if( typeof sr !== "undefined" ) 
                        sr.sync();

                });             

            });
            
        }
        
        // Filtering

        
        
    });      
        
};
},{"./../utils":20}],19:[function(require,module,exports){
/**
 * Defines the scripts slider
 */
module.exports.initialize = function() {

    var wpcSliders = {};
     
    // Set-up the slider
    jQuery('.molecule-slider').each(function (index) {

        // Retrieve our option values
        var id = jQuery(this).data('id'),
            maxHeight = 0,
            options = window['slider' + id],
            slider = jQuery(this).find('.slider'),
            slides = slider.find('.atom-slide'),
            lazy = slides.find('.lazy');
        
        // Save our slider instance
        if (typeof tns !== "undefined") {
            wpcSliders[id] = tns(options);
        }

        /**
         * Fixes a bug with a wrong slider height with lazy loaded images.
         */
        if( lazy.length > 0 && slides.length > 0 ) {
            
            setTimeout( function() {

                maxHeight = Array.prototype.map.call(slides, function(n) {
                    if( n.clientHeight != n.clientWidth ) {
                        return n.clientHeight;
                    }
                }).filter( function(n) {
                    return n != null;
                }).reduce( function(a, b) {
                    return Math.max(a, b);
                });

                slider.closest('.tns-inner').css( {'maxHeight' : maxHeight + 'px' } );

            }, 300);

        }        

    });       
        
};
},{}],20:[function(require,module,exports){
/**
 * Contains utility functions
 */

/* Simplified wrapper for ajax calls */
module.exports.ajax = function(options) {
    
    var options = options;
    
    options.data.nonce = components.nonce;
    options.type = 'POST';
    options.url = components.ajaxUrl;
    
    return jQuery.ajax(options);
    
};

/* Initialize scrollReveal */
module.exports.scrollReveal = function() {

    // Execute our scroll-reveal
    if( typeof ScrollReveal !== "undefined" ) {

        window.sr = ScrollReveal();

        sr.reveal( '.components-bottom-appear', { origin: 'bottom'}, 50 );
        sr.reveal( '.components-left-appear', { origin: 'left'}, 50 );
        sr.reveal( '.components-right-appear', { origin: 'right'}, 50 );
        sr.reveal( '.components-top-appear', { origin: 'top'}, 50 );
    }
    
};

/* Initialize parallax */
module.exports.parallax = function() {
    
    jQuery(window).scroll(function() {

        var scrollPosition  = jQuery(this).scrollTop();

        jQuery('.components-parallax').css({
            'backgroundPosition' : 'calc(50%) ' + 'calc(50% + ' + scrollPosition/5+"px" + ')'
        });

    });
    
};
},{}],21:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;

},{"./util":30}],22:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = require('./base64');

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

},{"./base64":23}],23:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

},{}],24:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};

},{}],25:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;

},{"./util":30}],26:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

},{}],27:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var binarySearch = require('./binary-search');
var ArraySet = require('./array-set').ArraySet;
var base64VLQ = require('./base64-vlq');
var quickSort = require('./quick-sort').quickSort;

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap)
    : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util.join(sourceRoot, source);
      }
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    if (this.sourceRoot != null) {
      needle.source = util.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util.join(this.sourceRoot, source);
          }
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    if (this.sourceRoot != null) {
      aSource = util.relative(this.sourceRoot, aSource);
    }

    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    if (this.sourceRoot != null) {
      source = util.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

},{"./array-set":21,"./base64-vlq":22,"./binary-search":24,"./quick-sort":26,"./util":30}],28:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = require('./base64-vlq');
var util = require('./util');
var ArraySet = require('./array-set').ArraySet;
var MappingList = require('./mapping-list').MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;

},{"./array-set":21,"./base64-vlq":22,"./mapping-list":25,"./util":30}],29:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
var util = require('./util');

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex];
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex];
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;

},{"./source-map-generator":28,"./util":30}],30:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

},{}],31:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./lib/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./lib/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./lib/source-node').SourceNode;

},{"./lib/source-map-consumer":27,"./lib/source-map-generator":28,"./lib/source-node":29}],32:[function(require,module,exports){
(function (Buffer){
var sys = require("util");
var MOZ_SourceMap = require("source-map");
var UglifyJS = exports;
/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

function array_to_hash(a) {
    var ret = Object.create(null);
    for (var i = 0; i < a.length; ++i)
        ret[a[i]] = true;
    return ret;
};

function slice(a, start) {
    return Array.prototype.slice.call(a, start || 0);
};

function characters(str) {
    return str.split("");
};

function member(name, array) {
    return array.indexOf(name) >= 0;
};

function find_if(func, array) {
    for (var i = 0, n = array.length; i < n; ++i) {
        if (func(array[i]))
            return array[i];
    }
};

function repeat_string(str, i) {
    if (i <= 0) return "";
    if (i == 1) return str;
    var d = repeat_string(str, i >> 1);
    d += d;
    if (i & 1) d += str;
    return d;
};

function configure_error_stack(fn) {
    Object.defineProperty(fn.prototype, "stack", {
        get: function() {
            var err = new Error(this.message);
            err.name = this.name;
            try {
                throw err;
            } catch(e) {
                return e.stack;
            }
        }
    });
}

function DefaultsError(msg, defs) {
    this.message = msg;
    this.defs = defs;
};
DefaultsError.prototype = Object.create(Error.prototype);
DefaultsError.prototype.constructor = DefaultsError;
DefaultsError.prototype.name = "DefaultsError";
configure_error_stack(DefaultsError);

DefaultsError.croak = function(msg, defs) {
    throw new DefaultsError(msg, defs);
};

function defaults(args, defs, croak) {
    if (args === true)
        args = {};
    var ret = args || {};
    if (croak) for (var i in ret) if (HOP(ret, i) && !HOP(defs, i))
        DefaultsError.croak("`" + i + "` is not a supported option", defs);
    for (var i in defs) if (HOP(defs, i)) {
        ret[i] = (args && HOP(args, i)) ? args[i] : defs[i];
    }
    return ret;
};

function merge(obj, ext) {
    var count = 0;
    for (var i in ext) if (HOP(ext, i)) {
        obj[i] = ext[i];
        count++;
    }
    return count;
};

function noop() {}
function return_false() { return false; }
function return_true() { return true; }
function return_this() { return this; }
function return_null() { return null; }

var MAP = (function(){
    function MAP(a, f, backwards) {
        var ret = [], top = [], i;
        function doit() {
            var val = f(a[i], i);
            var is_last = val instanceof Last;
            if (is_last) val = val.v;
            if (val instanceof AtTop) {
                val = val.v;
                if (val instanceof Splice) {
                    top.push.apply(top, backwards ? val.v.slice().reverse() : val.v);
                } else {
                    top.push(val);
                }
            }
            else if (val !== skip) {
                if (val instanceof Splice) {
                    ret.push.apply(ret, backwards ? val.v.slice().reverse() : val.v);
                } else {
                    ret.push(val);
                }
            }
            return is_last;
        };
        if (a instanceof Array) {
            if (backwards) {
                for (i = a.length; --i >= 0;) if (doit()) break;
                ret.reverse();
                top.reverse();
            } else {
                for (i = 0; i < a.length; ++i) if (doit()) break;
            }
        }
        else {
            for (i in a) if (HOP(a, i)) if (doit()) break;
        }
        return top.concat(ret);
    };
    MAP.at_top = function(val) { return new AtTop(val) };
    MAP.splice = function(val) { return new Splice(val) };
    MAP.last = function(val) { return new Last(val) };
    var skip = MAP.skip = {};
    function AtTop(val) { this.v = val };
    function Splice(val) { this.v = val };
    function Last(val) { this.v = val };
    return MAP;
})();

function push_uniq(array, el) {
    if (array.indexOf(el) < 0)
        array.push(el);
};

function string_template(text, props) {
    return text.replace(/\{(.+?)\}/g, function(str, p){
        return props && props[p];
    });
};

function remove(array, el) {
    for (var i = array.length; --i >= 0;) {
        if (array[i] === el) array.splice(i, 1);
    }
};

function mergeSort(array, cmp) {
    if (array.length < 2) return array.slice();
    function merge(a, b) {
        var r = [], ai = 0, bi = 0, i = 0;
        while (ai < a.length && bi < b.length) {
            cmp(a[ai], b[bi]) <= 0
                ? r[i++] = a[ai++]
                : r[i++] = b[bi++];
        }
        if (ai < a.length) r.push.apply(r, a.slice(ai));
        if (bi < b.length) r.push.apply(r, b.slice(bi));
        return r;
    };
    function _ms(a) {
        if (a.length <= 1)
            return a;
        var m = Math.floor(a.length / 2), left = a.slice(0, m), right = a.slice(m);
        left = _ms(left);
        right = _ms(right);
        return merge(left, right);
    };
    return _ms(array);
};

function set_difference(a, b) {
    return a.filter(function(el){
        return b.indexOf(el) < 0;
    });
};

function set_intersection(a, b) {
    return a.filter(function(el){
        return b.indexOf(el) >= 0;
    });
};

// this function is taken from Acorn [1], written by Marijn Haverbeke
// [1] https://github.com/marijnh/acorn
function makePredicate(words) {
    if (!(words instanceof Array)) words = words.split(" ");
    var f = "", cats = [];
    out: for (var i = 0; i < words.length; ++i) {
        for (var j = 0; j < cats.length; ++j)
            if (cats[j][0].length == words[i].length) {
                cats[j].push(words[i]);
                continue out;
            }
        cats.push([words[i]]);
    }
    function quote(word) {
        return JSON.stringify(word).replace(/[\u2028\u2029]/g, function(s) {
            switch (s) {
                case "\u2028": return "\\u2028";
                case "\u2029": return "\\u2029";
            }
            return s;
        });
    }
    function compareTo(arr) {
        if (arr.length == 1) return f += "return str === " + quote(arr[0]) + ";";
        f += "switch(str){";
        for (var i = 0; i < arr.length; ++i) f += "case " + quote(arr[i]) + ":";
        f += "return true}return false;";
    }
    // When there are more than three length categories, an outer
    // switch first dispatches on the lengths, to save on comparisons.
    if (cats.length > 3) {
        cats.sort(function(a, b) {return b.length - a.length;});
        f += "switch(str.length){";
        for (var i = 0; i < cats.length; ++i) {
            var cat = cats[i];
            f += "case " + cat[0].length + ":";
            compareTo(cat);
        }
        f += "}";
        // Otherwise, simply generate a flat `switch` statement.
    } else {
        compareTo(words);
    }
    return new Function("str", f);
};

function all(array, predicate) {
    for (var i = array.length; --i >= 0;)
        if (!predicate(array[i]))
            return false;
    return true;
};

function Dictionary() {
    this._values = Object.create(null);
    this._size = 0;
};
Dictionary.prototype = {
    set: function(key, val) {
        if (!this.has(key)) ++this._size;
        this._values["$" + key] = val;
        return this;
    },
    add: function(key, val) {
        if (this.has(key)) {
            this.get(key).push(val);
        } else {
            this.set(key, [ val ]);
        }
        return this;
    },
    get: function(key) { return this._values["$" + key] },
    del: function(key) {
        if (this.has(key)) {
            --this._size;
            delete this._values["$" + key];
        }
        return this;
    },
    has: function(key) { return ("$" + key) in this._values },
    each: function(f) {
        for (var i in this._values)
            f(this._values[i], i.substr(1));
    },
    size: function() {
        return this._size;
    },
    map: function(f) {
        var ret = [];
        for (var i in this._values)
            ret.push(f(this._values[i], i.substr(1)));
        return ret;
    },
    toObject: function() { return this._values }
};
Dictionary.fromObject = function(obj) {
    var dict = new Dictionary();
    dict._size = merge(dict._values, obj);
    return dict;
};

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

// return true if the node at the top of the stack (that means the
// innermost node in the current output) is lexically the first in
// a statement.
function first_in_statement(stack) {
    var node = stack.parent(-1);
    for (var i = 0, p; p = stack.parent(i); i++) {
        if (p instanceof AST_Statement && p.body === node)
            return true;
        if ((p instanceof AST_Seq           && p.car === node        ) ||
            (p instanceof AST_Call          && p.expression === node && !(p instanceof AST_New) ) ||
            (p instanceof AST_Dot           && p.expression === node ) ||
            (p instanceof AST_Sub           && p.expression === node ) ||
            (p instanceof AST_Conditional   && p.condition === node  ) ||
            (p instanceof AST_Binary        && p.left === node       ) ||
            (p instanceof AST_UnaryPostfix  && p.expression === node ))
        {
            node = p;
        } else {
            return false;
        }
    }
}

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

function DEFNODE(type, props, methods, base) {
    if (arguments.length < 4) base = AST_Node;
    if (!props) props = [];
    else props = props.split(/\s+/);
    var self_props = props;
    if (base && base.PROPS)
        props = props.concat(base.PROPS);
    var code = "return function AST_" + type + "(props){ if (props) { ";
    for (var i = props.length; --i >= 0;) {
        code += "this." + props[i] + " = props." + props[i] + ";";
    }
    var proto = base && new base;
    if (proto && proto.initialize || (methods && methods.initialize))
        code += "this.initialize();";
    code += "}}";
    var ctor = new Function(code)();
    if (proto) {
        ctor.prototype = proto;
        ctor.BASE = base;
    }
    if (base) base.SUBCLASSES.push(ctor);
    ctor.prototype.CTOR = ctor;
    ctor.PROPS = props || null;
    ctor.SELF_PROPS = self_props;
    ctor.SUBCLASSES = [];
    if (type) {
        ctor.prototype.TYPE = ctor.TYPE = type;
    }
    if (methods) for (i in methods) if (HOP(methods, i)) {
        if (/^\$/.test(i)) {
            ctor[i.substr(1)] = methods[i];
        } else {
            ctor.prototype[i] = methods[i];
        }
    }
    ctor.DEFMETHOD = function(name, method) {
        this.prototype[name] = method;
    };
    if (typeof exports !== "undefined") {
        exports["AST_" + type] = ctor;
    }
    return ctor;
};

var AST_Token = DEFNODE("Token", "type value line col pos endline endcol endpos nlb comments_before file raw", {
}, null);

var AST_Node = DEFNODE("Node", "start end", {
    _clone: function(deep) {
        if (deep) {
            var self = this.clone();
            return self.transform(new TreeTransformer(function(node) {
                if (node !== self) {
                    return node.clone(true);
                }
            }));
        }
        return new this.CTOR(this);
    },
    clone: function(deep) {
        return this._clone(deep);
    },
    $documentation: "Base class of all AST nodes",
    $propdoc: {
        start: "[AST_Token] The first token of this node",
        end: "[AST_Token] The last token of this node"
    },
    _walk: function(visitor) {
        return visitor._visit(this);
    },
    walk: function(visitor) {
        return this._walk(visitor); // not sure the indirection will be any help
    }
}, null);

AST_Node.warn_function = null;
AST_Node.warn = function(txt, props) {
    if (AST_Node.warn_function)
        AST_Node.warn_function(string_template(txt, props));
};

/* -----[ statements ]----- */

var AST_Statement = DEFNODE("Statement", null, {
    $documentation: "Base class of all statements",
});

var AST_Debugger = DEFNODE("Debugger", null, {
    $documentation: "Represents a debugger statement",
}, AST_Statement);

var AST_Directive = DEFNODE("Directive", "value scope quote", {
    $documentation: "Represents a directive, like \"use strict\";",
    $propdoc: {
        value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
        scope: "[AST_Scope/S] The scope that this directive affects",
        quote: "[string] the original quote character"
    },
}, AST_Statement);

var AST_SimpleStatement = DEFNODE("SimpleStatement", "body", {
    $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
    $propdoc: {
        body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.body._walk(visitor);
        });
    }
}, AST_Statement);

function walk_body(node, visitor) {
    var body = node.body;
    if (body instanceof AST_Statement) {
        body._walk(visitor);
    }
    else for (var i = 0, len = body.length; i < len; i++) {
        body[i]._walk(visitor);
    }
};

var AST_Block = DEFNODE("Block", "body", {
    $documentation: "A body of statements (usually bracketed)",
    $propdoc: {
        body: "[AST_Statement*] an array of statements"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            walk_body(this, visitor);
        });
    }
}, AST_Statement);

var AST_BlockStatement = DEFNODE("BlockStatement", null, {
    $documentation: "A block statement",
}, AST_Block);

var AST_EmptyStatement = DEFNODE("EmptyStatement", null, {
    $documentation: "The empty statement (empty block or simply a semicolon)",
    _walk: function(visitor) {
        return visitor._visit(this);
    }
}, AST_Statement);

var AST_StatementWithBody = DEFNODE("StatementWithBody", "body", {
    $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
    $propdoc: {
        body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.body._walk(visitor);
        });
    }
}, AST_Statement);

var AST_LabeledStatement = DEFNODE("LabeledStatement", "label", {
    $documentation: "Statement with a label",
    $propdoc: {
        label: "[AST_Label] a label definition"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.label._walk(visitor);
            this.body._walk(visitor);
        });
    },
    clone: function(deep) {
        var node = this._clone(deep);
        if (deep) {
            var label = node.label;
            var def = this.label;
            node.walk(new TreeWalker(function(node) {
                if (node instanceof AST_LoopControl
                    && node.label && node.label.thedef === def) {
                    node.label.thedef = label;
                    label.references.push(node);
                }
            }));
        }
        return node;
    }
}, AST_StatementWithBody);

var AST_IterationStatement = DEFNODE("IterationStatement", null, {
    $documentation: "Internal class.  All loops inherit from it."
}, AST_StatementWithBody);

var AST_DWLoop = DEFNODE("DWLoop", "condition", {
    $documentation: "Base class for do/while statements",
    $propdoc: {
        condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"
    }
}, AST_IterationStatement);

var AST_Do = DEFNODE("Do", null, {
    $documentation: "A `do` statement",
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.body._walk(visitor);
            this.condition._walk(visitor);
        });
    }
}, AST_DWLoop);

var AST_While = DEFNODE("While", null, {
    $documentation: "A `while` statement",
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.condition._walk(visitor);
            this.body._walk(visitor);
        });
    }
}, AST_DWLoop);

var AST_For = DEFNODE("For", "init condition step", {
    $documentation: "A `for` statement",
    $propdoc: {
        init: "[AST_Node?] the `for` initialization code, or null if empty",
        condition: "[AST_Node?] the `for` termination clause, or null if empty",
        step: "[AST_Node?] the `for` update clause, or null if empty"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            if (this.init) this.init._walk(visitor);
            if (this.condition) this.condition._walk(visitor);
            if (this.step) this.step._walk(visitor);
            this.body._walk(visitor);
        });
    }
}, AST_IterationStatement);

var AST_ForIn = DEFNODE("ForIn", "init name object", {
    $documentation: "A `for ... in` statement",
    $propdoc: {
        init: "[AST_Node] the `for/in` initialization code",
        name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var",
        object: "[AST_Node] the object that we're looping through"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.init._walk(visitor);
            this.object._walk(visitor);
            this.body._walk(visitor);
        });
    }
}, AST_IterationStatement);

var AST_With = DEFNODE("With", "expression", {
    $documentation: "A `with` statement",
    $propdoc: {
        expression: "[AST_Node] the `with` expression"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.expression._walk(visitor);
            this.body._walk(visitor);
        });
    }
}, AST_StatementWithBody);

/* -----[ scope and functions ]----- */

var AST_Scope = DEFNODE("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", {
    $documentation: "Base class for all statements introducing a lexical scope",
    $propdoc: {
        directives: "[string*/S] an array of directives declared in this scope",
        variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
        functions: "[Object/S] like `variables`, but only lists function declarations",
        uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
        uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
        parent_scope: "[AST_Scope?/S] link to the parent scope",
        enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
        cname: "[integer/S] current index for mangling variables (used internally by the mangler)",
    },
}, AST_Block);

var AST_Toplevel = DEFNODE("Toplevel", "globals", {
    $documentation: "The toplevel scope",
    $propdoc: {
        globals: "[Object/S] a map of name -> SymbolDef for all undeclared names",
    },
    wrap_enclose: function(arg_parameter_pairs) {
        var self = this;
        var args = [];
        var parameters = [];

        arg_parameter_pairs.forEach(function(pair) {
            var splitAt = pair.lastIndexOf(":");

            args.push(pair.substr(0, splitAt));
            parameters.push(pair.substr(splitAt + 1));
        });

        var wrapped_tl = "(function(" + parameters.join(",") + "){ '$ORIG'; })(" + args.join(",") + ")";
        wrapped_tl = parse(wrapped_tl);
        wrapped_tl = wrapped_tl.transform(new TreeTransformer(function before(node){
            if (node instanceof AST_Directive && node.value == "$ORIG") {
                return MAP.splice(self.body);
            }
        }));
        return wrapped_tl;
    },
    wrap_commonjs: function(name, export_all) {
        var self = this;
        var to_export = [];
        if (export_all) {
            self.figure_out_scope();
            self.walk(new TreeWalker(function(node){
                if (node instanceof AST_SymbolDeclaration && node.definition().global) {
                    if (!find_if(function(n){ return n.name == node.name }, to_export))
                        to_export.push(node);
                }
            }));
        }
        var wrapped_tl = "(function(exports, global){ '$ORIG'; '$EXPORTS'; global['" + name + "'] = exports; }({}, (function(){return this}())))";
        wrapped_tl = parse(wrapped_tl);
        wrapped_tl = wrapped_tl.transform(new TreeTransformer(function before(node){
            if (node instanceof AST_Directive) {
                switch (node.value) {
                  case "$ORIG":
                    return MAP.splice(self.body);
                  case "$EXPORTS":
                    var body = [];
                    to_export.forEach(function(sym){
                        body.push(new AST_SimpleStatement({
                            body: new AST_Assign({
                                left: new AST_Sub({
                                    expression: new AST_SymbolRef({ name: "exports" }),
                                    property: new AST_String({ value: sym.name }),
                                }),
                                operator: "=",
                                right: new AST_SymbolRef(sym),
                            }),
                        }));
                    });
                    return MAP.splice(body);
                }
            }
        }));
        return wrapped_tl;
    }
}, AST_Scope);

var AST_Lambda = DEFNODE("Lambda", "name argnames uses_arguments", {
    $documentation: "Base class for functions",
    $propdoc: {
        name: "[AST_SymbolDeclaration?] the name of this function",
        argnames: "[AST_SymbolFunarg*] array of function arguments",
        uses_arguments: "[boolean/S] tells whether this function accesses the arguments array"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            if (this.name) this.name._walk(visitor);
            var argnames = this.argnames;
            for (var i = 0, len = argnames.length; i < len; i++) {
                argnames[i]._walk(visitor);
            }
            walk_body(this, visitor);
        });
    }
}, AST_Scope);

var AST_Accessor = DEFNODE("Accessor", null, {
    $documentation: "A setter/getter function.  The `name` property is always null."
}, AST_Lambda);

var AST_Function = DEFNODE("Function", null, {
    $documentation: "A function expression"
}, AST_Lambda);

var AST_Defun = DEFNODE("Defun", null, {
    $documentation: "A function definition"
}, AST_Lambda);

/* -----[ JUMPS ]----- */

var AST_Jump = DEFNODE("Jump", null, {
    $documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)"
}, AST_Statement);

var AST_Exit = DEFNODE("Exit", "value", {
    $documentation: "Base class for “exits” (`return` and `throw`)",
    $propdoc: {
        value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"
    },
    _walk: function(visitor) {
        return visitor._visit(this, this.value && function(){
            this.value._walk(visitor);
        });
    }
}, AST_Jump);

var AST_Return = DEFNODE("Return", null, {
    $documentation: "A `return` statement"
}, AST_Exit);

var AST_Throw = DEFNODE("Throw", null, {
    $documentation: "A `throw` statement"
}, AST_Exit);

var AST_LoopControl = DEFNODE("LoopControl", "label", {
    $documentation: "Base class for loop control statements (`break` and `continue`)",
    $propdoc: {
        label: "[AST_LabelRef?] the label, or null if none",
    },
    _walk: function(visitor) {
        return visitor._visit(this, this.label && function(){
            this.label._walk(visitor);
        });
    }
}, AST_Jump);

var AST_Break = DEFNODE("Break", null, {
    $documentation: "A `break` statement"
}, AST_LoopControl);

var AST_Continue = DEFNODE("Continue", null, {
    $documentation: "A `continue` statement"
}, AST_LoopControl);

/* -----[ IF ]----- */

var AST_If = DEFNODE("If", "condition alternative", {
    $documentation: "A `if` statement",
    $propdoc: {
        condition: "[AST_Node] the `if` condition",
        alternative: "[AST_Statement?] the `else` part, or null if not present"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.condition._walk(visitor);
            this.body._walk(visitor);
            if (this.alternative) this.alternative._walk(visitor);
        });
    }
}, AST_StatementWithBody);

/* -----[ SWITCH ]----- */

var AST_Switch = DEFNODE("Switch", "expression", {
    $documentation: "A `switch` statement",
    $propdoc: {
        expression: "[AST_Node] the `switch` “discriminant”"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.expression._walk(visitor);
            walk_body(this, visitor);
        });
    }
}, AST_Block);

var AST_SwitchBranch = DEFNODE("SwitchBranch", null, {
    $documentation: "Base class for `switch` branches",
}, AST_Block);

var AST_Default = DEFNODE("Default", null, {
    $documentation: "A `default` switch branch",
}, AST_SwitchBranch);

var AST_Case = DEFNODE("Case", "expression", {
    $documentation: "A `case` switch branch",
    $propdoc: {
        expression: "[AST_Node] the `case` expression"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.expression._walk(visitor);
            walk_body(this, visitor);
        });
    }
}, AST_SwitchBranch);

/* -----[ EXCEPTIONS ]----- */

var AST_Try = DEFNODE("Try", "bcatch bfinally", {
    $documentation: "A `try` statement",
    $propdoc: {
        bcatch: "[AST_Catch?] the catch block, or null if not present",
        bfinally: "[AST_Finally?] the finally block, or null if not present"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            walk_body(this, visitor);
            if (this.bcatch) this.bcatch._walk(visitor);
            if (this.bfinally) this.bfinally._walk(visitor);
        });
    }
}, AST_Block);

var AST_Catch = DEFNODE("Catch", "argname", {
    $documentation: "A `catch` node; only makes sense as part of a `try` statement",
    $propdoc: {
        argname: "[AST_SymbolCatch] symbol for the exception"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.argname._walk(visitor);
            walk_body(this, visitor);
        });
    }
}, AST_Block);

var AST_Finally = DEFNODE("Finally", null, {
    $documentation: "A `finally` node; only makes sense as part of a `try` statement"
}, AST_Block);

/* -----[ VAR/CONST ]----- */

var AST_Definitions = DEFNODE("Definitions", "definitions", {
    $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
    $propdoc: {
        definitions: "[AST_VarDef*] array of variable definitions"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            var definitions = this.definitions;
            for (var i = 0, len = definitions.length; i < len; i++) {
                definitions[i]._walk(visitor);
            }
        });
    }
}, AST_Statement);

var AST_Var = DEFNODE("Var", null, {
    $documentation: "A `var` statement"
}, AST_Definitions);

var AST_Const = DEFNODE("Const", null, {
    $documentation: "A `const` statement"
}, AST_Definitions);

var AST_VarDef = DEFNODE("VarDef", "name value", {
    $documentation: "A variable declaration; only appears in a AST_Definitions node",
    $propdoc: {
        name: "[AST_SymbolVar|AST_SymbolConst] name of the variable",
        value: "[AST_Node?] initializer, or null of there's no initializer"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.name._walk(visitor);
            if (this.value) this.value._walk(visitor);
        });
    }
});

/* -----[ OTHER ]----- */

var AST_Call = DEFNODE("Call", "expression args", {
    $documentation: "A function call expression",
    $propdoc: {
        expression: "[AST_Node] expression to invoke as function",
        args: "[AST_Node*] array of arguments"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.expression._walk(visitor);
            var args = this.args;
            for (var i = 0, len = args.length; i < len; i++) {
                args[i]._walk(visitor);
            }
        });
    }
});

var AST_New = DEFNODE("New", null, {
    $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"
}, AST_Call);

var AST_Seq = DEFNODE("Seq", "car cdr", {
    $documentation: "A sequence expression (two comma-separated expressions)",
    $propdoc: {
        car: "[AST_Node] first element in sequence",
        cdr: "[AST_Node] second element in sequence"
    },
    $cons: function(x, y) {
        var seq = new AST_Seq(x);
        seq.car = x;
        seq.cdr = y;
        return seq;
    },
    $from_array: function(array) {
        if (array.length == 0) return null;
        if (array.length == 1) return array[0].clone();
        var list = null;
        for (var i = array.length; --i >= 0;) {
            list = AST_Seq.cons(array[i], list);
        }
        var p = list;
        while (p) {
            if (p.cdr && !p.cdr.cdr) {
                p.cdr = p.cdr.car;
                break;
            }
            p = p.cdr;
        }
        return list;
    },
    to_array: function() {
        var p = this, a = [];
        while (p) {
            a.push(p.car);
            if (p.cdr && !(p.cdr instanceof AST_Seq)) {
                a.push(p.cdr);
                break;
            }
            p = p.cdr;
        }
        return a;
    },
    add: function(node) {
        var p = this;
        while (p) {
            if (!(p.cdr instanceof AST_Seq)) {
                var cell = AST_Seq.cons(p.cdr, node);
                return p.cdr = cell;
            }
            p = p.cdr;
        }
    },
    len: function() {
        if (this.cdr instanceof AST_Seq) {
            return this.cdr.len() + 1;
        } else {
            return 2;
        }
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.car._walk(visitor);
            if (this.cdr) this.cdr._walk(visitor);
        });
    }
});

var AST_PropAccess = DEFNODE("PropAccess", "expression property", {
    $documentation: "Base class for property access expressions, i.e. `a.foo` or `a[\"foo\"]`",
    $propdoc: {
        expression: "[AST_Node] the “container” expression",
        property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node"
    }
});

var AST_Dot = DEFNODE("Dot", null, {
    $documentation: "A dotted property access expression",
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.expression._walk(visitor);
        });
    }
}, AST_PropAccess);

var AST_Sub = DEFNODE("Sub", null, {
    $documentation: "Index-style property access, i.e. `a[\"foo\"]`",
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.expression._walk(visitor);
            this.property._walk(visitor);
        });
    }
}, AST_PropAccess);

var AST_Unary = DEFNODE("Unary", "operator expression", {
    $documentation: "Base class for unary expressions",
    $propdoc: {
        operator: "[string] the operator",
        expression: "[AST_Node] expression that this unary operator applies to"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.expression._walk(visitor);
        });
    }
});

var AST_UnaryPrefix = DEFNODE("UnaryPrefix", null, {
    $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"
}, AST_Unary);

var AST_UnaryPostfix = DEFNODE("UnaryPostfix", null, {
    $documentation: "Unary postfix expression, i.e. `i++`"
}, AST_Unary);

var AST_Binary = DEFNODE("Binary", "left operator right", {
    $documentation: "Binary expression, i.e. `a + b`",
    $propdoc: {
        left: "[AST_Node] left-hand side expression",
        operator: "[string] the operator",
        right: "[AST_Node] right-hand side expression"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.left._walk(visitor);
            this.right._walk(visitor);
        });
    }
});

var AST_Conditional = DEFNODE("Conditional", "condition consequent alternative", {
    $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
    $propdoc: {
        condition: "[AST_Node]",
        consequent: "[AST_Node]",
        alternative: "[AST_Node]"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.condition._walk(visitor);
            this.consequent._walk(visitor);
            this.alternative._walk(visitor);
        });
    }
});

var AST_Assign = DEFNODE("Assign", null, {
    $documentation: "An assignment expression — `a = b + 5`",
}, AST_Binary);

/* -----[ LITERALS ]----- */

var AST_Array = DEFNODE("Array", "elements", {
    $documentation: "An array literal",
    $propdoc: {
        elements: "[AST_Node*] array of elements"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            var elements = this.elements;
            for (var i = 0, len = elements.length; i < len; i++) {
                elements[i]._walk(visitor);
            }
        });
    }
});

var AST_Object = DEFNODE("Object", "properties", {
    $documentation: "An object literal",
    $propdoc: {
        properties: "[AST_ObjectProperty*] array of properties"
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            var properties = this.properties;
            for (var i = 0, len = properties.length; i < len; i++) {
                properties[i]._walk(visitor);
            }
        });
    }
});

var AST_ObjectProperty = DEFNODE("ObjectProperty", "key value", {
    $documentation: "Base class for literal object properties",
    $propdoc: {
        key: "[string] the property name converted to a string for ObjectKeyVal.  For setters and getters this is an AST_SymbolAccessor.",
        value: "[AST_Node] property value.  For setters and getters this is an AST_Accessor."
    },
    _walk: function(visitor) {
        return visitor._visit(this, function(){
            this.value._walk(visitor);
        });
    }
});

var AST_ObjectKeyVal = DEFNODE("ObjectKeyVal", "quote", {
    $documentation: "A key: value object property",
    $propdoc: {
        quote: "[string] the original quote character"
    }
}, AST_ObjectProperty);

var AST_ObjectSetter = DEFNODE("ObjectSetter", null, {
    $documentation: "An object setter property",
}, AST_ObjectProperty);

var AST_ObjectGetter = DEFNODE("ObjectGetter", null, {
    $documentation: "An object getter property",
}, AST_ObjectProperty);

var AST_Symbol = DEFNODE("Symbol", "scope name thedef", {
    $propdoc: {
        name: "[string] name of this symbol",
        scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
        thedef: "[SymbolDef/S] the definition of this symbol"
    },
    $documentation: "Base class for all symbols",
});

var AST_SymbolAccessor = DEFNODE("SymbolAccessor", null, {
    $documentation: "The name of a property accessor (setter/getter function)"
}, AST_Symbol);

var AST_SymbolDeclaration = DEFNODE("SymbolDeclaration", "init", {
    $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)",
}, AST_Symbol);

var AST_SymbolVar = DEFNODE("SymbolVar", null, {
    $documentation: "Symbol defining a variable",
}, AST_SymbolDeclaration);

var AST_SymbolConst = DEFNODE("SymbolConst", null, {
    $documentation: "A constant declaration"
}, AST_SymbolDeclaration);

var AST_SymbolFunarg = DEFNODE("SymbolFunarg", null, {
    $documentation: "Symbol naming a function argument",
}, AST_SymbolVar);

var AST_SymbolDefun = DEFNODE("SymbolDefun", null, {
    $documentation: "Symbol defining a function",
}, AST_SymbolDeclaration);

var AST_SymbolLambda = DEFNODE("SymbolLambda", null, {
    $documentation: "Symbol naming a function expression",
}, AST_SymbolDeclaration);

var AST_SymbolCatch = DEFNODE("SymbolCatch", null, {
    $documentation: "Symbol naming the exception in catch",
}, AST_SymbolDeclaration);

var AST_Label = DEFNODE("Label", "references", {
    $documentation: "Symbol naming a label (declaration)",
    $propdoc: {
        references: "[AST_LoopControl*] a list of nodes referring to this label"
    },
    initialize: function() {
        this.references = [];
        this.thedef = this;
    }
}, AST_Symbol);

var AST_SymbolRef = DEFNODE("SymbolRef", null, {
    $documentation: "Reference to some symbol (not definition/declaration)",
}, AST_Symbol);

var AST_LabelRef = DEFNODE("LabelRef", null, {
    $documentation: "Reference to a label symbol",
}, AST_Symbol);

var AST_This = DEFNODE("This", null, {
    $documentation: "The `this` symbol",
}, AST_Symbol);

var AST_Constant = DEFNODE("Constant", null, {
    $documentation: "Base class for all constants",
    getValue: function() {
        return this.value;
    }
});

var AST_String = DEFNODE("String", "value quote", {
    $documentation: "A string literal",
    $propdoc: {
        value: "[string] the contents of this string",
        quote: "[string] the original quote character"
    }
}, AST_Constant);

var AST_Number = DEFNODE("Number", "value literal", {
    $documentation: "A number literal",
    $propdoc: {
        value: "[number] the numeric value",
        literal: "[string] numeric value as string (optional)"
    }
}, AST_Constant);

var AST_RegExp = DEFNODE("RegExp", "value", {
    $documentation: "A regexp literal",
    $propdoc: {
        value: "[RegExp] the actual regexp"
    }
}, AST_Constant);

var AST_Atom = DEFNODE("Atom", null, {
    $documentation: "Base class for atoms",
}, AST_Constant);

var AST_Null = DEFNODE("Null", null, {
    $documentation: "The `null` atom",
    value: null
}, AST_Atom);

var AST_NaN = DEFNODE("NaN", null, {
    $documentation: "The impossible value",
    value: 0/0
}, AST_Atom);

var AST_Undefined = DEFNODE("Undefined", null, {
    $documentation: "The `undefined` value",
    value: (function(){}())
}, AST_Atom);

var AST_Hole = DEFNODE("Hole", null, {
    $documentation: "A hole in an array",
    value: (function(){}())
}, AST_Atom);

var AST_Infinity = DEFNODE("Infinity", null, {
    $documentation: "The `Infinity` value",
    value: 1/0
}, AST_Atom);

var AST_Boolean = DEFNODE("Boolean", null, {
    $documentation: "Base class for booleans",
}, AST_Atom);

var AST_False = DEFNODE("False", null, {
    $documentation: "The `false` atom",
    value: false
}, AST_Boolean);

var AST_True = DEFNODE("True", null, {
    $documentation: "The `true` atom",
    value: true
}, AST_Boolean);

/* -----[ TreeWalker ]----- */

function TreeWalker(callback) {
    this.visit = callback;
    this.stack = [];
    this.directives = Object.create(null);
};
TreeWalker.prototype = {
    _visit: function(node, descend) {
        this.push(node);
        var ret = this.visit(node, descend ? function(){
            descend.call(node);
        } : noop);
        if (!ret && descend) {
            descend.call(node);
        }
        this.pop(node);
        return ret;
    },
    parent: function(n) {
        return this.stack[this.stack.length - 2 - (n || 0)];
    },
    push: function (node) {
        if (node instanceof AST_Lambda) {
            this.directives = Object.create(this.directives);
        } else if (node instanceof AST_Directive && !this.directives[node.value]) {
            this.directives[node.value] = node;
        }
        this.stack.push(node);
    },
    pop: function(node) {
        this.stack.pop();
        if (node instanceof AST_Lambda) {
            this.directives = Object.getPrototypeOf(this.directives);
        }
    },
    self: function() {
        return this.stack[this.stack.length - 1];
    },
    find_parent: function(type) {
        var stack = this.stack;
        for (var i = stack.length; --i >= 0;) {
            var x = stack[i];
            if (x instanceof type) return x;
        }
    },
    has_directive: function(type) {
        var dir = this.directives[type];
        if (dir) return dir;
        var node = this.stack[this.stack.length - 1];
        if (node instanceof AST_Scope) {
            for (var i = 0; i < node.body.length; ++i) {
                var st = node.body[i];
                if (!(st instanceof AST_Directive)) break;
                if (st.value == type) return st;
            }
        }
    },
    in_boolean_context: function() {
        var stack = this.stack;
        var i = stack.length, self = stack[--i];
        while (i > 0) {
            var p = stack[--i];
            if ((p instanceof AST_If           && p.condition === self) ||
                (p instanceof AST_Conditional  && p.condition === self) ||
                (p instanceof AST_DWLoop       && p.condition === self) ||
                (p instanceof AST_For          && p.condition === self) ||
                (p instanceof AST_UnaryPrefix  && p.operator == "!" && p.expression === self))
            {
                return true;
            }
            if (!(p instanceof AST_Binary && (p.operator == "&&" || p.operator == "||")))
                return false;
            self = p;
        }
    },
    loopcontrol_target: function(node) {
        var stack = this.stack;
        if (node.label) for (var i = stack.length; --i >= 0;) {
            var x = stack[i];
            if (x instanceof AST_LabeledStatement && x.label.name == node.label.name)
                return x.body;
        } else for (var i = stack.length; --i >= 0;) {
            var x = stack[i];
            if (x instanceof AST_IterationStatement
                || node instanceof AST_Break && x instanceof AST_Switch)
                return x;
        }
    }
};

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>
    Parser based on parse-js (http://marijn.haverbeke.nl/parse-js/).

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

var KEYWORDS = 'break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with';
var KEYWORDS_ATOM = 'false null true';
var RESERVED_WORDS = 'abstract boolean byte char class double enum export extends final float goto implements import int interface let long native package private protected public short static super synchronized this throws transient volatile yield'
    + " " + KEYWORDS_ATOM + " " + KEYWORDS;
var KEYWORDS_BEFORE_EXPRESSION = 'return new delete throw else case';

KEYWORDS = makePredicate(KEYWORDS);
RESERVED_WORDS = makePredicate(RESERVED_WORDS);
KEYWORDS_BEFORE_EXPRESSION = makePredicate(KEYWORDS_BEFORE_EXPRESSION);
KEYWORDS_ATOM = makePredicate(KEYWORDS_ATOM);

var OPERATOR_CHARS = makePredicate(characters("+-*&%=<>!?|~^"));

var RE_HEX_NUMBER = /^0x[0-9a-f]+$/i;
var RE_OCT_NUMBER = /^0[0-7]+$/;

var OPERATORS = makePredicate([
    "in",
    "instanceof",
    "typeof",
    "new",
    "void",
    "delete",
    "++",
    "--",
    "+",
    "-",
    "!",
    "~",
    "&",
    "|",
    "^",
    "*",
    "/",
    "%",
    ">>",
    "<<",
    ">>>",
    "<",
    ">",
    "<=",
    ">=",
    "==",
    "===",
    "!=",
    "!==",
    "?",
    "=",
    "+=",
    "-=",
    "/=",
    "*=",
    "%=",
    ">>=",
    "<<=",
    ">>>=",
    "|=",
    "^=",
    "&=",
    "&&",
    "||"
]);

var WHITESPACE_CHARS = makePredicate(characters(" \u00a0\n\r\t\f\u000b\u200b\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\uFEFF"));

var NEWLINE_CHARS = makePredicate(characters("\n\r\u2028\u2029"));

var PUNC_BEFORE_EXPRESSION = makePredicate(characters("[{(,;:"));

var PUNC_CHARS = makePredicate(characters("[]{}(),;:"));

var REGEXP_MODIFIERS = makePredicate(characters("gmsiy"));

/* -----[ Tokenizer ]----- */

// regexps adapted from http://xregexp.com/plugins/#unicode
var UNICODE = {
    letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0-\\u08B2\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0980\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA69D\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA7AD\\uA7B0\\uA7B1\\uA7F7-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uA9E0-\\uA9E4\\uA9E6-\\uA9EF\\uA9FA-\\uA9FE\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA7E-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB5F\\uAB64\\uAB65\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
    digit: new RegExp("[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0DE6-\\u0DEF\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uA9F0-\\uA9F9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19]"),
    non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
    space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
    connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
};

function is_letter(code) {
    return (code >= 97 && code <= 122)
        || (code >= 65 && code <= 90)
        || (code >= 0xaa && UNICODE.letter.test(String.fromCharCode(code)));
};

function is_digit(code) {
    return code >= 48 && code <= 57;
};

function is_alphanumeric_char(code) {
    return is_digit(code) || is_letter(code);
};

function is_unicode_digit(code) {
    return UNICODE.digit.test(String.fromCharCode(code));
}

function is_unicode_combining_mark(ch) {
    return UNICODE.non_spacing_mark.test(ch) || UNICODE.space_combining_mark.test(ch);
};

function is_unicode_connector_punctuation(ch) {
    return UNICODE.connector_punctuation.test(ch);
};

function is_identifier(name) {
    return !RESERVED_WORDS(name) && /^[a-z_$][a-z0-9_$]*$/i.test(name);
};

function is_identifier_start(code) {
    return code == 36 || code == 95 || is_letter(code);
};

function is_identifier_char(ch) {
    var code = ch.charCodeAt(0);
    return is_identifier_start(code)
        || is_digit(code)
        || code == 8204 // \u200c: zero-width non-joiner <ZWNJ>
        || code == 8205 // \u200d: zero-width joiner <ZWJ> (in my ECMA-262 PDF, this is also 200c)
        || is_unicode_combining_mark(ch)
        || is_unicode_connector_punctuation(ch)
        || is_unicode_digit(code)
    ;
};

function is_identifier_string(str){
    return /^[a-z_$][a-z0-9_$]*$/i.test(str);
};

function parse_js_number(num) {
    if (RE_HEX_NUMBER.test(num)) {
        return parseInt(num.substr(2), 16);
    } else if (RE_OCT_NUMBER.test(num)) {
        return parseInt(num.substr(1), 8);
    } else {
        var val = parseFloat(num);
        if (val == num) return val;
    }
};

function JS_Parse_Error(message, filename, line, col, pos) {
    this.message = message;
    this.filename = filename;
    this.line = line;
    this.col = col;
    this.pos = pos;
};
JS_Parse_Error.prototype = Object.create(Error.prototype);
JS_Parse_Error.prototype.constructor = JS_Parse_Error;
JS_Parse_Error.prototype.name = "SyntaxError";
configure_error_stack(JS_Parse_Error);

function js_error(message, filename, line, col, pos) {
    throw new JS_Parse_Error(message, filename, line, col, pos);
};

function is_token(token, type, val) {
    return token.type == type && (val == null || token.value == val);
};

var EX_EOF = {};

function tokenizer($TEXT, filename, html5_comments, shebang) {

    var S = {
        text            : $TEXT,
        filename        : filename,
        pos             : 0,
        tokpos          : 0,
        line            : 1,
        tokline         : 0,
        col             : 0,
        tokcol          : 0,
        newline_before  : false,
        regex_allowed   : false,
        comments_before : [],
        directives      : {},
        directive_stack : []
    };

    function peek() { return S.text.charAt(S.pos); };

    function next(signal_eof, in_string) {
        var ch = S.text.charAt(S.pos++);
        if (signal_eof && !ch)
            throw EX_EOF;
        if (NEWLINE_CHARS(ch)) {
            S.newline_before = S.newline_before || !in_string;
            ++S.line;
            S.col = 0;
            if (!in_string && ch == "\r" && peek() == "\n") {
                // treat a \r\n sequence as a single \n
                ++S.pos;
                ch = "\n";
            }
        } else {
            ++S.col;
        }
        return ch;
    };

    function forward(i) {
        while (i-- > 0) next();
    };

    function looking_at(str) {
        return S.text.substr(S.pos, str.length) == str;
    };

    function find_eol() {
        var text = S.text;
        for (var i = S.pos, n = S.text.length; i < n; ++i) {
            var ch = text[i];
            if (NEWLINE_CHARS(ch))
                return i;
        }
        return -1;
    };

    function find(what, signal_eof) {
        var pos = S.text.indexOf(what, S.pos);
        if (signal_eof && pos == -1) throw EX_EOF;
        return pos;
    };

    function start_token() {
        S.tokline = S.line;
        S.tokcol = S.col;
        S.tokpos = S.pos;
    };

    var prev_was_dot = false;
    function token(type, value, is_comment) {
        S.regex_allowed = ((type == "operator" && !UNARY_POSTFIX(value)) ||
                           (type == "keyword" && KEYWORDS_BEFORE_EXPRESSION(value)) ||
                           (type == "punc" && PUNC_BEFORE_EXPRESSION(value)));
        if (type == "punc" && value == ".") {
            prev_was_dot = true;
        } else if (!is_comment) {
            prev_was_dot = false;
        }
        var ret = {
            type    : type,
            value   : value,
            line    : S.tokline,
            col     : S.tokcol,
            pos     : S.tokpos,
            endline : S.line,
            endcol  : S.col,
            endpos  : S.pos,
            nlb     : S.newline_before,
            file    : filename
        };
        if (/^(?:num|string|regexp)$/i.test(type)) {
            ret.raw = $TEXT.substring(ret.pos, ret.endpos);
        }
        if (!is_comment) {
            ret.comments_before = S.comments_before;
            S.comments_before = [];
            // make note of any newlines in the comments that came before
            for (var i = 0, len = ret.comments_before.length; i < len; i++) {
                ret.nlb = ret.nlb || ret.comments_before[i].nlb;
            }
        }
        S.newline_before = false;
        return new AST_Token(ret);
    };

    function skip_whitespace() {
        while (WHITESPACE_CHARS(peek()))
            next();
    };

    function read_while(pred) {
        var ret = "", ch, i = 0;
        while ((ch = peek()) && pred(ch, i++))
            ret += next();
        return ret;
    };

    function parse_error(err) {
        js_error(err, filename, S.tokline, S.tokcol, S.tokpos);
    };

    function read_num(prefix) {
        var has_e = false, after_e = false, has_x = false, has_dot = prefix == ".";
        var num = read_while(function(ch, i){
            var code = ch.charCodeAt(0);
            switch (code) {
              case 120: case 88: // xX
                return has_x ? false : (has_x = true);
              case 101: case 69: // eE
                return has_x ? true : has_e ? false : (has_e = after_e = true);
              case 45: // -
                return after_e || (i == 0 && !prefix);
              case 43: // +
                return after_e;
              case (after_e = false, 46): // .
                return (!has_dot && !has_x && !has_e) ? (has_dot = true) : false;
            }
            return is_alphanumeric_char(code);
        });
        if (prefix) num = prefix + num;
        if (RE_OCT_NUMBER.test(num) && next_token.has_directive("use strict")) {
            parse_error("Legacy octal literals are not allowed in strict mode");
        }
        var valid = parse_js_number(num);
        if (!isNaN(valid)) {
            return token("num", valid);
        } else {
            parse_error("Invalid syntax: " + num);
        }
    };

    function read_escaped_char(in_string) {
        var ch = next(true, in_string);
        switch (ch.charCodeAt(0)) {
          case 110 : return "\n";
          case 114 : return "\r";
          case 116 : return "\t";
          case 98  : return "\b";
          case 118 : return "\u000b"; // \v
          case 102 : return "\f";
          case 120 : return String.fromCharCode(hex_bytes(2)); // \x
          case 117 : return String.fromCharCode(hex_bytes(4)); // \u
          case 10  : return ""; // newline
          case 13  :            // \r
            if (peek() == "\n") { // DOS newline
                next(true, in_string);
                return "";
            }
        }
        if (ch >= "0" && ch <= "7")
            return read_octal_escape_sequence(ch);
        return ch;
    };

    function read_octal_escape_sequence(ch) {
        // Read
        var p = peek();
        if (p >= "0" && p <= "7") {
            ch += next(true);
            if (ch[0] <= "3" && (p = peek()) >= "0" && p <= "7")
                ch += next(true);
        }

        // Parse
        if (ch === "0") return "\0";
        if (ch.length > 0 && next_token.has_directive("use strict"))
            parse_error("Legacy octal escape sequences are not allowed in strict mode");
        return String.fromCharCode(parseInt(ch, 8));
    }

    function hex_bytes(n) {
        var num = 0;
        for (; n > 0; --n) {
            var digit = parseInt(next(true), 16);
            if (isNaN(digit))
                parse_error("Invalid hex-character pattern in string");
            num = (num << 4) | digit;
        }
        return num;
    };

    var read_string = with_eof_error("Unterminated string constant", function(quote_char){
        var quote = next(), ret = "";
        for (;;) {
            var ch = next(true, true);
            if (ch == "\\") ch = read_escaped_char(true);
            else if (NEWLINE_CHARS(ch)) parse_error("Unterminated string constant");
            else if (ch == quote) break;
            ret += ch;
        }
        var tok = token("string", ret);
        tok.quote = quote_char;
        return tok;
    });

    function skip_line_comment(type) {
        var regex_allowed = S.regex_allowed;
        var i = find_eol(), ret;
        if (i == -1) {
            ret = S.text.substr(S.pos);
            S.pos = S.text.length;
        } else {
            ret = S.text.substring(S.pos, i);
            S.pos = i;
        }
        S.col = S.tokcol + (S.pos - S.tokpos);
        S.comments_before.push(token(type, ret, true));
        S.regex_allowed = regex_allowed;
        return next_token;
    };

    var skip_multiline_comment = with_eof_error("Unterminated multiline comment", function(){
        var regex_allowed = S.regex_allowed;
        var i = find("*/", true);
        var text = S.text.substring(S.pos, i).replace(/\r\n|\r|\u2028|\u2029/g, '\n');
        // update stream position
        forward(text.length /* doesn't count \r\n as 2 char while S.pos - i does */ + 2);
        S.comments_before.push(token("comment2", text, true));
        S.regex_allowed = regex_allowed;
        return next_token;
    });

    function read_name() {
        var backslash = false, name = "", ch, escaped = false, hex;
        while ((ch = peek()) != null) {
            if (!backslash) {
                if (ch == "\\") escaped = backslash = true, next();
                else if (is_identifier_char(ch)) name += next();
                else break;
            }
            else {
                if (ch != "u") parse_error("Expecting UnicodeEscapeSequence -- uXXXX");
                ch = read_escaped_char();
                if (!is_identifier_char(ch)) parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                name += ch;
                backslash = false;
            }
        }
        if (KEYWORDS(name) && escaped) {
            hex = name.charCodeAt(0).toString(16).toUpperCase();
            name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1);
        }
        return name;
    };

    var read_regexp = with_eof_error("Unterminated regular expression", function(regexp){
        var prev_backslash = false, ch, in_class = false;
        while ((ch = next(true))) if (NEWLINE_CHARS(ch)) {
            parse_error("Unexpected line terminator");
        } else if (prev_backslash) {
            regexp += "\\" + ch;
            prev_backslash = false;
        } else if (ch == "[") {
            in_class = true;
            regexp += ch;
        } else if (ch == "]" && in_class) {
            in_class = false;
            regexp += ch;
        } else if (ch == "/" && !in_class) {
            break;
        } else if (ch == "\\") {
            prev_backslash = true;
        } else {
            regexp += ch;
        }
        var mods = read_name();
        try {
          return token("regexp", new RegExp(regexp, mods));
        } catch(e) {
          parse_error(e.message);
        }
    });

    function read_operator(prefix) {
        function grow(op) {
            if (!peek()) return op;
            var bigger = op + peek();
            if (OPERATORS(bigger)) {
                next();
                return grow(bigger);
            } else {
                return op;
            }
        };
        return token("operator", grow(prefix || next()));
    };

    function handle_slash() {
        next();
        switch (peek()) {
          case "/":
            next();
            return skip_line_comment("comment1");
          case "*":
            next();
            return skip_multiline_comment();
        }
        return S.regex_allowed ? read_regexp("") : read_operator("/");
    };

    function handle_dot() {
        next();
        return is_digit(peek().charCodeAt(0))
            ? read_num(".")
            : token("punc", ".");
    };

    function read_word() {
        var word = read_name();
        if (prev_was_dot) return token("name", word);
        return KEYWORDS_ATOM(word) ? token("atom", word)
            : !KEYWORDS(word) ? token("name", word)
            : OPERATORS(word) ? token("operator", word)
            : token("keyword", word);
    };

    function with_eof_error(eof_error, cont) {
        return function(x) {
            try {
                return cont(x);
            } catch(ex) {
                if (ex === EX_EOF) parse_error(eof_error);
                else throw ex;
            }
        };
    };

    function next_token(force_regexp) {
        if (force_regexp != null)
            return read_regexp(force_regexp);
        if (shebang && S.pos == 0 && looking_at("#!")) {
            start_token();
            forward(2);
            skip_line_comment("comment5");
        }
        for (;;) {
            skip_whitespace();
            start_token();
            if (html5_comments) {
                if (looking_at("<!--")) {
                    forward(4);
                    skip_line_comment("comment3");
                    continue;
                }
                if (looking_at("-->") && S.newline_before) {
                    forward(3);
                    skip_line_comment("comment4");
                    continue;
                }
            }
            var ch = peek();
            if (!ch) return token("eof");
            var code = ch.charCodeAt(0);
            switch (code) {
              case 34: case 39: return read_string(ch);
              case 46: return handle_dot();
              case 47: {
                  var tok = handle_slash();
                  if (tok === next_token) continue;
                  return tok;
              }
            }
            if (is_digit(code)) return read_num();
            if (PUNC_CHARS(ch)) return token("punc", next());
            if (OPERATOR_CHARS(ch)) return read_operator();
            if (code == 92 || is_identifier_start(code)) return read_word();
            break;
        }
        parse_error("Unexpected character '" + ch + "'");
    };

    next_token.context = function(nc) {
        if (nc) S = nc;
        return S;
    };

    next_token.add_directive = function(directive) {
        S.directive_stack[S.directive_stack.length - 1].push(directive);

        if (S.directives[directive] === undefined) {
            S.directives[directive] = 1;
        } else {
            S.directives[directive]++;
        }
    }

    next_token.push_directives_stack = function() {
        S.directive_stack.push([]);
    }

    next_token.pop_directives_stack = function() {
        var directives = S.directive_stack[S.directive_stack.length - 1];

        for (var i = 0; i < directives.length; i++) {
            S.directives[directives[i]]--;
        }

        S.directive_stack.pop();
    }

    next_token.has_directive = function(directive) {
        return S.directives[directive] !== undefined &&
            S.directives[directive] > 0;
    }

    return next_token;

};

/* -----[ Parser (constants) ]----- */

var UNARY_PREFIX = makePredicate([
    "typeof",
    "void",
    "delete",
    "--",
    "++",
    "!",
    "~",
    "-",
    "+"
]);

var UNARY_POSTFIX = makePredicate([ "--", "++" ]);

var ASSIGNMENT = makePredicate([ "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=" ]);

var PRECEDENCE = (function(a, ret){
    for (var i = 0; i < a.length; ++i) {
        var b = a[i];
        for (var j = 0; j < b.length; ++j) {
            ret[b[j]] = i + 1;
        }
    }
    return ret;
})(
    [
        ["||"],
        ["&&"],
        ["|"],
        ["^"],
        ["&"],
        ["==", "===", "!=", "!=="],
        ["<", ">", "<=", ">=", "in", "instanceof"],
        [">>", "<<", ">>>"],
        ["+", "-"],
        ["*", "/", "%"]
    ],
    {}
);

var STATEMENTS_WITH_LABELS = array_to_hash([ "fo" + "r", "do", "while", "switch" ]);

var ATOMIC_START_TOKEN = array_to_hash([ "atom", "num", "string", "regexp", "name" ]);

/* -----[ Parser ]----- */

function parse($TEXT, options) {

    options = defaults(options, {
        bare_returns   : false,
        cli            : false,
        expression     : false,
        filename       : null,
        html5_comments : true,
        shebang        : true,
        strict         : false,
        toplevel       : null,
    });

    var S = {
        input         : (typeof $TEXT == "string"
                         ? tokenizer($TEXT, options.filename,
                                     options.html5_comments, options.shebang)
                         : $TEXT),
        token         : null,
        prev          : null,
        peeked        : null,
        in_function   : 0,
        in_directives : true,
        in_loop       : 0,
        labels        : []
    };

    S.token = next();

    function is(type, value) {
        return is_token(S.token, type, value);
    };

    function peek() { return S.peeked || (S.peeked = S.input()); };

    function next() {
        S.prev = S.token;
        if (S.peeked) {
            S.token = S.peeked;
            S.peeked = null;
        } else {
            S.token = S.input();
        }
        S.in_directives = S.in_directives && (
            S.token.type == "string" || is("punc", ";")
        );
        return S.token;
    };

    function prev() {
        return S.prev;
    };

    function croak(msg, line, col, pos) {
        var ctx = S.input.context();
        js_error(msg,
                 ctx.filename,
                 line != null ? line : ctx.tokline,
                 col != null ? col : ctx.tokcol,
                 pos != null ? pos : ctx.tokpos);
    };

    function token_error(token, msg) {
        croak(msg, token.line, token.col);
    };

    function unexpected(token) {
        if (token == null)
            token = S.token;
        token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
    };

    function expect_token(type, val) {
        if (is(type, val)) {
            return next();
        }
        token_error(S.token, "Unexpected token " + S.token.type + " «" + S.token.value + "»" + ", expected " + type + " «" + val + "»");
    };

    function expect(punc) { return expect_token("punc", punc); };

    function can_insert_semicolon() {
        return !options.strict && (
            S.token.nlb || is("eof") || is("punc", "}")
        );
    };

    function semicolon(optional) {
        if (is("punc", ";")) next();
        else if (!optional && !can_insert_semicolon()) unexpected();
    };

    function parenthesised() {
        expect("(");
        var exp = expression(true);
        expect(")");
        return exp;
    };

    function embed_tokens(parser) {
        return function() {
            var start = S.token;
            var expr = parser();
            var end = prev();
            expr.start = start;
            expr.end = end;
            return expr;
        };
    };

    function handle_regexp() {
        if (is("operator", "/") || is("operator", "/=")) {
            S.peeked = null;
            S.token = S.input(S.token.value.substr(1)); // force regexp
        }
    };

    var statement = embed_tokens(function() {
        handle_regexp();
        switch (S.token.type) {
          case "string":
            if (S.in_directives) {
                var token = peek();
                if (S.token.raw.indexOf("\\") == -1
                    && (token.nlb
                        || is_token(token, "eof")
                        || is_token(token, "punc", ";")
                        || is_token(token, "punc", "}"))) {
                    S.input.add_directive(S.token.value);
                } else {
                    S.in_directives = false;
                }
            }
            var dir = S.in_directives, stat = simple_statement();
            return dir ? new AST_Directive(stat.body) : stat;
          case "num":
          case "regexp":
          case "operator":
          case "atom":
            return simple_statement();

          case "name":
            return is_token(peek(), "punc", ":")
                ? labeled_statement()
                : simple_statement();

          case "punc":
            switch (S.token.value) {
              case "{":
                return new AST_BlockStatement({
                    start : S.token,
                    body  : block_(),
                    end   : prev()
                });
              case "[":
              case "(":
                return simple_statement();
              case ";":
                S.in_directives = false;
                next();
                return new AST_EmptyStatement();
              default:
                unexpected();
            }

          case "keyword":
            switch (S.token.value) {
              case "break":
                next();
                return break_cont(AST_Break);

              case "continue":
                next();
                return break_cont(AST_Continue);

              case "debugger":
                next();
                semicolon();
                return new AST_Debugger();

              case "do":
                next();
                var body = in_loop(statement);
                expect_token("keyword", "while");
                var condition = parenthesised();
                semicolon(true);
                return new AST_Do({
                    body      : body,
                    condition : condition
                });

              case "while":
                next();
                return new AST_While({
                    condition : parenthesised(),
                    body      : in_loop(statement)
                });

              case "fo" + "r":
                next();
                return for_();

              case "function":
                next();
                return function_(AST_Defun);

              case "if":
                next();
                return if_();

              case "return":
                if (S.in_function == 0 && !options.bare_returns)
                    croak("'return' outside of function");
                next();
                var value = null;
                if (is("punc", ";")) {
                    next();
                } else if (!can_insert_semicolon()) {
                    value = expression(true);
                    semicolon();
                }
                return new AST_Return({
                    value: value
                });

              case "switch":
                next();
                return new AST_Switch({
                    expression : parenthesised(),
                    body       : in_loop(switch_body_)
                });

              case "throw":
                next();
                if (S.token.nlb)
                    croak("Illegal newline after 'throw'");
                var value = expression(true);
                semicolon();
                return new AST_Throw({
                    value: value
                });

              case "try":
                next();
                return try_();

              case "var":
                next();
                var node = var_();
                semicolon();
                return node;

              case "const":
                next();
                var node = const_();
                semicolon();
                return node;

              case "with":
                if (S.input.has_directive("use strict")) {
                    croak("Strict mode may not include a with statement");
                }
                next();
                return new AST_With({
                    expression : parenthesised(),
                    body       : statement()
                });
            }
        }
        unexpected();
    });

    function labeled_statement() {
        var label = as_symbol(AST_Label);
        if (find_if(function(l){ return l.name == label.name }, S.labels)) {
            // ECMA-262, 12.12: An ECMAScript program is considered
            // syntactically incorrect if it contains a
            // LabelledStatement that is enclosed by a
            // LabelledStatement with the same Identifier as label.
            croak("Label " + label.name + " defined twice");
        }
        expect(":");
        S.labels.push(label);
        var stat = statement();
        S.labels.pop();
        if (!(stat instanceof AST_IterationStatement)) {
            // check for `continue` that refers to this label.
            // those should be reported as syntax errors.
            // https://github.com/mishoo/UglifyJS2/issues/287
            label.references.forEach(function(ref){
                if (ref instanceof AST_Continue) {
                    ref = ref.label.start;
                    croak("Continue label `" + label.name + "` refers to non-IterationStatement.",
                          ref.line, ref.col, ref.pos);
                }
            });
        }
        return new AST_LabeledStatement({ body: stat, label: label });
    };

    function simple_statement(tmp) {
        return new AST_SimpleStatement({ body: (tmp = expression(true), semicolon(), tmp) });
    };

    function break_cont(type) {
        var label = null, ldef;
        if (!can_insert_semicolon()) {
            label = as_symbol(AST_LabelRef, true);
        }
        if (label != null) {
            ldef = find_if(function(l){ return l.name == label.name }, S.labels);
            if (!ldef)
                croak("Undefined label " + label.name);
            label.thedef = ldef;
        }
        else if (S.in_loop == 0)
            croak(type.TYPE + " not inside a loop or switch");
        semicolon();
        var stat = new type({ label: label });
        if (ldef) ldef.references.push(stat);
        return stat;
    };

    function for_() {
        expect("(");
        var init = null;
        if (!is("punc", ";")) {
            init = is("keyword", "var")
                ? (next(), var_(true))
                : expression(true, true);
            if (is("operator", "in")) {
                if (init instanceof AST_Var && init.definitions.length > 1)
                    croak("Only one variable declaration allowed in for..in loop");
                next();
                return for_in(init);
            }
        }
        return regular_for(init);
    };

    function regular_for(init) {
        expect(";");
        var test = is("punc", ";") ? null : expression(true);
        expect(";");
        var step = is("punc", ")") ? null : expression(true);
        expect(")");
        return new AST_For({
            init      : init,
            condition : test,
            step      : step,
            body      : in_loop(statement)
        });
    };

    function for_in(init) {
        var lhs = init instanceof AST_Var ? init.definitions[0].name : null;
        var obj = expression(true);
        expect(")");
        return new AST_ForIn({
            init   : init,
            name   : lhs,
            object : obj,
            body   : in_loop(statement)
        });
    };

    var function_ = function(ctor) {
        var in_statement = ctor === AST_Defun;
        var name = is("name") ? as_symbol(in_statement ? AST_SymbolDefun : AST_SymbolLambda) : null;
        if (in_statement && !name)
            unexpected();
        expect("(");
        return new ctor({
            name: name,
            argnames: (function(first, a){
                while (!is("punc", ")")) {
                    if (first) first = false; else expect(",");
                    a.push(as_symbol(AST_SymbolFunarg));
                }
                next();
                return a;
            })(true, []),
            body: (function(loop, labels){
                ++S.in_function;
                S.in_directives = true;
                S.input.push_directives_stack();
                S.in_loop = 0;
                S.labels = [];
                var a = block_();
                S.input.pop_directives_stack();
                --S.in_function;
                S.in_loop = loop;
                S.labels = labels;
                return a;
            })(S.in_loop, S.labels)
        });
    };

    function if_() {
        var cond = parenthesised(), body = statement(), belse = null;
        if (is("keyword", "else")) {
            next();
            belse = statement();
        }
        return new AST_If({
            condition   : cond,
            body        : body,
            alternative : belse
        });
    };

    function block_() {
        expect("{");
        var a = [];
        while (!is("punc", "}")) {
            if (is("eof")) unexpected();
            a.push(statement());
        }
        next();
        return a;
    };

    function switch_body_() {
        expect("{");
        var a = [], cur = null, branch = null, tmp;
        while (!is("punc", "}")) {
            if (is("eof")) unexpected();
            if (is("keyword", "case")) {
                if (branch) branch.end = prev();
                cur = [];
                branch = new AST_Case({
                    start      : (tmp = S.token, next(), tmp),
                    expression : expression(true),
                    body       : cur
                });
                a.push(branch);
                expect(":");
            }
            else if (is("keyword", "default")) {
                if (branch) branch.end = prev();
                cur = [];
                branch = new AST_Default({
                    start : (tmp = S.token, next(), expect(":"), tmp),
                    body  : cur
                });
                a.push(branch);
            }
            else {
                if (!cur) unexpected();
                cur.push(statement());
            }
        }
        if (branch) branch.end = prev();
        next();
        return a;
    };

    function try_() {
        var body = block_(), bcatch = null, bfinally = null;
        if (is("keyword", "catch")) {
            var start = S.token;
            next();
            expect("(");
            var name = as_symbol(AST_SymbolCatch);
            expect(")");
            bcatch = new AST_Catch({
                start   : start,
                argname : name,
                body    : block_(),
                end     : prev()
            });
        }
        if (is("keyword", "finally")) {
            var start = S.token;
            next();
            bfinally = new AST_Finally({
                start : start,
                body  : block_(),
                end   : prev()
            });
        }
        if (!bcatch && !bfinally)
            croak("Missing catch/finally blocks");
        return new AST_Try({
            body     : body,
            bcatch   : bcatch,
            bfinally : bfinally
        });
    };

    function vardefs(no_in, in_const) {
        var a = [];
        for (;;) {
            a.push(new AST_VarDef({
                start : S.token,
                name  : as_symbol(in_const ? AST_SymbolConst : AST_SymbolVar),
                value : is("operator", "=") ? (next(), expression(false, no_in)) : null,
                end   : prev()
            }));
            if (!is("punc", ","))
                break;
            next();
        }
        return a;
    };

    var var_ = function(no_in) {
        return new AST_Var({
            start       : prev(),
            definitions : vardefs(no_in, false),
            end         : prev()
        });
    };

    var const_ = function() {
        return new AST_Const({
            start       : prev(),
            definitions : vardefs(false, true),
            end         : prev()
        });
    };

    var new_ = function(allow_calls) {
        var start = S.token;
        expect_token("operator", "new");
        var newexp = expr_atom(false), args;
        if (is("punc", "(")) {
            next();
            args = expr_list(")");
        } else {
            args = [];
        }
        return subscripts(new AST_New({
            start      : start,
            expression : newexp,
            args       : args,
            end        : prev()
        }), allow_calls);
    };

    function as_atom_node() {
        var tok = S.token, ret;
        switch (tok.type) {
          case "name":
          case "keyword":
            ret = _make_symbol(AST_SymbolRef);
            break;
          case "num":
            ret = new AST_Number({ start: tok, end: tok, value: tok.value });
            break;
          case "string":
            ret = new AST_String({
                start : tok,
                end   : tok,
                value : tok.value,
                quote : tok.quote
            });
            break;
          case "regexp":
            ret = new AST_RegExp({ start: tok, end: tok, value: tok.value });
            break;
          case "atom":
            switch (tok.value) {
              case "false":
                ret = new AST_False({ start: tok, end: tok });
                break;
              case "true":
                ret = new AST_True({ start: tok, end: tok });
                break;
              case "null":
                ret = new AST_Null({ start: tok, end: tok });
                break;
            }
            break;
          case "operator":
            if (!is_identifier_string(tok.value)) {
                croak("Invalid getter/setter name: " + tok.value,
                    tok.line, tok.col, tok.pos);
            }
            ret = _make_symbol(AST_SymbolRef);
            break;
        }
        next();
        return ret;
    };

    var expr_atom = function(allow_calls) {
        if (is("operator", "new")) {
            return new_(allow_calls);
        }
        var start = S.token;
        if (is("punc")) {
            switch (start.value) {
              case "(":
                next();
                var ex = expression(true);
                ex.start = start;
                ex.end = S.token;
                expect(")");
                return subscripts(ex, allow_calls);
              case "[":
                return subscripts(array_(), allow_calls);
              case "{":
                return subscripts(object_(), allow_calls);
            }
            unexpected();
        }
        if (is("keyword", "function")) {
            next();
            var func = function_(AST_Function);
            func.start = start;
            func.end = prev();
            return subscripts(func, allow_calls);
        }
        if (ATOMIC_START_TOKEN[S.token.type]) {
            return subscripts(as_atom_node(), allow_calls);
        }
        unexpected();
    };

    function expr_list(closing, allow_trailing_comma, allow_empty) {
        var first = true, a = [];
        while (!is("punc", closing)) {
            if (first) first = false; else expect(",");
            if (allow_trailing_comma && is("punc", closing)) break;
            if (is("punc", ",") && allow_empty) {
                a.push(new AST_Hole({ start: S.token, end: S.token }));
            } else {
                a.push(expression(false));
            }
        }
        next();
        return a;
    };

    var array_ = embed_tokens(function() {
        expect("[");
        return new AST_Array({
            elements: expr_list("]", !options.strict, true)
        });
    });

    var create_accessor = embed_tokens(function() {
        return function_(AST_Accessor);
    });

    var object_ = embed_tokens(function() {
        expect("{");
        var first = true, a = [];
        while (!is("punc", "}")) {
            if (first) first = false; else expect(",");
            if (!options.strict && is("punc", "}"))
                // allow trailing comma
                break;
            var start = S.token;
            var type = start.type;
            var name = as_property_name();
            if (type == "name" && !is("punc", ":")) {
                var key = new AST_SymbolAccessor({
                    start: S.token,
                    name: as_property_name(),
                    end: prev()
                });
                if (name == "get") {
                    a.push(new AST_ObjectGetter({
                        start : start,
                        key   : key,
                        value : create_accessor(),
                        end   : prev()
                    }));
                    continue;
                }
                if (name == "set") {
                    a.push(new AST_ObjectSetter({
                        start : start,
                        key   : key,
                        value : create_accessor(),
                        end   : prev()
                    }));
                    continue;
                }
            }
            expect(":");
            a.push(new AST_ObjectKeyVal({
                start : start,
                quote : start.quote,
                key   : name,
                value : expression(false),
                end   : prev()
            }));
        }
        next();
        return new AST_Object({ properties: a });
    });

    function as_property_name() {
        var tmp = S.token;
        switch (tmp.type) {
          case "operator":
            if (!KEYWORDS(tmp.value)) unexpected();
          case "num":
          case "string":
          case "name":
          case "keyword":
          case "atom":
            next();
            return tmp.value;
          default:
            unexpected();
        }
    };

    function as_name() {
        var tmp = S.token;
        if (tmp.type != "name") unexpected();
        next();
        return tmp.value;
    };

    function _make_symbol(type) {
        var name = S.token.value;
        return new (name == "this" ? AST_This : type)({
            name  : String(name),
            start : S.token,
            end   : S.token
        });
    };

    function as_symbol(type, noerror) {
        if (!is("name")) {
            if (!noerror) croak("Name expected");
            return null;
        }
        var sym = _make_symbol(type);
        next();
        return sym;
    };

    var subscripts = function(expr, allow_calls) {
        var start = expr.start;
        if (is("punc", ".")) {
            next();
            return subscripts(new AST_Dot({
                start      : start,
                expression : expr,
                property   : as_name(),
                end        : prev()
            }), allow_calls);
        }
        if (is("punc", "[")) {
            next();
            var prop = expression(true);
            expect("]");
            return subscripts(new AST_Sub({
                start      : start,
                expression : expr,
                property   : prop,
                end        : prev()
            }), allow_calls);
        }
        if (allow_calls && is("punc", "(")) {
            next();
            return subscripts(new AST_Call({
                start      : start,
                expression : expr,
                args       : expr_list(")"),
                end        : prev()
            }), true);
        }
        return expr;
    };

    var maybe_unary = function(allow_calls) {
        var start = S.token;
        if (is("operator") && UNARY_PREFIX(start.value)) {
            next();
            handle_regexp();
            var ex = make_unary(AST_UnaryPrefix, start, maybe_unary(allow_calls));
            ex.start = start;
            ex.end = prev();
            return ex;
        }
        var val = expr_atom(allow_calls);
        while (is("operator") && UNARY_POSTFIX(S.token.value) && !S.token.nlb) {
            val = make_unary(AST_UnaryPostfix, S.token, val);
            val.start = start;
            val.end = S.token;
            next();
        }
        return val;
    };

    function make_unary(ctor, token, expr) {
        var op = token.value;
        if ((op == "++" || op == "--") && !is_assignable(expr))
            croak("Invalid use of " + op + " operator", token.line, token.col, token.pos);
        return new ctor({ operator: op, expression: expr });
    };

    var expr_op = function(left, min_prec, no_in) {
        var op = is("operator") ? S.token.value : null;
        if (op == "in" && no_in) op = null;
        var prec = op != null ? PRECEDENCE[op] : null;
        if (prec != null && prec > min_prec) {
            next();
            var right = expr_op(maybe_unary(true), prec, no_in);
            return expr_op(new AST_Binary({
                start    : left.start,
                left     : left,
                operator : op,
                right    : right,
                end      : right.end
            }), min_prec, no_in);
        }
        return left;
    };

    function expr_ops(no_in) {
        return expr_op(maybe_unary(true), 0, no_in);
    };

    var maybe_conditional = function(no_in) {
        var start = S.token;
        var expr = expr_ops(no_in);
        if (is("operator", "?")) {
            next();
            var yes = expression(false);
            expect(":");
            return new AST_Conditional({
                start       : start,
                condition   : expr,
                consequent  : yes,
                alternative : expression(false, no_in),
                end         : prev()
            });
        }
        return expr;
    };

    function is_assignable(expr) {
        if (options.cli) return true;
        return expr instanceof AST_PropAccess || expr instanceof AST_SymbolRef;
    };

    var maybe_assign = function(no_in) {
        var start = S.token;
        var left = maybe_conditional(no_in), val = S.token.value;
        if (is("operator") && ASSIGNMENT(val)) {
            if (is_assignable(left)) {
                next();
                return new AST_Assign({
                    start    : start,
                    left     : left,
                    operator : val,
                    right    : maybe_assign(no_in),
                    end      : prev()
                });
            }
            croak("Invalid assignment");
        }
        return left;
    };

    var expression = function(commas, no_in) {
        var start = S.token;
        var expr = maybe_assign(no_in);
        if (commas && is("punc", ",")) {
            next();
            return new AST_Seq({
                start  : start,
                car    : expr,
                cdr    : expression(true, no_in),
                end    : peek()
            });
        }
        return expr;
    };

    function in_loop(cont) {
        ++S.in_loop;
        var ret = cont();
        --S.in_loop;
        return ret;
    };

    if (options.expression) {
        return expression(true);
    }

    return (function(){
        var start = S.token;
        var body = [];
        S.input.push_directives_stack();
        while (!is("eof"))
            body.push(statement());
        S.input.pop_directives_stack();
        var end = prev();
        var toplevel = options.toplevel;
        if (toplevel) {
            toplevel.body = toplevel.body.concat(body);
            toplevel.end = end;
        } else {
            toplevel = new AST_Toplevel({ start: start, body: body, end: end });
        }
        return toplevel;
    })();

};

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

// Tree transformer helpers.

function TreeTransformer(before, after) {
    TreeWalker.call(this);
    this.before = before;
    this.after = after;
}
TreeTransformer.prototype = new TreeWalker;

(function(undefined){

    function _(node, descend) {
        node.DEFMETHOD("transform", function(tw, in_list){
            var x, y;
            tw.push(this);
            if (tw.before) x = tw.before(this, descend, in_list);
            if (x === undefined) {
                if (!tw.after) {
                    x = this;
                    descend(x, tw);
                } else {
                    tw.stack[tw.stack.length - 1] = x = this;
                    descend(x, tw);
                    y = tw.after(x, in_list);
                    if (y !== undefined) x = y;
                }
            }
            tw.pop(this);
            return x;
        });
    };

    function do_list(list, tw) {
        return MAP(list, function(node){
            return node.transform(tw, true);
        });
    };

    _(AST_Node, noop);

    _(AST_LabeledStatement, function(self, tw){
        self.label = self.label.transform(tw);
        self.body = self.body.transform(tw);
    });

    _(AST_SimpleStatement, function(self, tw){
        self.body = self.body.transform(tw);
    });

    _(AST_Block, function(self, tw){
        self.body = do_list(self.body, tw);
    });

    _(AST_DWLoop, function(self, tw){
        self.condition = self.condition.transform(tw);
        self.body = self.body.transform(tw);
    });

    _(AST_For, function(self, tw){
        if (self.init) self.init = self.init.transform(tw);
        if (self.condition) self.condition = self.condition.transform(tw);
        if (self.step) self.step = self.step.transform(tw);
        self.body = self.body.transform(tw);
    });

    _(AST_ForIn, function(self, tw){
        self.init = self.init.transform(tw);
        self.object = self.object.transform(tw);
        self.body = self.body.transform(tw);
    });

    _(AST_With, function(self, tw){
        self.expression = self.expression.transform(tw);
        self.body = self.body.transform(tw);
    });

    _(AST_Exit, function(self, tw){
        if (self.value) self.value = self.value.transform(tw);
    });

    _(AST_LoopControl, function(self, tw){
        if (self.label) self.label = self.label.transform(tw);
    });

    _(AST_If, function(self, tw){
        self.condition = self.condition.transform(tw);
        self.body = self.body.transform(tw);
        if (self.alternative) self.alternative = self.alternative.transform(tw);
    });

    _(AST_Switch, function(self, tw){
        self.expression = self.expression.transform(tw);
        self.body = do_list(self.body, tw);
    });

    _(AST_Case, function(self, tw){
        self.expression = self.expression.transform(tw);
        self.body = do_list(self.body, tw);
    });

    _(AST_Try, function(self, tw){
        self.body = do_list(self.body, tw);
        if (self.bcatch) self.bcatch = self.bcatch.transform(tw);
        if (self.bfinally) self.bfinally = self.bfinally.transform(tw);
    });

    _(AST_Catch, function(self, tw){
        self.argname = self.argname.transform(tw);
        self.body = do_list(self.body, tw);
    });

    _(AST_Definitions, function(self, tw){
        self.definitions = do_list(self.definitions, tw);
    });

    _(AST_VarDef, function(self, tw){
        self.name = self.name.transform(tw);
        if (self.value) self.value = self.value.transform(tw);
    });

    _(AST_Lambda, function(self, tw){
        if (self.name) self.name = self.name.transform(tw);
        self.argnames = do_list(self.argnames, tw);
        self.body = do_list(self.body, tw);
    });

    _(AST_Call, function(self, tw){
        self.expression = self.expression.transform(tw);
        self.args = do_list(self.args, tw);
    });

    _(AST_Seq, function(self, tw){
        self.car = self.car.transform(tw);
        self.cdr = self.cdr.transform(tw);
    });

    _(AST_Dot, function(self, tw){
        self.expression = self.expression.transform(tw);
    });

    _(AST_Sub, function(self, tw){
        self.expression = self.expression.transform(tw);
        self.property = self.property.transform(tw);
    });

    _(AST_Unary, function(self, tw){
        self.expression = self.expression.transform(tw);
    });

    _(AST_Binary, function(self, tw){
        self.left = self.left.transform(tw);
        self.right = self.right.transform(tw);
    });

    _(AST_Conditional, function(self, tw){
        self.condition = self.condition.transform(tw);
        self.consequent = self.consequent.transform(tw);
        self.alternative = self.alternative.transform(tw);
    });

    _(AST_Array, function(self, tw){
        self.elements = do_list(self.elements, tw);
    });

    _(AST_Object, function(self, tw){
        self.properties = do_list(self.properties, tw);
    });

    _(AST_ObjectProperty, function(self, tw){
        self.value = self.value.transform(tw);
    });

})();

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

function SymbolDef(scope, index, orig) {
    this.name = orig.name;
    this.orig = [ orig ];
    this.scope = scope;
    this.references = [];
    this.global = false;
    this.mangled_name = null;
    this.undeclared = false;
    this.index = index;
    this.id = SymbolDef.next_id++;
};

SymbolDef.next_id = 1;

SymbolDef.prototype = {
    unmangleable: function(options) {
        if (!options) options = {};

        return (this.global && !options.toplevel)
            || this.undeclared
            || (!options.eval && (this.scope.uses_eval || this.scope.uses_with))
            || (options.keep_fnames
                && (this.orig[0] instanceof AST_SymbolLambda
                    || this.orig[0] instanceof AST_SymbolDefun));
    },
    mangle: function(options) {
        var cache = options.cache && options.cache.props;
        if (this.global && cache && cache.has(this.name)) {
            this.mangled_name = cache.get(this.name);
        }
        else if (!this.mangled_name && !this.unmangleable(options)) {
            var s = this.scope;
            var sym = this.orig[0];
            if (!options.screw_ie8 && sym instanceof AST_SymbolLambda)
                s = s.parent_scope;
            var def;
            if (this.defun && (def = this.defun.variables.get(this.name))) {
                this.mangled_name = def.mangled_name || def.name;
            } else
                this.mangled_name = s.next_mangled(options, this);
            if (this.global && cache) {
                cache.set(this.name, this.mangled_name);
            }
        }
    }
};

AST_Toplevel.DEFMETHOD("figure_out_scope", function(options){
    options = defaults(options, {
        cache: null,
        screw_ie8: true,
    });

    // pass 1: setup scope chaining and handle definitions
    var self = this;
    var scope = self.parent_scope = null;
    var labels = new Dictionary();
    var defun = null;
    var tw = new TreeWalker(function(node, descend){
        if (node instanceof AST_Catch) {
            var save_scope = scope;
            scope = new AST_Scope(node);
            scope.init_scope_vars(save_scope);
            descend();
            scope = save_scope;
            return true;
        }
        if (node instanceof AST_Scope) {
            node.init_scope_vars(scope);
            var save_scope = scope;
            var save_defun = defun;
            var save_labels = labels;
            defun = scope = node;
            labels = new Dictionary();
            descend();
            scope = save_scope;
            defun = save_defun;
            labels = save_labels;
            return true;        // don't descend again in TreeWalker
        }
        if (node instanceof AST_LabeledStatement) {
            var l = node.label;
            if (labels.has(l.name)) {
                throw new Error(string_template("Label {name} defined twice", l));
            }
            labels.set(l.name, l);
            descend();
            labels.del(l.name);
            return true;        // no descend again
        }
        if (node instanceof AST_With) {
            for (var s = scope; s; s = s.parent_scope)
                s.uses_with = true;
            return;
        }
        if (node instanceof AST_Symbol) {
            node.scope = scope;
        }
        if (node instanceof AST_Label) {
            node.thedef = node;
            node.references = [];
        }
        if (node instanceof AST_SymbolLambda) {
            defun.def_function(node);
        }
        else if (node instanceof AST_SymbolDefun) {
            // Careful here, the scope where this should be defined is
            // the parent scope.  The reason is that we enter a new
            // scope when we encounter the AST_Defun node (which is
            // instanceof AST_Scope) but we get to the symbol a bit
            // later.
            (node.scope = defun.parent_scope).def_function(node);
        }
        else if (node instanceof AST_SymbolVar
            || node instanceof AST_SymbolConst) {
            defun.def_variable(node);
            if (defun !== scope) {
                node.mark_enclosed(options);
                var def = scope.find_variable(node);
                if (node.thedef !== def) {
                    node.thedef = def;
                    node.reference(options);
                }
            }
        }
        else if (node instanceof AST_SymbolCatch) {
            scope.def_variable(node).defun = defun;
        }
        else if (node instanceof AST_LabelRef) {
            var sym = labels.get(node.name);
            if (!sym) throw new Error(string_template("Undefined label {name} [{line},{col}]", {
                name: node.name,
                line: node.start.line,
                col: node.start.col
            }));
            node.thedef = sym;
        }
    });
    self.walk(tw);

    // pass 2: find back references and eval
    var func = null;
    var globals = self.globals = new Dictionary();
    var tw = new TreeWalker(function(node, descend){
        if (node instanceof AST_Lambda) {
            var prev_func = func;
            func = node;
            descend();
            func = prev_func;
            return true;
        }
        if (node instanceof AST_LoopControl && node.label) {
            node.label.thedef.references.push(node);
            return true;
        }
        if (node instanceof AST_SymbolRef) {
            var name = node.name;
            if (name == "eval" && tw.parent() instanceof AST_Call) {
                for (var s = node.scope; s && !s.uses_eval; s = s.parent_scope) {
                    s.uses_eval = true;
                }
            }
            var sym = node.scope.find_variable(name);
            if (node.scope instanceof AST_Lambda && name == "arguments") {
                node.scope.uses_arguments = true;
            }
            if (!sym) {
                sym = self.def_global(node);
            }
            node.thedef = sym;
            node.reference(options);
            return true;
        }
    });
    self.walk(tw);

    // pass 3: fix up any scoping issue with IE8
    if (!options.screw_ie8) {
        self.walk(new TreeWalker(function(node, descend) {
            if (node instanceof AST_SymbolCatch) {
                var name = node.name;
                var refs = node.thedef.references;
                var scope = node.thedef.defun;
                var def = scope.find_variable(name) || self.globals.get(name) || scope.def_variable(node);
                refs.forEach(function(ref) {
                    ref.thedef = def;
                    ref.reference(options);
                });
                node.thedef = def;
                return true;
            }
        }));
    }

    if (options.cache) {
        this.cname = options.cache.cname;
    }
});

AST_Toplevel.DEFMETHOD("def_global", function(node){
    var globals = this.globals, name = node.name;
    if (globals.has(name)) {
        return globals.get(name);
    } else {
        var g = new SymbolDef(this, globals.size(), node);
        g.undeclared = true;
        g.global = true;
        globals.set(name, g);
        return g;
    }
});

AST_Scope.DEFMETHOD("init_scope_vars", function(parent_scope){
    this.variables = new Dictionary();  // map name to AST_SymbolVar (variables defined in this scope; includes functions)
    this.functions = new Dictionary();  // map name to AST_SymbolDefun (functions defined in this scope)
    this.uses_with = false;             // will be set to true if this or some nested scope uses the `with` statement
    this.uses_eval = false;             // will be set to true if this or nested scope uses the global `eval`
    this.parent_scope = parent_scope;   // the parent scope
    this.enclosed = [];                 // a list of variables from this or outer scope(s) that are referenced from this or inner scopes
    this.cname = -1;                    // the current index for mangling functions/variables
});

AST_Lambda.DEFMETHOD("init_scope_vars", function(){
    AST_Scope.prototype.init_scope_vars.apply(this, arguments);
    this.uses_arguments = false;
    this.def_variable(new AST_SymbolVar({
        name: "arguments",
        start: this.start,
        end: this.end
    }));
});

AST_Symbol.DEFMETHOD("mark_enclosed", function(options) {
    var def = this.definition();
    var s = this.scope;
    while (s) {
        push_uniq(s.enclosed, def);
        if (options.keep_fnames) {
            s.functions.each(function(d) {
                push_uniq(def.scope.enclosed, d);
            });
        }
        if (s === def.scope) break;
        s = s.parent_scope;
    }
});

AST_Symbol.DEFMETHOD("reference", function(options) {
    this.definition().references.push(this);
    this.mark_enclosed(options);
});

AST_Scope.DEFMETHOD("find_variable", function(name){
    if (name instanceof AST_Symbol) name = name.name;
    return this.variables.get(name)
        || (this.parent_scope && this.parent_scope.find_variable(name));
});

AST_Scope.DEFMETHOD("def_function", function(symbol){
    this.functions.set(symbol.name, this.def_variable(symbol));
});

AST_Scope.DEFMETHOD("def_variable", function(symbol){
    var def;
    if (!this.variables.has(symbol.name)) {
        def = new SymbolDef(this, this.variables.size(), symbol);
        this.variables.set(symbol.name, def);
        def.global = !this.parent_scope;
    } else {
        def = this.variables.get(symbol.name);
        def.orig.push(symbol);
    }
    return symbol.thedef = def;
});

AST_Scope.DEFMETHOD("next_mangled", function(options){
    var ext = this.enclosed;
    out: while (true) {
        var m = base54(++this.cname);
        if (!is_identifier(m)) continue; // skip over "do"

        // https://github.com/mishoo/UglifyJS2/issues/242 -- do not
        // shadow a name excepted from mangling.
        if (options.except.indexOf(m) >= 0) continue;

        // we must ensure that the mangled name does not shadow a name
        // from some parent scope that is referenced in this or in
        // inner scopes.
        for (var i = ext.length; --i >= 0;) {
            var sym = ext[i];
            var name = sym.mangled_name || (sym.unmangleable(options) && sym.name);
            if (m == name) continue out;
        }
        return m;
    }
});

AST_Function.DEFMETHOD("next_mangled", function(options, def){
    // #179, #326
    // in Safari strict mode, something like (function x(x){...}) is a syntax error;
    // a function expression's argument cannot shadow the function expression's name

    var tricky_def = def.orig[0] instanceof AST_SymbolFunarg && this.name && this.name.definition();

    // the function's mangled_name is null when keep_fnames is true
    var tricky_name = tricky_def ? tricky_def.mangled_name || tricky_def.name : null;

    while (true) {
        var name = AST_Lambda.prototype.next_mangled.call(this, options, def);
        if (!tricky_name || tricky_name != name)
            return name;
    }
});

AST_Symbol.DEFMETHOD("unmangleable", function(options){
    return this.definition().unmangleable(options);
});

// labels are always mangleable
AST_Label.DEFMETHOD("unmangleable", function(){
    return false;
});

AST_Symbol.DEFMETHOD("unreferenced", function(){
    return this.definition().references.length == 0
        && !(this.scope.uses_eval || this.scope.uses_with);
});

AST_Symbol.DEFMETHOD("undeclared", function(){
    return this.definition().undeclared;
});

AST_LabelRef.DEFMETHOD("undeclared", function(){
    return false;
});

AST_Label.DEFMETHOD("undeclared", function(){
    return false;
});

AST_Symbol.DEFMETHOD("definition", function(){
    return this.thedef;
});

AST_Symbol.DEFMETHOD("global", function(){
    return this.definition().global;
});

AST_Toplevel.DEFMETHOD("_default_mangler_options", function(options){
    return defaults(options, {
        eval        : false,
        except      : [],
        keep_fnames : false,
        screw_ie8   : true,
        sort        : false, // Ignored. Flag retained for backwards compatibility.
        toplevel    : false,
    });
});

AST_Toplevel.DEFMETHOD("mangle_names", function(options){
    options = this._default_mangler_options(options);

    // Never mangle arguments
    options.except.push('arguments');

    // We only need to mangle declaration nodes.  Special logic wired
    // into the code generator will display the mangled name if it's
    // present (and for AST_SymbolRef-s it'll use the mangled name of
    // the AST_SymbolDeclaration that it points to).
    var lname = -1;
    var to_mangle = [];

    if (options.cache) {
        this.globals.each(function(symbol){
            if (options.except.indexOf(symbol.name) < 0) {
                to_mangle.push(symbol);
            }
        });
    }

    var tw = new TreeWalker(function(node, descend){
        if (node instanceof AST_LabeledStatement) {
            // lname is incremented when we get to the AST_Label
            var save_nesting = lname;
            descend();
            lname = save_nesting;
            return true;        // don't descend again in TreeWalker
        }
        if (node instanceof AST_Scope) {
            var p = tw.parent(), a = [];
            node.variables.each(function(symbol){
                if (options.except.indexOf(symbol.name) < 0) {
                    a.push(symbol);
                }
            });
            to_mangle.push.apply(to_mangle, a);
            return;
        }
        if (node instanceof AST_Label) {
            var name;
            do name = base54(++lname); while (!is_identifier(name));
            node.mangled_name = name;
            return true;
        }
        if (options.screw_ie8 && node instanceof AST_SymbolCatch) {
            to_mangle.push(node.definition());
            return;
        }
    });
    this.walk(tw);
    to_mangle.forEach(function(def){ def.mangle(options) });

    if (options.cache) {
        options.cache.cname = this.cname;
    }
});

AST_Toplevel.DEFMETHOD("compute_char_frequency", function(options){
    options = this._default_mangler_options(options);
    var tw = new TreeWalker(function(node){
        if (node instanceof AST_Constant)
            base54.consider(node.print_to_string());
        else if (node instanceof AST_Return)
            base54.consider("return");
        else if (node instanceof AST_Throw)
            base54.consider("throw");
        else if (node instanceof AST_Continue)
            base54.consider("continue");
        else if (node instanceof AST_Break)
            base54.consider("break");
        else if (node instanceof AST_Debugger)
            base54.consider("debugger");
        else if (node instanceof AST_Directive)
            base54.consider(node.value);
        else if (node instanceof AST_While)
            base54.consider("while");
        else if (node instanceof AST_Do)
            base54.consider("do while");
        else if (node instanceof AST_If) {
            base54.consider("if");
            if (node.alternative) base54.consider("else");
        }
        else if (node instanceof AST_Var)
            base54.consider("var");
        else if (node instanceof AST_Const)
            base54.consider("const");
        else if (node instanceof AST_Lambda)
            base54.consider("function");
        else if (node instanceof AST_For)
            base54.consider("fo" + "r");
        else if (node instanceof AST_ForIn)
            base54.consider("for in");
        else if (node instanceof AST_Switch)
            base54.consider("switch");
        else if (node instanceof AST_Case)
            base54.consider("case");
        else if (node instanceof AST_Default)
            base54.consider("default");
        else if (node instanceof AST_With)
            base54.consider("with");
        else if (node instanceof AST_ObjectSetter)
            base54.consider("set" + node.key);
        else if (node instanceof AST_ObjectGetter)
            base54.consider("get" + node.key);
        else if (node instanceof AST_ObjectKeyVal)
            base54.consider(node.key);
        else if (node instanceof AST_New)
            base54.consider("new");
        else if (node instanceof AST_This)
            base54.consider("this");
        else if (node instanceof AST_Try)
            base54.consider("try");
        else if (node instanceof AST_Catch)
            base54.consider("catch");
        else if (node instanceof AST_Finally)
            base54.consider("finally");
        else if (node instanceof AST_Symbol && node.unmangleable(options))
            base54.consider(node.name);
        else if (node instanceof AST_Unary || node instanceof AST_Binary)
            base54.consider(node.operator);
        else if (node instanceof AST_Dot)
            base54.consider(node.property);
    });
    this.walk(tw);
    base54.sort();
});

var base54 = (function() {
    var string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
    var chars, frequency;
    function reset() {
        frequency = Object.create(null);
        chars = string.split("").map(function(ch){ return ch.charCodeAt(0) });
        chars.forEach(function(ch){ frequency[ch] = 0 });
    }
    base54.consider = function(str){
        for (var i = str.length; --i >= 0;) {
            var code = str.charCodeAt(i);
            if (code in frequency) ++frequency[code];
        }
    };
    base54.sort = function() {
        chars = mergeSort(chars, function(a, b){
            if (is_digit(a) && !is_digit(b)) return 1;
            if (is_digit(b) && !is_digit(a)) return -1;
            return frequency[b] - frequency[a];
        });
    };
    base54.reset = reset;
    reset();
    base54.get = function(){ return chars };
    base54.freq = function(){ return frequency };
    function base54(num) {
        var ret = "", base = 54;
        num++;
        do {
            num--;
            ret += String.fromCharCode(chars[num % base]);
            num = Math.floor(num / base);
            base = 64;
        } while (num > 0);
        return ret;
    };
    return base54;
})();

AST_Toplevel.DEFMETHOD("scope_warnings", function(options){
    options = defaults(options, {
        assign_to_global : true,
        eval             : true,
        func_arguments   : true,
        nested_defuns    : true,
        undeclared       : false, // this makes a lot of noise
        unreferenced     : true,
    });
    var tw = new TreeWalker(function(node){
        if (options.undeclared
            && node instanceof AST_SymbolRef
            && node.undeclared())
        {
            // XXX: this also warns about JS standard names,
            // i.e. Object, Array, parseInt etc.  Should add a list of
            // exceptions.
            AST_Node.warn("Undeclared symbol: {name} [{file}:{line},{col}]", {
                name: node.name,
                file: node.start.file,
                line: node.start.line,
                col: node.start.col
            });
        }
        if (options.assign_to_global)
        {
            var sym = null;
            if (node instanceof AST_Assign && node.left instanceof AST_SymbolRef)
                sym = node.left;
            else if (node instanceof AST_ForIn && node.init instanceof AST_SymbolRef)
                sym = node.init;
            if (sym
                && (sym.undeclared()
                    || (sym.global() && sym.scope !== sym.definition().scope))) {
                AST_Node.warn("{msg}: {name} [{file}:{line},{col}]", {
                    msg: sym.undeclared() ? "Accidental global?" : "Assignment to global",
                    name: sym.name,
                    file: sym.start.file,
                    line: sym.start.line,
                    col: sym.start.col
                });
            }
        }
        if (options.eval
            && node instanceof AST_SymbolRef
            && node.undeclared()
            && node.name == "eval") {
            AST_Node.warn("Eval is used [{file}:{line},{col}]", node.start);
        }
        if (options.unreferenced
            && (node instanceof AST_SymbolDeclaration || node instanceof AST_Label)
            && !(node instanceof AST_SymbolCatch)
            && node.unreferenced()) {
            AST_Node.warn("{type} {name} is declared but not referenced [{file}:{line},{col}]", {
                type: node instanceof AST_Label ? "Label" : "Symbol",
                name: node.name,
                file: node.start.file,
                line: node.start.line,
                col: node.start.col
            });
        }
        if (options.func_arguments
            && node instanceof AST_Lambda
            && node.uses_arguments) {
            AST_Node.warn("arguments used in function {name} [{file}:{line},{col}]", {
                name: node.name ? node.name.name : "anonymous",
                file: node.start.file,
                line: node.start.line,
                col: node.start.col
            });
        }
        if (options.nested_defuns
            && node instanceof AST_Defun
            && !(tw.parent() instanceof AST_Scope)) {
            AST_Node.warn("Function {name} declared in nested statement \"{type}\" [{file}:{line},{col}]", {
                name: node.name.name,
                type: tw.parent().TYPE,
                file: node.start.file,
                line: node.start.line,
                col: node.start.col
            });
        }
    });
    this.walk(tw);
});

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

var EXPECT_DIRECTIVE = /^$|[;{][\s\n]*$/;

function is_some_comments(comment) {
    // multiline comment
    return comment.type == "comment2" && /@preserve|@license|@cc_on/i.test(comment.value);
}

function OutputStream(options) {

    options = defaults(options, {
        ascii_only       : false,
        beautify         : false,
        bracketize       : false,
        comments         : false,
        indent_level     : 4,
        indent_start     : 0,
        inline_script    : true,
        keep_quoted_props: false,
        max_line_len     : false,
        preamble         : null,
        preserve_line    : false,
        quote_keys       : false,
        quote_style      : 0,
        screw_ie8        : true,
        semicolons       : true,
        shebang          : true,
        source_map       : null,
        space_colon      : true,
        unescape_regexps : false,
        width            : 80,
        wrap_iife        : false,
    }, true);

    // Convert comment option to RegExp if neccessary and set up comments filter
    var comment_filter = return_false; // Default case, throw all comments away
    if (options.comments) {
        var comments = options.comments;
        if (typeof options.comments === "string" && /^\/.*\/[a-zA-Z]*$/.test(options.comments)) {
            var regex_pos = options.comments.lastIndexOf("/");
            comments = new RegExp(
                options.comments.substr(1, regex_pos - 1),
                options.comments.substr(regex_pos + 1)
            );
        }
        if (comments instanceof RegExp) {
            comment_filter = function(comment) {
                return comment.type != "comment5" && comments.test(comment.value);
            };
        }
        else if (typeof comments === "function") {
            comment_filter = function(comment) {
                return comment.type != "comment5" && comments(this, comment);
            };
        }
        else if (comments === "some") {
            comment_filter = is_some_comments;
        } else { // NOTE includes "all" option
            comment_filter = return_true;
        }
    }

    var indentation = 0;
    var current_col = 0;
    var current_line = 1;
    var current_pos = 0;
    var OUTPUT = "";

    function to_ascii(str, identifier) {
        return str.replace(/[\u0000-\u001f\u007f-\uffff]/g, function(ch) {
            var code = ch.charCodeAt(0).toString(16);
            if (code.length <= 2 && !identifier) {
                while (code.length < 2) code = "0" + code;
                return "\\x" + code;
            } else {
                while (code.length < 4) code = "0" + code;
                return "\\u" + code;
            }
        });
    };

    function make_string(str, quote) {
        var dq = 0, sq = 0;
        str = str.replace(/[\\\b\f\n\r\v\t\x22\x27\u2028\u2029\0\ufeff]/g,
          function(s, i){
            switch (s) {
              case '"': ++dq; return '"';
              case "'": ++sq; return "'";
              case "\\": return "\\\\";
              case "\n": return "\\n";
              case "\r": return "\\r";
              case "\t": return "\\t";
              case "\b": return "\\b";
              case "\f": return "\\f";
              case "\x0B": return options.screw_ie8 ? "\\v" : "\\x0B";
              case "\u2028": return "\\u2028";
              case "\u2029": return "\\u2029";
              case "\ufeff": return "\\ufeff";
              case "\0":
                  return /[0-7]/.test(str.charAt(i+1)) ? "\\x00" : "\\0";
            }
            return s;
        });
        function quote_single() {
            return "'" + str.replace(/\x27/g, "\\'") + "'";
        }
        function quote_double() {
            return '"' + str.replace(/\x22/g, '\\"') + '"';
        }
        if (options.ascii_only) str = to_ascii(str);
        switch (options.quote_style) {
          case 1:
            return quote_single();
          case 2:
            return quote_double();
          case 3:
            return quote == "'" ? quote_single() : quote_double();
          default:
            return dq > sq ? quote_single() : quote_double();
        }
    };

    function encode_string(str, quote) {
        var ret = make_string(str, quote);
        if (options.inline_script) {
            ret = ret.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
            ret = ret.replace(/\x3c!--/g, "\\x3c!--");
            ret = ret.replace(/--\x3e/g, "--\\x3e");
        }
        return ret;
    };

    function make_name(name) {
        name = name.toString();
        if (options.ascii_only)
            name = to_ascii(name, true);
        return name;
    };

    function make_indent(back) {
        return repeat_string(" ", options.indent_start + indentation - back * options.indent_level);
    };

    /* -----[ beautification/minification ]----- */

    var might_need_space = false;
    var might_need_semicolon = false;
    var might_add_newline = 0;
    var last = "";

    var ensure_line_len = options.max_line_len ? function() {
        if (current_col > options.max_line_len) {
            if (might_add_newline) {
                var left = OUTPUT.slice(0, might_add_newline);
                var right = OUTPUT.slice(might_add_newline);
                OUTPUT = left + "\n" + right;
                current_line++;
                current_pos++;
                current_col = right.length;
            }
            if (current_col > options.max_line_len) {
                AST_Node.warn("Output exceeds {max_line_len} characters", options);
            }
        }
        might_add_newline = 0;
    } : noop;

    var requireSemicolonChars = makePredicate("( [ + * / - , .");

    function print(str) {
        str = String(str);
        var ch = str.charAt(0);
        var prev = last.charAt(last.length - 1);
        if (might_need_semicolon) {
            might_need_semicolon = false;

            if (prev == ":" && ch == "}" || (!ch || ";}".indexOf(ch) < 0) && prev != ";") {
                if (options.semicolons || requireSemicolonChars(ch)) {
                    OUTPUT += ";";
                    current_col++;
                    current_pos++;
                } else {
                    ensure_line_len();
                    OUTPUT += "\n";
                    current_pos++;
                    current_line++;
                    current_col = 0;

                    if (/^\s+$/.test(str)) {
                        // reset the semicolon flag, since we didn't print one
                        // now and might still have to later
                        might_need_semicolon = true;
                    }
                }

                if (!options.beautify)
                    might_need_space = false;
            }
        }

        if (!options.beautify && options.preserve_line && stack[stack.length - 1]) {
            var target_line = stack[stack.length - 1].start.line;
            while (current_line < target_line) {
                ensure_line_len();
                OUTPUT += "\n";
                current_pos++;
                current_line++;
                current_col = 0;
                might_need_space = false;
            }
        }

        if (might_need_space) {
            if ((is_identifier_char(prev)
                    && (is_identifier_char(ch) || ch == "\\"))
                || (ch == "/" && ch == prev)
                || ((ch == "+" || ch == "-") && ch == last))
            {
                OUTPUT += " ";
                current_col++;
                current_pos++;
            }
            might_need_space = false;
        }
        OUTPUT += str;
        current_pos += str.length;
        var a = str.split(/\r?\n/), n = a.length - 1;
        current_line += n;
        current_col += a[0].length;
        if (n > 0) {
            ensure_line_len();
            current_col = a[n].length;
        }
        last = str;
    };

    var space = options.beautify ? function() {
        print(" ");
    } : function() {
        might_need_space = true;
    };

    var indent = options.beautify ? function(half) {
        if (options.beautify) {
            print(make_indent(half ? 0.5 : 0));
        }
    } : noop;

    var with_indent = options.beautify ? function(col, cont) {
        if (col === true) col = next_indent();
        var save_indentation = indentation;
        indentation = col;
        var ret = cont();
        indentation = save_indentation;
        return ret;
    } : function(col, cont) { return cont() };

    var newline = options.beautify ? function() {
        print("\n");
    } : options.max_line_len ? function() {
        ensure_line_len();
        might_add_newline = OUTPUT.length;
    } : noop;

    var semicolon = options.beautify ? function() {
        print(";");
    } : function() {
        might_need_semicolon = true;
    };

    function force_semicolon() {
        might_need_semicolon = false;
        print(";");
    };

    function next_indent() {
        return indentation + options.indent_level;
    };

    function with_block(cont) {
        var ret;
        print("{");
        newline();
        with_indent(next_indent(), function(){
            ret = cont();
        });
        indent();
        print("}");
        return ret;
    };

    function with_parens(cont) {
        print("(");
        //XXX: still nice to have that for argument lists
        //var ret = with_indent(current_col, cont);
        var ret = cont();
        print(")");
        return ret;
    };

    function with_square(cont) {
        print("[");
        //var ret = with_indent(current_col, cont);
        var ret = cont();
        print("]");
        return ret;
    };

    function comma() {
        print(",");
        space();
    };

    function colon() {
        print(":");
        if (options.space_colon) space();
    };

    var add_mapping = options.source_map ? function(token, name) {
        try {
            if (token) options.source_map.add(
                token.file || "?",
                current_line, current_col,
                token.line, token.col,
                (!name && token.type == "name") ? token.value : name
            );
        } catch(ex) {
            AST_Node.warn("Couldn't figure out mapping for {file}:{line},{col} → {cline},{ccol} [{name}]", {
                file: token.file,
                line: token.line,
                col: token.col,
                cline: current_line,
                ccol: current_col,
                name: name || ""
            })
        }
    } : noop;

    function get() {
        if (might_add_newline) {
            ensure_line_len();
        }
        return OUTPUT;
    };

    var stack = [];
    return {
        get             : get,
        toString        : get,
        indent          : indent,
        indentation     : function() { return indentation },
        current_width   : function() { return current_col - indentation },
        should_break    : function() { return options.width && this.current_width() >= options.width },
        newline         : newline,
        print           : print,
        space           : space,
        comma           : comma,
        colon           : colon,
        last            : function() { return last },
        semicolon       : semicolon,
        force_semicolon : force_semicolon,
        to_ascii        : to_ascii,
        print_name      : function(name) { print(make_name(name)) },
        print_string    : function(str, quote, escape_directive) {
            var encoded = encode_string(str, quote);
            if (escape_directive === true && encoded.indexOf("\\") === -1) {
                // Insert semicolons to break directive prologue
                if (!EXPECT_DIRECTIVE.test(OUTPUT)) {
                    force_semicolon();
                }
                force_semicolon();
            }
            print(encoded);
        },
        encode_string   : encode_string,
        next_indent     : next_indent,
        with_indent     : with_indent,
        with_block      : with_block,
        with_parens     : with_parens,
        with_square     : with_square,
        add_mapping     : add_mapping,
        option          : function(opt) { return options[opt] },
        comment_filter  : comment_filter,
        line            : function() { return current_line },
        col             : function() { return current_col },
        pos             : function() { return current_pos },
        push_node       : function(node) { stack.push(node) },
        pop_node        : function() { return stack.pop() },
        parent          : function(n) {
            return stack[stack.length - 2 - (n || 0)];
        }
    };

};

/* -----[ code generators ]----- */

(function(){

    /* -----[ utils ]----- */

    function DEFPRINT(nodetype, generator) {
        nodetype.DEFMETHOD("_codegen", generator);
    };

    var use_asm = false;
    var in_directive = false;

    AST_Node.DEFMETHOD("print", function(stream, force_parens){
        var self = this, generator = self._codegen, prev_use_asm = use_asm;
        if (self instanceof AST_Directive && self.value == "use asm" && stream.parent() instanceof AST_Scope) {
            use_asm = true;
        }
        function doit() {
            self.add_comments(stream);
            self.add_source_map(stream);
            generator(self, stream);
        }
        stream.push_node(self);
        if (force_parens || self.needs_parens(stream)) {
            stream.with_parens(doit);
        } else {
            doit();
        }
        stream.pop_node();
        if (self instanceof AST_Scope) {
            use_asm = prev_use_asm;
        }
    });

    AST_Node.DEFMETHOD("print_to_string", function(options){
        var s = OutputStream(options);
        if (!options) s._readonly = true;
        this.print(s);
        return s.get();
    });

    /* -----[ comments ]----- */

    AST_Node.DEFMETHOD("add_comments", function(output){
        if (output._readonly) return;
        var self = this;
        var start = self.start;
        if (start && !start._comments_dumped) {
            start._comments_dumped = true;
            var comments = start.comments_before || [];

            // XXX: ugly fix for https://github.com/mishoo/UglifyJS2/issues/112
            //               and https://github.com/mishoo/UglifyJS2/issues/372
            if (self instanceof AST_Exit && self.value) {
                self.value.walk(new TreeWalker(function(node){
                    if (node.start && node.start.comments_before) {
                        comments = comments.concat(node.start.comments_before);
                        node.start.comments_before = [];
                    }
                    if (node instanceof AST_Function ||
                        node instanceof AST_Array ||
                        node instanceof AST_Object)
                    {
                        return true; // don't go inside.
                    }
                }));
            }

            if (output.pos() == 0) {
                if (comments.length > 0 && output.option("shebang") && comments[0].type == "comment5") {
                    output.print("#!" + comments.shift().value + "\n");
                    output.indent();
                }
                var preamble = output.option("preamble");
                if (preamble) {
                    output.print(preamble.replace(/\r\n?|[\n\u2028\u2029]|\s*$/g, "\n"));
                }
            }

            comments = comments.filter(output.comment_filter, self);

            // Keep single line comments after nlb, after nlb
            if (!output.option("beautify") && comments.length > 0 &&
                /comment[134]/.test(comments[0].type) &&
                output.col() !== 0 && comments[0].nlb)
            {
                output.print("\n");
            }

            comments.forEach(function(c){
                if (/comment[134]/.test(c.type)) {
                    output.print("//" + c.value + "\n");
                    output.indent();
                }
                else if (c.type == "comment2") {
                    output.print("/*" + c.value + "*/");
                    if (start.nlb) {
                        output.print("\n");
                        output.indent();
                    } else {
                        output.space();
                    }
                }
            });
        }
    });

    /* -----[ PARENTHESES ]----- */

    function PARENS(nodetype, func) {
        if (Array.isArray(nodetype)) {
            nodetype.forEach(function(nodetype){
                PARENS(nodetype, func);
            });
        } else {
            nodetype.DEFMETHOD("needs_parens", func);
        }
    };

    PARENS(AST_Node, function(){
        return false;
    });

    // a function expression needs parens around it when it's provably
    // the first token to appear in a statement.
    PARENS(AST_Function, function(output){
        if (first_in_statement(output)) {
            return true;
        }

        if (output.option('wrap_iife')) {
            var p = output.parent();
            return p instanceof AST_Call && p.expression === this;
        }

        return false;
    });

    // same goes for an object literal, because otherwise it would be
    // interpreted as a block of code.
    PARENS(AST_Object, function(output){
        return first_in_statement(output);
    });

    PARENS(AST_Unary, function(output){
        var p = output.parent();
        return p instanceof AST_PropAccess && p.expression === this
            || p instanceof AST_Call && p.expression === this;
    });

    PARENS(AST_Seq, function(output){
        var p = output.parent();
        return p instanceof AST_Call             // (foo, bar)() or foo(1, (2, 3), 4)
            || p instanceof AST_Unary            // !(foo, bar, baz)
            || p instanceof AST_Binary           // 1 + (2, 3) + 4 ==> 8
            || p instanceof AST_VarDef           // var a = (1, 2), b = a + a; ==> b == 4
            || p instanceof AST_PropAccess       // (1, {foo:2}).foo or (1, {foo:2})["foo"] ==> 2
            || p instanceof AST_Array            // [ 1, (2, 3), 4 ] ==> [ 1, 3, 4 ]
            || p instanceof AST_ObjectProperty   // { foo: (1, 2) }.foo ==> 2
            || p instanceof AST_Conditional      /* (false, true) ? (a = 10, b = 20) : (c = 30)
                                                  * ==> 20 (side effect, set a := 10 and b := 20) */
        ;
    });

    PARENS(AST_Binary, function(output){
        var p = output.parent();
        // (foo && bar)()
        if (p instanceof AST_Call && p.expression === this)
            return true;
        // typeof (foo && bar)
        if (p instanceof AST_Unary)
            return true;
        // (foo && bar)["prop"], (foo && bar).prop
        if (p instanceof AST_PropAccess && p.expression === this)
            return true;
        // this deals with precedence: 3 * (2 + 1)
        if (p instanceof AST_Binary) {
            var po = p.operator, pp = PRECEDENCE[po];
            var so = this.operator, sp = PRECEDENCE[so];
            if (pp > sp
                || (pp == sp
                    && this === p.right)) {
                return true;
            }
        }
    });

    PARENS(AST_PropAccess, function(output){
        var p = output.parent();
        if (p instanceof AST_New && p.expression === this) {
            // i.e. new (foo.bar().baz)
            //
            // if there's one call into this subtree, then we need
            // parens around it too, otherwise the call will be
            // interpreted as passing the arguments to the upper New
            // expression.
            try {
                this.walk(new TreeWalker(function(node){
                    if (node instanceof AST_Call) throw p;
                }));
            } catch(ex) {
                if (ex !== p) throw ex;
                return true;
            }
        }
    });

    PARENS(AST_Call, function(output){
        var p = output.parent(), p1;
        if (p instanceof AST_New && p.expression === this)
            return true;

        // workaround for Safari bug.
        // https://bugs.webkit.org/show_bug.cgi?id=123506
        return this.expression instanceof AST_Function
            && p instanceof AST_PropAccess
            && p.expression === this
            && (p1 = output.parent(1)) instanceof AST_Assign
            && p1.left === p;
    });

    PARENS(AST_New, function(output){
        var p = output.parent();
        if (!need_constructor_parens(this, output)
            && (p instanceof AST_PropAccess // (new Date).getTime(), (new Date)["getTime"]()
                || p instanceof AST_Call && p.expression === this)) // (new foo)(bar)
            return true;
    });

    PARENS(AST_Number, function(output){
        var p = output.parent();
        if (p instanceof AST_PropAccess && p.expression === this) {
            var value = this.getValue();
            if (value < 0 || /^0/.test(make_num(value))) {
                return true;
            }
        }
    });

    PARENS([ AST_Assign, AST_Conditional ], function (output){
        var p = output.parent();
        // !(a = false) → true
        if (p instanceof AST_Unary)
            return true;
        // 1 + (a = 2) + 3 → 6, side effect setting a = 2
        if (p instanceof AST_Binary && !(p instanceof AST_Assign))
            return true;
        // (a = func)() —or— new (a = Object)()
        if (p instanceof AST_Call && p.expression === this)
            return true;
        // (a = foo) ? bar : baz
        if (p instanceof AST_Conditional && p.condition === this)
            return true;
        // (a = foo)["prop"] —or— (a = foo).prop
        if (p instanceof AST_PropAccess && p.expression === this)
            return true;
    });

    /* -----[ PRINTERS ]----- */

    DEFPRINT(AST_Directive, function(self, output){
        output.print_string(self.value, self.quote);
        output.semicolon();
    });
    DEFPRINT(AST_Debugger, function(self, output){
        output.print("debugger");
        output.semicolon();
    });

    /* -----[ statements ]----- */

    function display_body(body, is_toplevel, output, allow_directives) {
        var last = body.length - 1;
        in_directive = allow_directives;
        body.forEach(function(stmt, i){
            if (in_directive === true && !(stmt instanceof AST_Directive ||
                stmt instanceof AST_EmptyStatement ||
                (stmt instanceof AST_SimpleStatement && stmt.body instanceof AST_String)
            )) {
                in_directive = false;
            }
            if (!(stmt instanceof AST_EmptyStatement)) {
                output.indent();
                stmt.print(output);
                if (!(i == last && is_toplevel)) {
                    output.newline();
                    if (is_toplevel) output.newline();
                }
            }
            if (in_directive === true &&
                stmt instanceof AST_SimpleStatement &&
                stmt.body instanceof AST_String
            ) {
                in_directive = false;
            }
        });
        in_directive = false;
    };

    AST_StatementWithBody.DEFMETHOD("_do_print_body", function(output){
        force_statement(this.body, output);
    });

    DEFPRINT(AST_Statement, function(self, output){
        self.body.print(output);
        output.semicolon();
    });
    DEFPRINT(AST_Toplevel, function(self, output){
        display_body(self.body, true, output, true);
        output.print("");
    });
    DEFPRINT(AST_LabeledStatement, function(self, output){
        self.label.print(output);
        output.colon();
        self.body.print(output);
    });
    DEFPRINT(AST_SimpleStatement, function(self, output){
        self.body.print(output);
        output.semicolon();
    });
    function print_bracketed(body, output, allow_directives) {
        if (body.length > 0) output.with_block(function(){
            display_body(body, false, output, allow_directives);
        });
        else output.print("{}");
    };
    DEFPRINT(AST_BlockStatement, function(self, output){
        print_bracketed(self.body, output);
    });
    DEFPRINT(AST_EmptyStatement, function(self, output){
        output.semicolon();
    });
    DEFPRINT(AST_Do, function(self, output){
        output.print("do");
        output.space();
        make_block(self.body, output);
        output.space();
        output.print("while");
        output.space();
        output.with_parens(function(){
            self.condition.print(output);
        });
        output.semicolon();
    });
    DEFPRINT(AST_While, function(self, output){
        output.print("while");
        output.space();
        output.with_parens(function(){
            self.condition.print(output);
        });
        output.space();
        self._do_print_body(output);
    });
    DEFPRINT(AST_For, function(self, output){
        output.print("fo" + "r");
        output.space();
        output.with_parens(function(){
            if (self.init) {
                if (self.init instanceof AST_Definitions) {
                    self.init.print(output);
                } else {
                    parenthesize_for_noin(self.init, output, true);
                }
                output.print(";");
                output.space();
            } else {
                output.print(";");
            }
            if (self.condition) {
                self.condition.print(output);
                output.print(";");
                output.space();
            } else {
                output.print(";");
            }
            if (self.step) {
                self.step.print(output);
            }
        });
        output.space();
        self._do_print_body(output);
    });
    DEFPRINT(AST_ForIn, function(self, output){
        output.print("fo" + "r");
        output.space();
        output.with_parens(function(){
            self.init.print(output);
            output.space();
            output.print("in");
            output.space();
            self.object.print(output);
        });
        output.space();
        self._do_print_body(output);
    });
    DEFPRINT(AST_With, function(self, output){
        output.print("with");
        output.space();
        output.with_parens(function(){
            self.expression.print(output);
        });
        output.space();
        self._do_print_body(output);
    });

    /* -----[ functions ]----- */
    AST_Lambda.DEFMETHOD("_do_print", function(output, nokeyword){
        var self = this;
        if (!nokeyword) {
            output.print("function");
        }
        if (self.name) {
            output.space();
            self.name.print(output);
        }
        output.with_parens(function(){
            self.argnames.forEach(function(arg, i){
                if (i) output.comma();
                arg.print(output);
            });
        });
        output.space();
        print_bracketed(self.body, output, true);
    });
    DEFPRINT(AST_Lambda, function(self, output){
        self._do_print(output);
    });

    /* -----[ exits ]----- */
    AST_Exit.DEFMETHOD("_do_print", function(output, kind){
        output.print(kind);
        if (this.value) {
            output.space();
            this.value.print(output);
        }
        output.semicolon();
    });
    DEFPRINT(AST_Return, function(self, output){
        self._do_print(output, "return");
    });
    DEFPRINT(AST_Throw, function(self, output){
        self._do_print(output, "throw");
    });

    /* -----[ loop control ]----- */
    AST_LoopControl.DEFMETHOD("_do_print", function(output, kind){
        output.print(kind);
        if (this.label) {
            output.space();
            this.label.print(output);
        }
        output.semicolon();
    });
    DEFPRINT(AST_Break, function(self, output){
        self._do_print(output, "break");
    });
    DEFPRINT(AST_Continue, function(self, output){
        self._do_print(output, "continue");
    });

    /* -----[ if ]----- */
    function make_then(self, output) {
        var b = self.body;
        if (output.option("bracketize")
            || !output.option("screw_ie8") && b instanceof AST_Do)
            return make_block(b, output);
        // The squeezer replaces "block"-s that contain only a single
        // statement with the statement itself; technically, the AST
        // is correct, but this can create problems when we output an
        // IF having an ELSE clause where the THEN clause ends in an
        // IF *without* an ELSE block (then the outer ELSE would refer
        // to the inner IF).  This function checks for this case and
        // adds the block brackets if needed.
        if (!b) return output.force_semicolon();
        while (true) {
            if (b instanceof AST_If) {
                if (!b.alternative) {
                    make_block(self.body, output);
                    return;
                }
                b = b.alternative;
            }
            else if (b instanceof AST_StatementWithBody) {
                b = b.body;
            }
            else break;
        }
        force_statement(self.body, output);
    };
    DEFPRINT(AST_If, function(self, output){
        output.print("if");
        output.space();
        output.with_parens(function(){
            self.condition.print(output);
        });
        output.space();
        if (self.alternative) {
            make_then(self, output);
            output.space();
            output.print("else");
            output.space();
            if (self.alternative instanceof AST_If)
                self.alternative.print(output);
            else
                force_statement(self.alternative, output);
        } else {
            self._do_print_body(output);
        }
    });

    /* -----[ switch ]----- */
    DEFPRINT(AST_Switch, function(self, output){
        output.print("switch");
        output.space();
        output.with_parens(function(){
            self.expression.print(output);
        });
        output.space();
        var last = self.body.length - 1;
        if (last < 0) output.print("{}");
        else output.with_block(function(){
            self.body.forEach(function(branch, i){
                output.indent(true);
                branch.print(output);
                if (i < last && branch.body.length > 0)
                    output.newline();
            });
        });
    });
    AST_SwitchBranch.DEFMETHOD("_do_print_body", function(output){
        output.newline();
        this.body.forEach(function(stmt){
            output.indent();
            stmt.print(output);
            output.newline();
        });
    });
    DEFPRINT(AST_Default, function(self, output){
        output.print("default:");
        self._do_print_body(output);
    });
    DEFPRINT(AST_Case, function(self, output){
        output.print("case");
        output.space();
        self.expression.print(output);
        output.print(":");
        self._do_print_body(output);
    });

    /* -----[ exceptions ]----- */
    DEFPRINT(AST_Try, function(self, output){
        output.print("try");
        output.space();
        print_bracketed(self.body, output);
        if (self.bcatch) {
            output.space();
            self.bcatch.print(output);
        }
        if (self.bfinally) {
            output.space();
            self.bfinally.print(output);
        }
    });
    DEFPRINT(AST_Catch, function(self, output){
        output.print("catch");
        output.space();
        output.with_parens(function(){
            self.argname.print(output);
        });
        output.space();
        print_bracketed(self.body, output);
    });
    DEFPRINT(AST_Finally, function(self, output){
        output.print("finally");
        output.space();
        print_bracketed(self.body, output);
    });

    /* -----[ var/const ]----- */
    AST_Definitions.DEFMETHOD("_do_print", function(output, kind){
        output.print(kind);
        output.space();
        this.definitions.forEach(function(def, i){
            if (i) output.comma();
            def.print(output);
        });
        var p = output.parent();
        var in_for = p instanceof AST_For || p instanceof AST_ForIn;
        var avoid_semicolon = in_for && p.init === this;
        if (!avoid_semicolon)
            output.semicolon();
    });
    DEFPRINT(AST_Var, function(self, output){
        self._do_print(output, "var");
    });
    DEFPRINT(AST_Const, function(self, output){
        self._do_print(output, "const");
    });

    function parenthesize_for_noin(node, output, noin) {
        if (!noin) node.print(output);
        else try {
            // need to take some precautions here:
            //    https://github.com/mishoo/UglifyJS2/issues/60
            node.walk(new TreeWalker(function(node){
                if (node instanceof AST_Binary && node.operator == "in")
                    throw output;
            }));
            node.print(output);
        } catch(ex) {
            if (ex !== output) throw ex;
            node.print(output, true);
        }
    };

    DEFPRINT(AST_VarDef, function(self, output){
        self.name.print(output);
        if (self.value) {
            output.space();
            output.print("=");
            output.space();
            var p = output.parent(1);
            var noin = p instanceof AST_For || p instanceof AST_ForIn;
            parenthesize_for_noin(self.value, output, noin);
        }
    });

    /* -----[ other expressions ]----- */
    DEFPRINT(AST_Call, function(self, output){
        self.expression.print(output);
        if (self instanceof AST_New && !need_constructor_parens(self, output))
            return;
        output.with_parens(function(){
            self.args.forEach(function(expr, i){
                if (i) output.comma();
                expr.print(output);
            });
        });
    });
    DEFPRINT(AST_New, function(self, output){
        output.print("new");
        output.space();
        AST_Call.prototype._codegen(self, output);
    });

    AST_Seq.DEFMETHOD("_do_print", function(output){
        this.car.print(output);
        if (this.cdr) {
            output.comma();
            if (output.should_break()) {
                output.newline();
                output.indent();
            }
            this.cdr.print(output);
        }
    });
    DEFPRINT(AST_Seq, function(self, output){
        self._do_print(output);
        // var p = output.parent();
        // if (p instanceof AST_Statement) {
        //     output.with_indent(output.next_indent(), function(){
        //         self._do_print(output);
        //     });
        // } else {
        //     self._do_print(output);
        // }
    });
    DEFPRINT(AST_Dot, function(self, output){
        var expr = self.expression;
        expr.print(output);
        if (expr instanceof AST_Number && expr.getValue() >= 0) {
            if (!/[xa-f.)]/i.test(output.last())) {
                output.print(".");
            }
        }
        output.print(".");
        // the name after dot would be mapped about here.
        output.add_mapping(self.end);
        output.print_name(self.property);
    });
    DEFPRINT(AST_Sub, function(self, output){
        self.expression.print(output);
        output.print("[");
        self.property.print(output);
        output.print("]");
    });
    DEFPRINT(AST_UnaryPrefix, function(self, output){
        var op = self.operator;
        output.print(op);
        if (/^[a-z]/i.test(op)
            || (/[+-]$/.test(op)
                && self.expression instanceof AST_UnaryPrefix
                && /^[+-]/.test(self.expression.operator))) {
            output.space();
        }
        self.expression.print(output);
    });
    DEFPRINT(AST_UnaryPostfix, function(self, output){
        self.expression.print(output);
        output.print(self.operator);
    });
    DEFPRINT(AST_Binary, function(self, output){
        var op = self.operator;
        self.left.print(output);
        if (op[0] == ">" /* ">>" ">>>" ">" ">=" */
            && self.left instanceof AST_UnaryPostfix
            && self.left.operator == "--") {
            // space is mandatory to avoid outputting -->
            output.print(" ");
        } else {
            // the space is optional depending on "beautify"
            output.space();
        }
        output.print(op);
        if ((op == "<" || op == "<<")
            && self.right instanceof AST_UnaryPrefix
            && self.right.operator == "!"
            && self.right.expression instanceof AST_UnaryPrefix
            && self.right.expression.operator == "--") {
            // space is mandatory to avoid outputting <!--
            output.print(" ");
        } else {
            // the space is optional depending on "beautify"
            output.space();
        }
        self.right.print(output);
    });
    DEFPRINT(AST_Conditional, function(self, output){
        self.condition.print(output);
        output.space();
        output.print("?");
        output.space();
        self.consequent.print(output);
        output.space();
        output.colon();
        self.alternative.print(output);
    });

    /* -----[ literals ]----- */
    DEFPRINT(AST_Array, function(self, output){
        output.with_square(function(){
            var a = self.elements, len = a.length;
            if (len > 0) output.space();
            a.forEach(function(exp, i){
                if (i) output.comma();
                exp.print(output);
                // If the final element is a hole, we need to make sure it
                // doesn't look like a trailing comma, by inserting an actual
                // trailing comma.
                if (i === len - 1 && exp instanceof AST_Hole)
                  output.comma();
            });
            if (len > 0) output.space();
        });
    });
    DEFPRINT(AST_Object, function(self, output){
        if (self.properties.length > 0) output.with_block(function(){
            self.properties.forEach(function(prop, i){
                if (i) {
                    output.print(",");
                    output.newline();
                }
                output.indent();
                prop.print(output);
            });
            output.newline();
        });
        else output.print("{}");
    });

    function print_property_name(key, quote, output) {
        if (output.option("quote_keys")) {
            output.print_string(key + "");
        } else if ((typeof key == "number"
                    || !output.option("beautify")
                    && +key + "" == key)
                   && parseFloat(key) >= 0) {
            output.print(make_num(key));
        } else if (RESERVED_WORDS(key) ? output.option("screw_ie8") : is_identifier_string(key)) {
            if (quote && output.option("keep_quoted_props")) {
                output.print_string(key, quote);
            } else {
                output.print_name(key);
            }
        } else {
            output.print_string(key, quote);
        }
    }

    DEFPRINT(AST_ObjectKeyVal, function(self, output){
        print_property_name(self.key, self.quote, output);
        output.colon();
        self.value.print(output);
    });
    AST_ObjectProperty.DEFMETHOD("_print_getter_setter", function(type, output) {
        output.print(type);
        output.space();
        print_property_name(this.key.name, this.quote, output);
        this.value._do_print(output, true);
    });
    DEFPRINT(AST_ObjectSetter, function(self, output){
        self._print_getter_setter("set", output);
    });
    DEFPRINT(AST_ObjectGetter, function(self, output){
        self._print_getter_setter("get", output);
    });
    DEFPRINT(AST_Symbol, function(self, output){
        var def = self.definition();
        output.print_name(def ? def.mangled_name || def.name : self.name);
    });
    DEFPRINT(AST_Hole, noop);
    DEFPRINT(AST_This, function(self, output){
        output.print("this");
    });
    DEFPRINT(AST_Constant, function(self, output){
        output.print(self.getValue());
    });
    DEFPRINT(AST_String, function(self, output){
        output.print_string(self.getValue(), self.quote, in_directive);
    });
    DEFPRINT(AST_Number, function(self, output){
        if (use_asm && self.start && self.start.raw != null) {
            output.print(self.start.raw);
        } else {
            output.print(make_num(self.getValue()));
        }
    });

    function regexp_safe_literal(code) {
        return [
            0x5c   , // \
            0x2f   , // /
            0x2e   , // .
            0x2b   , // +
            0x2a   , // *
            0x3f   , // ?
            0x28   , // (
            0x29   , // )
            0x5b   , // [
            0x5d   , // ]
            0x7b   , // {
            0x7d   , // }
            0x24   , // $
            0x5e   , // ^
            0x3a   , // :
            0x7c   , // |
            0x21   , // !
            0x0a   , // \n
            0x0d   , // \r
            0x00   , // \0
            0xfeff , // Unicode BOM
            0x2028 , // unicode "line separator"
            0x2029 , // unicode "paragraph separator"
        ].indexOf(code) < 0;
    };

    DEFPRINT(AST_RegExp, function(self, output){
        var str = self.getValue().toString();
        if (output.option("ascii_only")) {
            str = output.to_ascii(str);
        } else if (output.option("unescape_regexps")) {
            str = str.split("\\\\").map(function(str){
                return str.replace(/\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}/g, function(s){
                    var code = parseInt(s.substr(2), 16);
                    return regexp_safe_literal(code) ? String.fromCharCode(code) : s;
                });
            }).join("\\\\");
        }
        output.print(str);
        var p = output.parent();
        if (p instanceof AST_Binary && /^in/.test(p.operator) && p.left === self)
            output.print(" ");
    });

    function force_statement(stat, output) {
        if (output.option("bracketize")) {
            make_block(stat, output);
        } else {
            if (!stat || stat instanceof AST_EmptyStatement)
                output.force_semicolon();
            else
                stat.print(output);
        }
    };

    // self should be AST_New.  decide if we want to show parens or not.
    function need_constructor_parens(self, output) {
        // Always print parentheses with arguments
        if (self.args.length > 0) return true;

        return output.option("beautify");
    };

    function best_of(a) {
        var best = a[0], len = best.length;
        for (var i = 1; i < a.length; ++i) {
            if (a[i].length < len) {
                best = a[i];
                len = best.length;
            }
        }
        return best;
    };

    function make_num(num) {
        var str = num.toString(10), a = [ str.replace(/^0\./, ".").replace('e+', 'e') ], m;
        if (Math.floor(num) === num) {
            if (num >= 0) {
                a.push("0x" + num.toString(16).toLowerCase(), // probably pointless
                       "0" + num.toString(8)); // same.
            } else {
                a.push("-0x" + (-num).toString(16).toLowerCase(), // probably pointless
                       "-0" + (-num).toString(8)); // same.
            }
            if ((m = /^(.*?)(0+)$/.exec(num))) {
                a.push(m[1] + "e" + m[2].length);
            }
        } else if ((m = /^0?\.(0+)(.*)$/.exec(num))) {
            a.push(m[2] + "e-" + (m[1].length + m[2].length),
                   str.substr(str.indexOf(".")));
        }
        return best_of(a);
    };

    function make_block(stmt, output) {
        if (!stmt || stmt instanceof AST_EmptyStatement)
            output.print("{}");
        else if (stmt instanceof AST_BlockStatement)
            stmt.print(output);
        else output.with_block(function(){
            output.indent();
            stmt.print(output);
            output.newline();
        });
    };

    /* -----[ source map generators ]----- */

    function DEFMAP(nodetype, generator) {
        nodetype.DEFMETHOD("add_source_map", function(stream){
            generator(this, stream);
        });
    };

    // We could easily add info for ALL nodes, but it seems to me that
    // would be quite wasteful, hence this noop in the base class.
    DEFMAP(AST_Node, noop);

    function basic_sourcemap_gen(self, output) {
        output.add_mapping(self.start);
    };

    // XXX: I'm not exactly sure if we need it for all of these nodes,
    // or if we should add even more.

    DEFMAP(AST_Directive, basic_sourcemap_gen);
    DEFMAP(AST_Debugger, basic_sourcemap_gen);
    DEFMAP(AST_Symbol, basic_sourcemap_gen);
    DEFMAP(AST_Jump, basic_sourcemap_gen);
    DEFMAP(AST_StatementWithBody, basic_sourcemap_gen);
    DEFMAP(AST_LabeledStatement, noop); // since the label symbol will mark it
    DEFMAP(AST_Lambda, basic_sourcemap_gen);
    DEFMAP(AST_Switch, basic_sourcemap_gen);
    DEFMAP(AST_SwitchBranch, basic_sourcemap_gen);
    DEFMAP(AST_BlockStatement, basic_sourcemap_gen);
    DEFMAP(AST_Toplevel, noop);
    DEFMAP(AST_New, basic_sourcemap_gen);
    DEFMAP(AST_Try, basic_sourcemap_gen);
    DEFMAP(AST_Catch, basic_sourcemap_gen);
    DEFMAP(AST_Finally, basic_sourcemap_gen);
    DEFMAP(AST_Definitions, basic_sourcemap_gen);
    DEFMAP(AST_Constant, basic_sourcemap_gen);
    DEFMAP(AST_ObjectSetter, function(self, output){
        output.add_mapping(self.start, self.key.name);
    });
    DEFMAP(AST_ObjectGetter, function(self, output){
        output.add_mapping(self.start, self.key.name);
    });
    DEFMAP(AST_ObjectProperty, function(self, output){
        output.add_mapping(self.start, self.key);
    });

})();

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

function Compressor(options, false_by_default) {
    if (!(this instanceof Compressor))
        return new Compressor(options, false_by_default);
    TreeTransformer.call(this, this.before, this.after);
    this.options = defaults(options, {
        angular       : false,
        booleans      : !false_by_default,
        cascade       : !false_by_default,
        collapse_vars : !false_by_default,
        comparisons   : !false_by_default,
        conditionals  : !false_by_default,
        dead_code     : !false_by_default,
        drop_console  : false,
        drop_debugger : !false_by_default,
        evaluate      : !false_by_default,
        expression    : false,
        global_defs   : {},
        hoist_funs    : !false_by_default,
        hoist_vars    : false,
        if_return     : !false_by_default,
        join_vars     : !false_by_default,
        keep_fargs    : true,
        keep_fnames   : false,
        keep_infinity : false,
        loops         : !false_by_default,
        negate_iife   : !false_by_default,
        passes        : 1,
        properties    : !false_by_default,
        pure_getters  : !false_by_default && "strict",
        pure_funcs    : null,
        reduce_vars   : !false_by_default,
        screw_ie8     : true,
        sequences     : !false_by_default,
        side_effects  : !false_by_default,
        switches      : !false_by_default,
        top_retain    : null,
        toplevel      : !!(options && options["top_retain"]),
        unsafe        : false,
        unsafe_comps  : false,
        unsafe_math   : false,
        unsafe_proto  : false,
        unsafe_regexp : false,
        unused        : !false_by_default,
        warnings      : true,
    }, true);
    var pure_funcs = this.options["pure_funcs"];
    if (typeof pure_funcs == "function") {
        this.pure_funcs = pure_funcs;
    } else {
        this.pure_funcs = pure_funcs ? function(node) {
            return pure_funcs.indexOf(node.expression.print_to_string()) < 0;
        } : return_true;
    }
    var top_retain = this.options["top_retain"];
    if (top_retain instanceof RegExp) {
        this.top_retain = function(def) {
            return top_retain.test(def.name);
        };
    } else if (typeof top_retain == "function") {
        this.top_retain = top_retain;
    } else if (top_retain) {
        if (typeof top_retain == "string") {
            top_retain = top_retain.split(/,/);
        }
        this.top_retain = function(def) {
            return top_retain.indexOf(def.name) >= 0;
        };
    }
    var sequences = this.options["sequences"];
    this.sequences_limit = sequences == 1 ? 200 : sequences | 0;
    this.warnings_produced = {};
};

Compressor.prototype = new TreeTransformer;
merge(Compressor.prototype, {
    option: function(key) { return this.options[key] },
    compress: function(node) {
        if (this.option("expression")) {
            node = node.process_expression(true);
        }
        var passes = +this.options.passes || 1;
        for (var pass = 0; pass < passes && pass < 3; ++pass) {
            if (pass > 0 || this.option("reduce_vars"))
                node.reset_opt_flags(this, true);
            node = node.transform(this);
        }
        if (this.option("expression")) {
            node = node.process_expression(false);
        }
        return node;
    },
    info: function() {
        if (this.options.warnings == "verbose") {
            AST_Node.warn.apply(AST_Node, arguments);
        }
    },
    warn: function(text, props) {
        if (this.options.warnings) {
            // only emit unique warnings
            var message = string_template(text, props);
            if (!(message in this.warnings_produced)) {
                this.warnings_produced[message] = true;
                AST_Node.warn.apply(AST_Node, arguments);
            }
        }
    },
    clear_warnings: function() {
        this.warnings_produced = {};
    },
    before: function(node, descend, in_list) {
        if (node._squeezed) return node;
        var was_scope = false;
        if (node instanceof AST_Scope) {
            node = node.hoist_declarations(this);
            was_scope = true;
        }
        // Before https://github.com/mishoo/UglifyJS2/pull/1602 AST_Node.optimize()
        // would call AST_Node.transform() if a different instance of AST_Node is
        // produced after OPT().
        // This corrupts TreeWalker.stack, which cause AST look-ups to malfunction.
        // Migrate and defer all children's AST_Node.transform() to below, which
        // will now happen after this parent AST_Node has been properly substituted
        // thus gives a consistent AST snapshot.
        descend(node, this);
        // Existing code relies on how AST_Node.optimize() worked, and omitting the
        // following replacement call would result in degraded efficiency of both
        // output and performance.
        descend(node, this);
        var opt = node.optimize(this);
        if (was_scope && opt instanceof AST_Scope) {
            opt.drop_unused(this);
            descend(opt, this);
        }
        if (opt === node) opt._squeezed = true;
        return opt;
    }
});

(function(){

    function OPT(node, optimizer) {
        node.DEFMETHOD("optimize", function(compressor){
            var self = this;
            if (self._optimized) return self;
            if (compressor.has_directive("use asm")) return self;
            var opt = optimizer(self, compressor);
            opt._optimized = true;
            return opt;
        });
    };

    OPT(AST_Node, function(self, compressor){
        return self;
    });

    AST_Node.DEFMETHOD("equivalent_to", function(node){
        return this.TYPE == node.TYPE && this.print_to_string() == node.print_to_string();
    });

    AST_Node.DEFMETHOD("process_expression", function(insert, compressor) {
        var self = this;
        var tt = new TreeTransformer(function(node) {
            if (insert && node instanceof AST_SimpleStatement) {
                return make_node(AST_Return, node, {
                    value: node.body
                });
            }
            if (!insert && node instanceof AST_Return) {
                if (compressor) {
                    var value = node.value && node.value.drop_side_effect_free(compressor, true);
                    return value ? make_node(AST_SimpleStatement, node, {
                        body: value
                    }) : make_node(AST_EmptyStatement, node);
                }
                return make_node(AST_SimpleStatement, node, {
                    body: node.value || make_node(AST_UnaryPrefix, node, {
                        operator: "void",
                        expression: make_node(AST_Number, node, {
                            value: 0
                        })
                    })
                });
            }
            if (node instanceof AST_Lambda && node !== self) {
                return node;
            }
            if (node instanceof AST_Block) {
                var index = node.body.length - 1;
                if (index >= 0) {
                    node.body[index] = node.body[index].transform(tt);
                }
            }
            if (node instanceof AST_If) {
                node.body = node.body.transform(tt);
                if (node.alternative) {
                    node.alternative = node.alternative.transform(tt);
                }
            }
            if (node instanceof AST_With) {
                node.body = node.body.transform(tt);
            }
            return node;
        });
        return self.transform(tt);
    });

    AST_Node.DEFMETHOD("reset_opt_flags", function(compressor, rescan){
        var reduce_vars = rescan && compressor.option("reduce_vars");
        var toplevel = compressor.option("toplevel");
        var safe_ids = Object.create(null);
        var suppressor = new TreeWalker(function(node) {
            if (node instanceof AST_Symbol) {
                var d = node.definition();
                if (node instanceof AST_SymbolRef) d.references.push(node);
                d.fixed = false;
            }
        });
        var tw = new TreeWalker(function(node, descend){
            node._squeezed = false;
            node._optimized = false;
            if (reduce_vars) {
                if (node instanceof AST_Toplevel) node.globals.each(reset_def);
                if (node instanceof AST_Scope) node.variables.each(reset_def);
                if (node instanceof AST_SymbolRef) {
                    var d = node.definition();
                    d.references.push(node);
                    if (d.fixed === undefined || !is_safe(d)
                        || is_modified(node, 0, node.fixed_value() instanceof AST_Lambda)) {
                        d.fixed = false;
                    } else {
                        var parent = tw.parent();
                        if (parent instanceof AST_Assign && parent.operator == "=" && node === parent.right
                            || parent instanceof AST_Call && node !== parent.expression
                            || parent instanceof AST_Return && node === parent.value && node.scope !== d.scope
                            || parent instanceof AST_VarDef && node === parent.value) {
                            d.escaped = true;
                        }
                    }
                }
                if (node instanceof AST_SymbolCatch) {
                    node.definition().fixed = false;
                }
                if (node instanceof AST_VarDef) {
                    var d = node.name.definition();
                    if (d.fixed == null) {
                        if (node.value) {
                            d.fixed = function() {
                                return node.value;
                            };
                            mark(d, false);
                            descend();
                        } else {
                            d.fixed = null;
                        }
                        mark(d, true);
                        return true;
                    } else if (node.value) {
                        d.fixed = false;
                    }
                }
                if (node instanceof AST_Defun) {
                    var d = node.name.definition();
                    if (!toplevel && d.global || is_safe(d)) {
                        d.fixed = false;
                    } else {
                        d.fixed = node;
                        mark(d, true);
                    }
                    var save_ids = safe_ids;
                    safe_ids = Object.create(null);
                    descend();
                    safe_ids = save_ids;
                    return true;
                }
                if (node instanceof AST_Function) {
                    push();
                    var iife;
                    if (!node.name
                        && (iife = tw.parent()) instanceof AST_Call
                        && iife.expression === node) {
                        // Virtually turn IIFE parameters into variable definitions:
                        //   (function(a,b) {...})(c,d) => (function() {var a=c,b=d; ...})()
                        // So existing transformation rules can work on them.
                        node.argnames.forEach(function(arg, i) {
                            var d = arg.definition();
                            if (!node.uses_arguments && d.fixed === undefined) {
                                d.fixed = function() {
                                    return iife.args[i] || make_node(AST_Undefined, iife);
                                };
                                mark(d, true);
                            } else {
                                d.fixed = false;
                            }
                        });
                    }
                    descend();
                    pop();
                    return true;
                }
                if (node instanceof AST_Accessor) {
                    var save_ids = safe_ids;
                    safe_ids = Object.create(null);
                    descend();
                    safe_ids = save_ids;
                    return true;
                }
                if (node instanceof AST_Binary
                    && (node.operator == "&&" || node.operator == "||")) {
                    node.left.walk(tw);
                    push();
                    node.right.walk(tw);
                    pop();
                    return true;
                }
                if (node instanceof AST_Conditional) {
                    node.condition.walk(tw);
                    push();
                    node.consequent.walk(tw);
                    pop();
                    push();
                    node.alternative.walk(tw);
                    pop();
                    return true;
                }
                if (node instanceof AST_If || node instanceof AST_DWLoop) {
                    node.condition.walk(tw);
                    push();
                    node.body.walk(tw);
                    pop();
                    if (node.alternative) {
                        push();
                        node.alternative.walk(tw);
                        pop();
                    }
                    return true;
                }
                if (node instanceof AST_LabeledStatement) {
                    push();
                    node.body.walk(tw);
                    pop();
                    return true;
                }
                if (node instanceof AST_For) {
                    if (node.init) node.init.walk(tw);
                    push();
                    if (node.condition) node.condition.walk(tw);
                    node.body.walk(tw);
                    if (node.step) node.step.walk(tw);
                    pop();
                    return true;
                }
                if (node instanceof AST_ForIn) {
                    node.init.walk(suppressor);
                    node.object.walk(tw);
                    push();
                    node.body.walk(tw);
                    pop();
                    return true;
                }
                if (node instanceof AST_Try) {
                    push();
                    walk_body(node, tw);
                    pop();
                    if (node.bcatch) {
                        push();
                        node.bcatch.walk(tw);
                        pop();
                    }
                    if (node.bfinally) node.bfinally.walk(tw);
                    return true;
                }
                if (node instanceof AST_SwitchBranch) {
                    push();
                    descend();
                    pop();
                    return true;
                }
            }
        });
        this.walk(tw);

        function mark(def, safe) {
            safe_ids[def.id] = safe;
        }

        function is_safe(def) {
            if (safe_ids[def.id]) {
                if (def.fixed == null) {
                    var orig = def.orig[0];
                    if (orig instanceof AST_SymbolFunarg || orig.name == "arguments") return false;
                    def.fixed = make_node(AST_Undefined, orig);
                }
                return true;
            }
        }

        function push() {
            safe_ids = Object.create(safe_ids);
        }

        function pop() {
            safe_ids = Object.getPrototypeOf(safe_ids);
        }

        function reset_def(def) {
            def.escaped = false;
            if (def.scope.uses_eval) {
                def.fixed = false;
            } else if (toplevel || !def.global || def.orig[0] instanceof AST_SymbolConst) {
                def.fixed = undefined;
            } else {
                def.fixed = false;
            }
            def.references = [];
            def.should_replace = undefined;
        }

        function is_modified(node, level, func) {
            var parent = tw.parent(level);
            if (is_lhs(node, parent)
                || !func && parent instanceof AST_Call && parent.expression === node) {
                return true;
            } else if (parent instanceof AST_PropAccess && parent.expression === node) {
                return !func && is_modified(parent, level + 1);
            }
        }
    });

    AST_SymbolRef.DEFMETHOD("fixed_value", function() {
        var fixed = this.definition().fixed;
        if (!fixed || fixed instanceof AST_Node) return fixed;
        return fixed();
    });

    function is_reference_const(ref) {
        if (!(ref instanceof AST_SymbolRef)) return false;
        var orig = ref.definition().orig;
        for (var i = orig.length; --i >= 0;) {
            if (orig[i] instanceof AST_SymbolConst) return true;
        }
    }

    function find_variable(compressor, name) {
        var scope, i = 0;
        while (scope = compressor.parent(i++)) {
            if (scope instanceof AST_Scope) break;
            if (scope instanceof AST_Catch) {
                scope = scope.argname.definition().scope;
                break;
            }
        }
        return scope.find_variable(name);
    }

    function make_node(ctor, orig, props) {
        if (!props) props = {};
        if (orig) {
            if (!props.start) props.start = orig.start;
            if (!props.end) props.end = orig.end;
        }
        return new ctor(props);
    };

    function make_node_from_constant(val, orig) {
        switch (typeof val) {
          case "string":
            return make_node(AST_String, orig, {
                value: val
            });
          case "number":
            if (isNaN(val)) return make_node(AST_NaN, orig);
            if (isFinite(val)) {
                return 1 / val < 0 ? make_node(AST_UnaryPrefix, orig, {
                    operator: "-",
                    expression: make_node(AST_Number, orig, { value: -val })
                }) : make_node(AST_Number, orig, { value: val });
            }
            return val < 0 ? make_node(AST_UnaryPrefix, orig, {
                operator: "-",
                expression: make_node(AST_Infinity, orig)
            }) : make_node(AST_Infinity, orig);
          case "boolean":
            return make_node(val ? AST_True : AST_False, orig);
          case "undefined":
            return make_node(AST_Undefined, orig);
          default:
            if (val === null) {
                return make_node(AST_Null, orig, { value: null });
            }
            if (val instanceof RegExp) {
                return make_node(AST_RegExp, orig, { value: val });
            }
            throw new Error(string_template("Can't handle constant of type: {type}", {
                type: typeof val
            }));
        }
    };

    // we shouldn't compress (1,func)(something) to
    // func(something) because that changes the meaning of
    // the func (becomes lexical instead of global).
    function maintain_this_binding(parent, orig, val) {
        if (parent instanceof AST_UnaryPrefix && parent.operator == "delete"
            || parent instanceof AST_Call && parent.expression === orig
                && (val instanceof AST_PropAccess || val instanceof AST_SymbolRef && val.name == "eval")) {
            return make_node(AST_Seq, orig, {
                car: make_node(AST_Number, orig, {
                    value: 0
                }),
                cdr: val
            });
        }
        return val;
    }

    function as_statement_array(thing) {
        if (thing === null) return [];
        if (thing instanceof AST_BlockStatement) return thing.body;
        if (thing instanceof AST_EmptyStatement) return [];
        if (thing instanceof AST_Statement) return [ thing ];
        throw new Error("Can't convert thing to statement array");
    };

    function is_empty(thing) {
        if (thing === null) return true;
        if (thing instanceof AST_EmptyStatement) return true;
        if (thing instanceof AST_BlockStatement) return thing.body.length == 0;
        return false;
    };

    function loop_body(x) {
        if (x instanceof AST_Switch) return x;
        if (x instanceof AST_For || x instanceof AST_ForIn || x instanceof AST_DWLoop) {
            return (x.body instanceof AST_BlockStatement ? x.body : x);
        }
        return x;
    };

    function is_iife_call(node) {
        if (node instanceof AST_Call && !(node instanceof AST_New)) {
            return node.expression instanceof AST_Function || is_iife_call(node.expression);
        }
        return false;
    }

    function tighten_body(statements, compressor) {
        var CHANGED, max_iter = 10;
        do {
            CHANGED = false;
            if (compressor.option("angular")) {
                statements = process_for_angular(statements);
            }
            statements = eliminate_spurious_blocks(statements);
            if (compressor.option("dead_code")) {
                statements = eliminate_dead_code(statements, compressor);
            }
            if (compressor.option("if_return")) {
                statements = handle_if_return(statements, compressor);
            }
            if (compressor.sequences_limit > 0) {
                statements = sequencesize(statements, compressor);
            }
            if (compressor.option("join_vars")) {
                statements = join_consecutive_vars(statements, compressor);
            }
            if (compressor.option("collapse_vars")) {
                statements = collapse_single_use_vars(statements, compressor);
            }
        } while (CHANGED && max_iter-- > 0);

        return statements;

        function collapse_single_use_vars(statements, compressor) {
            // Iterate statements backwards looking for a statement with a var/const
            // declaration immediately preceding it. Grab the rightmost var definition
            // and if it has exactly one reference then attempt to replace its reference
            // in the statement with the var value and then erase the var definition.

            var self = compressor.self();
            var var_defs_removed = false;
            var toplevel = compressor.option("toplevel");
            for (var stat_index = statements.length; --stat_index >= 0;) {
                var stat = statements[stat_index];
                if (stat instanceof AST_Definitions) continue;

                // Process child blocks of statement if present.
                [stat, stat.body, stat.alternative, stat.bcatch, stat.bfinally].forEach(function(node) {
                    node && node.body && collapse_single_use_vars(node.body, compressor);
                });

                // The variable definition must precede a statement.
                if (stat_index <= 0) break;
                var prev_stat_index = stat_index - 1;
                var prev_stat = statements[prev_stat_index];
                if (!(prev_stat instanceof AST_Definitions)) continue;
                var var_defs = prev_stat.definitions;
                if (var_defs == null) continue;

                var var_names_seen = {};
                var side_effects_encountered = false;
                var lvalues_encountered = false;
                var lvalues = {};

                // Scan variable definitions from right to left.
                for (var var_defs_index = var_defs.length; --var_defs_index >= 0;) {

                    // Obtain var declaration and var name with basic sanity check.
                    var var_decl = var_defs[var_defs_index];
                    if (var_decl.value == null) break;
                    var var_name = var_decl.name.name;
                    if (!var_name || !var_name.length) break;

                    // Bail if we've seen a var definition of same name before.
                    if (var_name in var_names_seen) break;
                    var_names_seen[var_name] = true;

                    // Only interested in cases with just one reference to the variable.
                    var def = self.find_variable && self.find_variable(var_name);
                    if (!def || !def.references || def.references.length !== 1
                        || var_name == "arguments" || (!toplevel && def.global)) {
                        side_effects_encountered = true;
                        continue;
                    }
                    var ref = def.references[0];

                    // Don't replace ref if eval() or with statement in scope.
                    if (ref.scope.uses_eval || ref.scope.uses_with) break;

                    // Constant single use vars can be replaced in any scope.
                    if (var_decl.value.is_constant()) {
                        var ctt = new TreeTransformer(function(node) {
                            var parent = ctt.parent();
                            if (parent instanceof AST_IterationStatement
                                && (parent.condition === node || parent.init === node)) {
                                return node;
                            }
                            if (node === ref)
                                return replace_var(node, parent, true);
                        });
                        stat.transform(ctt);
                        continue;
                    }

                    // Restrict var replacement to constants if side effects encountered.
                    if (side_effects_encountered |= lvalues_encountered) continue;

                    var value_has_side_effects = var_decl.value.has_side_effects(compressor);
                    // Non-constant single use vars can only be replaced in same scope.
                    if (ref.scope !== self) {
                        side_effects_encountered |= value_has_side_effects;
                        continue;
                    }

                    // Detect lvalues in var value.
                    var tw = new TreeWalker(function(node){
                        if (node instanceof AST_SymbolRef && is_lvalue(node, tw.parent())) {
                            lvalues[node.name] = lvalues_encountered = true;
                        }
                    });
                    var_decl.value.walk(tw);

                    // Replace the non-constant single use var in statement if side effect free.
                    var unwind = false;
                    var tt = new TreeTransformer(
                        function preorder(node) {
                            if (unwind) return node;
                            var parent = tt.parent();
                            if (node instanceof AST_Lambda
                                || node instanceof AST_Try
                                || node instanceof AST_With
                                || node instanceof AST_Case
                                || node instanceof AST_IterationStatement
                                || (parent instanceof AST_If          && node !== parent.condition)
                                || (parent instanceof AST_Conditional && node !== parent.condition)
                                || (node instanceof AST_SymbolRef
                                    && value_has_side_effects
                                    && !are_references_in_scope(node.definition(), self))
                                || (parent instanceof AST_Binary
                                    && (parent.operator == "&&" || parent.operator == "||")
                                    && node === parent.right)
                                || (parent instanceof AST_Switch && node !== parent.expression)) {
                                return side_effects_encountered = unwind = true, node;
                            }
                            function are_references_in_scope(def, scope) {
                                if (def.orig.length === 1
                                    && def.orig[0] instanceof AST_SymbolDefun) return true;
                                if (def.scope !== scope) return false;
                                var refs = def.references;
                                for (var i = 0, len = refs.length; i < len; i++) {
                                    if (refs[i].scope !== scope) return false;
                                }
                                return true;
                            }
                        },
                        function postorder(node) {
                            if (unwind) return node;
                            if (node === ref)
                                return unwind = true, replace_var(node, tt.parent(), false);
                            if (side_effects_encountered |= node.has_side_effects(compressor))
                                return unwind = true, node;
                            if (lvalues_encountered && node instanceof AST_SymbolRef && node.name in lvalues) {
                                side_effects_encountered = true;
                                return unwind = true, node;
                            }
                        }
                    );
                    stat.transform(tt);
                }
            }

            // Remove extraneous empty statments in block after removing var definitions.
            // Leave at least one statement in `statements`.
            if (var_defs_removed) for (var i = statements.length; --i >= 0;) {
                if (statements.length > 1 && statements[i] instanceof AST_EmptyStatement)
                    statements.splice(i, 1);
            }

            return statements;

            function is_lvalue(node, parent) {
                return node instanceof AST_SymbolRef && is_lhs(node, parent);
            }
            function replace_var(node, parent, is_constant) {
                if (is_lvalue(node, parent)) return node;

                // Remove var definition and return its value to the TreeTransformer to replace.
                var value = maintain_this_binding(parent, node, var_decl.value);
                var_decl.value = null;

                var_defs.splice(var_defs_index, 1);
                if (var_defs.length === 0) {
                    statements[prev_stat_index] = make_node(AST_EmptyStatement, self);
                    var_defs_removed = true;
                }
                // Further optimize statement after substitution.
                stat.reset_opt_flags(compressor);

                compressor.info("Collapsing " + (is_constant ? "constant" : "variable") +
                    " " + var_name + " [{file}:{line},{col}]", node.start);
                CHANGED = true;
                return value;
            }
        }

        function process_for_angular(statements) {
            function has_inject(comment) {
                return /@ngInject/.test(comment.value);
            }
            function make_arguments_names_list(func) {
                return func.argnames.map(function(sym){
                    return make_node(AST_String, sym, { value: sym.name });
                });
            }
            function make_array(orig, elements) {
                return make_node(AST_Array, orig, { elements: elements });
            }
            function make_injector(func, name) {
                return make_node(AST_SimpleStatement, func, {
                    body: make_node(AST_Assign, func, {
                        operator: "=",
                        left: make_node(AST_Dot, name, {
                            expression: make_node(AST_SymbolRef, name, name),
                            property: "$inject"
                        }),
                        right: make_array(func, make_arguments_names_list(func))
                    })
                });
            }
            function check_expression(body) {
                if (body && body.args) {
                    // if this is a function call check all of arguments passed
                    body.args.forEach(function(argument, index, array) {
                        var comments = argument.start.comments_before;
                        // if the argument is function preceded by @ngInject
                        if (argument instanceof AST_Lambda && comments.length && has_inject(comments[0])) {
                            // replace the function with an array of names of its parameters and function at the end
                            array[index] = make_array(argument, make_arguments_names_list(argument).concat(argument));
                        }
                    });
                    // if this is chained call check previous one recursively
                    if (body.expression && body.expression.expression) {
                        check_expression(body.expression.expression);
                    }
                }
            }
            return statements.reduce(function(a, stat){
                a.push(stat);

                if (stat.body && stat.body.args) {
                    check_expression(stat.body);
                } else {
                    var token = stat.start;
                    var comments = token.comments_before;
                    if (comments && comments.length > 0) {
                        var last = comments.pop();
                        if (has_inject(last)) {
                            // case 1: defun
                            if (stat instanceof AST_Defun) {
                                a.push(make_injector(stat, stat.name));
                            }
                            else if (stat instanceof AST_Definitions) {
                                stat.definitions.forEach(function(def) {
                                    if (def.value && def.value instanceof AST_Lambda) {
                                        a.push(make_injector(def.value, def.name));
                                    }
                                });
                            }
                            else {
                                compressor.warn("Unknown statement marked with @ngInject [{file}:{line},{col}]", token);
                            }
                        }
                    }
                }

                return a;
            }, []);
        }

        function eliminate_spurious_blocks(statements) {
            var seen_dirs = [];
            return statements.reduce(function(a, stat){
                if (stat instanceof AST_BlockStatement) {
                    CHANGED = true;
                    a.push.apply(a, eliminate_spurious_blocks(stat.body));
                } else if (stat instanceof AST_EmptyStatement) {
                    CHANGED = true;
                } else if (stat instanceof AST_Directive) {
                    if (seen_dirs.indexOf(stat.value) < 0) {
                        a.push(stat);
                        seen_dirs.push(stat.value);
                    } else {
                        CHANGED = true;
                    }
                } else {
                    a.push(stat);
                }
                return a;
            }, []);
        };

        function handle_if_return(statements, compressor) {
            var self = compressor.self();
            var multiple_if_returns = has_multiple_if_returns(statements);
            var in_lambda = self instanceof AST_Lambda;
            var ret = []; // Optimized statements, build from tail to front
            loop: for (var i = statements.length; --i >= 0;) {
                var stat = statements[i];
                switch (true) {
                  case (in_lambda && stat instanceof AST_Return && !stat.value && ret.length == 0):
                    CHANGED = true;
                    // note, ret.length is probably always zero
                    // because we drop unreachable code before this
                    // step.  nevertheless, it's good to check.
                    continue loop;
                  case stat instanceof AST_If:
                    if (stat.body instanceof AST_Return) {
                        //---
                        // pretty silly case, but:
                        // if (foo()) return; return; ==> foo(); return;
                        if (((in_lambda && ret.length == 0)
                             || (ret[0] instanceof AST_Return && !ret[0].value))
                            && !stat.body.value && !stat.alternative) {
                            CHANGED = true;
                            var cond = make_node(AST_SimpleStatement, stat.condition, {
                                body: stat.condition
                            });
                            ret.unshift(cond);
                            continue loop;
                        }
                        //---
                        // if (foo()) return x; return y; ==> return foo() ? x : y;
                        if (ret[0] instanceof AST_Return && stat.body.value && ret[0].value && !stat.alternative) {
                            CHANGED = true;
                            stat = stat.clone();
                            stat.alternative = ret[0];
                            ret[0] = stat.transform(compressor);
                            continue loop;
                        }
                        //---
                        // if (foo()) return x; [ return ; ] ==> return foo() ? x : undefined;
                        if (multiple_if_returns && (ret.length == 0 || ret[0] instanceof AST_Return)
                            && stat.body.value && !stat.alternative && in_lambda) {
                            CHANGED = true;
                            stat = stat.clone();
                            stat.alternative = ret[0] || make_node(AST_Return, stat, {
                                value: null
                            });
                            ret[0] = stat.transform(compressor);
                            continue loop;
                        }
                        //---
                        // if (foo()) return; [ else x... ]; y... ==> if (!foo()) { x...; y... }
                        if (!stat.body.value && in_lambda) {
                            CHANGED = true;
                            stat = stat.clone();
                            stat.condition = stat.condition.negate(compressor);
                            var body = as_statement_array(stat.alternative).concat(ret);
                            var funs = extract_functions_from_statement_array(body);
                            stat.body = make_node(AST_BlockStatement, stat, {
                                body: body
                            });
                            stat.alternative = null;
                            ret = funs.concat([ stat.transform(compressor) ]);
                            continue loop;
                        }

                        //---
                        // if (a) return b; if (c) return d; e; ==> return a ? b : c ? d : void e;
                        //
                        // if sequences is not enabled, this can lead to an endless loop (issue #866).
                        // however, with sequences on this helps producing slightly better output for
                        // the example code.
                        if (compressor.option("sequences")
                            && i > 0 && statements[i - 1] instanceof AST_If && statements[i - 1].body instanceof AST_Return
                            && ret.length == 1 && in_lambda && ret[0] instanceof AST_SimpleStatement
                            && !stat.alternative) {
                            CHANGED = true;
                            ret.push(make_node(AST_Return, ret[0], {
                                value: null
                            }).transform(compressor));
                            ret.unshift(stat);
                            continue loop;
                        }
                    }

                    var ab = aborts(stat.body);
                    var lct = ab instanceof AST_LoopControl ? compressor.loopcontrol_target(ab) : null;
                    if (ab && ((ab instanceof AST_Return && !ab.value && in_lambda)
                               || (ab instanceof AST_Continue && self === loop_body(lct))
                               || (ab instanceof AST_Break && lct instanceof AST_BlockStatement && self === lct))) {
                        if (ab.label) {
                            remove(ab.label.thedef.references, ab);
                        }
                        CHANGED = true;
                        var body = as_statement_array(stat.body).slice(0, -1);
                        stat = stat.clone();
                        stat.condition = stat.condition.negate(compressor);
                        stat.body = make_node(AST_BlockStatement, stat, {
                            body: as_statement_array(stat.alternative).concat(ret)
                        });
                        stat.alternative = make_node(AST_BlockStatement, stat, {
                            body: body
                        });
                        ret = [ stat.transform(compressor) ];
                        continue loop;
                    }

                    var ab = aborts(stat.alternative);
                    var lct = ab instanceof AST_LoopControl ? compressor.loopcontrol_target(ab) : null;
                    if (ab && ((ab instanceof AST_Return && !ab.value && in_lambda)
                               || (ab instanceof AST_Continue && self === loop_body(lct))
                               || (ab instanceof AST_Break && lct instanceof AST_BlockStatement && self === lct))) {
                        if (ab.label) {
                            remove(ab.label.thedef.references, ab);
                        }
                        CHANGED = true;
                        stat = stat.clone();
                        stat.body = make_node(AST_BlockStatement, stat.body, {
                            body: as_statement_array(stat.body).concat(ret)
                        });
                        stat.alternative = make_node(AST_BlockStatement, stat.alternative, {
                            body: as_statement_array(stat.alternative).slice(0, -1)
                        });
                        ret = [ stat.transform(compressor) ];
                        continue loop;
                    }

                    ret.unshift(stat);
                    break;
                  default:
                    ret.unshift(stat);
                    break;
                }
            }
            return ret;

            function has_multiple_if_returns(statements) {
                var n = 0;
                for (var i = statements.length; --i >= 0;) {
                    var stat = statements[i];
                    if (stat instanceof AST_If && stat.body instanceof AST_Return) {
                        if (++n > 1) return true;
                    }
                }
                return false;
            }
        };

        function eliminate_dead_code(statements, compressor) {
            var has_quit = false;
            var orig = statements.length;
            var self = compressor.self();
            statements = statements.reduce(function(a, stat){
                if (has_quit) {
                    extract_declarations_from_unreachable_code(compressor, stat, a);
                } else {
                    if (stat instanceof AST_LoopControl) {
                        var lct = compressor.loopcontrol_target(stat);
                        if ((stat instanceof AST_Break
                             && !(lct instanceof AST_IterationStatement)
                             && loop_body(lct) === self) || (stat instanceof AST_Continue
                                                             && loop_body(lct) === self)) {
                            if (stat.label) {
                                remove(stat.label.thedef.references, stat);
                            }
                        } else {
                            a.push(stat);
                        }
                    } else {
                        a.push(stat);
                    }
                    if (aborts(stat)) has_quit = true;
                }
                return a;
            }, []);
            CHANGED = statements.length != orig;
            return statements;
        };

        function sequencesize(statements, compressor) {
            if (statements.length < 2) return statements;
            var seq = [], ret = [];
            function push_seq() {
                seq = AST_Seq.from_array(seq);
                if (seq) ret.push(make_node(AST_SimpleStatement, seq, {
                    body: seq
                }));
                seq = [];
            };
            statements.forEach(function(stat){
                if (stat instanceof AST_SimpleStatement) {
                    if (seqLength(seq) >= compressor.sequences_limit) push_seq();
                    var body = stat.body;
                    if (seq.length > 0) body = body.drop_side_effect_free(compressor);
                    if (body) seq.push(body);
                } else {
                    push_seq();
                    ret.push(stat);
                }
            });
            push_seq();
            ret = sequencesize_2(ret, compressor);
            CHANGED = ret.length != statements.length;
            return ret;
        };

        function seqLength(a) {
            for (var len = 0, i = 0; i < a.length; ++i) {
                var stat = a[i];
                if (stat instanceof AST_Seq) {
                    len += stat.len();
                } else {
                    len++;
                }
            }
            return len;
        };

        function sequencesize_2(statements, compressor) {
            function cons_seq(right) {
                ret.pop();
                var left = prev.body;
                if (left instanceof AST_Seq) {
                    left.add(right);
                } else {
                    left = AST_Seq.cons(left, right);
                }
                return left.transform(compressor);
            };
            var ret = [], prev = null;
            statements.forEach(function(stat){
                if (prev) {
                    if (stat instanceof AST_For) {
                        var opera = {};
                        try {
                            prev.body.walk(new TreeWalker(function(node){
                                if (node instanceof AST_Binary && node.operator == "in")
                                    throw opera;
                            }));
                            if (stat.init && !(stat.init instanceof AST_Definitions)) {
                                stat.init = cons_seq(stat.init);
                            }
                            else if (!stat.init) {
                                stat.init = prev.body.drop_side_effect_free(compressor);
                                ret.pop();
                            }
                        } catch(ex) {
                            if (ex !== opera) throw ex;
                        }
                    }
                    else if (stat instanceof AST_If) {
                        stat.condition = cons_seq(stat.condition);
                    }
                    else if (stat instanceof AST_With) {
                        stat.expression = cons_seq(stat.expression);
                    }
                    else if (stat instanceof AST_Exit && stat.value) {
                        stat.value = cons_seq(stat.value);
                    }
                    else if (stat instanceof AST_Exit) {
                        stat.value = cons_seq(make_node(AST_Undefined, stat).transform(compressor));
                    }
                    else if (stat instanceof AST_Switch) {
                        stat.expression = cons_seq(stat.expression);
                    }
                }
                ret.push(stat);
                prev = stat instanceof AST_SimpleStatement ? stat : null;
            });
            return ret;
        };

        function join_consecutive_vars(statements, compressor) {
            var prev = null;
            return statements.reduce(function(a, stat){
                if (stat instanceof AST_Definitions && prev && prev.TYPE == stat.TYPE) {
                    prev.definitions = prev.definitions.concat(stat.definitions);
                    CHANGED = true;
                }
                else if (stat instanceof AST_For
                         && prev instanceof AST_Var
                         && (!stat.init || stat.init.TYPE == prev.TYPE)) {
                    CHANGED = true;
                    a.pop();
                    if (stat.init) {
                        stat.init.definitions = prev.definitions.concat(stat.init.definitions);
                    } else {
                        stat.init = prev;
                    }
                    a.push(stat);
                    prev = stat;
                }
                else {
                    prev = stat;
                    a.push(stat);
                }
                return a;
            }, []);
        };

    };

    function extract_functions_from_statement_array(statements) {
        var funs = [];
        for (var i = statements.length - 1; i >= 0; --i) {
            var stat = statements[i];
            if (stat instanceof AST_Defun) {
                statements.splice(i, 1);
                funs.unshift(stat);
            }
        }
        return funs;
    }

    function extract_declarations_from_unreachable_code(compressor, stat, target) {
        if (!(stat instanceof AST_Defun)) {
            compressor.warn("Dropping unreachable code [{file}:{line},{col}]", stat.start);
        }
        stat.walk(new TreeWalker(function(node){
            if (node instanceof AST_Definitions) {
                compressor.warn("Declarations in unreachable code! [{file}:{line},{col}]", node.start);
                node.remove_initializers();
                target.push(node);
                return true;
            }
            if (node instanceof AST_Defun) {
                target.push(node);
                return true;
            }
            if (node instanceof AST_Scope) {
                return true;
            }
        }));
    };

    function is_undefined(node, compressor) {
        return node.is_undefined
            || node instanceof AST_Undefined
            || node instanceof AST_UnaryPrefix
                && node.operator == "void"
                && !node.expression.has_side_effects(compressor);
    }

    // may_throw_on_access()
    // returns true if this node may be null, undefined or contain `AST_Accessor`
    (function(def) {
        AST_Node.DEFMETHOD("may_throw_on_access", function(compressor) {
            var pure_getters = compressor.option("pure_getters");
            return !pure_getters || this._throw_on_access(pure_getters);
        });

        function is_strict(pure_getters) {
            return /strict/.test(pure_getters);
        }

        def(AST_Node, is_strict);
        def(AST_Null, return_true);
        def(AST_Undefined, return_true);
        def(AST_Constant, return_false);
        def(AST_Array, return_false);
        def(AST_Object, function(pure_getters) {
            if (!is_strict(pure_getters)) return false;
            for (var i = this.properties.length; --i >=0;)
                if (this.properties[i].value instanceof AST_Accessor) return true;
            return false;
        });
        def(AST_Function, return_false);
        def(AST_UnaryPostfix, return_false);
        def(AST_UnaryPrefix, function() {
            return this.operator == "void";
        });
        def(AST_Binary, function(pure_getters) {
            switch (this.operator) {
              case "&&":
                return this.left._throw_on_access(pure_getters);
              case "||":
                return this.left._throw_on_access(pure_getters)
                    && this.right._throw_on_access(pure_getters);
              default:
                return false;
            }
        })
        def(AST_Assign, function(pure_getters) {
            return this.operator == "="
                && this.right._throw_on_access(pure_getters);
        })
        def(AST_Conditional, function(pure_getters) {
            return this.consequent._throw_on_access(pure_getters)
                || this.alternative._throw_on_access(pure_getters);
        })
        def(AST_Seq, function(pure_getters) {
            return this.cdr._throw_on_access(pure_getters);
        });
        def(AST_SymbolRef, function(pure_getters) {
            if (this.is_undefined) return true;
            if (!is_strict(pure_getters)) return false;
            var fixed = this.fixed_value();
            return !fixed || fixed._throw_on_access(pure_getters);
        });
    })(function(node, func) {
        node.DEFMETHOD("_throw_on_access", func);
    });

    /* -----[ boolean/negation helpers ]----- */

    // methods to determine whether an expression has a boolean result type
    (function (def){
        var unary_bool = [ "!", "delete" ];
        var binary_bool = [ "in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">" ];
        def(AST_Node, return_false);
        def(AST_UnaryPrefix, function(){
            return member(this.operator, unary_bool);
        });
        def(AST_Binary, function(){
            return member(this.operator, binary_bool) ||
                ( (this.operator == "&&" || this.operator == "||") &&
                  this.left.is_boolean() && this.right.is_boolean() );
        });
        def(AST_Conditional, function(){
            return this.consequent.is_boolean() && this.alternative.is_boolean();
        });
        def(AST_Assign, function(){
            return this.operator == "=" && this.right.is_boolean();
        });
        def(AST_Seq, function(){
            return this.cdr.is_boolean();
        });
        def(AST_True, return_true);
        def(AST_False, return_true);
    })(function(node, func){
        node.DEFMETHOD("is_boolean", func);
    });

    // methods to determine if an expression has a numeric result type
    (function (def){
        def(AST_Node, return_false);
        def(AST_Number, return_true);
        var unary = makePredicate("+ - ~ ++ --");
        def(AST_Unary, function(){
            return unary(this.operator);
        });
        var binary = makePredicate("- * / % & | ^ << >> >>>");
        def(AST_Binary, function(compressor){
            return binary(this.operator) || this.operator == "+"
                && this.left.is_number(compressor)
                && this.right.is_number(compressor);
        });
        def(AST_Assign, function(compressor){
            return binary(this.operator.slice(0, -1))
                || this.operator == "=" && this.right.is_number(compressor);
        });
        def(AST_Seq, function(compressor){
            return this.cdr.is_number(compressor);
        });
        def(AST_Conditional, function(compressor){
            return this.consequent.is_number(compressor) && this.alternative.is_number(compressor);
        });
    })(function(node, func){
        node.DEFMETHOD("is_number", func);
    });

    // methods to determine if an expression has a string result type
    (function (def){
        def(AST_Node, return_false);
        def(AST_String, return_true);
        def(AST_UnaryPrefix, function(){
            return this.operator == "typeof";
        });
        def(AST_Binary, function(compressor){
            return this.operator == "+" &&
                (this.left.is_string(compressor) || this.right.is_string(compressor));
        });
        def(AST_Assign, function(compressor){
            return (this.operator == "=" || this.operator == "+=") && this.right.is_string(compressor);
        });
        def(AST_Seq, function(compressor){
            return this.cdr.is_string(compressor);
        });
        def(AST_Conditional, function(compressor){
            return this.consequent.is_string(compressor) && this.alternative.is_string(compressor);
        });
    })(function(node, func){
        node.DEFMETHOD("is_string", func);
    });

    var unary_side_effects = makePredicate("delete ++ --");

    function is_lhs(node, parent) {
        if (parent instanceof AST_Unary && unary_side_effects(parent.operator)) return parent.expression;
        if (parent instanceof AST_Assign && parent.left === node) return node;
    }

    (function (def){
        AST_Node.DEFMETHOD("resolve_defines", function(compressor) {
            if (!compressor.option("global_defs")) return;
            var def = this._find_defs(compressor, "");
            if (def) {
                var node, parent = this, level = 0;
                do {
                    node = parent;
                    parent = compressor.parent(level++);
                } while (parent instanceof AST_PropAccess && parent.expression === node);
                if (is_lhs(node, parent)) {
                    compressor.warn('global_defs ' + this.print_to_string() + ' redefined [{file}:{line},{col}]', this.start);
                } else {
                    return def;
                }
            }
        });
        function to_node(value, orig) {
            if (value instanceof AST_Node) return make_node(value.CTOR, orig, value);
            if (Array.isArray(value)) return make_node(AST_Array, orig, {
                elements: value.map(function(value) {
                    return to_node(value, orig);
                })
            });
            if (value && typeof value == "object") {
                var props = [];
                for (var key in value) {
                    props.push(make_node(AST_ObjectKeyVal, orig, {
                        key: key,
                        value: to_node(value[key], orig)
                    }));
                }
                return make_node(AST_Object, orig, {
                    properties: props
                });
            }
            return make_node_from_constant(value, orig);
        }
        def(AST_Node, noop);
        def(AST_Dot, function(compressor, suffix){
            return this.expression._find_defs(compressor, "." + this.property + suffix);
        });
        def(AST_SymbolRef, function(compressor, suffix){
            if (!this.global()) return;
            var name;
            var defines = compressor.option("global_defs");
            if (defines && HOP(defines, (name = this.name + suffix))) {
                var node = to_node(defines[name], this);
                var top = compressor.find_parent(AST_Toplevel);
                node.walk(new TreeWalker(function(node) {
                    if (node instanceof AST_SymbolRef) {
                        node.scope = top;
                        node.thedef = top.def_global(node);
                    }
                }));
                return node;
            }
        });
    })(function(node, func){
        node.DEFMETHOD("_find_defs", func);
    });

    function best_of_expression(ast1, ast2) {
        return ast1.print_to_string().length >
            ast2.print_to_string().length
            ? ast2 : ast1;
    }

    function best_of_statement(ast1, ast2) {
        return best_of_expression(make_node(AST_SimpleStatement, ast1, {
            body: ast1
        }), make_node(AST_SimpleStatement, ast2, {
            body: ast2
        })).body;
    }

    function best_of(compressor, ast1, ast2) {
        return (first_in_statement(compressor) ? best_of_statement : best_of_expression)(ast1, ast2);
    }

    // methods to evaluate a constant expression
    (function (def){
        // If the node has been successfully reduced to a constant,
        // then its value is returned; otherwise the element itself
        // is returned.
        // They can be distinguished as constant value is never a
        // descendant of AST_Node.
        AST_Node.DEFMETHOD("evaluate", function(compressor){
            if (!compressor.option("evaluate")) return this;
            try {
                var val = this._eval(compressor);
                return !val || val instanceof RegExp || typeof val != "object" ? val : this;
            } catch(ex) {
                if (ex !== def) throw ex;
                return this;
            }
        });
        var unaryPrefix = makePredicate("! ~ - + void");
        AST_Node.DEFMETHOD("is_constant", function(){
            // Accomodate when compress option evaluate=false
            // as well as the common constant expressions !0 and -1
            if (this instanceof AST_Constant) {
                return !(this instanceof AST_RegExp);
            } else {
                return this instanceof AST_UnaryPrefix
                    && this.expression instanceof AST_Constant
                    && unaryPrefix(this.operator);
            }
        });
        // Obtain the constant value of an expression already known to be constant.
        // Result only valid iff this.is_constant() is true.
        AST_Node.DEFMETHOD("constant_value", function(compressor){
            // Accomodate when option evaluate=false.
            if (this instanceof AST_Constant && !(this instanceof AST_RegExp)) {
                return this.value;
            }
            // Accomodate the common constant expressions !0 and -1 when option evaluate=false.
            if (this instanceof AST_UnaryPrefix
                && this.expression instanceof AST_Constant) switch (this.operator) {
              case "!":
                return !this.expression.value;
              case "~":
                return ~this.expression.value;
              case "-":
                return -this.expression.value;
              case "+":
                return +this.expression.value;
              default:
                throw new Error(string_template("Cannot evaluate unary expression {value}", {
                    value: this.print_to_string()
                }));
            }
            var result = this.evaluate(compressor);
            if (result !== this) {
                return result;
            }
            throw new Error(string_template("Cannot evaluate constant [{file}:{line},{col}]", this.start));
        });
        def(AST_Statement, function(){
            throw new Error(string_template("Cannot evaluate a statement [{file}:{line},{col}]", this.start));
        });
        def(AST_Lambda, function(){
            throw def;
        });
        function ev(node, compressor) {
            if (!compressor) throw new Error("Compressor must be passed");

            return node._eval(compressor);
        };
        def(AST_Node, function(){
            throw def;          // not constant
        });
        def(AST_Constant, function(){
            return this.getValue();
        });
        def(AST_Array, function(compressor){
            if (compressor.option("unsafe")) {
                return this.elements.map(function(element) {
                    return ev(element, compressor);
                });
            }
            throw def;
        });
        def(AST_Object, function(compressor){
            if (compressor.option("unsafe")) {
                var val = {};
                for (var i = 0, len = this.properties.length; i < len; i++) {
                    var prop = this.properties[i];
                    var key = prop.key;
                    if (key instanceof AST_Symbol) {
                        key = key.name;
                    } else if (key instanceof AST_Node) {
                        key = ev(key, compressor);
                    }
                    if (typeof Object.prototype[key] === 'function') {
                        throw def;
                    }
                    val[key] = ev(prop.value, compressor);
                }
                return val;
            }
            throw def;
        });
        def(AST_UnaryPrefix, function(compressor){
            var e = this.expression;
            switch (this.operator) {
              case "!": return !ev(e, compressor);
              case "typeof":
                // Function would be evaluated to an array and so typeof would
                // incorrectly return 'object'. Hence making is a special case.
                if (e instanceof AST_Function) return typeof function(){};

                e = ev(e, compressor);

                // typeof <RegExp> returns "object" or "function" on different platforms
                // so cannot evaluate reliably
                if (e instanceof RegExp) throw def;

                return typeof e;
              case "void": return void ev(e, compressor);
              case "~": return ~ev(e, compressor);
              case "-": return -ev(e, compressor);
              case "+": return +ev(e, compressor);
            }
            throw def;
        });
        def(AST_Binary, function(c){
            var left = this.left, right = this.right, result;
            switch (this.operator) {
              case "&&"  : result = ev(left, c) &&  ev(right, c); break;
              case "||"  : result = ev(left, c) ||  ev(right, c); break;
              case "|"   : result = ev(left, c) |   ev(right, c); break;
              case "&"   : result = ev(left, c) &   ev(right, c); break;
              case "^"   : result = ev(left, c) ^   ev(right, c); break;
              case "+"   : result = ev(left, c) +   ev(right, c); break;
              case "*"   : result = ev(left, c) *   ev(right, c); break;
              case "/"   : result = ev(left, c) /   ev(right, c); break;
              case "%"   : result = ev(left, c) %   ev(right, c); break;
              case "-"   : result = ev(left, c) -   ev(right, c); break;
              case "<<"  : result = ev(left, c) <<  ev(right, c); break;
              case ">>"  : result = ev(left, c) >>  ev(right, c); break;
              case ">>>" : result = ev(left, c) >>> ev(right, c); break;
              case "=="  : result = ev(left, c) ==  ev(right, c); break;
              case "===" : result = ev(left, c) === ev(right, c); break;
              case "!="  : result = ev(left, c) !=  ev(right, c); break;
              case "!==" : result = ev(left, c) !== ev(right, c); break;
              case "<"   : result = ev(left, c) <   ev(right, c); break;
              case "<="  : result = ev(left, c) <=  ev(right, c); break;
              case ">"   : result = ev(left, c) >   ev(right, c); break;
              case ">="  : result = ev(left, c) >=  ev(right, c); break;
              default:
                  throw def;
            }
            if (isNaN(result) && c.find_parent(AST_With)) {
                // leave original expression as is
                throw def;
            }
            return result;
        });
        def(AST_Conditional, function(compressor){
            return ev(this.condition, compressor)
                ? ev(this.consequent, compressor)
                : ev(this.alternative, compressor);
        });
        def(AST_SymbolRef, function(compressor){
            if (!compressor.option("reduce_vars") || this._evaluating) throw def;
            this._evaluating = true;
            try {
                var fixed = this.fixed_value();
                if (!fixed) throw def;
                var value = ev(fixed, compressor);
                if (!HOP(fixed, "_eval")) fixed._eval = function() {
                    return value;
                };
                if (value && typeof value == "object" && this.definition().escaped) throw def;
                return value;
            } finally {
                this._evaluating = false;
            }
        });
        def(AST_PropAccess, function(compressor){
            if (compressor.option("unsafe")) {
                var key = this.property;
                if (key instanceof AST_Node) {
                    key = ev(key, compressor);
                }
                var val = ev(this.expression, compressor);
                if (val && HOP(val, key)) {
                    return val[key];
                }
            }
            throw def;
        });
    })(function(node, func){
        node.DEFMETHOD("_eval", func);
    });

    // method to negate an expression
    (function(def){
        function basic_negation(exp) {
            return make_node(AST_UnaryPrefix, exp, {
                operator: "!",
                expression: exp
            });
        }
        function best(orig, alt, first_in_statement) {
            var negated = basic_negation(orig);
            if (first_in_statement) {
                var stat = make_node(AST_SimpleStatement, alt, {
                    body: alt
                });
                return best_of_expression(negated, stat) === stat ? alt : negated;
            }
            return best_of_expression(negated, alt);
        }
        def(AST_Node, function(){
            return basic_negation(this);
        });
        def(AST_Statement, function(){
            throw new Error("Cannot negate a statement");
        });
        def(AST_Function, function(){
            return basic_negation(this);
        });
        def(AST_UnaryPrefix, function(){
            if (this.operator == "!")
                return this.expression;
            return basic_negation(this);
        });
        def(AST_Seq, function(compressor){
            var self = this.clone();
            self.cdr = self.cdr.negate(compressor);
            return self;
        });
        def(AST_Conditional, function(compressor, first_in_statement){
            var self = this.clone();
            self.consequent = self.consequent.negate(compressor);
            self.alternative = self.alternative.negate(compressor);
            return best(this, self, first_in_statement);
        });
        def(AST_Binary, function(compressor, first_in_statement){
            var self = this.clone(), op = this.operator;
            if (compressor.option("unsafe_comps")) {
                switch (op) {
                  case "<=" : self.operator = ">"  ; return self;
                  case "<"  : self.operator = ">=" ; return self;
                  case ">=" : self.operator = "<"  ; return self;
                  case ">"  : self.operator = "<=" ; return self;
                }
            }
            switch (op) {
              case "==" : self.operator = "!="; return self;
              case "!=" : self.operator = "=="; return self;
              case "===": self.operator = "!=="; return self;
              case "!==": self.operator = "==="; return self;
              case "&&":
                self.operator = "||";
                self.left = self.left.negate(compressor, first_in_statement);
                self.right = self.right.negate(compressor);
                return best(this, self, first_in_statement);
              case "||":
                self.operator = "&&";
                self.left = self.left.negate(compressor, first_in_statement);
                self.right = self.right.negate(compressor);
                return best(this, self, first_in_statement);
            }
            return basic_negation(this);
        });
    })(function(node, func){
        node.DEFMETHOD("negate", function(compressor, first_in_statement){
            return func.call(this, compressor, first_in_statement);
        });
    });

    AST_Call.DEFMETHOD("has_pure_annotation", function(compressor) {
        if (!compressor.option("side_effects")) return false;
        if (this.pure !== undefined) return this.pure;
        var pure = false;
        var comments, last_comment;
        if (this.start
            && (comments = this.start.comments_before)
            && comments.length
            && /[@#]__PURE__/.test((last_comment = comments[comments.length - 1]).value)) {
            pure = last_comment;
        }
        return this.pure = pure;
    });

    // determine if expression has side effects
    (function(def){
        def(AST_Node, return_true);

        def(AST_EmptyStatement, return_false);
        def(AST_Constant, return_false);
        def(AST_This, return_false);

        def(AST_Call, function(compressor){
            if (!this.has_pure_annotation(compressor) && compressor.pure_funcs(this)) return true;
            for (var i = this.args.length; --i >= 0;) {
                if (this.args[i].has_side_effects(compressor))
                    return true;
            }
            return false;
        });

        function any(list, compressor) {
            for (var i = list.length; --i >= 0;)
                if (list[i].has_side_effects(compressor))
                    return true;
            return false;
        }

        def(AST_Block, function(compressor){
            return any(this.body, compressor);
        });
        def(AST_Switch, function(compressor){
            return this.expression.has_side_effects(compressor)
                || any(this.body, compressor);
        });
        def(AST_Case, function(compressor){
            return this.expression.has_side_effects(compressor)
                || any(this.body, compressor);
        });
        def(AST_Try, function(compressor){
            return any(this.body, compressor)
                || this.bcatch && this.bcatch.has_side_effects(compressor)
                || this.bfinally && this.bfinally.has_side_effects(compressor);
        });
        def(AST_If, function(compressor){
            return this.condition.has_side_effects(compressor)
                || this.body && this.body.has_side_effects(compressor)
                || this.alternative && this.alternative.has_side_effects(compressor);
        });
        def(AST_LabeledStatement, function(compressor){
            return this.body.has_side_effects(compressor);
        });
        def(AST_SimpleStatement, function(compressor){
            return this.body.has_side_effects(compressor);
        });
        def(AST_Defun, return_true);
        def(AST_Function, return_false);
        def(AST_Binary, function(compressor){
            return this.left.has_side_effects(compressor)
                || this.right.has_side_effects(compressor);
        });
        def(AST_Assign, return_true);
        def(AST_Conditional, function(compressor){
            return this.condition.has_side_effects(compressor)
                || this.consequent.has_side_effects(compressor)
                || this.alternative.has_side_effects(compressor);
        });
        def(AST_Unary, function(compressor){
            return unary_side_effects(this.operator)
                || this.expression.has_side_effects(compressor);
        });
        def(AST_SymbolRef, function(compressor){
            return this.undeclared();
        });
        def(AST_Object, function(compressor){
            return any(this.properties, compressor);
        });
        def(AST_ObjectProperty, function(compressor){
            return this.value.has_side_effects(compressor);
        });
        def(AST_Array, function(compressor){
            return any(this.elements, compressor);
        });
        def(AST_Dot, function(compressor){
            return this.expression.may_throw_on_access(compressor)
                || this.expression.has_side_effects(compressor);
        });
        def(AST_Sub, function(compressor){
            return this.expression.may_throw_on_access(compressor)
                || this.expression.has_side_effects(compressor)
                || this.property.has_side_effects(compressor);
        });
        def(AST_Seq, function(compressor){
            return this.car.has_side_effects(compressor)
                || this.cdr.has_side_effects(compressor);
        });
    })(function(node, func){
        node.DEFMETHOD("has_side_effects", func);
    });

    // tell me if a statement aborts
    function aborts(thing) {
        return thing && thing.aborts();
    };
    (function(def){
        def(AST_Statement, return_null);
        def(AST_Jump, return_this);
        function block_aborts(){
            var n = this.body.length;
            return n > 0 && aborts(this.body[n - 1]);
        };
        def(AST_BlockStatement, block_aborts);
        def(AST_SwitchBranch, block_aborts);
        def(AST_If, function(){
            return this.alternative && aborts(this.body) && aborts(this.alternative) && this;
        });
    })(function(node, func){
        node.DEFMETHOD("aborts", func);
    });

    /* -----[ optimizers ]----- */

    OPT(AST_Directive, function(self, compressor){
        if (compressor.has_directive(self.value) !== self) {
            return make_node(AST_EmptyStatement, self);
        }
        return self;
    });

    OPT(AST_Debugger, function(self, compressor){
        if (compressor.option("drop_debugger"))
            return make_node(AST_EmptyStatement, self);
        return self;
    });

    OPT(AST_LabeledStatement, function(self, compressor){
        if (self.body instanceof AST_Break
            && compressor.loopcontrol_target(self.body) === self.body) {
            return make_node(AST_EmptyStatement, self);
        }
        return self.label.references.length == 0 ? self.body : self;
    });

    OPT(AST_Block, function(self, compressor){
        self.body = tighten_body(self.body, compressor);
        return self;
    });

    OPT(AST_BlockStatement, function(self, compressor){
        self.body = tighten_body(self.body, compressor);
        switch (self.body.length) {
          case 1: return self.body[0];
          case 0: return make_node(AST_EmptyStatement, self);
        }
        return self;
    });

    AST_Scope.DEFMETHOD("drop_unused", function(compressor){
        var self = this;
        if (compressor.has_directive("use asm")) return self;
        var toplevel = compressor.option("toplevel");
        if (compressor.option("unused")
            && (!(self instanceof AST_Toplevel) || toplevel)
            && !self.uses_eval
            && !self.uses_with) {
            var assign_as_unused = !/keep_assign/.test(compressor.option("unused"));
            var drop_funcs = /funcs/.test(toplevel);
            var drop_vars = /vars/.test(toplevel);
            if (!(self instanceof AST_Toplevel) || toplevel == true) {
                drop_funcs = drop_vars = true;
            }
            var in_use = [];
            var in_use_ids = Object.create(null); // avoid expensive linear scans of in_use
            if (self instanceof AST_Toplevel && compressor.top_retain) {
                self.variables.each(function(def) {
                    if (compressor.top_retain(def) && !(def.id in in_use_ids)) {
                        in_use_ids[def.id] = true;
                        in_use.push(def);
                    }
                });
            }
            var initializations = new Dictionary();
            // pass 1: find out which symbols are directly used in
            // this scope (not in nested scopes).
            var scope = this;
            var tw = new TreeWalker(function(node, descend){
                if (node !== self) {
                    if (node instanceof AST_Defun) {
                        if (!drop_funcs && scope === self) {
                            var node_def = node.name.definition();
                            if (!(node_def.id in in_use_ids)) {
                                in_use_ids[node_def.id] = true;
                                in_use.push(node_def);
                            }
                        }
                        initializations.add(node.name.name, node);
                        return true; // don't go in nested scopes
                    }
                    if (node instanceof AST_Definitions && scope === self) {
                        node.definitions.forEach(function(def){
                            if (!drop_vars) {
                                var node_def = def.name.definition();
                                if (!(node_def.id in in_use_ids)) {
                                    in_use_ids[node_def.id] = true;
                                    in_use.push(node_def);
                                }
                            }
                            if (def.value) {
                                initializations.add(def.name.name, def.value);
                                if (def.value.has_side_effects(compressor)) {
                                    def.value.walk(tw);
                                }
                            }
                        });
                        return true;
                    }
                    if (assign_as_unused
                        && node instanceof AST_Assign
                        && node.operator == "="
                        && node.left instanceof AST_SymbolRef
                        && !is_reference_const(node.left)
                        && scope === self) {
                        node.right.walk(tw);
                        return true;
                    }
                    if (node instanceof AST_SymbolRef) {
                        var node_def = node.definition();
                        if (!(node_def.id in in_use_ids)) {
                            in_use_ids[node_def.id] = true;
                            in_use.push(node_def);
                        }
                        return true;
                    }
                    if (node instanceof AST_Scope) {
                        var save_scope = scope;
                        scope = node;
                        descend();
                        scope = save_scope;
                        return true;
                    }
                }
            });
            self.walk(tw);
            // pass 2: for every used symbol we need to walk its
            // initialization code to figure out if it uses other
            // symbols (that may not be in_use).
            for (var i = 0; i < in_use.length; ++i) {
                in_use[i].orig.forEach(function(decl){
                    // undeclared globals will be instanceof AST_SymbolRef
                    var init = initializations.get(decl.name);
                    if (init) init.forEach(function(init){
                        var tw = new TreeWalker(function(node){
                            if (node instanceof AST_SymbolRef) {
                                var node_def = node.definition();
                                if (!(node_def.id in in_use_ids)) {
                                    in_use_ids[node_def.id] = true;
                                    in_use.push(node_def);
                                }
                            }
                        });
                        init.walk(tw);
                    });
                });
            }
            // pass 3: we should drop declarations not in_use
            var tt = new TreeTransformer(
                function before(node, descend, in_list) {
                    if (node instanceof AST_Function
                        && node.name
                        && !compressor.option("keep_fnames")) {
                        var def = node.name.definition();
                        // any declarations with same name will overshadow
                        // name of this anonymous function and can therefore
                        // never be used anywhere
                        if (!(def.id in in_use_ids) || def.orig.length > 1)
                            node.name = null;
                    }
                    if (node instanceof AST_Lambda && !(node instanceof AST_Accessor)) {
                        var trim = !compressor.option("keep_fargs");
                        for (var a = node.argnames, i = a.length; --i >= 0;) {
                            var sym = a[i];
                            if (!(sym.definition().id in in_use_ids)) {
                                sym.__unused = true;
                                if (trim) {
                                    a.pop();
                                    compressor[sym.unreferenced() ? "warn" : "info"]("Dropping unused function argument {name} [{file}:{line},{col}]", {
                                        name : sym.name,
                                        file : sym.start.file,
                                        line : sym.start.line,
                                        col  : sym.start.col
                                    });
                                }
                            }
                            else {
                                trim = false;
                            }
                        }
                    }
                    if (drop_funcs && node instanceof AST_Defun && node !== self) {
                        if (!(node.name.definition().id in in_use_ids)) {
                            compressor[node.name.unreferenced() ? "warn" : "info"]("Dropping unused function {name} [{file}:{line},{col}]", {
                                name : node.name.name,
                                file : node.name.start.file,
                                line : node.name.start.line,
                                col  : node.name.start.col
                            });
                            return make_node(AST_EmptyStatement, node);
                        }
                        return node;
                    }
                    if (drop_vars && node instanceof AST_Definitions && !(tt.parent() instanceof AST_ForIn && tt.parent().init === node)) {
                        var def = node.definitions.filter(function(def){
                            if (def.value) def.value = def.value.transform(tt);
                            var sym = def.name.definition();
                            if (sym.id in in_use_ids) return true;
                            if (sym.orig[0] instanceof AST_SymbolCatch) {
                                def.value = def.value && def.value.drop_side_effect_free(compressor);
                                return true;
                            }
                            var w = {
                                name : def.name.name,
                                file : def.name.start.file,
                                line : def.name.start.line,
                                col  : def.name.start.col
                            };
                            if (def.value && (def._unused_side_effects = def.value.drop_side_effect_free(compressor))) {
                                compressor.warn("Side effects in initialization of unused variable {name} [{file}:{line},{col}]", w);
                                return true;
                            }
                            compressor[def.name.unreferenced() ? "warn" : "info"]("Dropping unused variable {name} [{file}:{line},{col}]", w);
                            return false;
                        });
                        // place uninitialized names at the start
                        def = mergeSort(def, function(a, b){
                            if (!a.value && b.value) return -1;
                            if (!b.value && a.value) return 1;
                            return 0;
                        });
                        // for unused names whose initialization has
                        // side effects, we can cascade the init. code
                        // into the next one, or next statement.
                        var side_effects = [];
                        for (var i = 0; i < def.length;) {
                            var x = def[i];
                            if (x._unused_side_effects) {
                                side_effects.push(x._unused_side_effects);
                                def.splice(i, 1);
                            } else {
                                if (side_effects.length > 0) {
                                    side_effects.push(x.value);
                                    x.value = AST_Seq.from_array(side_effects);
                                    side_effects = [];
                                }
                                ++i;
                            }
                        }
                        if (side_effects.length > 0) {
                            side_effects = make_node(AST_BlockStatement, node, {
                                body: [ make_node(AST_SimpleStatement, node, {
                                    body: AST_Seq.from_array(side_effects)
                                }) ]
                            });
                        } else {
                            side_effects = null;
                        }
                        if (def.length == 0 && !side_effects) {
                            return make_node(AST_EmptyStatement, node);
                        }
                        if (def.length == 0) {
                            return in_list ? MAP.splice(side_effects.body) : side_effects;
                        }
                        node.definitions = def;
                        if (side_effects) {
                            side_effects.body.unshift(node);
                            return in_list ? MAP.splice(side_effects.body) : side_effects;
                        }
                        return node;
                    }
                    if (drop_vars && assign_as_unused
                        && node instanceof AST_Assign
                        && node.operator == "="
                        && node.left instanceof AST_SymbolRef) {
                        var def = node.left.definition();
                        if (!(def.id in in_use_ids)
                            && self.variables.get(def.name) === def) {
                            return maintain_this_binding(tt.parent(), node, node.right.transform(tt));
                        }
                    }
                    // certain combination of unused name + side effect leads to:
                    //    https://github.com/mishoo/UglifyJS2/issues/44
                    //    https://github.com/mishoo/UglifyJS2/issues/1830
                    // that's an invalid AST.
                    // We fix it at this stage by moving the `var` outside the `for`.
                    if (node instanceof AST_For) {
                        descend(node, this);
                        if (node.init instanceof AST_BlockStatement) {
                            var block = node.init;
                            node.init = block.body.pop();
                            block.body.push(node);
                            return in_list ? MAP.splice(block.body) : block;
                        } else if (is_empty(node.init)) {
                            node.init = null;
                        }
                        return node;
                    }
                    if (node instanceof AST_LabeledStatement && node.body instanceof AST_For) {
                        descend(node, this);
                        if (node.body instanceof AST_BlockStatement) {
                            var block = node.body;
                            node.body = block.body.pop();
                            block.body.push(node);
                            return in_list ? MAP.splice(block.body) : block;
                        }
                        return node;
                    }
                    if (node instanceof AST_Scope && node !== self)
                        return node;
                }
            );
            self.transform(tt);
        }
    });

    AST_Scope.DEFMETHOD("hoist_declarations", function(compressor){
        var self = this;
        if (compressor.has_directive("use asm")) return self;
        var hoist_funs = compressor.option("hoist_funs");
        var hoist_vars = compressor.option("hoist_vars");
        if (hoist_funs || hoist_vars) {
            var dirs = [];
            var hoisted = [];
            var vars = new Dictionary(), vars_found = 0, var_decl = 0;
            // let's count var_decl first, we seem to waste a lot of
            // space if we hoist `var` when there's only one.
            self.walk(new TreeWalker(function(node){
                if (node instanceof AST_Scope && node !== self)
                    return true;
                if (node instanceof AST_Var) {
                    ++var_decl;
                    return true;
                }
            }));
            hoist_vars = hoist_vars && var_decl > 1;
            var tt = new TreeTransformer(
                function before(node) {
                    if (node !== self) {
                        if (node instanceof AST_Directive) {
                            dirs.push(node);
                            return make_node(AST_EmptyStatement, node);
                        }
                        if (node instanceof AST_Defun && hoist_funs) {
                            hoisted.push(node);
                            return make_node(AST_EmptyStatement, node);
                        }
                        if (node instanceof AST_Var && hoist_vars) {
                            node.definitions.forEach(function(def){
                                vars.set(def.name.name, def);
                                ++vars_found;
                            });
                            var seq = node.to_assignments(compressor);
                            var p = tt.parent();
                            if (p instanceof AST_ForIn && p.init === node) {
                                if (seq == null) {
                                    var def = node.definitions[0].name;
                                    return make_node(AST_SymbolRef, def, def);
                                }
                                return seq;
                            }
                            if (p instanceof AST_For && p.init === node) {
                                return seq;
                            }
                            if (!seq) return make_node(AST_EmptyStatement, node);
                            return make_node(AST_SimpleStatement, node, {
                                body: seq
                            });
                        }
                        if (node instanceof AST_Scope)
                            return node; // to avoid descending in nested scopes
                    }
                }
            );
            self = self.transform(tt);
            if (vars_found > 0) {
                // collect only vars which don't show up in self's arguments list
                var defs = [];
                vars.each(function(def, name){
                    if (self instanceof AST_Lambda
                        && find_if(function(x){ return x.name == def.name.name },
                                   self.argnames)) {
                        vars.del(name);
                    } else {
                        def = def.clone();
                        def.value = null;
                        defs.push(def);
                        vars.set(name, def);
                    }
                });
                if (defs.length > 0) {
                    // try to merge in assignments
                    for (var i = 0; i < self.body.length;) {
                        if (self.body[i] instanceof AST_SimpleStatement) {
                            var expr = self.body[i].body, sym, assign;
                            if (expr instanceof AST_Assign
                                && expr.operator == "="
                                && (sym = expr.left) instanceof AST_Symbol
                                && vars.has(sym.name))
                            {
                                var def = vars.get(sym.name);
                                if (def.value) break;
                                def.value = expr.right;
                                remove(defs, def);
                                defs.push(def);
                                self.body.splice(i, 1);
                                continue;
                            }
                            if (expr instanceof AST_Seq
                                && (assign = expr.car) instanceof AST_Assign
                                && assign.operator == "="
                                && (sym = assign.left) instanceof AST_Symbol
                                && vars.has(sym.name))
                            {
                                var def = vars.get(sym.name);
                                if (def.value) break;
                                def.value = assign.right;
                                remove(defs, def);
                                defs.push(def);
                                self.body[i].body = expr.cdr;
                                continue;
                            }
                        }
                        if (self.body[i] instanceof AST_EmptyStatement) {
                            self.body.splice(i, 1);
                            continue;
                        }
                        if (self.body[i] instanceof AST_BlockStatement) {
                            var tmp = [ i, 1 ].concat(self.body[i].body);
                            self.body.splice.apply(self.body, tmp);
                            continue;
                        }
                        break;
                    }
                    defs = make_node(AST_Var, self, {
                        definitions: defs
                    });
                    hoisted.push(defs);
                };
            }
            self.body = dirs.concat(hoisted, self.body);
        }
        return self;
    });

    // drop_side_effect_free()
    // remove side-effect-free parts which only affects return value
    (function(def){
        // Drop side-effect-free elements from an array of expressions.
        // Returns an array of expressions with side-effects or null
        // if all elements were dropped. Note: original array may be
        // returned if nothing changed.
        function trim(nodes, compressor, first_in_statement) {
            var ret = [], changed = false;
            for (var i = 0, len = nodes.length; i < len; i++) {
                var node = nodes[i].drop_side_effect_free(compressor, first_in_statement);
                changed |= node !== nodes[i];
                if (node) {
                    ret.push(node);
                    first_in_statement = false;
                }
            }
            return changed ? ret.length ? ret : null : nodes;
        }

        def(AST_Node, return_this);
        def(AST_Constant, return_null);
        def(AST_This, return_null);
        def(AST_Call, function(compressor, first_in_statement){
            if (!this.has_pure_annotation(compressor) && compressor.pure_funcs(this)) {
                if (this.expression instanceof AST_Function
                    && (!this.expression.name || !this.expression.name.definition().references.length)) {
                    var node = this.clone();
                    node.expression = node.expression.process_expression(false, compressor);
                    return node;
                }
                return this;
            }
            if (this.pure) {
                compressor.warn("Dropping __PURE__ call [{file}:{line},{col}]", this.start);
                this.pure.value = this.pure.value.replace(/[@#]__PURE__/g, ' ');
            }
            var args = trim(this.args, compressor, first_in_statement);
            return args && AST_Seq.from_array(args);
        });
        def(AST_Accessor, return_null);
        def(AST_Function, return_null);
        def(AST_Binary, function(compressor, first_in_statement){
            var right = this.right.drop_side_effect_free(compressor);
            if (!right) return this.left.drop_side_effect_free(compressor, first_in_statement);
            switch (this.operator) {
              case "&&":
              case "||":
                if (right === this.right) return this;
                var node = this.clone();
                node.right = right;
                return node;
              default:
                var left = this.left.drop_side_effect_free(compressor, first_in_statement);
                if (!left) return this.right.drop_side_effect_free(compressor, first_in_statement);
                return make_node(AST_Seq, this, {
                    car: left,
                    cdr: right
                });
            }
        });
        def(AST_Assign, return_this);
        def(AST_Conditional, function(compressor){
            var consequent = this.consequent.drop_side_effect_free(compressor);
            var alternative = this.alternative.drop_side_effect_free(compressor);
            if (consequent === this.consequent && alternative === this.alternative) return this;
            if (!consequent) return alternative ? make_node(AST_Binary, this, {
                operator: "||",
                left: this.condition,
                right: alternative
            }) : this.condition.drop_side_effect_free(compressor);
            if (!alternative) return make_node(AST_Binary, this, {
                operator: "&&",
                left: this.condition,
                right: consequent
            });
            var node = this.clone();
            node.consequent = consequent;
            node.alternative = alternative;
            return node;
        });
        def(AST_Unary, function(compressor, first_in_statement){
            if (unary_side_effects(this.operator)) return this;
            if (this.operator == "typeof" && this.expression instanceof AST_SymbolRef) return null;
            var expression = this.expression.drop_side_effect_free(compressor, first_in_statement);
            if (first_in_statement
                && this instanceof AST_UnaryPrefix
                && is_iife_call(expression)) {
                if (expression === this.expression && this.operator.length === 1) return this;
                return make_node(AST_UnaryPrefix, this, {
                    operator: this.operator.length === 1 ? this.operator : "!",
                    expression: expression
                });
            }
            return expression;
        });
        def(AST_SymbolRef, function() {
            return this.undeclared() ? this : null;
        });
        def(AST_Object, function(compressor, first_in_statement){
            var values = trim(this.properties, compressor, first_in_statement);
            return values && AST_Seq.from_array(values);
        });
        def(AST_ObjectProperty, function(compressor, first_in_statement){
            return this.value.drop_side_effect_free(compressor, first_in_statement);
        });
        def(AST_Array, function(compressor, first_in_statement){
            var values = trim(this.elements, compressor, first_in_statement);
            return values && AST_Seq.from_array(values);
        });
        def(AST_Dot, function(compressor, first_in_statement){
            if (this.expression.may_throw_on_access(compressor)) return this;
            return this.expression.drop_side_effect_free(compressor, first_in_statement);
        });
        def(AST_Sub, function(compressor, first_in_statement){
            if (this.expression.may_throw_on_access(compressor)) return this;
            var expression = this.expression.drop_side_effect_free(compressor, first_in_statement);
            if (!expression) return this.property.drop_side_effect_free(compressor, first_in_statement);
            var property = this.property.drop_side_effect_free(compressor);
            if (!property) return expression;
            return make_node(AST_Seq, this, {
                car: expression,
                cdr: property
            });
        });
        def(AST_Seq, function(compressor){
            var cdr = this.cdr.drop_side_effect_free(compressor);
            if (cdr === this.cdr) return this;
            if (!cdr) return this.car;
            return make_node(AST_Seq, this, {
                car: this.car,
                cdr: cdr
            });
        });
    })(function(node, func){
        node.DEFMETHOD("drop_side_effect_free", func);
    });

    OPT(AST_SimpleStatement, function(self, compressor){
        if (compressor.option("side_effects")) {
            var body = self.body;
            var node = body.drop_side_effect_free(compressor, true);
            if (!node) {
                compressor.warn("Dropping side-effect-free statement [{file}:{line},{col}]", self.start);
                return make_node(AST_EmptyStatement, self);
            }
            if (node !== body) {
                return make_node(AST_SimpleStatement, self, { body: node });
            }
        }
        return self;
    });

    OPT(AST_DWLoop, function(self, compressor){
        if (!compressor.option("loops")) return self;
        var cond = self.condition.evaluate(compressor);
        if (cond !== self.condition) {
            if (cond) {
                return make_node(AST_For, self, {
                    body: self.body
                });
            }
            if (compressor.option("dead_code") && self instanceof AST_While) {
                var a = [];
                extract_declarations_from_unreachable_code(compressor, self.body, a);
                return make_node(AST_BlockStatement, self, { body: a }).optimize(compressor);
            }
            if (self instanceof AST_Do) {
                var has_loop_control = false;
                var tw = new TreeWalker(function(node) {
                    if (node instanceof AST_Scope || has_loop_control) return true;
                    if (node instanceof AST_LoopControl && tw.loopcontrol_target(node) === self)
                        return has_loop_control = true;
                });
                var parent = compressor.parent();
                (parent instanceof AST_LabeledStatement ? parent : self).walk(tw);
                if (!has_loop_control) return self.body;
            }
        }
        if (self instanceof AST_While) {
            return make_node(AST_For, self, self).optimize(compressor);
        }
        return self;
    });

    function if_break_in_loop(self, compressor) {
        function drop_it(rest) {
            rest = as_statement_array(rest);
            if (self.body instanceof AST_BlockStatement) {
                self.body = self.body.clone();
                self.body.body = rest.concat(self.body.body.slice(1));
                self.body = self.body.transform(compressor);
            } else {
                self.body = make_node(AST_BlockStatement, self.body, {
                    body: rest
                }).transform(compressor);
            }
            if_break_in_loop(self, compressor);
        }
        var first = self.body instanceof AST_BlockStatement ? self.body.body[0] : self.body;
        if (first instanceof AST_If) {
            if (first.body instanceof AST_Break
                && compressor.loopcontrol_target(first.body) === compressor.self()) {
                if (self.condition) {
                    self.condition = make_node(AST_Binary, self.condition, {
                        left: self.condition,
                        operator: "&&",
                        right: first.condition.negate(compressor),
                    });
                } else {
                    self.condition = first.condition.negate(compressor);
                }
                drop_it(first.alternative);
            }
            else if (first.alternative instanceof AST_Break
                     && compressor.loopcontrol_target(first.alternative) === compressor.self()) {
                if (self.condition) {
                    self.condition = make_node(AST_Binary, self.condition, {
                        left: self.condition,
                        operator: "&&",
                        right: first.condition,
                    });
                } else {
                    self.condition = first.condition;
                }
                drop_it(first.body);
            }
        }
    };

    OPT(AST_For, function(self, compressor){
        if (!compressor.option("loops")) return self;
        if (self.condition) {
            var cond = self.condition.evaluate(compressor);
            if (compressor.option("dead_code") && !cond) {
                var a = [];
                if (self.init instanceof AST_Statement) {
                    a.push(self.init);
                }
                else if (self.init) {
                    a.push(make_node(AST_SimpleStatement, self.init, {
                        body: self.init
                    }));
                }
                extract_declarations_from_unreachable_code(compressor, self.body, a);
                return make_node(AST_BlockStatement, self, { body: a }).optimize(compressor);
            }
            if (cond !== self.condition) {
                cond = make_node_from_constant(cond, self.condition).transform(compressor);
                self.condition = best_of_expression(cond, self.condition);
            }
        }
        if_break_in_loop(self, compressor);
        return self;
    });

    OPT(AST_If, function(self, compressor){
        if (is_empty(self.alternative)) self.alternative = null;

        if (!compressor.option("conditionals")) return self;
        // if condition can be statically determined, warn and drop
        // one of the blocks.  note, statically determined implies
        // “has no side effects”; also it doesn't work for cases like
        // `x && true`, though it probably should.
        var cond = self.condition.evaluate(compressor);
        if (cond !== self.condition) {
            if (cond) {
                compressor.warn("Condition always true [{file}:{line},{col}]", self.condition.start);
                if (compressor.option("dead_code")) {
                    var a = [];
                    if (self.alternative) {
                        extract_declarations_from_unreachable_code(compressor, self.alternative, a);
                    }
                    a.push(self.body);
                    return make_node(AST_BlockStatement, self, { body: a }).optimize(compressor);
                }
            } else {
                compressor.warn("Condition always false [{file}:{line},{col}]", self.condition.start);
                if (compressor.option("dead_code")) {
                    var a = [];
                    extract_declarations_from_unreachable_code(compressor, self.body, a);
                    if (self.alternative) a.push(self.alternative);
                    return make_node(AST_BlockStatement, self, { body: a }).optimize(compressor);
                }
            }
            cond = make_node_from_constant(cond, self.condition).transform(compressor);
            self.condition = best_of_expression(cond, self.condition);
        }
        var negated = self.condition.negate(compressor);
        var self_condition_length = self.condition.print_to_string().length;
        var negated_length = negated.print_to_string().length;
        var negated_is_best = negated_length < self_condition_length;
        if (self.alternative && negated_is_best) {
            negated_is_best = false; // because we already do the switch here.
            // no need to swap values of self_condition_length and negated_length
            // here because they are only used in an equality comparison later on.
            self.condition = negated;
            var tmp = self.body;
            self.body = self.alternative || make_node(AST_EmptyStatement, self);
            self.alternative = tmp;
        }
        if (is_empty(self.body) && is_empty(self.alternative)) {
            return make_node(AST_SimpleStatement, self.condition, {
                body: self.condition.clone()
            }).optimize(compressor);
        }
        if (self.body instanceof AST_SimpleStatement
            && self.alternative instanceof AST_SimpleStatement) {
            return make_node(AST_SimpleStatement, self, {
                body: make_node(AST_Conditional, self, {
                    condition   : self.condition,
                    consequent  : self.body.body,
                    alternative : self.alternative.body
                })
            }).optimize(compressor);
        }
        if (is_empty(self.alternative) && self.body instanceof AST_SimpleStatement) {
            if (self_condition_length === negated_length && !negated_is_best
                && self.condition instanceof AST_Binary && self.condition.operator == "||") {
                // although the code length of self.condition and negated are the same,
                // negated does not require additional surrounding parentheses.
                // see https://github.com/mishoo/UglifyJS2/issues/979
                negated_is_best = true;
            }
            if (negated_is_best) return make_node(AST_SimpleStatement, self, {
                body: make_node(AST_Binary, self, {
                    operator : "||",
                    left     : negated,
                    right    : self.body.body
                })
            }).optimize(compressor);
            return make_node(AST_SimpleStatement, self, {
                body: make_node(AST_Binary, self, {
                    operator : "&&",
                    left     : self.condition,
                    right    : self.body.body
                })
            }).optimize(compressor);
        }
        if (self.body instanceof AST_EmptyStatement
            && self.alternative instanceof AST_SimpleStatement) {
            return make_node(AST_SimpleStatement, self, {
                body: make_node(AST_Binary, self, {
                    operator : "||",
                    left     : self.condition,
                    right    : self.alternative.body
                })
            }).optimize(compressor);
        }
        if (self.body instanceof AST_Exit
            && self.alternative instanceof AST_Exit
            && self.body.TYPE == self.alternative.TYPE) {
            return make_node(self.body.CTOR, self, {
                value: make_node(AST_Conditional, self, {
                    condition   : self.condition,
                    consequent  : self.body.value || make_node(AST_Undefined, self.body),
                    alternative : self.alternative.value || make_node(AST_Undefined, self.alternative)
                }).transform(compressor)
            }).optimize(compressor);
        }
        if (self.body instanceof AST_If
            && !self.body.alternative
            && !self.alternative) {
            self = make_node(AST_If, self, {
                condition: make_node(AST_Binary, self.condition, {
                    operator: "&&",
                    left: self.condition,
                    right: self.body.condition
                }),
                body: self.body.body,
                alternative: null
            });
        }
        if (aborts(self.body)) {
            if (self.alternative) {
                var alt = self.alternative;
                self.alternative = null;
                return make_node(AST_BlockStatement, self, {
                    body: [ self, alt ]
                }).optimize(compressor);
            }
        }
        if (aborts(self.alternative)) {
            var body = self.body;
            self.body = self.alternative;
            self.condition = negated_is_best ? negated : self.condition.negate(compressor);
            self.alternative = null;
            return make_node(AST_BlockStatement, self, {
                body: [ self, body ]
            }).optimize(compressor);
        }
        return self;
    });

    OPT(AST_Switch, function(self, compressor){
        if (!compressor.option("switches")) return self;
        var branch;
        var value = self.expression.evaluate(compressor);
        if (value !== self.expression) {
            var expression = make_node_from_constant(value, self.expression).transform(compressor);
            self.expression = best_of_expression(expression, self.expression);
        }
        if (!compressor.option("dead_code")) return self;
        var decl = [];
        var body = [];
        var default_branch;
        var exact_match;
        for (var i = 0, len = self.body.length; i < len && !exact_match; i++) {
            branch = self.body[i];
            if (branch instanceof AST_Default) {
                if (!default_branch) {
                    default_branch = branch;
                } else {
                    eliminate_branch(branch, body[body.length - 1]);
                }
            } else if (value !== self.expression) {
                var exp = branch.expression.evaluate(compressor);
                if (exp === value) {
                    exact_match = branch;
                    if (default_branch) {
                        var default_index = body.indexOf(default_branch);
                        body.splice(default_index, 1);
                        eliminate_branch(default_branch, body[default_index - 1]);
                        default_branch = null;
                    }
                } else if (exp !== branch.expression) {
                    eliminate_branch(branch, body[body.length - 1]);
                    continue;
                }
            }
            if (aborts(branch)) {
                var prev = body[body.length - 1];
                if (aborts(prev) && prev.body.length == branch.body.length
                    && make_node(AST_BlockStatement, prev, prev).equivalent_to(make_node(AST_BlockStatement, branch, branch))) {
                    prev.body = [];
                }
            }
            body.push(branch);
        }
        while (i < len) eliminate_branch(self.body[i++], body[body.length - 1]);
        if (body.length > 0) {
            body[0].body = decl.concat(body[0].body);
        }
        self.body = body;
        while (branch = body[body.length - 1]) {
            var stat = branch.body[branch.body.length - 1];
            if (stat instanceof AST_Break && compressor.loopcontrol_target(stat) === self)
                branch.body.pop();
            if (branch.body.length || branch instanceof AST_Case
                && (default_branch || branch.expression.has_side_effects(compressor))) break;
            if (body.pop() === default_branch) default_branch = null;
        }
        if (body.length == 0) {
            return make_node(AST_BlockStatement, self, {
                body: decl.concat(make_node(AST_SimpleStatement, self.expression, {
                    body: self.expression
                }))
            }).optimize(compressor);
        }
        if (body.length == 1 && (body[0] === exact_match || body[0] === default_branch)) {
            var has_break = false;
            var tw = new TreeWalker(function(node) {
                if (has_break
                    || node instanceof AST_Lambda
                    || node instanceof AST_SimpleStatement) return true;
                if (node instanceof AST_Break && tw.loopcontrol_target(node) === self)
                    has_break = true;
            });
            self.walk(tw);
            if (!has_break) {
                body = body[0].body.slice();
                body.unshift(make_node(AST_SimpleStatement, self.expression, {
                    body: self.expression
                }));
                return make_node(AST_BlockStatement, self, {
                    body: body
                }).optimize(compressor);
            }
        }
        return self;

        function eliminate_branch(branch, prev) {
            if (prev && !aborts(prev)) {
                prev.body = prev.body.concat(branch.body);
            } else {
                extract_declarations_from_unreachable_code(compressor, branch, decl);
            }
        }
    });

    OPT(AST_Try, function(self, compressor){
        self.body = tighten_body(self.body, compressor);
        if (self.bcatch && self.bfinally && all(self.bfinally.body, is_empty)) self.bfinally = null;
        if (all(self.body, is_empty)) {
            var body = [];
            if (self.bcatch) extract_declarations_from_unreachable_code(compressor, self.bcatch, body);
            if (self.bfinally) body = body.concat(self.bfinally.body);
            return make_node(AST_BlockStatement, self, {
                body: body
            }).optimize(compressor);
        }
        return self;
    });

    AST_Definitions.DEFMETHOD("remove_initializers", function(){
        this.definitions.forEach(function(def){ def.value = null });
    });

    AST_Definitions.DEFMETHOD("to_assignments", function(compressor){
        var reduce_vars = compressor.option("reduce_vars");
        var assignments = this.definitions.reduce(function(a, def){
            if (def.value) {
                var name = make_node(AST_SymbolRef, def.name, def.name);
                a.push(make_node(AST_Assign, def, {
                    operator : "=",
                    left     : name,
                    right    : def.value
                }));
                if (reduce_vars) name.definition().fixed = false;
            }
            return a;
        }, []);
        if (assignments.length == 0) return null;
        return AST_Seq.from_array(assignments);
    });

    OPT(AST_Definitions, function(self, compressor){
        if (self.definitions.length == 0)
            return make_node(AST_EmptyStatement, self);
        return self;
    });

    OPT(AST_Call, function(self, compressor){
        var exp = self.expression;
        if (compressor.option("reduce_vars")
            && exp instanceof AST_SymbolRef) {
            var def = exp.definition();
            var fixed = exp.fixed_value();
            if (fixed instanceof AST_Defun) {
                def.fixed = fixed = make_node(AST_Function, fixed, fixed).clone(true);
            }
            if (fixed instanceof AST_Function) {
                exp = fixed;
                if (compressor.option("unused")
                    && def.references.length == 1
                    && !(def.scope.uses_arguments
                        && def.orig[0] instanceof AST_SymbolFunarg)
                    && !def.scope.uses_eval
                    && compressor.find_parent(AST_Scope) === def.scope) {
                    self.expression = exp;
                }
            }
        }
        if (compressor.option("unused")
            && exp instanceof AST_Function
            && !exp.uses_arguments
            && !exp.uses_eval) {
            var pos = 0, last = 0;
            for (var i = 0, len = self.args.length; i < len; i++) {
                var trim = i >= exp.argnames.length;
                if (trim || exp.argnames[i].__unused) {
                    var node = self.args[i].drop_side_effect_free(compressor);
                    if (node) {
                        self.args[pos++] = node;
                    } else if (!trim) {
                        self.args[pos++] = make_node(AST_Number, self.args[i], {
                            value: 0
                        });
                        continue;
                    }
                } else {
                    self.args[pos++] = self.args[i];
                }
                last = pos;
            }
            self.args.length = last;
        }
        if (compressor.option("unsafe")) {
            if (exp instanceof AST_SymbolRef && exp.undeclared()) {
                switch (exp.name) {
                  case "Array":
                    if (self.args.length != 1) {
                        return make_node(AST_Array, self, {
                            elements: self.args
                        }).optimize(compressor);
                    }
                    break;
                  case "Object":
                    if (self.args.length == 0) {
                        return make_node(AST_Object, self, {
                            properties: []
                        });
                    }
                    break;
                  case "String":
                    if (self.args.length == 0) return make_node(AST_String, self, {
                        value: ""
                    });
                    if (self.args.length <= 1) return make_node(AST_Binary, self, {
                        left: self.args[0],
                        operator: "+",
                        right: make_node(AST_String, self, { value: "" })
                    }).optimize(compressor);
                    break;
                  case "Number":
                    if (self.args.length == 0) return make_node(AST_Number, self, {
                        value: 0
                    });
                    if (self.args.length == 1) return make_node(AST_UnaryPrefix, self, {
                        expression: self.args[0],
                        operator: "+"
                    }).optimize(compressor);
                  case "Boolean":
                    if (self.args.length == 0) return make_node(AST_False, self);
                    if (self.args.length == 1) return make_node(AST_UnaryPrefix, self, {
                        expression: make_node(AST_UnaryPrefix, self, {
                            expression: self.args[0],
                            operator: "!"
                        }),
                        operator: "!"
                    }).optimize(compressor);
                    break;
                  case "Function":
                    // new Function() => function(){}
                    if (self.args.length == 0) return make_node(AST_Function, self, {
                        argnames: [],
                        body: []
                    });
                    if (all(self.args, function(x){ return x instanceof AST_String })) {
                        // quite a corner-case, but we can handle it:
                        //   https://github.com/mishoo/UglifyJS2/issues/203
                        // if the code argument is a constant, then we can minify it.
                        try {
                            var code = "(function(" + self.args.slice(0, -1).map(function(arg){
                                return arg.value;
                            }).join(",") + "){" + self.args[self.args.length - 1].value + "})()";
                            var ast = parse(code);
                            ast.figure_out_scope({ screw_ie8: compressor.option("screw_ie8") });
                            var comp = new Compressor(compressor.options);
                            ast = ast.transform(comp);
                            ast.figure_out_scope({ screw_ie8: compressor.option("screw_ie8") });
                            ast.mangle_names();
                            var fun;
                            try {
                                ast.walk(new TreeWalker(function(node){
                                    if (node instanceof AST_Lambda) {
                                        fun = node;
                                        throw ast;
                                    }
                                }));
                            } catch(ex) {
                                if (ex !== ast) throw ex;
                            };
                            if (!fun) return self;
                            var args = fun.argnames.map(function(arg, i){
                                return make_node(AST_String, self.args[i], {
                                    value: arg.print_to_string()
                                });
                            });
                            var code = OutputStream();
                            AST_BlockStatement.prototype._codegen.call(fun, fun, code);
                            code = code.toString().replace(/^\{|\}$/g, "");
                            args.push(make_node(AST_String, self.args[self.args.length - 1], {
                                value: code
                            }));
                            self.args = args;
                            return self;
                        } catch(ex) {
                            if (ex instanceof JS_Parse_Error) {
                                compressor.warn("Error parsing code passed to new Function [{file}:{line},{col}]", self.args[self.args.length - 1].start);
                                compressor.warn(ex.toString());
                            } else {
                                console.log(ex);
                                throw ex;
                            }
                        }
                    }
                    break;
                }
            }
            else if (exp instanceof AST_Dot && exp.property == "toString" && self.args.length == 0) {
                return make_node(AST_Binary, self, {
                    left: make_node(AST_String, self, { value: "" }),
                    operator: "+",
                    right: exp.expression
                }).optimize(compressor);
            }
            else if (exp instanceof AST_Dot && exp.expression instanceof AST_Array && exp.property == "join") EXIT: {
                var separator;
                if (self.args.length > 0) {
                    separator = self.args[0].evaluate(compressor);
                    if (separator === self.args[0]) break EXIT; // not a constant
                }
                var elements = [];
                var consts = [];
                exp.expression.elements.forEach(function(el) {
                    var value = el.evaluate(compressor);
                    if (value !== el) {
                        consts.push(value);
                    } else {
                        if (consts.length > 0) {
                            elements.push(make_node(AST_String, self, {
                                value: consts.join(separator)
                            }));
                            consts.length = 0;
                        }
                        elements.push(el);
                    }
                });
                if (consts.length > 0) {
                    elements.push(make_node(AST_String, self, {
                        value: consts.join(separator)
                    }));
                }
                if (elements.length == 0) return make_node(AST_String, self, { value: "" });
                if (elements.length == 1) {
                    if (elements[0].is_string(compressor)) {
                        return elements[0];
                    }
                    return make_node(AST_Binary, elements[0], {
                        operator : "+",
                        left     : make_node(AST_String, self, { value: "" }),
                        right    : elements[0]
                    });
                }
                if (separator == "") {
                    var first;
                    if (elements[0].is_string(compressor)
                        || elements[1].is_string(compressor)) {
                        first = elements.shift();
                    } else {
                        first = make_node(AST_String, self, { value: "" });
                    }
                    return elements.reduce(function(prev, el){
                        return make_node(AST_Binary, el, {
                            operator : "+",
                            left     : prev,
                            right    : el
                        });
                    }, first).optimize(compressor);
                }
                // need this awkward cloning to not affect original element
                // best_of will decide which one to get through.
                var node = self.clone();
                node.expression = node.expression.clone();
                node.expression.expression = node.expression.expression.clone();
                node.expression.expression.elements = elements;
                return best_of(compressor, self, node);
            }
            else if (exp instanceof AST_Dot && exp.expression.is_string(compressor) && exp.property == "charAt") {
                var arg = self.args[0];
                var index = arg ? arg.evaluate(compressor) : 0;
                if (index !== arg) {
                    return make_node(AST_Sub, exp, {
                        expression: exp.expression,
                        property: make_node_from_constant(index | 0, arg || exp)
                    }).optimize(compressor);
                }
            }
        }
        if (exp instanceof AST_Function) {
            if (exp.body[0] instanceof AST_Return) {
                var value = exp.body[0].value;
                if (!value || value.is_constant()) {
                    var args = self.args.concat(value || make_node(AST_Undefined, self));
                    return AST_Seq.from_array(args).transform(compressor);
                }
            }
            if (compressor.option("side_effects") && all(exp.body, is_empty)) {
                var args = self.args.concat(make_node(AST_Undefined, self));
                return AST_Seq.from_array(args).transform(compressor);
            }
        }
        if (compressor.option("drop_console")) {
            if (exp instanceof AST_PropAccess) {
                var name = exp.expression;
                while (name.expression) {
                    name = name.expression;
                }
                if (name instanceof AST_SymbolRef
                    && name.name == "console"
                    && name.undeclared()) {
                    return make_node(AST_Undefined, self).optimize(compressor);
                }
            }
        }
        if (compressor.option("negate_iife")
            && compressor.parent() instanceof AST_SimpleStatement
            && is_iife_call(self)) {
            return self.negate(compressor, true);
        }
        return self;
    });

    OPT(AST_New, function(self, compressor){
        if (compressor.option("unsafe")) {
            var exp = self.expression;
            if (exp instanceof AST_SymbolRef && exp.undeclared()) {
                switch (exp.name) {
                  case "Object":
                  case "RegExp":
                  case "Function":
                  case "Error":
                  case "Array":
                    return make_node(AST_Call, self, self).transform(compressor);
                }
            }
        }
        return self;
    });

    OPT(AST_Seq, function(self, compressor){
        if (!compressor.option("side_effects"))
            return self;
        self.car = self.car.drop_side_effect_free(compressor, first_in_statement(compressor));
        if (!self.car) return maintain_this_binding(compressor.parent(), self, self.cdr);
        if (compressor.option("cascade")) {
            var left;
            if (self.car instanceof AST_Assign
                && !self.car.left.has_side_effects(compressor)) {
                left = self.car.left;
            } else if (self.car instanceof AST_Unary
                && (self.car.operator == "++" || self.car.operator == "--")) {
                left = self.car.expression;
            }
            if (left
                && !(left instanceof AST_SymbolRef
                    && (left.definition().orig[0] instanceof AST_SymbolLambda
                        || is_reference_const(left)))) {
                var parent, field;
                var cdr = self.cdr;
                while (true) {
                    if (cdr.equivalent_to(left)) {
                        var car = self.car instanceof AST_UnaryPostfix ? make_node(AST_UnaryPrefix, self.car, {
                            operator: self.car.operator,
                            expression: left
                        }) : self.car;
                        if (parent) {
                            parent[field] = car;
                            return self.cdr;
                        }
                        return car;
                    }
                    if (cdr instanceof AST_Binary && !(cdr instanceof AST_Assign)) {
                        if (cdr.left.is_constant()) {
                            if (cdr.operator == "||" || cdr.operator == "&&") break;
                            field = "right";
                        } else {
                            field = "left";
                        }
                    } else if (cdr instanceof AST_Call
                        || cdr instanceof AST_Unary && !unary_side_effects(cdr.operator)) {
                        field = "expression";
                    } else break;
                    parent = cdr;
                    cdr = cdr[field];
                }
            }
        }
        if (is_undefined(self.cdr, compressor)) {
            return make_node(AST_UnaryPrefix, self, {
                operator   : "void",
                expression : self.car
            });
        }
        return self;
    });

    AST_Unary.DEFMETHOD("lift_sequences", function(compressor){
        if (compressor.option("sequences")) {
            if (this.expression instanceof AST_Seq) {
                var seq = this.expression;
                var x = seq.to_array();
                var e = this.clone();
                e.expression = x.pop();
                x.push(e);
                seq = AST_Seq.from_array(x).transform(compressor);
                return seq;
            }
        }
        return this;
    });

    OPT(AST_UnaryPostfix, function(self, compressor){
        return self.lift_sequences(compressor);
    });

    OPT(AST_UnaryPrefix, function(self, compressor){
        var e = self.expression;
        if (self.operator == "delete"
            && !(e instanceof AST_SymbolRef
                || e instanceof AST_PropAccess
                || e instanceof AST_NaN
                || e instanceof AST_Infinity
                || e instanceof AST_Undefined)) {
            if (e instanceof AST_Seq) {
                e = e.to_array();
                e.push(make_node(AST_True, self));
                return AST_Seq.from_array(e).optimize(compressor);
            }
            return make_node(AST_Seq, self, {
                car: e,
                cdr: make_node(AST_True, self)
            }).optimize(compressor);
        }
        var seq = self.lift_sequences(compressor);
        if (seq !== self) {
            return seq;
        }
        if (compressor.option("side_effects") && self.operator == "void") {
            e = e.drop_side_effect_free(compressor);
            if (e) {
                self.expression = e;
                return self;
            } else {
                return make_node(AST_Undefined, self).optimize(compressor);
            }
        }
        if (compressor.option("booleans") && compressor.in_boolean_context()) {
            switch (self.operator) {
              case "!":
                if (e instanceof AST_UnaryPrefix && e.operator == "!") {
                    // !!foo ==> foo, if we're in boolean context
                    return e.expression;
                }
                if (e instanceof AST_Binary) {
                    self = best_of(compressor, self, e.negate(compressor, first_in_statement(compressor)));
                }
                break;
              case "typeof":
                // typeof always returns a non-empty string, thus it's
                // always true in booleans
                compressor.warn("Boolean expression always true [{file}:{line},{col}]", self.start);
                return (e instanceof AST_SymbolRef ? make_node(AST_True, self) : make_node(AST_Seq, self, {
                    car: e,
                    cdr: make_node(AST_True, self)
                })).optimize(compressor);
            }
        }
        if (self.operator == "-" && e instanceof AST_Infinity) {
            e = e.transform(compressor);
        }
        if (e instanceof AST_Binary
            && (self.operator == "+" || self.operator == "-")
            && (e.operator == "*" || e.operator == "/" || e.operator == "%")) {
            return make_node(AST_Binary, self, {
                operator: e.operator,
                left: make_node(AST_UnaryPrefix, e.left, {
                    operator: self.operator,
                    expression: e.left
                }),
                right: e.right
            });
        }
        // avoids infinite recursion of numerals
        if (self.operator != "-"
            || !(e instanceof AST_Number || e instanceof AST_Infinity)) {
            var ev = self.evaluate(compressor);
            if (ev !== self) {
                ev = make_node_from_constant(ev, self).optimize(compressor);
                return best_of(compressor, ev, self);
            }
        }
        return self;
    });

    AST_Binary.DEFMETHOD("lift_sequences", function(compressor){
        if (compressor.option("sequences")) {
            if (this.left instanceof AST_Seq) {
                var seq = this.left;
                var x = seq.to_array();
                var e = this.clone();
                e.left = x.pop();
                x.push(e);
                return AST_Seq.from_array(x).optimize(compressor);
            }
            if (this.right instanceof AST_Seq && !this.left.has_side_effects(compressor)) {
                var assign = this.operator == "=" && this.left instanceof AST_SymbolRef;
                var root = this.right.clone();
                var cursor, seq = root;
                while (assign || !seq.car.has_side_effects(compressor)) {
                    cursor = seq;
                    if (seq.cdr instanceof AST_Seq) {
                        seq = seq.cdr = seq.cdr.clone();
                    } else break;
                }
                if (cursor) {
                    var e = this.clone();
                    e.right = cursor.cdr;
                    cursor.cdr = e;
                    return root.optimize(compressor);
                }
            }
        }
        return this;
    });

    var commutativeOperators = makePredicate("== === != !== * & | ^");

    OPT(AST_Binary, function(self, compressor){
        function reversible() {
            return self.left.is_constant()
                || self.right.is_constant()
                || !self.left.has_side_effects(compressor)
                    && !self.right.has_side_effects(compressor);
        }
        function reverse(op) {
            if (reversible()) {
                if (op) self.operator = op;
                var tmp = self.left;
                self.left = self.right;
                self.right = tmp;
            }
        }
        if (commutativeOperators(self.operator)) {
            if (self.right.is_constant()
                && !self.left.is_constant()) {
                // if right is a constant, whatever side effects the
                // left side might have could not influence the
                // result.  hence, force switch.

                if (!(self.left instanceof AST_Binary
                      && PRECEDENCE[self.left.operator] >= PRECEDENCE[self.operator])) {
                    reverse();
                }
            }
        }
        self = self.lift_sequences(compressor);
        if (compressor.option("comparisons")) switch (self.operator) {
          case "===":
          case "!==":
            if ((self.left.is_string(compressor) && self.right.is_string(compressor)) ||
                (self.left.is_number(compressor) && self.right.is_number(compressor)) ||
                (self.left.is_boolean() && self.right.is_boolean())) {
                self.operator = self.operator.substr(0, 2);
            }
            // XXX: intentionally falling down to the next case
          case "==":
          case "!=":
            // "undefined" == typeof x => undefined === x
            if (self.left instanceof AST_String
                && self.left.value == "undefined"
                && self.right instanceof AST_UnaryPrefix
                && self.right.operator == "typeof") {
                var expr = self.right.expression;
                if (expr instanceof AST_SymbolRef ? !expr.undeclared()
                    : !(expr instanceof AST_PropAccess) || compressor.option("screw_ie8")) {
                    self.right = expr;
                    self.left = make_node(AST_Undefined, self.left).optimize(compressor);
                    if (self.operator.length == 2) self.operator += "=";
                }
            }
            break;
        }
        if (compressor.option("booleans") && self.operator == "+" && compressor.in_boolean_context()) {
            var ll = self.left.evaluate(compressor);
            var rr = self.right.evaluate(compressor);
            if (ll && typeof ll == "string") {
                compressor.warn("+ in boolean context always true [{file}:{line},{col}]", self.start);
                return make_node(AST_Seq, self, {
                    car: self.right,
                    cdr: make_node(AST_True, self)
                }).optimize(compressor);
            }
            if (rr && typeof rr == "string") {
                compressor.warn("+ in boolean context always true [{file}:{line},{col}]", self.start);
                return make_node(AST_Seq, self, {
                    car: self.left,
                    cdr: make_node(AST_True, self)
                }).optimize(compressor);
            }
        }
        if (compressor.option("comparisons") && self.is_boolean()) {
            if (!(compressor.parent() instanceof AST_Binary)
                || compressor.parent() instanceof AST_Assign) {
                var negated = make_node(AST_UnaryPrefix, self, {
                    operator: "!",
                    expression: self.negate(compressor, first_in_statement(compressor))
                });
                self = best_of(compressor, self, negated);
            }
            if (compressor.option("unsafe_comps")) {
                switch (self.operator) {
                  case "<": reverse(">"); break;
                  case "<=": reverse(">="); break;
                }
            }
        }
        if (self.operator == "+") {
            if (self.right instanceof AST_String
                && self.right.getValue() == ""
                && self.left.is_string(compressor)) {
                return self.left;
            }
            if (self.left instanceof AST_String
                && self.left.getValue() == ""
                && self.right.is_string(compressor)) {
                return self.right;
            }
            if (self.left instanceof AST_Binary
                && self.left.operator == "+"
                && self.left.left instanceof AST_String
                && self.left.left.getValue() == ""
                && self.right.is_string(compressor)) {
                self.left = self.left.right;
                return self.transform(compressor);
            }
        }
        if (compressor.option("evaluate")) {
            switch (self.operator) {
              case "&&":
                var ll = self.left.evaluate(compressor);
                if (!ll) {
                    compressor.warn("Condition left of && always false [{file}:{line},{col}]", self.start);
                    return maintain_this_binding(compressor.parent(), self, self.left).optimize(compressor);
                } else if (ll !== self.left) {
                    compressor.warn("Condition left of && always true [{file}:{line},{col}]", self.start);
                    return maintain_this_binding(compressor.parent(), self, self.right).optimize(compressor);
                }
                if (compressor.option("booleans") && compressor.in_boolean_context()) {
                    var rr = self.right.evaluate(compressor);
                    if (!rr) {
                        compressor.warn("Boolean && always false [{file}:{line},{col}]", self.start);
                        return make_node(AST_Seq, self, {
                            car: self.left,
                            cdr: make_node(AST_False, self)
                        }).optimize(compressor);
                    } else if (rr !== self.right) {
                        compressor.warn("Dropping side-effect-free && in boolean context [{file}:{line},{col}]", self.start);
                        return self.left.optimize(compressor);
                    }
                }
                break;
              case "||":
                var ll = self.left.evaluate(compressor);
                if (!ll) {
                    compressor.warn("Condition left of || always false [{file}:{line},{col}]", self.start);
                    return maintain_this_binding(compressor.parent(), self, self.right).optimize(compressor);
                } else if (ll !== self.left) {
                    compressor.warn("Condition left of || always true [{file}:{line},{col}]", self.start);
                    return maintain_this_binding(compressor.parent(), self, self.left).optimize(compressor);
                }
                if (compressor.option("booleans") && compressor.in_boolean_context()) {
                    var rr = self.right.evaluate(compressor);
                    if (!rr) {
                        compressor.warn("Dropping side-effect-free || in boolean context [{file}:{line},{col}]", self.start);
                        return self.left.optimize(compressor);
                    } else if (rr !== self.right) {
                        compressor.warn("Boolean || always true [{file}:{line},{col}]", self.start);
                        return make_node(AST_Seq, self, {
                            car: self.left,
                            cdr: make_node(AST_True, self)
                        }).optimize(compressor);
                    }
                }
                break;
            }
            var associative = true;
            switch (self.operator) {
              case "+":
                // "foo" + ("bar" + x) => "foobar" + x
                if (self.left instanceof AST_Constant
                    && self.right instanceof AST_Binary
                    && self.right.operator == "+"
                    && self.right.left instanceof AST_Constant
                    && self.right.is_string(compressor)) {
                    self = make_node(AST_Binary, self, {
                        operator: "+",
                        left: make_node(AST_String, self.left, {
                            value: "" + self.left.getValue() + self.right.left.getValue(),
                            start: self.left.start,
                            end: self.right.left.end
                        }),
                        right: self.right.right
                    });
                }
                // (x + "foo") + "bar" => x + "foobar"
                if (self.right instanceof AST_Constant
                    && self.left instanceof AST_Binary
                    && self.left.operator == "+"
                    && self.left.right instanceof AST_Constant
                    && self.left.is_string(compressor)) {
                    self = make_node(AST_Binary, self, {
                        operator: "+",
                        left: self.left.left,
                        right: make_node(AST_String, self.right, {
                            value: "" + self.left.right.getValue() + self.right.getValue(),
                            start: self.left.right.start,
                            end: self.right.end
                        })
                    });
                }
                // (x + "foo") + ("bar" + y) => (x + "foobar") + y
                if (self.left instanceof AST_Binary
                    && self.left.operator == "+"
                    && self.left.is_string(compressor)
                    && self.left.right instanceof AST_Constant
                    && self.right instanceof AST_Binary
                    && self.right.operator == "+"
                    && self.right.left instanceof AST_Constant
                    && self.right.is_string(compressor)) {
                    self = make_node(AST_Binary, self, {
                        operator: "+",
                        left: make_node(AST_Binary, self.left, {
                            operator: "+",
                            left: self.left.left,
                            right: make_node(AST_String, self.left.right, {
                                value: "" + self.left.right.getValue() + self.right.left.getValue(),
                                start: self.left.right.start,
                                end: self.right.left.end
                            })
                        }),
                        right: self.right.right
                    });
                }
                // a + -b => a - b
                if (self.right instanceof AST_UnaryPrefix
                    && self.right.operator == "-"
                    && self.left.is_number(compressor)) {
                    self = make_node(AST_Binary, self, {
                        operator: "-",
                        left: self.left,
                        right: self.right.expression
                    });
                    break;
                }
                // -a + b => b - a
                if (self.left instanceof AST_UnaryPrefix
                    && self.left.operator == "-"
                    && reversible()
                    && self.right.is_number(compressor)) {
                    self = make_node(AST_Binary, self, {
                        operator: "-",
                        left: self.right,
                        right: self.left.expression
                    });
                    break;
                }
              case "*":
                associative = compressor.option("unsafe_math");
              case "&":
              case "|":
              case "^":
                // a + +b => +b + a
                if (self.left.is_number(compressor)
                    && self.right.is_number(compressor)
                    && reversible()
                    && !(self.left instanceof AST_Binary
                        && self.left.operator != self.operator
                        && PRECEDENCE[self.left.operator] >= PRECEDENCE[self.operator])) {
                    var reversed = make_node(AST_Binary, self, {
                        operator: self.operator,
                        left: self.right,
                        right: self.left
                    });
                    if (self.right instanceof AST_Constant
                        && !(self.left instanceof AST_Constant)) {
                        self = best_of(compressor, reversed, self);
                    } else {
                        self = best_of(compressor, self, reversed);
                    }
                }
                if (associative && self.is_number(compressor)) {
                    // a + (b + c) => (a + b) + c
                    if (self.right instanceof AST_Binary
                        && self.right.operator == self.operator) {
                        self = make_node(AST_Binary, self, {
                            operator: self.operator,
                            left: make_node(AST_Binary, self.left, {
                                operator: self.operator,
                                left: self.left,
                                right: self.right.left,
                                start: self.left.start,
                                end: self.right.left.end
                            }),
                            right: self.right.right
                        });
                    }
                    // (n + 2) + 3 => 5 + n
                    // (2 * n) * 3 => 6 + n
                    if (self.right instanceof AST_Constant
                        && self.left instanceof AST_Binary
                        && self.left.operator == self.operator) {
                        if (self.left.left instanceof AST_Constant) {
                            self = make_node(AST_Binary, self, {
                                operator: self.operator,
                                left: make_node(AST_Binary, self.left, {
                                    operator: self.operator,
                                    left: self.left.left,
                                    right: self.right,
                                    start: self.left.left.start,
                                    end: self.right.end
                                }),
                                right: self.left.right
                            });
                        } else if (self.left.right instanceof AST_Constant) {
                            self = make_node(AST_Binary, self, {
                                operator: self.operator,
                                left: make_node(AST_Binary, self.left, {
                                    operator: self.operator,
                                    left: self.left.right,
                                    right: self.right,
                                    start: self.left.right.start,
                                    end: self.right.end
                                }),
                                right: self.left.left
                            });
                        }
                    }
                    // (a | 1) | (2 | d) => (3 | a) | b
                    if (self.left instanceof AST_Binary
                        && self.left.operator == self.operator
                        && self.left.right instanceof AST_Constant
                        && self.right instanceof AST_Binary
                        && self.right.operator == self.operator
                        && self.right.left instanceof AST_Constant) {
                        self = make_node(AST_Binary, self, {
                            operator: self.operator,
                            left: make_node(AST_Binary, self.left, {
                                operator: self.operator,
                                left: make_node(AST_Binary, self.left.left, {
                                    operator: self.operator,
                                    left: self.left.right,
                                    right: self.right.left,
                                    start: self.left.right.start,
                                    end: self.right.left.end
                                }),
                                right: self.left.left
                            }),
                            right: self.right.right
                        });
                    }
                }
            }
        }
        // x && (y && z)  ==>  x && y && z
        // x || (y || z)  ==>  x || y || z
        // x + ("y" + z)  ==>  x + "y" + z
        // "x" + (y + "z")==>  "x" + y + "z"
        if (self.right instanceof AST_Binary
            && self.right.operator == self.operator
            && (self.operator == "&&"
                || self.operator == "||"
                || (self.operator == "+"
                    && (self.right.left.is_string(compressor)
                        || (self.left.is_string(compressor)
                            && self.right.right.is_string(compressor))))))
        {
            self.left = make_node(AST_Binary, self.left, {
                operator : self.operator,
                left     : self.left,
                right    : self.right.left
            });
            self.right = self.right.right;
            return self.transform(compressor);
        }
        var ev = self.evaluate(compressor);
        if (ev !== self) {
            ev = make_node_from_constant(ev, self).optimize(compressor);
            return best_of(compressor, ev, self);
        }
        return self;
    });

    OPT(AST_SymbolRef, function(self, compressor){
        var def = self.resolve_defines(compressor);
        if (def) {
            return def.optimize(compressor);
        }
        // testing against !self.scope.uses_with first is an optimization
        if (compressor.option("screw_ie8")
            && self.undeclared()
            && (!self.scope.uses_with || !compressor.find_parent(AST_With))) {
            switch (self.name) {
              case "undefined":
                return make_node(AST_Undefined, self).optimize(compressor);
              case "NaN":
                return make_node(AST_NaN, self).optimize(compressor);
              case "Infinity":
                return make_node(AST_Infinity, self).optimize(compressor);
            }
        }
        if (compressor.option("evaluate")
            && compressor.option("reduce_vars")
            && is_lhs(self, compressor.parent()) !== self) {
            var d = self.definition();
            var fixed = self.fixed_value();
            if (fixed) {
                if (d.should_replace === undefined) {
                    var init = fixed.evaluate(compressor);
                    if (init !== fixed && (compressor.option("unsafe_regexp") || !(init instanceof RegExp))) {
                        init = make_node_from_constant(init, fixed);
                        var value = init.optimize(compressor).print_to_string().length;
                        var fn;
                        if (has_symbol_ref(fixed)) {
                            fn = function() {
                                var result = init.optimize(compressor);
                                return result === init ? result.clone(true) : result;
                            };
                        } else {
                            value = Math.min(value, fixed.print_to_string().length);
                            fn = function() {
                                var result = best_of_expression(init.optimize(compressor), fixed);
                                return result === init || result === fixed ? result.clone(true) : result;
                            };
                        }
                        var name = d.name.length;
                        var overhead = 0;
                        if (compressor.option("unused") && (!d.global || compressor.option("toplevel"))) {
                            overhead = (name + 2 + value) / d.references.length;
                        }
                        d.should_replace = value <= name + overhead ? fn : false;
                    } else {
                        d.should_replace = false;
                    }
                }
                if (d.should_replace) {
                    return d.should_replace();
                }
            }
        }
        return self;

        function has_symbol_ref(value) {
            var found;
            value.walk(new TreeWalker(function(node) {
                if (node instanceof AST_SymbolRef) found = true;
                if (found) return true;
            }));
            return found;
        }
    });

    function is_atomic(lhs, self) {
        return lhs instanceof AST_SymbolRef || lhs.TYPE === self.TYPE;
    }

    OPT(AST_Undefined, function(self, compressor){
        if (compressor.option("unsafe")) {
            var undef = find_variable(compressor, "undefined");
            if (undef) {
                var ref = make_node(AST_SymbolRef, self, {
                    name   : "undefined",
                    scope  : undef.scope,
                    thedef : undef
                });
                ref.is_undefined = true;
                return ref;
            }
        }
        var lhs = is_lhs(compressor.self(), compressor.parent());
        if (lhs && is_atomic(lhs, self)) return self;
        return make_node(AST_UnaryPrefix, self, {
            operator: "void",
            expression: make_node(AST_Number, self, {
                value: 0
            })
        });
    });

    OPT(AST_Infinity, function(self, compressor){
        var lhs = is_lhs(compressor.self(), compressor.parent());
        if (lhs && is_atomic(lhs, self)) return self;
        if (compressor.option("keep_infinity")
            && !(lhs && !is_atomic(lhs, self))
            && !find_variable(compressor, "Infinity"))
            return self;
        return make_node(AST_Binary, self, {
            operator: "/",
            left: make_node(AST_Number, self, {
                value: 1
            }),
            right: make_node(AST_Number, self, {
                value: 0
            })
        });
    });

    OPT(AST_NaN, function(self, compressor){
        var lhs = is_lhs(compressor.self(), compressor.parent());
        if (lhs && !is_atomic(lhs, self)
            || find_variable(compressor, "NaN")) {
            return make_node(AST_Binary, self, {
                operator: "/",
                left: make_node(AST_Number, self, {
                    value: 0
                }),
                right: make_node(AST_Number, self, {
                    value: 0
                })
            });
        }
        return self;
    });

    var ASSIGN_OPS = [ '+', '-', '/', '*', '%', '>>', '<<', '>>>', '|', '^', '&' ];
    var ASSIGN_OPS_COMMUTATIVE = [ '*', '|', '^', '&' ];
    OPT(AST_Assign, function(self, compressor){
        self = self.lift_sequences(compressor);
        if (self.operator == "=" && self.left instanceof AST_SymbolRef && self.right instanceof AST_Binary) {
            // x = expr1 OP expr2
            if (self.right.left instanceof AST_SymbolRef
                && self.right.left.name == self.left.name
                && member(self.right.operator, ASSIGN_OPS)) {
                // x = x - 2  --->  x -= 2
                self.operator = self.right.operator + "=";
                self.right = self.right.right;
            }
            else if (self.right.right instanceof AST_SymbolRef
                && self.right.right.name == self.left.name
                && member(self.right.operator, ASSIGN_OPS_COMMUTATIVE)
                && !self.right.left.has_side_effects(compressor)) {
                // x = 2 & x  --->  x &= 2
                self.operator = self.right.operator + "=";
                self.right = self.right.left;
            }
        }
        return self;
    });

    OPT(AST_Conditional, function(self, compressor){
        if (!compressor.option("conditionals")) return self;
        if (self.condition instanceof AST_Seq) {
            var car = self.condition.car;
            self.condition = self.condition.cdr;
            return AST_Seq.cons(car, self);
        }
        var cond = self.condition.evaluate(compressor);
        if (cond !== self.condition) {
            if (cond) {
                compressor.warn("Condition always true [{file}:{line},{col}]", self.start);
                return maintain_this_binding(compressor.parent(), self, self.consequent);
            } else {
                compressor.warn("Condition always false [{file}:{line},{col}]", self.start);
                return maintain_this_binding(compressor.parent(), self, self.alternative);
            }
        }
        var negated = cond.negate(compressor, first_in_statement(compressor));
        if (best_of(compressor, cond, negated) === negated) {
            self = make_node(AST_Conditional, self, {
                condition: negated,
                consequent: self.alternative,
                alternative: self.consequent
            });
        }
        var condition = self.condition;
        var consequent = self.consequent;
        var alternative = self.alternative;
        // x?x:y --> x||y
        if (condition instanceof AST_SymbolRef
            && consequent instanceof AST_SymbolRef
            && condition.definition() === consequent.definition()) {
            return make_node(AST_Binary, self, {
                operator: "||",
                left: condition,
                right: alternative
            });
        }
        // if (foo) exp = something; else exp = something_else;
        //                   |
        //                   v
        // exp = foo ? something : something_else;
        if (consequent instanceof AST_Assign
            && alternative instanceof AST_Assign
            && consequent.operator == alternative.operator
            && consequent.left.equivalent_to(alternative.left)
            && (!self.condition.has_side_effects(compressor)
                || consequent.operator == "="
                    && !consequent.left.has_side_effects(compressor))) {
            return make_node(AST_Assign, self, {
                operator: consequent.operator,
                left: consequent.left,
                right: make_node(AST_Conditional, self, {
                    condition: self.condition,
                    consequent: consequent.right,
                    alternative: alternative.right
                })
            });
        }
        // x ? y(a) : y(b) --> y(x ? a : b)
        if (consequent instanceof AST_Call
            && alternative.TYPE === consequent.TYPE
            && consequent.args.length == 1
            && alternative.args.length == 1
            && consequent.expression.equivalent_to(alternative.expression)
            && !consequent.expression.has_side_effects(compressor)) {
            consequent.args[0] = make_node(AST_Conditional, self, {
                condition: self.condition,
                consequent: consequent.args[0],
                alternative: alternative.args[0]
            });
            return consequent;
        }
        // x?y?z:a:a --> x&&y?z:a
        if (consequent instanceof AST_Conditional
            && consequent.alternative.equivalent_to(alternative)) {
            return make_node(AST_Conditional, self, {
                condition: make_node(AST_Binary, self, {
                    left: self.condition,
                    operator: "&&",
                    right: consequent.condition
                }),
                consequent: consequent.consequent,
                alternative: alternative
            });
        }
        // x ? y : y --> x, y
        if (consequent.equivalent_to(alternative)) {
            return make_node(AST_Seq, self, {
                car: self.condition,
                cdr: consequent
            }).optimize(compressor);
        }

        if (is_true(self.consequent)) {
            if (is_false(self.alternative)) {
                // c ? true : false ---> !!c
                return booleanize(self.condition);
            }
            // c ? true : x ---> !!c || x
            return make_node(AST_Binary, self, {
                operator: "||",
                left: booleanize(self.condition),
                right: self.alternative
            });
        }
        if (is_false(self.consequent)) {
            if (is_true(self.alternative)) {
                // c ? false : true ---> !c
                return booleanize(self.condition.negate(compressor));
            }
            // c ? false : x ---> !c && x
            return make_node(AST_Binary, self, {
                operator: "&&",
                left: booleanize(self.condition.negate(compressor)),
                right: self.alternative
            });
        }
        if (is_true(self.alternative)) {
            // c ? x : true ---> !c || x
            return make_node(AST_Binary, self, {
                operator: "||",
                left: booleanize(self.condition.negate(compressor)),
                right: self.consequent
            });
        }
        if (is_false(self.alternative)) {
            // c ? x : false ---> !!c && x
            return make_node(AST_Binary, self, {
                operator: "&&",
                left: booleanize(self.condition),
                right: self.consequent
            });
        }

        return self;

        function booleanize(node) {
            if (node.is_boolean()) return node;
            // !!expression
            return make_node(AST_UnaryPrefix, node, {
                operator: "!",
                expression: node.negate(compressor)
            });
        }

        // AST_True or !0
        function is_true(node) {
            return node instanceof AST_True
                || (node instanceof AST_UnaryPrefix
                    && node.operator == "!"
                    && node.expression instanceof AST_Constant
                    && !node.expression.value);
        }
        // AST_False or !1
        function is_false(node) {
            return node instanceof AST_False
                || (node instanceof AST_UnaryPrefix
                    && node.operator == "!"
                    && node.expression instanceof AST_Constant
                    && !!node.expression.value);
        }
    });

    OPT(AST_Boolean, function(self, compressor){
        if (compressor.option("booleans")) {
            var p = compressor.parent();
            if (p instanceof AST_Binary && (p.operator == "=="
                                            || p.operator == "!=")) {
                compressor.warn("Non-strict equality against boolean: {operator} {value} [{file}:{line},{col}]", {
                    operator : p.operator,
                    value    : self.value,
                    file     : p.start.file,
                    line     : p.start.line,
                    col      : p.start.col,
                });
                return make_node(AST_Number, self, {
                    value: +self.value
                });
            }
            return make_node(AST_UnaryPrefix, self, {
                operator: "!",
                expression: make_node(AST_Number, self, {
                    value: 1 - self.value
                })
            });
        }
        return self;
    });

    OPT(AST_Sub, function(self, compressor){
        var prop = self.property;
        if (prop instanceof AST_String && compressor.option("properties")) {
            prop = prop.getValue();
            if (RESERVED_WORDS(prop) ? compressor.option("screw_ie8") : is_identifier_string(prop)) {
                return make_node(AST_Dot, self, {
                    expression : self.expression,
                    property   : prop
                }).optimize(compressor);
            }
            var v = parseFloat(prop);
            if (!isNaN(v) && v.toString() == prop) {
                self.property = make_node(AST_Number, self.property, {
                    value: v
                });
            }
        }
        var ev = self.evaluate(compressor);
        if (ev !== self) {
            ev = make_node_from_constant(ev, self).optimize(compressor);
            return best_of(compressor, ev, self);
        }
        return self;
    });

    OPT(AST_Dot, function(self, compressor){
        var def = self.resolve_defines(compressor);
        if (def) {
            return def.optimize(compressor);
        }
        var prop = self.property;
        if (RESERVED_WORDS(prop) && !compressor.option("screw_ie8")) {
            return make_node(AST_Sub, self, {
                expression : self.expression,
                property   : make_node(AST_String, self, {
                    value: prop
                })
            }).optimize(compressor);
        }
        if (compressor.option("unsafe_proto")
            && self.expression instanceof AST_Dot
            && self.expression.property == "prototype") {
            var exp = self.expression.expression;
            if (exp instanceof AST_SymbolRef && exp.undeclared()) switch (exp.name) {
              case "Array":
                self.expression = make_node(AST_Array, self.expression, {
                    elements: []
                });
                break;
              case "Object":
                self.expression = make_node(AST_Object, self.expression, {
                    properties: []
                });
                break;
              case "String":
                self.expression = make_node(AST_String, self.expression, {
                    value: ""
                });
                break;
            }
        }
        var ev = self.evaluate(compressor);
        if (ev !== self) {
            ev = make_node_from_constant(ev, self).optimize(compressor);
            return best_of(compressor, ev, self);
        }
        return self;
    });

    function literals_in_boolean_context(self, compressor) {
        if (compressor.option("booleans") && compressor.in_boolean_context()) {
            return best_of(compressor, self, make_node(AST_Seq, self, {
                car: self,
                cdr: make_node(AST_True, self)
            }).optimize(compressor));
        }
        return self;
    };
    OPT(AST_Array, literals_in_boolean_context);
    OPT(AST_Object, literals_in_boolean_context);
    OPT(AST_RegExp, literals_in_boolean_context);

    OPT(AST_Return, function(self, compressor){
        if (self.value && is_undefined(self.value, compressor)) {
            self.value = null;
        }
        return self;
    });

    OPT(AST_VarDef, function(self, compressor){
        var defines = compressor.option("global_defs");
        if (defines && HOP(defines, self.name.name)) {
            compressor.warn('global_defs ' + self.name.name + ' redefined [{file}:{line},{col}]', self.start);
        }
        return self;
    });

})();

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

// a small wrapper around fitzgen's source-map library
function SourceMap(options) {
    options = defaults(options, {
        file : null,
        root : null,
        orig : null,

        orig_line_diff : 0,
        dest_line_diff : 0,
    });
    var generator = new MOZ_SourceMap.SourceMapGenerator({
        file       : options.file,
        sourceRoot : options.root
    });
    var orig_map = options.orig && new MOZ_SourceMap.SourceMapConsumer(options.orig);

    if (orig_map && Array.isArray(options.orig.sources)) {
        orig_map._sources.toArray().forEach(function(source) {
            var sourceContent = orig_map.sourceContentFor(source, true);
            if (sourceContent) {
                generator.setSourceContent(source, sourceContent);
            }
        });
    }

    function add(source, gen_line, gen_col, orig_line, orig_col, name) {
        if (orig_map) {
            var info = orig_map.originalPositionFor({
                line: orig_line,
                column: orig_col
            });
            if (info.source === null) {
                return;
            }
            source = info.source;
            orig_line = info.line;
            orig_col = info.column;
            name = info.name || name;
        }
        generator.addMapping({
            generated : { line: gen_line + options.dest_line_diff, column: gen_col },
            original  : { line: orig_line + options.orig_line_diff, column: orig_col },
            source    : source,
            name      : name
        });
    };
    return {
        add        : add,
        get        : function() { return generator },
        toString   : function() { return JSON.stringify(generator.toJSON()); }
    };
};

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

(function(){

    var normalize_directives = function(body) {
        var in_directive = true;

        for (var i = 0; i < body.length; i++) {
            if (in_directive && body[i] instanceof AST_Statement && body[i].body instanceof AST_String) {
                body[i] = new AST_Directive({
                    start: body[i].start,
                    end: body[i].end,
                    value: body[i].body.value
                });
            } else if (in_directive && !(body[i] instanceof AST_Statement && body[i].body instanceof AST_String)) {
                in_directive = false;
            }
        }

        return body;
    };

    var MOZ_TO_ME = {
        Program: function(M) {
            return new AST_Toplevel({
                start: my_start_token(M),
                end: my_end_token(M),
                body: normalize_directives(M.body.map(from_moz))
            });
        },
        FunctionDeclaration: function(M) {
            return new AST_Defun({
                start: my_start_token(M),
                end: my_end_token(M),
                name: from_moz(M.id),
                argnames: M.params.map(from_moz),
                body: normalize_directives(from_moz(M.body).body)
            });
        },
        FunctionExpression: function(M) {
            return new AST_Function({
                start: my_start_token(M),
                end: my_end_token(M),
                name: from_moz(M.id),
                argnames: M.params.map(from_moz),
                body: normalize_directives(from_moz(M.body).body)
            });
        },
        ExpressionStatement: function(M) {
            return new AST_SimpleStatement({
                start: my_start_token(M),
                end: my_end_token(M),
                body: from_moz(M.expression)
            });
        },
        TryStatement: function(M) {
            var handlers = M.handlers || [M.handler];
            if (handlers.length > 1 || M.guardedHandlers && M.guardedHandlers.length) {
                throw new Error("Multiple catch clauses are not supported.");
            }
            return new AST_Try({
                start    : my_start_token(M),
                end      : my_end_token(M),
                body     : from_moz(M.block).body,
                bcatch   : from_moz(handlers[0]),
                bfinally : M.finalizer ? new AST_Finally(from_moz(M.finalizer)) : null
            });
        },
        Property: function(M) {
            var key = M.key;
            var args = {
                start    : my_start_token(key),
                end      : my_end_token(M.value),
                key      : key.type == "Identifier" ? key.name : key.value,
                value    : from_moz(M.value)
            };
            if (M.kind == "init") return new AST_ObjectKeyVal(args);
            args.key = new AST_SymbolAccessor({
                name: args.key
            });
            args.value = new AST_Accessor(args.value);
            if (M.kind == "get") return new AST_ObjectGetter(args);
            if (M.kind == "set") return new AST_ObjectSetter(args);
        },
        ArrayExpression: function(M) {
            return new AST_Array({
                start    : my_start_token(M),
                end      : my_end_token(M),
                elements : M.elements.map(function(elem){
                    return elem === null ? new AST_Hole() : from_moz(elem);
                })
            });
        },
        ObjectExpression: function(M) {
            return new AST_Object({
                start      : my_start_token(M),
                end        : my_end_token(M),
                properties : M.properties.map(function(prop){
                    prop.type = "Property";
                    return from_moz(prop)
                })
            });
        },
        SequenceExpression: function(M) {
            return AST_Seq.from_array(M.expressions.map(from_moz));
        },
        MemberExpression: function(M) {
            return new (M.computed ? AST_Sub : AST_Dot)({
                start      : my_start_token(M),
                end        : my_end_token(M),
                property   : M.computed ? from_moz(M.property) : M.property.name,
                expression : from_moz(M.object)
            });
        },
        SwitchCase: function(M) {
            return new (M.test ? AST_Case : AST_Default)({
                start      : my_start_token(M),
                end        : my_end_token(M),
                expression : from_moz(M.test),
                body       : M.consequent.map(from_moz)
            });
        },
        VariableDeclaration: function(M) {
            return new (M.kind === "const" ? AST_Const : AST_Var)({
                start       : my_start_token(M),
                end         : my_end_token(M),
                definitions : M.declarations.map(from_moz)
            });
        },
        Literal: function(M) {
            var val = M.value, args = {
                start  : my_start_token(M),
                end    : my_end_token(M)
            };
            if (val === null) return new AST_Null(args);
            switch (typeof val) {
              case "string":
                args.value = val;
                return new AST_String(args);
              case "number":
                args.value = val;
                return new AST_Number(args);
              case "boolean":
                return new (val ? AST_True : AST_False)(args);
              default:
                var rx = M.regex;
                if (rx && rx.pattern) {
                    // RegExpLiteral as per ESTree AST spec
                    args.value = new RegExp(rx.pattern, rx.flags).toString();
                } else {
                    // support legacy RegExp
                    args.value = M.regex && M.raw ? M.raw : val;
                }
                return new AST_RegExp(args);
            }
        },
        Identifier: function(M) {
            var p = FROM_MOZ_STACK[FROM_MOZ_STACK.length - 2];
            return new (  p.type == "LabeledStatement" ? AST_Label
                        : p.type == "VariableDeclarator" && p.id === M ? (p.kind == "const" ? AST_SymbolConst : AST_SymbolVar)
                        : p.type == "FunctionExpression" ? (p.id === M ? AST_SymbolLambda : AST_SymbolFunarg)
                        : p.type == "FunctionDeclaration" ? (p.id === M ? AST_SymbolDefun : AST_SymbolFunarg)
                        : p.type == "CatchClause" ? AST_SymbolCatch
                        : p.type == "BreakStatement" || p.type == "ContinueStatement" ? AST_LabelRef
                        : AST_SymbolRef)({
                            start : my_start_token(M),
                            end   : my_end_token(M),
                            name  : M.name
                        });
        }
    };

    MOZ_TO_ME.UpdateExpression =
    MOZ_TO_ME.UnaryExpression = function To_Moz_Unary(M) {
        var prefix = "prefix" in M ? M.prefix
            : M.type == "UnaryExpression" ? true : false;
        return new (prefix ? AST_UnaryPrefix : AST_UnaryPostfix)({
            start      : my_start_token(M),
            end        : my_end_token(M),
            operator   : M.operator,
            expression : from_moz(M.argument)
        });
    };

    map("EmptyStatement", AST_EmptyStatement);
    map("BlockStatement", AST_BlockStatement, "body@body");
    map("IfStatement", AST_If, "test>condition, consequent>body, alternate>alternative");
    map("LabeledStatement", AST_LabeledStatement, "label>label, body>body");
    map("BreakStatement", AST_Break, "label>label");
    map("ContinueStatement", AST_Continue, "label>label");
    map("WithStatement", AST_With, "object>expression, body>body");
    map("SwitchStatement", AST_Switch, "discriminant>expression, cases@body");
    map("ReturnStatement", AST_Return, "argument>value");
    map("ThrowStatement", AST_Throw, "argument>value");
    map("WhileStatement", AST_While, "test>condition, body>body");
    map("DoWhileStatement", AST_Do, "test>condition, body>body");
    map("ForStatement", AST_For, "init>init, test>condition, update>step, body>body");
    map("ForInStatement", AST_ForIn, "left>init, right>object, body>body");
    map("DebuggerStatement", AST_Debugger);
    map("VariableDeclarator", AST_VarDef, "id>name, init>value");
    map("CatchClause", AST_Catch, "param>argname, body%body");

    map("ThisExpression", AST_This);
    map("BinaryExpression", AST_Binary, "operator=operator, left>left, right>right");
    map("LogicalExpression", AST_Binary, "operator=operator, left>left, right>right");
    map("AssignmentExpression", AST_Assign, "operator=operator, left>left, right>right");
    map("ConditionalExpression", AST_Conditional, "test>condition, consequent>consequent, alternate>alternative");
    map("NewExpression", AST_New, "callee>expression, arguments@args");
    map("CallExpression", AST_Call, "callee>expression, arguments@args");

    def_to_moz(AST_Toplevel, function To_Moz_Program(M) {
        return to_moz_scope("Program", M);
    });

    def_to_moz(AST_Defun, function To_Moz_FunctionDeclaration(M) {
        return {
            type: "FunctionDeclaration",
            id: to_moz(M.name),
            params: M.argnames.map(to_moz),
            body: to_moz_scope("BlockStatement", M)
        }
    });

    def_to_moz(AST_Function, function To_Moz_FunctionExpression(M) {
        return {
            type: "FunctionExpression",
            id: to_moz(M.name),
            params: M.argnames.map(to_moz),
            body: to_moz_scope("BlockStatement", M)
        }
    });

    def_to_moz(AST_Directive, function To_Moz_Directive(M) {
        return {
            type: "ExpressionStatement",
            expression: {
                type: "Literal",
                value: M.value
            }
        };
    });

    def_to_moz(AST_SimpleStatement, function To_Moz_ExpressionStatement(M) {
        return {
            type: "ExpressionStatement",
            expression: to_moz(M.body)
        };
    });

    def_to_moz(AST_SwitchBranch, function To_Moz_SwitchCase(M) {
        return {
            type: "SwitchCase",
            test: to_moz(M.expression),
            consequent: M.body.map(to_moz)
        };
    });

    def_to_moz(AST_Try, function To_Moz_TryStatement(M) {
        return {
            type: "TryStatement",
            block: to_moz_block(M),
            handler: to_moz(M.bcatch),
            guardedHandlers: [],
            finalizer: to_moz(M.bfinally)
        };
    });

    def_to_moz(AST_Catch, function To_Moz_CatchClause(M) {
        return {
            type: "CatchClause",
            param: to_moz(M.argname),
            guard: null,
            body: to_moz_block(M)
        };
    });

    def_to_moz(AST_Definitions, function To_Moz_VariableDeclaration(M) {
        return {
            type: "VariableDeclaration",
            kind: M instanceof AST_Const ? "const" : "var",
            declarations: M.definitions.map(to_moz)
        };
    });

    def_to_moz(AST_Seq, function To_Moz_SequenceExpression(M) {
        return {
            type: "SequenceExpression",
            expressions: M.to_array().map(to_moz)
        };
    });

    def_to_moz(AST_PropAccess, function To_Moz_MemberExpression(M) {
        var isComputed = M instanceof AST_Sub;
        return {
            type: "MemberExpression",
            object: to_moz(M.expression),
            computed: isComputed,
            property: isComputed ? to_moz(M.property) : {type: "Identifier", name: M.property}
        };
    });

    def_to_moz(AST_Unary, function To_Moz_Unary(M) {
        return {
            type: M.operator == "++" || M.operator == "--" ? "UpdateExpression" : "UnaryExpression",
            operator: M.operator,
            prefix: M instanceof AST_UnaryPrefix,
            argument: to_moz(M.expression)
        };
    });

    def_to_moz(AST_Binary, function To_Moz_BinaryExpression(M) {
        return {
            type: M.operator == "&&" || M.operator == "||" ? "LogicalExpression" : "BinaryExpression",
            left: to_moz(M.left),
            operator: M.operator,
            right: to_moz(M.right)
        };
    });

    def_to_moz(AST_Array, function To_Moz_ArrayExpression(M) {
        return {
            type: "ArrayExpression",
            elements: M.elements.map(to_moz)
        };
    });

    def_to_moz(AST_Object, function To_Moz_ObjectExpression(M) {
        return {
            type: "ObjectExpression",
            properties: M.properties.map(to_moz)
        };
    });

    def_to_moz(AST_ObjectProperty, function To_Moz_Property(M) {
        var key = {
            type: "Literal",
            value: M.key instanceof AST_SymbolAccessor ? M.key.name : M.key
        };
        var kind;
        if (M instanceof AST_ObjectKeyVal) {
            kind = "init";
        } else
        if (M instanceof AST_ObjectGetter) {
            kind = "get";
        } else
        if (M instanceof AST_ObjectSetter) {
            kind = "set";
        }
        return {
            type: "Property",
            kind: kind,
            key: key,
            value: to_moz(M.value)
        };
    });

    def_to_moz(AST_Symbol, function To_Moz_Identifier(M) {
        var def = M.definition();
        return {
            type: "Identifier",
            name: def ? def.mangled_name || def.name : M.name
        };
    });

    def_to_moz(AST_RegExp, function To_Moz_RegExpLiteral(M) {
        var value = M.value;
        return {
            type: "Literal",
            value: value,
            raw: value.toString(),
            regex: {
                pattern: value.source,
                flags: value.toString().match(/[gimuy]*$/)[0]
            }
        };
    });

    def_to_moz(AST_Constant, function To_Moz_Literal(M) {
        var value = M.value;
        if (typeof value === 'number' && (value < 0 || (value === 0 && 1 / value < 0))) {
            return {
                type: "UnaryExpression",
                operator: "-",
                prefix: true,
                argument: {
                    type: "Literal",
                    value: -value,
                    raw: M.start.raw
                }
            };
        }
        return {
            type: "Literal",
            value: value,
            raw: M.start.raw
        };
    });

    def_to_moz(AST_Atom, function To_Moz_Atom(M) {
        return {
            type: "Identifier",
            name: String(M.value)
        };
    });

    AST_Boolean.DEFMETHOD("to_mozilla_ast", AST_Constant.prototype.to_mozilla_ast);
    AST_Null.DEFMETHOD("to_mozilla_ast", AST_Constant.prototype.to_mozilla_ast);
    AST_Hole.DEFMETHOD("to_mozilla_ast", function To_Moz_ArrayHole() { return null });

    AST_Block.DEFMETHOD("to_mozilla_ast", AST_BlockStatement.prototype.to_mozilla_ast);
    AST_Lambda.DEFMETHOD("to_mozilla_ast", AST_Function.prototype.to_mozilla_ast);

    /* -----[ tools ]----- */

    function raw_token(moznode) {
        if (moznode.type == "Literal") {
            return moznode.raw != null ? moznode.raw : moznode.value + "";
        }
    }

    function my_start_token(moznode) {
        var loc = moznode.loc, start = loc && loc.start;
        var range = moznode.range;
        return new AST_Token({
            file    : loc && loc.source,
            line    : start && start.line,
            col     : start && start.column,
            pos     : range ? range[0] : moznode.start,
            endline : start && start.line,
            endcol  : start && start.column,
            endpos  : range ? range[0] : moznode.start,
            raw     : raw_token(moznode),
        });
    };

    function my_end_token(moznode) {
        var loc = moznode.loc, end = loc && loc.end;
        var range = moznode.range;
        return new AST_Token({
            file    : loc && loc.source,
            line    : end && end.line,
            col     : end && end.column,
            pos     : range ? range[1] : moznode.end,
            endline : end && end.line,
            endcol  : end && end.column,
            endpos  : range ? range[1] : moznode.end,
            raw     : raw_token(moznode),
        });
    };

    function map(moztype, mytype, propmap) {
        var moz_to_me = "function From_Moz_" + moztype + "(M){\n";
        moz_to_me += "return new U2." + mytype.name + "({\n" +
            "start: my_start_token(M),\n" +
            "end: my_end_token(M)";

        var me_to_moz = "function To_Moz_" + moztype + "(M){\n";
        me_to_moz += "return {\n" +
            "type: " + JSON.stringify(moztype);

        if (propmap) propmap.split(/\s*,\s*/).forEach(function(prop){
            var m = /([a-z0-9$_]+)(=|@|>|%)([a-z0-9$_]+)/i.exec(prop);
            if (!m) throw new Error("Can't understand property map: " + prop);
            var moz = m[1], how = m[2], my = m[3];
            moz_to_me += ",\n" + my + ": ";
            me_to_moz += ",\n" + moz + ": ";
            switch (how) {
                case "@":
                    moz_to_me += "M." + moz + ".map(from_moz)";
                    me_to_moz += "M." +  my + ".map(to_moz)";
                    break;
                case ">":
                    moz_to_me += "from_moz(M." + moz + ")";
                    me_to_moz += "to_moz(M." + my + ")";
                    break;
                case "=":
                    moz_to_me += "M." + moz;
                    me_to_moz += "M." + my;
                    break;
                case "%":
                    moz_to_me += "from_moz(M." + moz + ").body";
                    me_to_moz += "to_moz_block(M)";
                    break;
                default:
                    throw new Error("Can't understand operator in propmap: " + prop);
            }
        });

        moz_to_me += "\n})\n}";
        me_to_moz += "\n}\n}";

        //moz_to_me = parse(moz_to_me).print_to_string({ beautify: true });
        //me_to_moz = parse(me_to_moz).print_to_string({ beautify: true });
        //console.log(moz_to_me);

        moz_to_me = new Function("U2", "my_start_token", "my_end_token", "from_moz", "return(" + moz_to_me + ")")(
            exports, my_start_token, my_end_token, from_moz
        );
        me_to_moz = new Function("to_moz", "to_moz_block", "to_moz_scope", "return(" + me_to_moz + ")")(
            to_moz, to_moz_block, to_moz_scope
        );
        MOZ_TO_ME[moztype] = moz_to_me;
        def_to_moz(mytype, me_to_moz);
    };

    var FROM_MOZ_STACK = null;

    function from_moz(node) {
        FROM_MOZ_STACK.push(node);
        var ret = node != null ? MOZ_TO_ME[node.type](node) : null;
        FROM_MOZ_STACK.pop();
        return ret;
    };

    AST_Node.from_mozilla_ast = function(node){
        var save_stack = FROM_MOZ_STACK;
        FROM_MOZ_STACK = [];
        var ast = from_moz(node);
        FROM_MOZ_STACK = save_stack;
        return ast;
    };

    function set_moz_loc(mynode, moznode, myparent) {
        var start = mynode.start;
        var end = mynode.end;
        if (start.pos != null && end.endpos != null) {
            moznode.range = [start.pos, end.endpos];
        }
        if (start.line) {
            moznode.loc = {
                start: {line: start.line, column: start.col},
                end: end.endline ? {line: end.endline, column: end.endcol} : null
            };
            if (start.file) {
                moznode.loc.source = start.file;
            }
        }
        return moznode;
    };

    function def_to_moz(mytype, handler) {
        mytype.DEFMETHOD("to_mozilla_ast", function() {
            return set_moz_loc(this, handler(this));
        });
    };

    function to_moz(node) {
        return node != null ? node.to_mozilla_ast() : null;
    };

    function to_moz_block(node) {
        return {
            type: "BlockStatement",
            body: node.body.map(to_moz)
        };
    };

    function to_moz_scope(type, node) {
        var body = node.body.map(to_moz);
        if (node.body[0] instanceof AST_SimpleStatement && node.body[0].body instanceof AST_String) {
            body.unshift(to_moz(new AST_EmptyStatement(node.body[0])));
        }
        return {
            type: type,
            body: body
        };
    };
})();

/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

function find_builtins() {
    // NaN will be included due to Number.NaN
    var a = [
        "null",
        "true",
        "false",
        "Infinity",
        "-Infinity",
        "undefined",
    ];
    [ Object, Array, Function, Number,
      String, Boolean, Error, Math,
      Date, RegExp
    ].forEach(function(ctor){
        Object.getOwnPropertyNames(ctor).map(add);
        if (ctor.prototype) {
            Object.getOwnPropertyNames(ctor.prototype).map(add);
        }
    });
    function add(name) {
        push_uniq(a, name);
    }
    return a;
}

function mangle_properties(ast, options) {
    options = defaults(options, {
        cache: null,
        debug: false,
        ignore_quoted: false,
        only_cache: false,
        regex: null,
        reserved: null,
    });

    var reserved = options.reserved;
    if (reserved == null)
        reserved = find_builtins();

    var cache = options.cache;
    if (cache == null) {
        cache = {
            cname: -1,
            props: new Dictionary()
        };
    }

    var regex = options.regex;
    var ignore_quoted = options.ignore_quoted;

    // note debug is either false (disabled), or a string of the debug suffix to use (enabled).
    // note debug may be enabled as an empty string, which is falsey. Also treat passing 'true'
    // the same as passing an empty string.
    var debug = (options.debug !== false);
    var debug_name_suffix;
    if (debug) {
        debug_name_suffix = (options.debug === true ? "" : options.debug);
    }

    var names_to_mangle = [];
    var unmangleable = [];
    var ignored = {};

    // step 1: find candidates to mangle
    ast.walk(new TreeWalker(function(node){
        if (node instanceof AST_ObjectKeyVal) {
            add(node.key, ignore_quoted && node.quote);
        }
        else if (node instanceof AST_ObjectProperty) {
            // setter or getter, since KeyVal is handled above
            add(node.key.name);
        }
        else if (node instanceof AST_Dot) {
            add(node.property);
        }
        else if (node instanceof AST_Sub) {
            addStrings(node.property, ignore_quoted);
        }
    }));

    // step 2: transform the tree, renaming properties
    return ast.transform(new TreeTransformer(function(node){
        if (node instanceof AST_ObjectKeyVal) {
            if (!(ignore_quoted && node.quote))
                node.key = mangle(node.key);
        }
        else if (node instanceof AST_ObjectProperty) {
            // setter or getter
            node.key.name = mangle(node.key.name);
        }
        else if (node instanceof AST_Dot) {
            node.property = mangle(node.property);
        }
        else if (node instanceof AST_Sub) {
            if (!ignore_quoted)
                node.property = mangleStrings(node.property);
        }
        // else if (node instanceof AST_String) {
        //     if (should_mangle(node.value)) {
        //         AST_Node.warn(
        //             "Found \"{prop}\" property candidate for mangling in an arbitrary string [{file}:{line},{col}]", {
        //                 file : node.start.file,
        //                 line : node.start.line,
        //                 col  : node.start.col,
        //                 prop : node.value
        //             }
        //         );
        //     }
        // }
    }));

    // only function declarations after this line

    function can_mangle(name) {
        if (unmangleable.indexOf(name) >= 0) return false;
        if (reserved.indexOf(name) >= 0) return false;
        if (options.only_cache) {
            return cache.props.has(name);
        }
        if (/^-?[0-9]+(\.[0-9]+)?(e[+-][0-9]+)?$/.test(name)) return false;
        return true;
    }

    function should_mangle(name) {
        if (ignore_quoted && name in ignored) return false;
        if (regex && !regex.test(name)) return false;
        if (reserved.indexOf(name) >= 0) return false;
        return cache.props.has(name)
            || names_to_mangle.indexOf(name) >= 0;
    }

    function add(name, ignore) {
        if (ignore) {
            ignored[name] = true;
            return;
        }

        if (can_mangle(name))
            push_uniq(names_to_mangle, name);

        if (!should_mangle(name)) {
            push_uniq(unmangleable, name);
        }
    }

    function mangle(name) {
        if (!should_mangle(name)) {
            return name;
        }

        var mangled = cache.props.get(name);
        if (!mangled) {
            if (debug) {
                // debug mode: use a prefix and suffix to preserve readability, e.g. o.foo -> o._$foo$NNN_.
                var debug_mangled = "_$" + name + "$" + debug_name_suffix + "_";

                if (can_mangle(debug_mangled) && !(ignore_quoted && debug_mangled in ignored)) {
                    mangled = debug_mangled;
                }
            }

            // either debug mode is off, or it is on and we could not use the mangled name
            if (!mangled) {
                // note can_mangle() does not check if the name collides with the 'ignored' set
                // (filled with quoted properties when ignore_quoted set). Make sure we add this
                // check so we don't collide with a quoted name.
                do {
                    mangled = base54(++cache.cname);
                } while (!can_mangle(mangled) || (ignore_quoted && mangled in ignored));
            }

            cache.props.set(name, mangled);
        }
        return mangled;
    }

    function addStrings(node, ignore) {
        var out = {};
        try {
            (function walk(node){
                node.walk(new TreeWalker(function(node){
                    if (node instanceof AST_Seq) {
                        walk(node.cdr);
                        return true;
                    }
                    if (node instanceof AST_String) {
                        add(node.value, ignore);
                        return true;
                    }
                    if (node instanceof AST_Conditional) {
                        walk(node.consequent);
                        walk(node.alternative);
                        return true;
                    }
                    throw out;
                }));
            })(node);
        } catch(ex) {
            if (ex !== out) throw ex;
        }
    }

    function mangleStrings(node) {
        return node.transform(new TreeTransformer(function(node){
            if (node instanceof AST_Seq) {
                node.cdr = mangleStrings(node.cdr);
            }
            else if (node instanceof AST_String) {
                node.value = mangle(node.value);
            }
            else if (node instanceof AST_Conditional) {
                node.consequent = mangleStrings(node.consequent);
                node.alternative = mangleStrings(node.alternative);
            }
            return node;
        }));
    }

}

exports["Compressor"] = Compressor;
exports["DefaultsError"] = DefaultsError;
exports["Dictionary"] = Dictionary;
exports["JS_Parse_Error"] = JS_Parse_Error;
exports["MAP"] = MAP;
exports["OutputStream"] = OutputStream;
exports["SourceMap"] = SourceMap;
exports["TreeTransformer"] = TreeTransformer;
exports["TreeWalker"] = TreeWalker;
exports["base54"] = base54;
exports["defaults"] = defaults;
exports["mangle_properties"] = mangle_properties;
exports["merge"] = merge;
exports["parse"] = parse;
exports["push_uniq"] = push_uniq;
exports["string_template"] = string_template;
exports["tokenizer"] = tokenizer;
exports["is_identifier"] = is_identifier;
exports["SymbolDef"] = SymbolDef;


exports.sys = sys;
exports.MOZ_SourceMap = MOZ_SourceMap;
exports.UglifyJS = UglifyJS;
exports.array_to_hash = array_to_hash;
exports.slice = slice;
exports.characters = characters;
exports.member = member;
exports.find_if = find_if;
exports.repeat_string = repeat_string;
exports.configure_error_stack = configure_error_stack;
exports.DefaultsError = DefaultsError;
exports.defaults = defaults;
exports.merge = merge;
exports.noop = noop;
exports.return_false = return_false;
exports.return_true = return_true;
exports.return_this = return_this;
exports.return_null = return_null;
exports.MAP = MAP;
exports.push_uniq = push_uniq;
exports.string_template = string_template;
exports.remove = remove;
exports.mergeSort = mergeSort;
exports.set_difference = set_difference;
exports.set_intersection = set_intersection;
exports.makePredicate = makePredicate;
exports.all = all;
exports.Dictionary = Dictionary;
exports.HOP = HOP;
exports.first_in_statement = first_in_statement;
exports.DEFNODE = DEFNODE;
exports.AST_Token = AST_Token;
exports.AST_Node = AST_Node;
exports.AST_Statement = AST_Statement;
exports.AST_Debugger = AST_Debugger;
exports.AST_Directive = AST_Directive;
exports.AST_SimpleStatement = AST_SimpleStatement;
exports.walk_body = walk_body;
exports.AST_Block = AST_Block;
exports.AST_BlockStatement = AST_BlockStatement;
exports.AST_EmptyStatement = AST_EmptyStatement;
exports.AST_StatementWithBody = AST_StatementWithBody;
exports.AST_LabeledStatement = AST_LabeledStatement;
exports.AST_IterationStatement = AST_IterationStatement;
exports.AST_DWLoop = AST_DWLoop;
exports.AST_Do = AST_Do;
exports.AST_While = AST_While;
exports.AST_For = AST_For;
exports.AST_ForIn = AST_ForIn;
exports.AST_With = AST_With;
exports.AST_Scope = AST_Scope;
exports.AST_Toplevel = AST_Toplevel;
exports.AST_Lambda = AST_Lambda;
exports.AST_Accessor = AST_Accessor;
exports.AST_Function = AST_Function;
exports.AST_Defun = AST_Defun;
exports.AST_Jump = AST_Jump;
exports.AST_Exit = AST_Exit;
exports.AST_Return = AST_Return;
exports.AST_Throw = AST_Throw;
exports.AST_LoopControl = AST_LoopControl;
exports.AST_Break = AST_Break;
exports.AST_Continue = AST_Continue;
exports.AST_If = AST_If;
exports.AST_Switch = AST_Switch;
exports.AST_SwitchBranch = AST_SwitchBranch;
exports.AST_Default = AST_Default;
exports.AST_Case = AST_Case;
exports.AST_Try = AST_Try;
exports.AST_Catch = AST_Catch;
exports.AST_Finally = AST_Finally;
exports.AST_Definitions = AST_Definitions;
exports.AST_Var = AST_Var;
exports.AST_Const = AST_Const;
exports.AST_VarDef = AST_VarDef;
exports.AST_Call = AST_Call;
exports.AST_New = AST_New;
exports.AST_Seq = AST_Seq;
exports.AST_PropAccess = AST_PropAccess;
exports.AST_Dot = AST_Dot;
exports.AST_Sub = AST_Sub;
exports.AST_Unary = AST_Unary;
exports.AST_UnaryPrefix = AST_UnaryPrefix;
exports.AST_UnaryPostfix = AST_UnaryPostfix;
exports.AST_Binary = AST_Binary;
exports.AST_Conditional = AST_Conditional;
exports.AST_Assign = AST_Assign;
exports.AST_Array = AST_Array;
exports.AST_Object = AST_Object;
exports.AST_ObjectProperty = AST_ObjectProperty;
exports.AST_ObjectKeyVal = AST_ObjectKeyVal;
exports.AST_ObjectSetter = AST_ObjectSetter;
exports.AST_ObjectGetter = AST_ObjectGetter;
exports.AST_Symbol = AST_Symbol;
exports.AST_SymbolAccessor = AST_SymbolAccessor;
exports.AST_SymbolDeclaration = AST_SymbolDeclaration;
exports.AST_SymbolVar = AST_SymbolVar;
exports.AST_SymbolConst = AST_SymbolConst;
exports.AST_SymbolFunarg = AST_SymbolFunarg;
exports.AST_SymbolDefun = AST_SymbolDefun;
exports.AST_SymbolLambda = AST_SymbolLambda;
exports.AST_SymbolCatch = AST_SymbolCatch;
exports.AST_Label = AST_Label;
exports.AST_SymbolRef = AST_SymbolRef;
exports.AST_LabelRef = AST_LabelRef;
exports.AST_This = AST_This;
exports.AST_Constant = AST_Constant;
exports.AST_String = AST_String;
exports.AST_Number = AST_Number;
exports.AST_RegExp = AST_RegExp;
exports.AST_Atom = AST_Atom;
exports.AST_Null = AST_Null;
exports.AST_NaN = AST_NaN;
exports.AST_Undefined = AST_Undefined;
exports.AST_Hole = AST_Hole;
exports.AST_Infinity = AST_Infinity;
exports.AST_Boolean = AST_Boolean;
exports.AST_False = AST_False;
exports.AST_True = AST_True;
exports.TreeWalker = TreeWalker;
exports.KEYWORDS = KEYWORDS;
exports.KEYWORDS_ATOM = KEYWORDS_ATOM;
exports.RESERVED_WORDS = RESERVED_WORDS;
exports.KEYWORDS_BEFORE_EXPRESSION = KEYWORDS_BEFORE_EXPRESSION;
exports.OPERATOR_CHARS = OPERATOR_CHARS;
exports.RE_HEX_NUMBER = RE_HEX_NUMBER;
exports.RE_OCT_NUMBER = RE_OCT_NUMBER;
exports.OPERATORS = OPERATORS;
exports.WHITESPACE_CHARS = WHITESPACE_CHARS;
exports.NEWLINE_CHARS = NEWLINE_CHARS;
exports.PUNC_BEFORE_EXPRESSION = PUNC_BEFORE_EXPRESSION;
exports.PUNC_CHARS = PUNC_CHARS;
exports.REGEXP_MODIFIERS = REGEXP_MODIFIERS;
exports.UNICODE = UNICODE;
exports.is_letter = is_letter;
exports.is_digit = is_digit;
exports.is_alphanumeric_char = is_alphanumeric_char;
exports.is_unicode_digit = is_unicode_digit;
exports.is_unicode_combining_mark = is_unicode_combining_mark;
exports.is_unicode_connector_punctuation = is_unicode_connector_punctuation;
exports.is_identifier = is_identifier;
exports.is_identifier_start = is_identifier_start;
exports.is_identifier_char = is_identifier_char;
exports.is_identifier_string = is_identifier_string;
exports.parse_js_number = parse_js_number;
exports.JS_Parse_Error = JS_Parse_Error;
exports.js_error = js_error;
exports.is_token = is_token;
exports.EX_EOF = EX_EOF;
exports.tokenizer = tokenizer;
exports.UNARY_PREFIX = UNARY_PREFIX;
exports.UNARY_POSTFIX = UNARY_POSTFIX;
exports.ASSIGNMENT = ASSIGNMENT;
exports.PRECEDENCE = PRECEDENCE;
exports.STATEMENTS_WITH_LABELS = STATEMENTS_WITH_LABELS;
exports.ATOMIC_START_TOKEN = ATOMIC_START_TOKEN;
exports.parse = parse;
exports.TreeTransformer = TreeTransformer;
exports.SymbolDef = SymbolDef;
exports.base54 = base54;
exports.EXPECT_DIRECTIVE = EXPECT_DIRECTIVE;
exports.is_some_comments = is_some_comments;
exports.OutputStream = OutputStream;
exports.Compressor = Compressor;
exports.SourceMap = SourceMap;
exports.find_builtins = find_builtins;
exports.mangle_properties = mangle_properties;

exports.AST_Node.warn_function = function (txt) { if (typeof console != "undefined" && typeof console.warn === "function") console.warn(txt) }

exports.minify = function(files, options) {
    options = UglifyJS.defaults(options, {
        compress         : {},
        fromString       : false,
        inSourceMap      : null,
        mangle           : {},
        mangleProperties : false,
        nameCache        : null,
        outFileName      : null,
        output           : null,
        outSourceMap     : null,
        parse            : {},
        sourceMapInline  : false,
        sourceMapUrl     : null,
        sourceRoot       : null,
        spidermonkey     : false,
        warnings         : false,
    });
    UglifyJS.base54.reset();

    var inMap = options.inSourceMap;
    if (typeof inMap == "string" && inMap != "inline") {
        inMap = JSON.parse(fs.readFileSync(inMap, "utf8"));
    }

    // 1. parse
    var toplevel = null,
        sourcesContent = {};

    if (options.spidermonkey) {
        if (inMap == "inline") {
            throw new Error("inline source map only works with built-in parser");
        }
        toplevel = UglifyJS.AST_Node.from_mozilla_ast(files);
    } else {
        function addFile(file, fileUrl) {
            var code = options.fromString
                ? file
                : fs.readFileSync(file, "utf8");
            if (inMap == "inline") {
                inMap = read_source_map(code);
            }
            sourcesContent[fileUrl] = code;
            toplevel = UglifyJS.parse(code, {
                filename: fileUrl,
                toplevel: toplevel,
                bare_returns: options.parse ? options.parse.bare_returns : undefined
            });
        }
        if (!options.fromString) {
            files = UglifyJS.simple_glob(files);
            if (inMap == "inline" && files.length > 1) {
                throw new Error("inline source map only works with singular input");
            }
        }
        [].concat(files).forEach(function (files, i) {
            if (typeof files === 'string') {
                addFile(files, options.fromString ? i : files);
            } else {
                for (var fileUrl in files) {
                    addFile(files[fileUrl], fileUrl);
                }
            }
        });
    }
    if (options.wrap) {
      toplevel = toplevel.wrap_commonjs(options.wrap, options.exportAll);
    }

    // 2. compress
    if (options.compress) {
        var compress = { warnings: options.warnings };
        UglifyJS.merge(compress, options.compress);
        toplevel.figure_out_scope(options.mangle);
        var sq = UglifyJS.Compressor(compress);
        toplevel = sq.compress(toplevel);
    }

    // 3. mangle properties
    if (options.mangleProperties || options.nameCache) {
        options.mangleProperties.cache = UglifyJS.readNameCache(options.nameCache, "props");
        toplevel = UglifyJS.mangle_properties(toplevel, options.mangleProperties);
        UglifyJS.writeNameCache(options.nameCache, "props", options.mangleProperties.cache);
    }

    // 4. mangle
    if (options.mangle) {
        toplevel.figure_out_scope(options.mangle);
        toplevel.compute_char_frequency(options.mangle);
        toplevel.mangle_names(options.mangle);
    }

    // 5. output
    var output = { max_line_len: 32000 };
    if (options.outSourceMap || options.sourceMapInline) {
        output.source_map = UglifyJS.SourceMap({
            // prefer outFileName, otherwise use outSourceMap without .map suffix
            file: options.outFileName || (typeof options.outSourceMap === 'string' ? options.outSourceMap.replace(/\.map$/i, '') : null),
            orig: inMap,
            root: options.sourceRoot
        });
        if (options.sourceMapIncludeSources) {
            for (var file in sourcesContent) {
                if (sourcesContent.hasOwnProperty(file)) {
                    output.source_map.get().setSourceContent(file, sourcesContent[file]);
                }
            }
        }

    }
    if (options.output) {
        UglifyJS.merge(output, options.output);
    }
    var stream = UglifyJS.OutputStream(output);
    toplevel.print(stream);


    var source_map = output.source_map;
    if (source_map) {
        source_map = source_map + "";
    }

    var mappingUrlPrefix = "\n//# sourceMappingURL=";
    if (options.sourceMapInline) {
        stream += mappingUrlPrefix + "data:application/json;charset=utf-8;base64," + new Buffer(source_map).toString("base64");
    } else if (options.outSourceMap && typeof options.outSourceMap === "string" && options.sourceMapUrl !== false) {
        stream += mappingUrlPrefix + (typeof options.sourceMapUrl === "string" ? options.sourceMapUrl : options.outSourceMap);
    }

    return {
        code : stream + "",
        map  : source_map
    };
};

exports.describe_ast = function() {
    var out = UglifyJS.OutputStream({ beautify: true });
    function doitem(ctor) {
        out.print("AST_" + ctor.TYPE);
        var props = ctor.SELF_PROPS.filter(function(prop){
            return !/^\$/.test(prop);
        });
        if (props.length > 0) {
            out.space();
            out.with_parens(function(){
                props.forEach(function(prop, i){
                    if (i) out.space();
                    out.print(prop);
                });
            });
        }
        if (ctor.documentation) {
            out.space();
            out.print_string(ctor.documentation);
        }
        if (ctor.SUBCLASSES.length > 0) {
            out.space();
            out.with_block(function(){
                ctor.SUBCLASSES.forEach(function(ctor, i){
                    out.indent();
                    doitem(ctor);
                    out.newline();
                });
            });
        }
    };
    doitem(UglifyJS.AST_Node);
    return out + "";
};
}).call(this,require("buffer").Buffer)
},{"buffer":2,"source-map":31,"util":7}]},{},[8]);
