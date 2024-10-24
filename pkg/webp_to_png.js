

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_0.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * @param {Uint8Array} webp_data
 * @returns {Uint8Array}
 */
export function webp_to_png(webp_data) {
    const ptr0 = passArray8ToWasm0(webp_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.webp_to_png(ptr0, len0);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

/**
 * Sample position for subsampled chroma
 */
export const ChromaSamplePosition = Object.freeze({
/**
 * The source video transfer function must be signaled
 * outside the AV1 bitstream.
 */
Unknown:0,"0":"Unknown",
/**
 * Horizontally co-located with (0, 0) luma sample, vertically positioned
 * in the middle between two luma samples.
 */
Vertical:1,"1":"Vertical",
/**
 * Co-located with (0, 0) luma sample.
 */
Colocated:2,"2":"Colocated", });
/**
 * Chroma subsampling format
 */
export const ChromaSampling = Object.freeze({
/**
 * Both vertically and horizontally subsampled.
 */
Cs420:0,"0":"Cs420",
/**
 * Horizontally subsampled.
 */
Cs422:1,"1":"Cs422",
/**
 * Not subsampled.
 */
Cs444:2,"2":"Cs444",
/**
 * Monochrome.
 */
Cs400:3,"3":"Cs400", });
/**
 * Allowed pixel value range
 *
 * C.f. `VideoFullRangeFlag` variable specified in ISO/IEC 23091-4/ITU-T H.273
 */
export const PixelRange = Object.freeze({
/**
 * Studio swing representation
 */
Limited:0,"0":"Limited",
/**
 * Full swing representation
 */
Full:1,"1":"Full", });

export const Tune = Object.freeze({ Psnr:0,"0":"Psnr",Psychovisual:1,"1":"Psychovisual", });

const imports = {
    __wbindgen_placeholder__: {
        __wbindgen_string_new: function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_export_0;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
            ;
        },
    },

};

const wasm_url = new URL('webp_to_png_bg.wasm', import.meta.url);
let wasmCode = '';
switch (wasm_url.protocol) {
    case 'file:':
    wasmCode = await Deno.readFile(wasm_url);
    break
    case 'https:':
    case 'http:':
    wasmCode = await (await fetch(wasm_url)).arrayBuffer();
    break
    default:
    throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);
}

const wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;
const wasm = wasmInstance.exports;
export const __wasm = wasm;

wasm.__wbindgen_start();

