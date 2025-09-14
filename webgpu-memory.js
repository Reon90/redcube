/* webgpu-memory@1.5.3, license MIT */
/* eslint-disable no-sparse-arrays */
/*
This file was copied and modified from the WebGPU Conformance Test Suite
https://github.com/gpuweb/cts/blob/main/src/webgpu/capability_info.ts

Note: Changes include adding bytesPerBlock to depth24plus, depth24plus-stencil8
and depth32-stencil8

Copyright 2019 WebGPU CTS Contributors

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

   3. Neither the name of the copyright holder nor the names of its
      contributors may be used to endorse or promote products derived from this
      software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**
 * Defaults applied to all texture format tables automatically. Used only inside
 * `formatTableWithDefaults`. This ensures keys are never missing, always explicitly `undefined`.
 *
 * All top-level keys must be defined here, or they won't be exposed at all.
 * Documentation is also written here; this makes it propagate through to the end types.
 */
const kFormatUniversalDefaults = {
    /** Texel block width. */
    blockWidth: undefined,
    /** Texel block height. */
    blockHeight: undefined,
    color: undefined,
    depth: undefined,
    stencil: undefined,
    /**
     * Info when this format can be used as a color render target. The format may require a feature
     * to actually be used as a render target. Eg: rg11b10ufloat which requires rg11b10ufloat-renderable
     * Call {@link isTextureFormatPossiblyUsableAsColorRenderAttachment} before having a device
     * Call {@link isTextureFormatColorRenderable}(device, format) to find out for a particular device.
     * Use {@link kPossibleColorRenderableTextureFormats} for params.
     */
    colorRender: undefined,
    /**
     * Whether the format can possibly be used as a multisample texture. The format may require a
     * feature to actually multisampled. Eg: rg11b10ufloat which requires rg11b10ufloat-renderable
     * Call {@link isTextureFormatPossiblyMultisampled} before having a device
     * Call {@link isTextureFormatMultisampled}(device, format) to find out for a particular device.
     * Use {@link kPossibleMultisampledTextureFormats} for params.
     */
    multisample: undefined,
    /** Optional feature required to use this format, or `undefined` if none. */
    feature: undefined,
    /** The base format for srgb formats. Specified on both srgb and equivalent non-srgb formats. */
    baseFormat: undefined,
    /** @deprecated Use `.color.bytes`, `.depth.bytes`, or `.stencil.bytes`. */
    bytesPerBlock: undefined,
    // IMPORTANT:
    // Add new top-level keys both here and in TextureFormatInfo_TypeCheck.
};
/**
 * Takes `table` and applies `defaults` to every row, i.e. for each row,
 * `{ ... kUniversalDefaults, ...defaults, ...row }`.
 * This only operates at the first level; it doesn't support defaults in nested objects.
 */
function formatTableWithDefaults({ defaults, table, }) {
    return Object.fromEntries(Object.entries(table).map(([k, row]) => [
        k,
        { ...kFormatUniversalDefaults, ...defaults, ...row },
    ])
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    );
}
/** "plain color formats", plus rgb9e5ufloat. */
const kRegularTextureFormatInfo = formatTableWithDefaults({
    defaults: { blockWidth: 1, blockHeight: 1 },
    table: {
        // plain, 8 bits per component
        r8unorm: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 1,
            },
            colorRender: { blend: true, resolve: true, byteCost: 1, alignment: 1 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        r8snorm: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 1,
            },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        r8uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 1,
            },
            colorRender: { blend: false, resolve: false, byteCost: 1, alignment: 1 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        r8sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 1,
            },
            colorRender: { blend: false, resolve: false, byteCost: 1, alignment: 1 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg8unorm: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 2,
            },
            colorRender: { blend: true, resolve: true, byteCost: 2, alignment: 1 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg8snorm: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 2,
            },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg8uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 2,
            },
            colorRender: { blend: false, resolve: false, byteCost: 2, alignment: 1 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg8sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 2,
            },
            colorRender: { blend: false, resolve: false, byteCost: 2, alignment: 1 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba8unorm: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: true, resolve: true, byteCost: 8, alignment: 1 },
            multisample: true,
            baseFormat: 'rgba8unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'rgba8unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: true, resolve: true, byteCost: 8, alignment: 1 },
            multisample: true,
            baseFormat: 'rgba8unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba8snorm: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 4,
            },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba8uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: false, resolve: false, byteCost: 4, alignment: 1 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba8sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: false, resolve: false, byteCost: 4, alignment: 1 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        bgra8unorm: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: true, resolve: true, byteCost: 8, alignment: 1 },
            multisample: true,
            baseFormat: 'bgra8unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bgra8unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: true, resolve: true, byteCost: 8, alignment: 1 },
            multisample: true,
            baseFormat: 'bgra8unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        // plain, 16 bits per component
        r16uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 2,
            },
            colorRender: { blend: false, resolve: false, byteCost: 2, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        r16sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 2,
            },
            colorRender: { blend: false, resolve: false, byteCost: 2, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        r16float: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 2,
            },
            colorRender: { blend: true, resolve: true, byteCost: 2, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg16uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: false, resolve: false, byteCost: 4, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg16sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: false, resolve: false, byteCost: 4, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg16float: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: true, resolve: true, byteCost: 4, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba16uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 8,
            },
            colorRender: { blend: false, resolve: false, byteCost: 8, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba16sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 8,
            },
            colorRender: { blend: false, resolve: false, byteCost: 8, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba16float: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 8,
            },
            colorRender: { blend: true, resolve: true, byteCost: 8, alignment: 2 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        // plain, 32 bits per component
        r32uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: true,
                bytes: 4,
            },
            colorRender: { blend: false, resolve: false, byteCost: 4, alignment: 4 },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        r32sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: true,
                bytes: 4,
            },
            colorRender: { blend: false, resolve: false, byteCost: 4, alignment: 4 },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        r32float: {
            color: {
                type: 'unfilterable-float',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: true,
                bytes: 4,
            },
            colorRender: { blend: false, resolve: false, byteCost: 4, alignment: 4 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg32uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 8,
            },
            colorRender: { blend: false, resolve: false, byteCost: 8, alignment: 4 },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg32sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 8,
            },
            colorRender: { blend: false, resolve: false, byteCost: 8, alignment: 4 },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg32float: {
            color: {
                type: 'unfilterable-float',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 8,
            },
            colorRender: { blend: false, resolve: false, byteCost: 8, alignment: 4 },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba32uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 16,
            },
            colorRender: { blend: false, resolve: false, byteCost: 16, alignment: 4 },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba32sint: {
            color: {
                type: 'sint',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 16,
            },
            colorRender: { blend: false, resolve: false, byteCost: 16, alignment: 4 },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgba32float: {
            color: {
                type: 'unfilterable-float',
                copySrc: true,
                copyDst: true,
                storage: true,
                readWriteStorage: false,
                bytes: 16,
            },
            colorRender: { blend: false, resolve: false, byteCost: 16, alignment: 4 },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        // plain, mixed component width, 32 bits per texel
        rgb10a2uint: {
            color: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: false, resolve: false, byteCost: 8, alignment: 4 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rgb10a2unorm: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: true, resolve: true, byteCost: 8, alignment: 4 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        rg11b10ufloat: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            colorRender: { blend: true, resolve: true, byteCost: 8, alignment: 4 },
            multisample: true,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        // packed
        rgb9e5ufloat: {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            multisample: false,
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
    },
});
// MAINTENANCE_TODO: Distinguishing "sized" and "unsized" depth stencil formats doesn't make sense
// because one aspect can be sized and one can be unsized. This should be cleaned up, but is kept
// this way during a migration phase.
const kSizedDepthStencilFormatInfo = formatTableWithDefaults({
    defaults: { blockWidth: 1, blockHeight: 1, multisample: true },
    table: {
        stencil8: {
            stencil: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 1,
            },
            bytesPerBlock: 1,
        },
        depth16unorm: {
            depth: {
                type: 'depth',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 2,
            },
            bytesPerBlock: 2,
        },
        depth32float: {
            depth: {
                type: 'depth',
                copySrc: true,
                copyDst: false,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            bytesPerBlock: 4,
        },
    },
});
const kUnsizedDepthStencilFormatInfo = formatTableWithDefaults({
    defaults: { blockWidth: 1, blockHeight: 1, multisample: true },
    table: {
        depth24plus: {
            depth: {
                type: 'depth',
                copySrc: false,
                copyDst: false,
                storage: false,
                readWriteStorage: false,
                bytes: undefined,
            },
            bytesPerBlock: 4,
        },
        'depth24plus-stencil8': {
            depth: {
                type: 'depth',
                copySrc: false,
                copyDst: false,
                storage: false,
                readWriteStorage: false,
                bytes: undefined,
            },
            stencil: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 1,
            },
            bytesPerBlock: 4,
        },
        'depth32float-stencil8': {
            depth: {
                type: 'depth',
                copySrc: true,
                copyDst: false,
                storage: false,
                readWriteStorage: false,
                bytes: 4,
            },
            stencil: {
                type: 'uint',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 1,
            },
            feature: 'depth32float-stencil8',
            bytesPerBlock: 5,
        },
    },
});
const kBCTextureFormatInfo = formatTableWithDefaults({
    defaults: {
        blockWidth: 4,
        blockHeight: 4,
        multisample: false,
        feature: 'texture-compression-bc',
    },
    table: {
        'bc1-rgba-unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            baseFormat: 'bc1-rgba-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc1-rgba-unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            baseFormat: 'bc1-rgba-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc2-rgba-unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'bc2-rgba-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc2-rgba-unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'bc2-rgba-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc3-rgba-unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'bc3-rgba-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc3-rgba-unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'bc3-rgba-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc4-r-unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc4-r-snorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc5-rg-unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc5-rg-snorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc6h-rgb-ufloat': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc6h-rgb-float': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc7-rgba-unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'bc7-rgba-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'bc7-rgba-unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'bc7-rgba-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
    },
});
const kETC2TextureFormatInfo = formatTableWithDefaults({
    defaults: {
        blockWidth: 4,
        blockHeight: 4,
        multisample: false,
        feature: 'texture-compression-etc2',
    },
    table: {
        'etc2-rgb8unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            baseFormat: 'etc2-rgb8unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'etc2-rgb8unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            baseFormat: 'etc2-rgb8unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'etc2-rgb8a1unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            baseFormat: 'etc2-rgb8a1unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'etc2-rgb8a1unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            baseFormat: 'etc2-rgb8a1unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'etc2-rgba8unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'etc2-rgba8unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'etc2-rgba8unorm-srgb': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'etc2-rgba8unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'eac-r11unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'eac-r11snorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 8,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'eac-rg11unorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'eac-rg11snorm': {
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
    },
});
const kASTCTextureFormatInfo = formatTableWithDefaults({
    defaults: {
        multisample: false,
        feature: 'texture-compression-astc',
    },
    table: {
        'astc-4x4-unorm': {
            blockWidth: 4,
            blockHeight: 4,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-4x4-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-4x4-unorm-srgb': {
            blockWidth: 4,
            blockHeight: 4,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-4x4-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-5x4-unorm': {
            blockWidth: 5,
            blockHeight: 4,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-5x4-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-5x4-unorm-srgb': {
            blockWidth: 5,
            blockHeight: 4,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-5x4-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-5x5-unorm': {
            blockWidth: 5,
            blockHeight: 5,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-5x5-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-5x5-unorm-srgb': {
            blockWidth: 5,
            blockHeight: 5,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-5x5-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-6x5-unorm': {
            blockWidth: 6,
            blockHeight: 5,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-6x5-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-6x5-unorm-srgb': {
            blockWidth: 6,
            blockHeight: 5,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-6x5-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-6x6-unorm': {
            blockWidth: 6,
            blockHeight: 6,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-6x6-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-6x6-unorm-srgb': {
            blockWidth: 6,
            blockHeight: 6,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-6x6-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-8x5-unorm': {
            blockWidth: 8,
            blockHeight: 5,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-8x5-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-8x5-unorm-srgb': {
            blockWidth: 8,
            blockHeight: 5,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-8x5-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-8x6-unorm': {
            blockWidth: 8,
            blockHeight: 6,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-8x6-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-8x6-unorm-srgb': {
            blockWidth: 8,
            blockHeight: 6,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-8x6-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-8x8-unorm': {
            blockWidth: 8,
            blockHeight: 8,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-8x8-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-8x8-unorm-srgb': {
            blockWidth: 8,
            blockHeight: 8,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-8x8-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-10x5-unorm': {
            blockWidth: 10,
            blockHeight: 5,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-10x5-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-10x5-unorm-srgb': {
            blockWidth: 10,
            blockHeight: 5,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-10x5-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-10x6-unorm': {
            blockWidth: 10,
            blockHeight: 6,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-10x6-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-10x6-unorm-srgb': {
            blockWidth: 10,
            blockHeight: 6,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-10x6-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-10x8-unorm': {
            blockWidth: 10,
            blockHeight: 8,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-10x8-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-10x8-unorm-srgb': {
            blockWidth: 10,
            blockHeight: 8,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-10x8-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-10x10-unorm': {
            blockWidth: 10,
            blockHeight: 10,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-10x10-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-10x10-unorm-srgb': {
            blockWidth: 10,
            blockHeight: 10,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-10x10-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-12x10-unorm': {
            blockWidth: 12,
            blockHeight: 10,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-12x10-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-12x10-unorm-srgb': {
            blockWidth: 12,
            blockHeight: 10,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-12x10-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-12x12-unorm': {
            blockWidth: 12,
            blockHeight: 12,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-12x12-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
        'astc-12x12-unorm-srgb': {
            blockWidth: 12,
            blockHeight: 12,
            color: {
                type: 'float',
                copySrc: true,
                copyDst: true,
                storage: false,
                readWriteStorage: false,
                bytes: 16,
            },
            baseFormat: 'astc-12x12-unorm',
            /*prettier-ignore*/ get bytesPerBlock() { return this.color.bytes; },
        },
    },
});
// Definitions for use locally.
// MAINTENANCE_TODO: Consider generating the exports below programmatically by filtering the big list, instead
// of using these local constants? Requires some type magic though.
/* prettier-ignore */ ({ ...kBCTextureFormatInfo, ...kETC2TextureFormatInfo, ...kASTCTextureFormatInfo });
/* prettier-ignore */ ({ ...kRegularTextureFormatInfo});
/* prettier-ignore */ ({ ...kRegularTextureFormatInfo, ...kSizedDepthStencilFormatInfo });
/* prettier-ignore */ ({ ...kRegularTextureFormatInfo, ...kSizedDepthStencilFormatInfo});
/* prettier-ignore */ ({ ...kSizedDepthStencilFormatInfo, ...kUnsizedDepthStencilFormatInfo });
/* prettier-ignore */ ({ ...kRegularTextureFormatInfo, ...kSizedDepthStencilFormatInfo, ...kUnsizedDepthStencilFormatInfo });
/**
 * DO NOT EXPORT THIS - functions that need info from this table should use the appropriate
 * method for their needs.
 *
 * For a list of textures formats for test parameters there are:
 *
 * Lists of formats that might require features to be enabled
 * * kPossibleColorRenderableTextureFormats
 * * kPossibleStorageTextureFormats
 * * kPossibleReadWriteStorageTextureFormats
 * * kPossibleMultisampledTextureFormats
 *
 * Lists of formats that end in -srgb
 * * kDifferentBaseFormatTextureFormats  (includes compressed textures)
 * * kDifferentBaseFormatRegularTextureFormats (does not include compressed textures)
 *
 * Formats that require a feature to use at all (mostly compressed formats)
 * * kOptionalTextureFormats
 *
 * Misc
 * * kRegularTextureFormats
 * * kSizedDepthStencilFormats
 * * kUnsizedDepthStencilFormats
 * * kCompressedTextureFormats
 * * kUncompressedTextureFormats
 * * kColorTextureFormats - color formats including compressed and sint/uint
 * * kEncodableTextureFormats - formats that TexelView supports.
 * * kSizedTextureFormats - formats that have a known size (so not depth24plus ...)
 * * kDepthStencilFormats - depth, stencil, depth-stencil
 * * kDepthTextureFormats - depth and depth-stencil
 * * kStencilTextureFormats - stencil and depth-stencil
 * * kAllTextureFormats
 *
 * If one of the list above does not work, add a new one or to filter in beforeAllSubcases you generally want to use
 * You will not know if you can actually use a texture for the given use case until the test runs and has a device.
 *
 * * isTextureFormatPossiblyUsableAsRenderAttachment
 * * isTextureFormatPossiblyUsableAsColorRenderAttachment
 * * isTextureFormatPossiblyMultisampled
 * * isTextureFormatPossiblyStorageReadable
 * * isTextureFormatPossiblyStorageReadWritable
 * * isTextureFormatPossiblyFilterableAsTextureF32
 *
 * These are also usable before or during a test
 *
 * * isColorTextureFormat
 * * isDepthTextureFormat
 * * isStencilTextureFormat
 * * isDepthOrStencilTextureFormat
 * * isEncodableTextureFormat
 * * isRegularTextureFormat
 * * isCompressedFloatTextureFormat
 * * isSintOrUintFormat
 *
 * To skip a test use the `skipIfXXX` tests in `GPUTest` if possible. Otherwise these functions
 * require a device to give a correct answer.
 *
 * * isTextureFormatUsableAsRenderAttachment
 * * isTextureFormatColorRenderable
 * * isTextureFormatResolvable
 * * isTextureFormatBlendable
 * * isTextureFormatMultisampled
 * * isTextureFormatUsableAsStorageFormat
 * * isTextureFormatUsableAsReadWriteStorageTexture
 * * isTextureFormatUsableAsStorageFormatInCreateShaderModule
 *
 * Per-GPUTextureFormat info.
 */
const kTextureFormatInfo = {
    ...kRegularTextureFormatInfo,
    ...kSizedDepthStencilFormatInfo,
    ...kUnsizedDepthStencilFormatInfo,
    ...kBCTextureFormatInfo,
    ...kETC2TextureFormatInfo,
    ...kASTCTextureFormatInfo,
};

const webgpuMemoryIdSymbol = Symbol('webgpu-memory-object-id');
const deviceIdToDeviceWeakRef = new Map();
let nextId = 1;
const allWebGPUObjectsById = new Map();
let globalRunningTotal = 0;
let globalMaxTotal = 0;
/**
 * Start tracking a resource by device
 */
function addDeviceObject(device, webgpuObject, category, size) {
    let id = webgpuObject[webgpuMemoryIdSymbol];
    if (!id) {
        id = nextId++;
        webgpuObject[webgpuMemoryIdSymbol] = id;
    }
    const deviceId = device[webgpuMemoryIdSymbol];
    const info = {
        ref: new WeakRef(webgpuObject),
        id,
        deviceId,
        category,
        size,
    };
    allWebGPUObjectsById.set(id, info);
    if (typeof size === 'function') {
        size = size(webgpuObject);
        info.oldSize = size;
    }
    if (!isNaN(size)) {
        const deviceInfo = allWebGPUObjectsById.get(deviceId);
        updateDeviceInfoRunningTotal(deviceInfo, size);
    }
}
function updateDeviceInfoRunningTotal(deviceInfo, size) {
    deviceInfo.runningTotal = (deviceInfo.runningTotal ?? 0) + size;
    deviceInfo.maxTotal = Math.max(deviceInfo.maxTotal ?? 0, deviceInfo.runningTotal);
    globalRunningTotal = globalRunningTotal + size;
    globalMaxTotal = Math.max(globalMaxTotal, globalRunningTotal);
}
/**
 * Start tracking a resource by device
 */
function addDeviceMem(device, webgpuObject, category, size) {
    addDeviceObject(device, webgpuObject, category, size);
}
/**
 */
function deviceExists(deviceId) {
    const ref = deviceIdToDeviceWeakRef.get(deviceId);
    return ref && !!ref.deref();
}
/**
 * Free an object's memory
 */
function freeObjectById(id, webgpuObject) {
    const obj = allWebGPUObjectsById.get(id);
    const sizer = obj?.size;
    const size = (webgpuObject && typeof sizer === 'function')
        ? sizer(webgpuObject)
        : sizer;
    if (!isNaN(size)) {
        const deviceInfo = allWebGPUObjectsById.get(obj.deviceId);
        if (deviceInfo) {
            updateDeviceInfoRunningTotal(deviceInfo, -size);
        }
    }
    allWebGPUObjectsById.delete(id);
}
/**
 * Free the memory used by object.
 */
function freeObject(webgpuObject) {
    const id = webgpuObject[webgpuMemoryIdSymbol];
    freeObjectById(id, webgpuObject);
}
/**
 * Gets WebGPU memory usage. If no device is passed in returns info for all devices.
 */
function getWebGPUMemoryUsage(device) {
    const memory = {
        total: 0,
        buffer: 0,
        texture: 0,
        querySet: 0,
        canvas: 0,
        maxTotal: 0,
    };
    const resources = {
        buffer: 0,
        texture: 0,
        querySet: 0,
    };
    const info = { memory, resources };
    const requestedDeviceId = device && device[webgpuMemoryIdSymbol];
    const idsToDelete = [];
    for (const [id, info] of allWebGPUObjectsById.entries()) {
        const { ref, deviceId, category, size } = info;
        const webgpuObject = ref.deref();
        if (!webgpuObject || !deviceExists(deviceId)) {
            idsToDelete.push(id);
        }
        else {
            if (!requestedDeviceId || deviceId === requestedDeviceId) {
                resources[category] = (resources[category] || 0) + 1;
                if (size) {
                    const numBytes = typeof size === 'function' ? size(webgpuObject) : size;
                    memory.total += numBytes;
                    memory[category] += numBytes;
                }
                if (category === 'device') {
                    memory.maxTotal += info.maxTotal;
                }
            }
        }
    }
    if (!device) {
        memory.maxTotal = globalMaxTotal;
    }
    idsToDelete.forEach(id => freeObjectById(id));
    return info;
}
function resetMaxTotal(device) {
    const devices = device ? [device] : [];
    let newGlobalMaxTotal = 0;
    if (!device) {
        for (const [id, { ref, category }] of allWebGPUObjectsById.entries()) {
            if (category === 'device') {
                const webgpuObject = ref.deref();
                if (webgpuObject) {
                    devices.push(webgpuObject);
                }
            }
        }
    }
    for (const device of devices) {
        const info = getWebGPUMemoryUsage(device);
        const deviceId = device[webgpuMemoryIdSymbol];
        const deviceInfo = allWebGPUObjectsById.get(deviceId);
        if (deviceInfo) {
            const { total } = info.memory;
            deviceInfo.maxTotal = total;
            newGlobalMaxTotal += total;
        }
    }
    if (!device) {
        globalRunningTotal = newGlobalMaxTotal;
        globalMaxTotal = newGlobalMaxTotal;
    }
}
function computeTextureMemorySize(texture) {
    const { blockWidth, blockHeight, bytesPerBlock, } = kTextureFormatInfo[texture.format];
    let size = 0;
    let width = texture.width;
    let height = texture.height;
    let depth = texture.depthOrArrayLayers;
    for (let level = 0; level < texture.mipLevelCount; ++level) {
        const blocksAcross = Math.ceil(width * texture.sampleCount / blockWidth);
        const blocksDown = Math.ceil(height * texture.sampleCount / blockHeight);
        const numBlocks = blocksAcross * blocksDown * depth;
        const bytesUsed = numBlocks * bytesPerBlock;
        size += bytesUsed;
        width = Math.max(1, width / 2 | 0);
        height = Math.max(1, height / 2 | 0);
        depth = texture.dimension === '3d' ? Math.max(1, depth / 2 | 0) : depth;
    }
    return size;
}
function addBuffer(device, buffer) {
    const bytesUsed = buffer.size;
    addDeviceMem(device, buffer, 'buffer', bytesUsed);
}
function removeBuffer(buffer) {
    freeObject(buffer);
}
function addTexture(device, texture) {
    const bytesUsed = computeTextureMemorySize(texture);
    addDeviceMem(device, texture, 'texture', bytesUsed);
}
function removeTexture(texture) {
    freeObject(texture);
}
function addQuerySet(device, querySet) {
    const bytesUsed = querySet.count * 8;
    addDeviceMem(device, querySet, 'querySet', bytesUsed);
}
function removeQuerySet(querySet) {
    freeObject(querySet);
}
function addDevice(adapter, device) {
    addDeviceMem(device, device, 'device', 0);
    const id = device[webgpuMemoryIdSymbol];
    deviceIdToDeviceWeakRef.set(id, new WeakRef(device));
}
function removeDevice(device) {
    const id = device[webgpuMemoryIdSymbol];
    deviceIdToDeviceWeakRef.delete(id);
    freeObject(device);
}
// assuming there are, in general, 2 textures per canvas.
// The one being displayed and the one being rendered to
const kTexturesPerCanvas = 2;
function computeCanvasBytesUsed(context, format) {
    const { width, height } = context.canvas;
    return computeTextureMemorySize({
        format,
        width,
        height,
        depthOrArrayLayers: 1,
        sampleCount: 1,
        mipLevelCount: 1,
        dimension: '2d',
    }) * kTexturesPerCanvas;
}
function addContext(context, dummy, config) {
    freeObject(context);
    const format = config.format;
    addDeviceMem(config.device, context, 'canvas', (context) => computeCanvasBytesUsed(context, format));
}
function removeContext(context) {
    freeObject(context);
}
function resizeContext(context) {
    const id = context[webgpuMemoryIdSymbol];
    const info = allWebGPUObjectsById.get(id);
    const deviceInfo = allWebGPUObjectsById.get(info.deviceId);
    updateDeviceInfoRunningTotal(deviceInfo, -info.oldSize);
    const size = info.size(context);
    info.oldSize = size;
    updateDeviceInfoRunningTotal(deviceInfo, size);
}
/**
 * Adds a wrapper function to a class method that gets called after the actual function
 */
//function wrapFunction(object, name: string, fn) {
//  const origFn = object.prototype[name];
//  object.prototype[name] = function(...args) {
//    const result = origFn.call(this, ...args);
//    if (result !== undefined && typeof result.then === 'function') {
//      result.then(realResult => fn(this, realResult, ...args));
//    } else {
//      fn(this, result, ...args);
//    }
//    return result;
//  };
//}
function wrapFunction(API, fnName, fn) {
    const origFn = API.prototype[fnName];
    API.prototype[fnName] = function (...args) {
        const result = origFn.call(this, ...args);
        fn(this, result, ...args);
        return result;
    };
}
function wrapAsyncFunction(API, fnName, fn) {
    const origFn = API.prototype[fnName];
    API.prototype[fnName] = async function (...args) {
        const result = await origFn.call(this, ...args);
        fn(this, result, ...args);
        return result;
    };
}
function wrapCreationDestroy(factoryClass, objectClass, fnName, category) {
    // @ts-ignore
    wrapFunction(factoryClass, fnName, function (device, object) {
        addDeviceObject(device, object, category, 0);
    });
    if (objectClass.prototype.destroy) {
        wrapFunction(objectClass, 'destroy', function (object) {
            freeObject(object);
        });
    }
}
if (typeof GPUAdapter !== 'undefined') {
    wrapAsyncFunction(GPUAdapter, 'requestDevice', addDevice);
    wrapFunction(GPUDevice, 'destroy', removeDevice);
    wrapFunction(GPUCanvasContext, 'configure', addContext);
    wrapFunction(GPUCanvasContext, 'unconfigure', removeContext);
    wrapFunction(GPUCanvasContext, 'getCurrentTexture', resizeContext);
    wrapFunction(GPUDevice, 'createBuffer', addBuffer);
    wrapFunction(GPUBuffer, 'destroy', removeBuffer);
    wrapFunction(GPUDevice, 'createTexture', addTexture);
    wrapFunction(GPUTexture, 'destroy', removeTexture);
    wrapFunction(GPUDevice, 'createQuerySet', addQuerySet);
    wrapFunction(GPUQuerySet, 'destroy', removeQuerySet);
    wrapCreationDestroy(GPUDevice, GPUSampler, 'createSampler', 'sampler');
    wrapCreationDestroy(GPUDevice, GPUBindGroup, 'createBindGroup', 'bindGroup');
    wrapCreationDestroy(GPUDevice, GPUBindGroupLayout, 'createBindGroupLayout', 'bindGroupLayout');
    wrapCreationDestroy(GPUDevice, GPUPipelineLayout, 'createPipelineLayout', 'pipelineLayout');
    wrapCreationDestroy(GPUDevice, GPUShaderModule, 'createShaderModule', 'shaderModule');
    wrapCreationDestroy(GPUDevice, GPUComputePipeline, 'createComputePipeline', 'computePipeline');
    wrapCreationDestroy(GPUDevice, GPURenderPipeline, 'createRenderPipeline', 'renderPipeline');
    wrapCreationDestroy(GPUDevice, GPUComputePipeline, 'createComputePipelineAsync', 'computePipeline');
    wrapCreationDestroy(GPUDevice, GPURenderPipeline, 'createRenderPipelineAsync', 'renderPipeline');
    //wrapCreationDestroy(GPUDevice, GPUCommandEncoder, 'createCommandEncoder', 'commandEncoder');
    //wrapCreationDestroy(GPUDevice, GPURenderBundleEncoder, 'createRenderBundleEncoder', 'renderBundleEncoder');
    // problem, no device for this
    // GPURenderBundleEncoder, 'finish'
}

export { getWebGPUMemoryUsage, resetMaxTotal };
//# sourceMappingURL=webgpu-memory.module.js.map
