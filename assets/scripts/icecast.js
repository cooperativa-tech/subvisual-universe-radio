/*!
 * Copyright 2021 Ethan Halsall
 * https://github.com/eshaz/icecast-metadata-js
 *
 * This file is part of icecast-metadata-player.
 *
 * icecast-metadata-player free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * icecast-metadata-player distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */
var IcecastMetadataPlayer;
IcecastMetadataPlayer = (() => {
  var t = {
      43: (t, e, s) => {
        "use strict";
        s.r(e),
          s.d(e, {
            IcecastMetadataQueue: () => n.a,
            IcecastMetadataReader: () => a.a,
            IcecastReadableStream: () => o.a,
          });
        var i = s(344),
          n = s.n(i),
          r = s(780),
          a = s.n(r),
          h = s(562),
          o = s.n(h);
      },
      344: (t) => {
        const e = () => {};
        t.exports = class {
          constructor({
            icyBr: t,
            onMetadataUpdate: s = e,
            onMetadataEnqueue: i = e,
          }) {
            (this.t = t),
              (this.i = s),
              (this.h = i),
              (this.l = !0),
              (this.u = []);
          }
          get metadataQueue() {
            return this.u.map(({ m: t, ...e }) => e);
          }
          addMetadata({ metadata: t, stats: e }, s, i = 0) {
            this.g(t, s, i + this.getTimeByBytes(e.currentStreamPosition));
          }
          getTimeByBytes(t) {
            return this.t ? t / (125 * this.t) : 0;
          }
          purgeMetadataQueue() {
            this.u.forEach((t) => clearTimeout(t.m)), (this.u = []);
          }
          g(t, e, s) {
            const i = { metadata: t, timestampOffset: e, timestamp: s };
            this.u.push(i),
              this.h(t, e, s),
              this.l
                ? (this.p(), (this.l = !1))
                : (i.m = setTimeout(() => {
                    this.p();
                  }, 1e3 * (e - s)));
          }
          p() {
            const {
              metadata: t,
              timestampOffset: e,
              timestamp: s,
            } = this.u.shift();
            this.i(t, e, s);
          }
        };
      },
      780: (t, e, s) => {
        const i = s(660),
          n = s(690),
          r = s(491),
          a = s(555);
        t.exports = class {
          constructor({ metadataTypes: t = ["icy"], ...e } = {}) {
            const s = t.includes("icy"),
              h = t.includes("ogg");
            this.S = s && h ? new a(e) : h ? new r(e) : s ? new n(e) : new i(e);
          }
          static parseIcyMetadata(t) {
            return n.parseIcyMetadata(t);
          }
          get icyMetaInt() {
            return this.S.icyMetaInt;
          }
          *iterator(t) {
            yield* this.S.iterator(t);
          }
          readAll(t) {
            this.S.readAll(t);
          }
          async *asyncIterator(t) {
            return yield* this.S.asyncIterator(t);
          }
          async asyncReadAll(t) {
            return this.S.asyncReadAll(t);
          }
        };
      },
      562: (t, e, s) => {
        const i = s(780),
          n = () => {};
        class r {
          constructor(t, { icyMetaInt: e, onStream: s = n, ...a }) {
            let h;
            (this.v = new ReadableStream({
              async start(n) {
                h = new i({
                  ...a,
                  icyMetaInt: parseInt(t.headers.get("Icy-MetaInt")) || e,
                  onStream: async (t) => (n.enqueue(t.stream), s(t)),
                });
                for await (const e of r.asyncIterator(t.body))
                  await h.asyncReadAll(e);
                n.close();
              },
            })),
              (this.M = h);
          }
          get icyMetaInt() {
            return this.M.icyMetaInt;
          }
          get readableStream() {
            return this.v;
          }
          async startReading() {
            for await (const t of r.asyncIterator(this.v));
          }
          static asyncIterator(t) {
            const e = t.getReader();
            return { [Symbol.asyncIterator]: () => ({ next: () => e.read() }) };
          }
        }
        t.exports = r;
      },
      555: (t, e, s) => {
        const i = s(690),
          n = s(491);
        t.exports = class {
          constructor(t) {
            const { onStream: e, ...s } = t;
            (this.I = new n(t)), (this.B = new i(s));
          }
          get icyMetaInt() {
            return this.B.icyMetaInt;
          }
          *iterator(t) {
            for (const e of this.B.iterator(t))
              e.stream ? yield* this.I.iterator(e.stream) : yield e;
          }
          readAll(t) {
            for (const e of this.B.iterator(t))
              e.stream && this.I.readAll(e.stream);
          }
          async *asyncIterator(t) {
            for await (const e of this.B.asyncIterator(t))
              if (e.stream)
                for await (const t of this.I.asyncIterator(e.stream)) yield t;
              else yield e;
          }
          async asyncReadAll(t) {
            for await (const e of this.B.iterator(t))
              e.stream && (await this.I.asyncReadAll(e.stream));
          }
        };
      },
      690: (t, e, s) => {
        const i = s(660);
        class n extends i {
          constructor({ icyMetaInt: t, icyDetectionTimeout: e = 2e3, ...s }) {
            super(s),
              (this.L = t),
              (this.C = e),
              (this.T = this._()),
              this.T.next();
          }
          *_() {
            if (yield* this.A())
              for (;;)
                (this.D = this.L),
                  yield* this.P(),
                  yield* this.R(),
                  this.D && (yield* this.F());
            (this.D = 1 / 0), yield* this.P();
          }
          static parseIcyMetadata(t) {
            const e = {};
            for (let s of t.matchAll(
              /(?<key>[^\0]+?)='(?<val>[^\0]*?)(;$|';|'$|$)/g,
            ))
              e[s.groups.key] = s.groups.val;
            return e;
          }
          get icyMetaInt() {
            return this.L;
          }
          *A() {
            if (this.L > 0) return !0;
            if (!this.C) return !1;
            this.k(
              "Passed in Icy-MetaInt is invalid. Attempting to detect ICY Metadata.",
              "See https://github.com/eshaz/icecast-metadata-js for information on how to properly request ICY Metadata.",
            );
            const t = [
                null,
                83,
                116,
                114,
                101,
                97,
                109,
                84,
                105,
                116,
                108,
                101,
                61,
              ],
              e = Date.now();
            let s = 0;
            for (; e + this.C > Date.now(); ) {
              this.U = i.O(this.U, yield* this.V());
              t: for (; s < this.U.length - t.length; ) {
                for (let e = 1; e < t.length; e++)
                  if (this.U[e + s] !== t[e]) {
                    s++;
                    continue t;
                  }
                return (
                  this.k(`Found ICY Metadata! Setting Icy-MetaInt to ${s}.`),
                  (this.L = s),
                  !0
                );
              }
            }
            return (
              this.k(
                "ICY Metadata not detected, but continuing anyway. Audio errors will occur if there is ICY metadata.",
                `Searched ${this.U.length} bytes for ${
                  (Date.now() - e) / 1e3
                } seconds.`,
                "Try increasing the `icyDetectionTimeout` value if ICY metadata is present in the stream.",
              ),
              !1
            );
          }
          *P() {
            for (this.N.currentStreamBytesRemaining = this.D; this.D; )
              yield* this.H(yield* super.W());
          }
          *R() {
            this.D = 1;
            do {
              this.D = 16 * (yield* this.W())[0];
            } while (1 === this.D);
            this.N.addMetadataLengthBytes(1);
          }
          *F() {
            this.N.currentMetadataBytesRemaining = this.D;
            const t = yield* this.W(this.D);
            this.N.addMetadataBytes(t.length),
              yield* this.G(n.parseIcyMetadata(this.$.decode(t)));
          }
        }
        t.exports = n;
      },
      660: (t, e, s) => {
        const i = s(758).TextDecoder || TextDecoder,
          n = s(8),
          r = () => {};
        class a {
          constructor(t) {
            (this.D = 0),
              (this.j = 0),
              (this.U = new Uint8Array(0)),
              (this.N = new n()),
              (this.$ = new i("utf-8")),
              (this.K = t.onStream || r),
              (this.q = t.onMetadata || r),
              (this.Y = t.onError || r),
              (this.J = t.enableLogging || !1),
              (this.X = Promise.resolve()),
              (this.tt = Promise.resolve()),
              (this.T = this.et()),
              this.T.next();
          }
          *et() {
            for (this.D = 1 / 0; ; ) yield* this.H(yield* this.W());
          }
          static O(t, e) {
            const s = new Uint8Array(t.length + e.length);
            return s.set(t), s.set(e, t.length), s;
          }
          *iterator(t) {
            for (let e = this.T.next(t); e.value; e = this.T.next())
              yield e.value;
          }
          readAll(t) {
            for (let e = this.T.next(t); e.value; e = this.T.next());
          }
          async *asyncIterator(t) {
            for (let e = this.T.next(t); e.value; e = this.T.next())
              await this.X, await this.tt, yield e.value;
          }
          async asyncReadAll(t) {
            for (let e = this.T.next(t); e.value; e = this.T.next())
              await this.X, await this.tt;
          }
          k(...t) {
            this.J &&
              console.warn(
                "icecast-metadata-js",
                t.reduce((t, e) => t + "\n  " + e, ""),
              ),
              this.Y(...t);
          }
          *H(t) {
            this.N.addStreamBytes(t.length);
            const e = { stream: t, stats: this.N.stats };
            (this.X = this.K(e)), yield e;
          }
          *G(t) {
            const e = { metadata: t, stats: this.N.stats };
            (this.tt = this.q(e)), yield e;
          }
          *W(t = 0) {
            for (
              this.j === this.U.length &&
              ((this.U = yield* this.V()), (this.j = 0));
              this.U.length - this.j < t;

            )
              this.U = a.O(this.U, yield* this.V());
            const e = this.U.subarray(this.j, (t || this.D) + this.j);
            return (
              this.N.addBytes(e.length),
              (this.D = e.length < this.D ? this.D - e.length : 0),
              (this.j += e.length),
              e
            );
          }
          *V() {
            let t;
            do {
              t = yield;
            } while (!t || 0 === t.length);
            return this.N.addCurrentBytesRemaining(t.length), t;
          }
        }
        t.exports = a;
      },
      491: (t, e, s) => {
        const i = s(660);
        t.exports = class extends i {
          constructor(t) {
            super(t), (this.T = this.st()), this.T.next();
          }
          *st() {
            if (yield* this.it()) {
              const t = yield* this.nt();
              if (t)
                for (; yield* this.it(); ) yield* this.F(t), yield* this.P();
            }
            (this.D = 1 / 0), yield* this.P();
          }
          rt(t, e = 0) {
            return new DataView(
              Uint8Array.from([...t.subarray(e, e + 4)]).buffer,
            ).getUint32(0, !0);
          }
          at(t, e) {
            return String.fromCharCode(...e).match(t);
          }
          *it() {
            let t = [];
            for (; t.length <= 65307; ) {
              const e = yield* super.W(5);
              if (
                79 === e[0] &&
                103 === e[1] &&
                103 === e[2] &&
                83 === e[3] &&
                !(248 & e[5])
              ) {
                (this.j -= 5),
                  (this.D += 5),
                  (this.N.ht -= 5),
                  (this.N.ot += 5);
                break;
              }
              t.push(e[0]), (this.j -= 4), (this.N.ht -= 4), (this.N.ot += 4);
            }
            if (
              (t.length && (yield* this.H(Uint8Array.from(t))),
              t.length > 65307)
            )
              return (
                this.k(
                  "This stream is not an OGG stream. No OGG metadata will be returned.",
                  "See https://github.com/eshaz/icecast-metadata-js for information on OGG metadata.",
                ),
                !1
              );
            const e = yield* this.W(27),
              s = yield* this.W(e[26]);
            return (this.D = s.reduce((t, e) => t + e, 0)), !0;
          }
          *nt() {
            const t = yield* this.W(8);
            return (
              yield* this.P(),
              this.at(/\x7fFLAC/, t.subarray(0, 5))
                ? { regex: /^[\x84|\x04]/, length: 4 }
                : this.at(/OpusHead/, t.subarray(0, 8))
                ? { regex: /OpusTags/, length: 8 }
                : this.at(/\x01vorbis/, t.subarray(0, 7))
                ? { regex: /\x03vorbis/, length: 7 }
                : void 0
            );
          }
          *F({ regex: t, length: e }) {
            this.at(t, yield* this.W(e)) && (yield* this.G(yield* this.ct()));
          }
          *P() {
            for (; this.D; ) yield* this.W();
          }
          *W(t) {
            const e = yield* super.W(t);
            return yield* this.H(e), e;
          }
          *V() {
            const t = yield* super.V();
            return (this.N.currentStreamBytesRemaining = t.length), t;
          }
          *ct() {
            const t = this.rt(yield* this.W(4));
            this.N.addMetadataBytes(4);
            const e = this.$.decode(yield* this.W(t));
            this.N.addMetadataBytes(t);
            const s = this.rt(yield* this.W(4));
            this.N.addMetadataBytes(4);
            const i = [];
            for (let t = 0; t < s; t++) {
              const t = yield* this.W(4);
              this.N.addMetadataBytes(4),
                i.push(yield* this.W(this.rt(t))),
                this.N.addMetadataBytes(i[i.length - 1].length);
            }
            return (
              (this.N.currentMetadataBytesRemaining = 0),
              i.reduce(
                (t, e) => {
                  const s = e.indexOf(61),
                    i = String.fromCharCode(...e.subarray(0, s)).toUpperCase(),
                    n = this.$.decode(e.subarray(s + 1));
                  return (t[i] = t[i] ? `${t[i]}; ${n}` : n), t;
                },
                { VENDOR_STRING: e },
              )
            );
          }
        };
      },
      8: (t) => {
        t.exports = class {
          constructor() {
            (this.ht = 0),
              (this.dt = 0),
              (this.lt = 0),
              (this.ut = 0),
              (this.ot = 0),
              (this.ft = 0),
              (this.yt = 0);
          }
          get stats() {
            return {
              totalBytesRead: this.ht,
              streamBytesRead: this.dt,
              metadataLengthBytesRead: this.lt,
              metadataBytesRead: this.ut,
              currentBytesRemaining: this.ot,
              currentStreamBytesRemaining: this.ft,
              currentMetadataBytesRemaining: this.yt,
            };
          }
          set currentStreamBytesRemaining(t) {
            this.ft += t;
          }
          set currentMetadataBytesRemaining(t) {
            this.yt = t;
          }
          addBytes(t) {
            (this.ht += t), (this.ot -= t);
          }
          addStreamBytes(t) {
            (this.dt += t), (this.ft -= t);
          }
          addMetadataLengthBytes(t) {
            this.lt += t;
          }
          addMetadataBytes(t) {
            (this.ut += t), (this.yt -= t);
          }
          addCurrentBytesRemaining(t) {
            this.ot += t;
          }
        };
      },
      388: (t, e, s) => {
        "use strict";
        s.d(e, { Z: () => zt });
        const i = (...t) => {
            console.error(
              "mse-audio-wrapper",
              t.reduce((t, e) => t + "\n  " + e, ""),
            );
          },
          n = new Int32Array([
            0,
            7,
            14,
            9,
            28,
            27,
            18,
            21,
            56,
            63,
            54,
            49,
            36,
            35,
            42,
            45,
            112,
            119,
            126,
            121,
            108,
            107,
            98,
            101,
            72,
            79,
            70,
            65,
            84,
            83,
            90,
            93,
            224,
            231,
            238,
            233,
            252,
            251,
            242,
            245,
            216,
            223,
            214,
            209,
            196,
            195,
            202,
            205,
            144,
            151,
            158,
            153,
            140,
            139,
            130,
            133,
            168,
            175,
            166,
            161,
            180,
            179,
            186,
            189,
            199,
            192,
            201,
            206,
            219,
            220,
            213,
            210,
            255,
            248,
            241,
            246,
            227,
            228,
            237,
            234,
            183,
            176,
            185,
            190,
            171,
            172,
            165,
            162,
            143,
            136,
            129,
            134,
            147,
            148,
            157,
            154,
            39,
            32,
            41,
            46,
            59,
            60,
            53,
            50,
            31,
            24,
            17,
            22,
            3,
            4,
            13,
            10,
            87,
            80,
            89,
            94,
            75,
            76,
            69,
            66,
            111,
            104,
            97,
            102,
            115,
            116,
            125,
            122,
            137,
            142,
            135,
            128,
            149,
            146,
            155,
            156,
            177,
            182,
            191,
            184,
            173,
            170,
            163,
            164,
            249,
            254,
            247,
            240,
            229,
            226,
            235,
            236,
            193,
            198,
            207,
            200,
            221,
            218,
            211,
            212,
            105,
            110,
            103,
            96,
            117,
            114,
            123,
            124,
            81,
            86,
            95,
            88,
            77,
            74,
            67,
            68,
            25,
            30,
            23,
            16,
            5,
            2,
            11,
            12,
            33,
            38,
            47,
            40,
            61,
            58,
            51,
            52,
            78,
            73,
            64,
            71,
            82,
            85,
            92,
            91,
            118,
            113,
            120,
            127,
            106,
            109,
            100,
            99,
            62,
            57,
            48,
            55,
            34,
            37,
            44,
            43,
            6,
            1,
            8,
            15,
            26,
            29,
            20,
            19,
            174,
            169,
            160,
            167,
            178,
            181,
            188,
            187,
            150,
            145,
            152,
            159,
            138,
            141,
            132,
            131,
            222,
            217,
            208,
            215,
            194,
            197,
            204,
            203,
            230,
            225,
            232,
            239,
            250,
            253,
            244,
            243,
          ]),
          r = (...t) => {
            const e = new Uint8Array(t.reduce((t, e) => t + e.length, 0));
            return t.reduce((t, s) => (e.set(s, t), t + s.length), 0), e;
          },
          a = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15],
          h = (t) => (a[15 & t] << 4) | a[t >> 4];
        class o {
          constructor(t) {
            (this.wt = t), (this.gt = 8 * t.length);
          }
          set position(t) {
            this.gt = t;
          }
          get position() {
            return this.gt;
          }
          read(t) {
            const e = Math.floor(this.gt / 8),
              s = this.gt % 8;
            this.gt -= t;
            return (
              (((h(this.wt[e - 1]) << 8) + h(this.wt[e])) >> (7 - s)) & 255
            );
          }
        }
        class c {
          constructor(t) {
            (this.bt = t), this.reset();
          }
          static getKey(t) {
            return String.fromCharCode(...t);
          }
          enable() {
            this.St = !0;
          }
          reset() {
            (this.vt = new Map()), (this.Mt = new WeakMap()), (this.St = !1);
          }
          getHeader(t) {
            const e = this.vt.get(t);
            return (
              e &&
                t !== this.It &&
                ((this.It = t), this.bt({ ...this.Mt.get(e) })),
              e
            );
          }
          setHeader(t, e, s) {
            t !== this.It && ((this.It = t), this.bt({ ...s })),
              this.St && (this.vt.set(t, e), this.Mt.set(e, s));
          }
        }
        class d {
          constructor(t) {
            this.vt = new c(t);
          }
          syncFrame(t, e = 0) {
            let s = new this.CodecFrame(t.subarray(e), this.vt);
            for (; !s.header && e + this.Et < t.length; )
              (e += s.length || 1),
                (s = new this.CodecFrame(t.subarray(e), this.vt));
            return { frame: s, remainingData: e };
          }
          fixedLengthFrame(t) {
            return this.fixedLengthFrameSync(t, !1);
          }
          fixedLengthFrameSync(t, e = !0) {
            let { frame: s, remainingData: i } = this.syncFrame(t),
              n = [];
            for (
              ;
              s.header &&
              s.header.isParsed &&
              s.length + i + this.Et < t.length;

            ) {
              const r = new this.CodecFrame(t.subarray(s.length + i), this.vt);
              if (r.header || !e) {
                if (
                  (this.vt.enable(),
                  n.push(s),
                  (i += s.length),
                  (s = r),
                  r.header && !r.header.isParsed)
                )
                  break;
              } else {
                this.vt.reset(), i++;
                const e = this.syncFrame(t, i);
                (i += e.remainingData), (s = e.frame);
              }
            }
            return { frames: n, remainingData: i };
          }
        }
        class l {
          constructor(t, e) {
            (this.Bt = t), (this.wt = e || []);
          }
          get length() {
            return this.Bt ? this.Bt.dataByteLength : 0;
          }
          get header() {
            return this.Bt;
          }
          get data() {
            return this.wt;
          }
        }
        class u {
          constructor(t, e) {
            (this.Lt = e),
              (this.Ct = t.channelMode),
              (this.Tt = t.channels),
              (this._t = t.dataByteLength),
              (this.xt = t.length),
              (this.At = t.sampleRate),
              (this.Dt = t.samplesPerFrame);
          }
          get isParsed() {
            return this.Lt;
          }
          get bitDepth() {
            return this.Pt;
          }
          get channels() {
            return this.Tt;
          }
          get dataByteLength() {
            return this._t;
          }
          get length() {
            return this.xt;
          }
          get sampleRate() {
            return this.At;
          }
          set samplesPerFrame(t) {
            this.Dt = t;
          }
          get samplesPerFrame() {
            return this.Dt;
          }
          set duration(t) {
            this.Rt = t;
          }
          get duration() {
            return this.Rt;
          }
        }
        const m = {
            0: ["free", "free", "free", "free", "free"],
            16: [32, 32, 32, 32, 8],
            32: [64, 48, 40, 48, 16],
            48: [96, 56, 48, 56, 24],
            64: [128, 64, 56, 64, 32],
            80: [160, 80, 64, 80, 40],
            96: [192, 96, 80, 96, 48],
            112: [224, 112, 96, 112, 56],
            128: [256, 128, 112, 128, 64],
            144: [288, 160, 128, 144, 80],
            160: [320, 192, 160, 160, 96],
            176: [352, 224, 192, 176, 112],
            192: [384, 256, 224, 192, 128],
            208: [416, 320, 256, 224, 144],
            224: [448, 384, 320, 256, 160],
            240: ["bad", "bad", "bad", "bad", "bad"],
          },
          f = {
            0: "bands 4 to 31",
            16: "bands 8 to 31",
            32: "bands 12 to 31",
            48: "bands 16 to 31",
          },
          y = {
            0: { description: "reserved" },
            2: {
              description: "Layer III",
              framePadding: 1,
              modeExtensions: {
                0: "Intensity stereo off, MS stereo off",
                16: "Intensity stereo on, MS stereo off",
                32: "Intensity stereo off, MS stereo on",
                48: "Intensity stereo on, MS stereo on",
              },
              v1: { bitrateIndex: 2, samplesPerFrame: 1152 },
              v2: { bitrateIndex: 4, samplesPerFrame: 576 },
            },
            4: {
              description: "Layer II",
              framePadding: 1,
              modeExtensions: f,
              samplesPerFrame: 1152,
              v1: { bitrateIndex: 1 },
              v2: { bitrateIndex: 4 },
            },
            6: {
              description: "Layer I",
              framePadding: 4,
              modeExtensions: f,
              samplesPerFrame: 384,
              v1: { bitrateIndex: 0 },
              v2: { bitrateIndex: 3 },
            },
          },
          w = {
            0: {
              description: "MPEG Version 2.5 (later extension of MPEG 2)",
              layers: "v2",
              sampleRates: { 0: 11025, 4: 12e3, 8: 8e3, 12: "reserved" },
            },
            8: { description: "reserved" },
            16: {
              description: "MPEG Version 2 (ISO/IEC 13818-3)",
              layers: "v2",
              sampleRates: { 0: 22050, 4: 24e3, 8: 16e3, 12: "reserved" },
            },
            24: {
              description: "MPEG Version 1 (ISO/IEC 11172-3)",
              layers: "v1",
              sampleRates: { 0: 44100, 4: 48e3, 8: 32e3, 12: "reserved" },
            },
          },
          g = { 0: "16bit CRC", 1: "none" },
          p = { 0: "none", 1: "50/15 ms", 2: "reserved", 3: "CCIT J.17" },
          b = {
            0: { channels: 2, description: "Stereo" },
            64: { channels: 2, description: "Joint stereo" },
            128: { channels: 2, description: "Dual channel" },
            192: { channels: 1, description: "Single channel (Mono)" },
          };
        class S extends u {
          static getHeader(t, e) {
            const s = {};
            if (t.length < 4) return new S(s, !1);
            const i = c.getKey(t.subarray(0, 4)),
              n = e.getHeader(i);
            if (n) return new S(n, !0);
            if (255 !== t[0] || t[1] < 224) return null;
            const r = 24 & t[1],
              a = 6 & t[1],
              h = 1 & t[1];
            s.length = 4;
            const o = w[r];
            if ("reserved" === o.description) return null;
            if ("reserved" === y[a].description) return null;
            const d = { ...y[a], ...y[a][o.layers] };
            (s.mpegVersion = o.description),
              (s.layer = d.description),
              (s.samplesPerFrame = d.samplesPerFrame),
              (s.protection = g[h]);
            const l = 240 & t[2],
              u = 12 & t[2],
              f = 2 & t[2],
              v = 1 & t[2];
            if (((s.bitrate = m[l][d.bitrateIndex]), "bad" === s.bitrate))
              return null;
            if (
              ((s.sampleRate = o.sampleRates[u]), "reserved" === s.sampleRate)
            )
              return null;
            if (
              ((s.framePadding = f >> 1 && d.framePadding),
              (s.isPrivate = !!v),
              (s.dataByteLength = Math.floor(
                (125 * s.bitrate * s.samplesPerFrame) / s.sampleRate +
                  s.framePadding,
              )),
              !s.dataByteLength)
            )
              return null;
            const M = 192 & t[3],
              I = 48 & t[3],
              E = 8 & t[3],
              B = 4 & t[3],
              L = 3 & t[3];
            if (
              ((s.channelMode = b[M].description),
              (s.channels = b[M].channels),
              (s.modeExtension = d.modeExtensions[I]),
              (s.isCopyrighted = !!(E >> 3)),
              (s.isOriginal = !!(B >> 2)),
              (s.emphasis = p[L]),
              "reserved" === s.emphasis)
            )
              return null;
            s.bitDepth = 16;
            const {
              length: C,
              dataByteLength: T,
              samplesPerFrame: _,
              ...x
            } = s;
            return e.setHeader(i, s, x), new S(s, !0);
          }
          constructor(t, e) {
            super(t, e),
              (this.zt = t.bitrate),
              (this.Ft = t.emphasis),
              (this.kt = t.framePadding),
              (this.Ut = t.isCopyrighted),
              (this.Ot = t.isOriginal),
              (this.Vt = t.isPrivate),
              (this.Nt = t.layer),
              (this.Ht = t.modeExtension),
              (this.Wt = t.mpegVersion),
              (this.Gt = t.protection);
          }
        }
        class v extends l {
          constructor(t, e) {
            const s = S.getHeader(t, e);
            super(s, s && t.subarray(0, s.dataByteLength));
          }
        }
        class M extends d {
          constructor(t) {
            super(t), (this.CodecFrame = v), (this.Et = 4);
          }
          get codec() {
            return "mp3";
          }
          parseFrames(t) {
            return this.fixedLengthFrameSync(t);
          }
        }
        const I = { 0: "MPEG-4", 8: "MPEG-2" },
          E = { 0: "valid", 2: "bad", 4: "bad", 6: "bad" },
          B = { 0: "16bit CRC", 1: "none" },
          L = {
            0: "AAC Main",
            64: "AAC LC (Low Complexity)",
            128: "AAC SSR (Scalable Sample Rate)",
            192: "AAC LTP (Long Term Prediction)",
          },
          C = {
            0: 96e3,
            4: 88200,
            8: 64e3,
            12: 48e3,
            16: 44100,
            20: 32e3,
            24: 24e3,
            28: 22050,
            32: 16e3,
            36: 12e3,
            40: 11025,
            44: 8e3,
            48: 7350,
            52: "reserved",
            56: "reserved",
            60: "frequency is written explicitly",
          },
          T = {
            0: { channels: 0, description: "Defined in AOT Specific Config" },
            64: { channels: 1, description: "front-center" },
            128: { channels: 2, description: "front-left, front-right" },
            192: {
              channels: 3,
              description: "front-center, front-left, front-right",
            },
            256: {
              channels: 4,
              description: "front-center, front-left, front-right, back-center",
            },
            320: {
              channels: 5,
              description:
                "front-center, front-left, front-right, back-left, back-right",
            },
            384: {
              channels: 6,
              description:
                "front-center, front-left, front-right, back-left, back-right, LFE-channel",
            },
            448: {
              channels: 8,
              description:
                "front-center, front-left, front-right, side-left, side-right, back-left, back-right, LFE-channel",
            },
          };
        class _ extends u {
          static getHeader(t, e) {
            const s = {};
            if (t.length < 7) return new _(s, !1);
            const i = c.getKey([t[0], t[1], t[2], 111111100 & t[3]]),
              n = e.getHeader(i);
            if (n) Object.assign(s, n);
            else {
              if (255 !== t[0] || t[1] < 240) return null;
              const e = 8 & t[1],
                i = 6 & t[1],
                n = 1 & t[1];
              if (((s.mpegVersion = I[e]), (s.layer = E[i]), "bad" === s.layer))
                return null;
              (s.protection = B[n]),
                (s.length = n ? 7 : 9),
                (s.profileBits = 192 & t[2]),
                (s.sampleRateBits = 60 & t[2]);
              const r = 2 & t[2];
              if (
                ((s.profile = L[s.profileBits]),
                (s.sampleRate = C[s.sampleRateBits]),
                "reserved" === s.sampleRate)
              )
                return null;
              (s.isPrivate = !!(r >> 1)),
                (s.channelModeBits =
                  448 &
                  new DataView(Uint8Array.of(t[2], t[3]).buffer).getUint16()),
                (s.channelMode = T[s.channelModeBits].description),
                (s.channels = T[s.channelModeBits].channels);
              const a = 32 & t[3],
                h = 8 & t[3],
                o = 8 & t[3],
                c = 4 & t[3];
              (s.isOriginal = !!(a >> 5)),
                (s.isHome = !!(h >> 4)),
                (s.copyrightId = !!(o >> 3)),
                (s.copyrightIdStart = !!(c >> 2)),
                (s.bitDepth = 16);
            }
            const r =
              262112 &
              new DataView(
                Uint8Array.of(0, t[3], t[4], t[5]).buffer,
              ).getUint32();
            if (((s.dataByteLength = r >> 5), !s.dataByteLength)) return null;
            const a =
              8188 & new DataView(Uint8Array.of(t[5], t[6]).buffer).getUint16();
            if (
              ((s.bufferFullness = 8188 === a ? "VBR" : a >> 2),
              (s.numberAACFrames = 3 & t[6]),
              (s.samplesPerFrame = 1024),
              !n)
            ) {
              const {
                length: t,
                channelModeBits: n,
                profileBits: r,
                sampleRateBits: a,
                dataByteLength: h,
                bufferFullness: o,
                numberAACFrames: c,
                samplesPerFrame: d,
                ...l
              } = s;
              e.setHeader(i, s, l);
            }
            return new _(s, !0);
          }
          constructor(t, e) {
            super(t, e),
              (this.$t = t.copyrightId),
              (this.jt = t.copyrightIdStart),
              (this.Kt = t.bufferFullness),
              (this.qt = t.isHome),
              (this.Ot = t.isOriginal),
              (this.Vt = t.isPrivate),
              (this.Nt = t.layer),
              (this.Wt = t.mpegVersion),
              (this.Yt = t.numberAACFrames),
              (this.Qt = t.profile),
              (this.Gt = t.protection),
              (this.Jt = t.profileBits),
              (this.Zt = t.sampleRateBits),
              (this.Xt = t.channelModeBits);
          }
          get audioSpecificConfig() {
            const t = ((this.Jt + 64) << 5) | (this.Zt << 5) | (this.Xt >> 3),
              e = new Uint8Array(2);
            return new DataView(e.buffer).setUint16(0, t, !1), e;
          }
        }
        class x extends l {
          constructor(t, e) {
            const s = _.getHeader(t, e);
            super(s, s && t.subarray(s.length, s.dataByteLength));
          }
        }
        class A extends d {
          constructor(t) {
            super(t), (this.CodecFrame = x), (this.Et = 9);
          }
          get codec() {
            return "mp4a.40.2";
          }
          parseFrames(t) {
            return this.fixedLengthFrameSync(t);
          }
        }
        class D {
          static getHeader(t) {
            const e = {};
            if (t.length < 28) return new D(e, !1);
            const s = new DataView(Uint8Array.of(...t.subarray(0, 28)).buffer);
            if (1332176723 !== s.getUint32(0)) return null;
            e.streamStructureVersion = t[4];
            const i = 248 & t[5],
              n = 4 & t[5],
              r = 2 & t[5],
              a = 1 & t[5];
            if (i) return null;
            (e.isContinuedPacket = !!(n >> 2)),
              (e.isFirstPage = !!(r >> 1)),
              (e.isLastPage = !!a);
            try {
              e.absoluteGranulePosition = s.getBigInt64(6, !0);
            } catch {}
            (e.streamSerialNumber = s.getInt32(14, !0)),
              (e.pageSequenceNumber = s.getInt32(18, !0)),
              (e.pageChecksum = s.getInt32(22, !0));
            const h = t[26];
            if (((e.length = h + 27), e.length > t.length)) return new D(e, !1);
            (e.dataByteLength = 0),
              (e.pageSegmentTable = []),
              (e.pageSegmentBytes = t.subarray(27, e.length));
            let o = 0;
            for (const t of e.pageSegmentBytes)
              (e.dataByteLength += t),
                (o += t),
                255 !== t && (e.pageSegmentTable.push(o), (o = 0));
            return new D(e, !0);
          }
          constructor(t, e) {
            (this.Lt = e),
              (this.te = t.absoluteGranulePosition),
              (this._t = t.dataByteLength),
              (this.ee = t.isContinuedPacket),
              (this.se = t.isFirstPage),
              (this.ie = t.isLastPage),
              (this.xt = t.length),
              (this.ne = t.pageSegmentBytes),
              (this.re = t.pageSegmentTable),
              (this.ae = t.pageSequenceNumber),
              (this.he = t.pageChecksum),
              (this.oe = t.streamSerialNumber);
          }
          get isParsed() {
            return this.Lt;
          }
          get absoluteGranulePosition() {
            return this.te;
          }
          get dataByteLength() {
            return this._t;
          }
          get pageSegmentTable() {
            return this.re;
          }
          get pageSegmentBytes() {
            return this.ne;
          }
          get pageSequenceNumber() {
            return this.ae;
          }
          get length() {
            return this.xt;
          }
        }
        class P extends l {
          constructor(t) {
            const e = D.getHeader(t);
            if (
              (super(e, e && t.subarray(e.length, e.length + e.dataByteLength)),
              e && e.isParsed)
            ) {
              let s = e.length;
              this.ce = e.pageSegmentTable.map((e) => {
                const i = t.subarray(s, s + e);
                return (s += e), i;
              });
            }
          }
          get length() {
            return this.Bt ? this.Bt.length + this.Bt.dataByteLength : 0;
          }
          get segments() {
            return this.ce;
          }
        }
        const R = { 0: "Fixed", 1: "Variable" },
          z = {
            0: "reserved",
            16: 192,
            32: 576,
            48: 1152,
            64: 2304,
            80: 4608,
            96: "8-bit (blocksize-1) end of header",
            112: "16-bit (blocksize-1) end of header",
            128: 256,
            144: 512,
            160: 1024,
            176: 2048,
            192: 4096,
            208: 8192,
            224: 16384,
            240: 32768,
          },
          F = {
            0: "invalid",
            1: 88200,
            2: 176400,
            3: 192e3,
            4: 8e3,
            5: 16e3,
            6: 22050,
            7: 24e3,
            8: 32e3,
            9: 44100,
            10: 48e3,
            11: 96e3,
            12: "get 8 bit sample rate (in kHz) from end of header",
            13: "get 16 bit sample rate (in Hz) from end of header",
            14: "get 16 bit sample rate (in tens of Hz) from end of header",
            15: "invalid",
          },
          k = {
            0: { channels: 1, description: "mono" },
            16: { channels: 2, description: "left, right" },
            32: { channels: 3, description: "left, right, center" },
            48: {
              channels: 4,
              description: "front left, front right, back left, back right",
            },
            64: {
              channels: 5,
              description:
                "front left, front right, front center, back/surround left, back/surround right",
            },
            80: {
              channels: 6,
              description:
                "front left, front right, front center, LFE, back/surround left, back/surround right",
            },
            96: {
              channels: 7,
              description:
                "front left, front right, front center, LFE, back center, side left, side right",
            },
            112: {
              channels: 8,
              description:
                "front left, front right, front center, LFE, back left, back right, side left, side right",
            },
            128: {
              channels: 2,
              description:
                "left/side stereo: channel 0 is the left channel, channel 1 is the side(difference) channel",
            },
            144: {
              channels: 2,
              description:
                "right/side stereo: channel 0 is the side(difference) channel, channel 1 is the right channel",
            },
            160: {
              channels: 2,
              description:
                "mid/side stereo: channel 0 is the mid(average) channel, channel 1 is the side(difference) channel",
            },
            176: "reserved",
            192: "reserved",
            208: "reserved",
            224: "reserved",
            240: "reserved",
          },
          U = {
            0: "get from STREAMINFO metadata block",
            2: 8,
            4: 12,
            6: "reserved",
            8: 16,
            10: 20,
            12: 24,
            14: "reserved",
          };
        class O extends u {
          static decodeUTF8Int(t) {
            if (t[0] < 128) return { value: t[0], next: 1 };
            if (255 === t) return null;
            let e,
              s = 2,
              i = 224;
            for (; (t[0] & i) != ((i << 1) & 255) && s < 7; )
              s++, (i |= i >> 1);
            if (7 === s) return null;
            const n = 6 * (s - 1);
            e = t[0] & ((255 ^ i) << n);
            for (let i = 1; i < s; i++) e |= (63 & t[i]) << (n - 6 * i);
            return { value: e, next: s };
          }
          static getHeader(t, e) {
            const s = {};
            if (t.length < 6) return new O(s, !1);
            const i = c.getKey(t.subarray(0, 3)),
              r = e.getHeader(i);
            if (r) Object.assign(s, r);
            else {
              if (255 !== t[0] || (248 !== t[1] && 249 !== t[1])) return null;
              (s.length = 2),
                (s.blockingStrategyBits = 1 & t[1]),
                (s.blockingStrategy = R[s.blockingStrategyBits]),
                s.length++;
              const e = 240 & t[2],
                i = 15 & t[2];
              if (((s.blockSize = z[e]), "reserved" === s.blockSize))
                return null;
              if (((s.sampleRate = F[i]), "invalid" === s.sampleRate))
                return null;
              if ((s.length++, 1 & t[3])) return null;
              const n = 240 & t[3],
                r = 14 & t[3],
                a = k[n];
              if ("reserved" === a) return null;
              if (
                ((s.channels = a.channels),
                (s.channelMode = a.description),
                (s.bitDepth = U[r]),
                "reserved" === s.bitDepth)
              )
                return null;
            }
            if (((s.length = 5), t.length < s.length + 8)) return new O(s, !1);
            const a = O.decodeUTF8Int(t.subarray(4));
            if (!a) return null;
            if (
              (s.blockingStrategyBits
                ? (s.sampleNumber = a.value)
                : (s.frameNumber = a.value),
              (s.length += a.next),
              "string" == typeof s.blockSize)
            )
              if (96 === blockSizeBits) {
                if (t.length < s.length) return new O(s, !1);
                (s.blockSize = t[s.length - 1] - 1), (s.length += 1);
              } else if (112 === blockSizeBits) {
                if (t.length <= s.length) return new O(s, !1);
                (s.blockSize = (t[s.length - 1] << 8) + t[s.length] - 1),
                  (s.length += 2);
              }
            if ("string" == typeof s.sampleRate)
              if (12 === sampleRateBits) {
                if (t.length < s.length) return new O(s, !1);
                (s.sampleRate = t[s.length - 1] - 1), (s.length += 1);
              } else if (13 === sampleRateBits) {
                if (t.length <= s.length) return new O(s, !1);
                (s.sampleRate = (t[s.length - 1] << 8) + t[s.length] - 1),
                  (s.length += 2);
              } else if (14 === sampleRateBits) {
                if (t.length <= s.length) return new O(s, !1);
                (s.sampleRate = (t[s.length - 1] << 8) + t[s.length] - 1),
                  (s.length += 2);
              }
            if (t.length < s.length) return new O(s, !1);
            if (
              ((s.crc = t[s.length - 1]),
              s.crc !==
                ((t) => {
                  let e;
                  for (const s of t) e = 255 & n[255 & (e ^ s)];
                  return e;
                })(t.subarray(0, s.length - 1)))
            )
              return null;
            if (!r) {
              const {
                blockingStrategyBits: t,
                frameNumber: n,
                sampleNumber: r,
                crc: a,
                length: h,
                ...o
              } = s;
              e.setHeader(i, s, o);
            }
            return s;
          }
          constructor(t, e) {
            super(t, e),
              (this.de = t.blockingStrategy),
              (this.le = t.blockSize),
              (this.ue = t.crc),
              (this.me = t.frameNumber),
              (this.Pt = t.bitDepth),
              (this.fe = t.sampleNumber),
              (this.Dt = t.blockSize);
          }
          set dataByteLength(t) {
            this._t = t;
          }
          get blockSize() {
            return this.le;
          }
          get frameNumber() {
            return this.me;
          }
          get bitDepth() {
            return this.Pt;
          }
        }
        class V extends l {
          constructor(t, e) {
            let s = null;
            e && ((s = new O(e, !0)), (s.dataByteLength = t.length)),
              super(s, t);
          }
        }
        class N extends d {
          constructor(t) {
            super(t), (this.CodecFrame = V);
          }
          get codec() {
            return "flac";
          }
          parseFrames(t) {
            return this.ye
              ? {
                  frames: t.segments
                    .filter(
                      (t) => 255 === t[0] && (248 === t[1] || 249 === t[1]),
                    )
                    .map((t) => new V(t, this.ye)),
                  remainingData: 0,
                }
              : ((this.ye = O.getHeader(t.data, this.vt)),
                { frames: [], remainingData: 0 });
          }
        }
        const H = {
          0: ["monophonic (mono)", "stereo (left, right)"],
          1: [
            "monophonic (mono)",
            "stereo (left, right)",
            "linear surround (left, center, right)",
            "quadraphonic (front left, front right, rear left, rear right)",
            "5.0 surround (front left, front center, front right, rear left, rear right)",
            "5.1 surround (front left, front center, front right, rear left, rear right, LFE)",
            "6.1 surround (front left, front center, front right, side left, side right, rear center, LFE)",
            "7.1 surround (front left, front center, front right, side left, side right, rear left, rear right, LFE)",
          ],
        };
        class W extends u {
          static getHeader(t, e) {
            const s = {};
            if (t.length < 19) return new W(s, !1);
            const i = c.getKey(t.subarray(0, 19)),
              n = e.getHeader(i);
            if (n) Object.assign(s, n);
            else {
              if (
                79 !== t[0] ||
                112 !== t[1] ||
                117 !== t[2] ||
                115 !== t[3] ||
                72 !== t[4] ||
                101 !== t[5] ||
                97 !== t[6] ||
                100 !== t[7]
              )
                return null;
              if (1 !== t[8]) return null;
              const e = new DataView(
                Uint8Array.of(...t.subarray(0, 19)).buffer,
              );
              if (
                ((s.bitDepth = 16),
                (s.length = 19),
                (s.channels = t[9]),
                (s.preSkip = e.getUint16(10, !0)),
                (s.inputSampleRate = e.getUint32(12, !0)),
                (s.sampleRate = 48e3),
                (s.outputGain = e.getInt16(16, !0)),
                (s.channelMappingFamily = t[18]),
                !s.channelMappingFamily in H)
              )
                return null;
              if (
                ((s.channelMode = H[s.channelMappingFamily][s.channels - 1]),
                !s.channelMode)
              )
                return null;
            }
            if (0 !== s.channelMappingFamily) {
              if (((s.length += 2 + s.channels), t.length < s.length))
                return new W(s, !1);
              (s.streamCount = t[19]),
                (s.coupledStreamCount = t[20]),
                (s.channelMappingTable = t.subarray(21, s.channels + 21));
            }
            if (((s.bytes = t.subarray(0, s.length)), !n)) {
              const { length: t, bytes: n, channelMappingFamily: r, ...a } = s;
              e.setHeader(i, s, a);
            }
            return new W(s, !0);
          }
          constructor(t, e) {
            super(t, e),
              (this.we = t.channelMappingFamily),
              (this.ge = t.channelMappingTable),
              (this.pe = t.coupledStreamCount),
              (this.Pt = t.bitDepth),
              (this.be = t.bytes),
              (this.Se = t.inputSampleRate),
              (this.ve = t.outputGain),
              (this.Me = t.preSkip),
              (this.Pt = t.bitDepth),
              (this.Ie = t.streamCount);
          }
          get bytes() {
            return this.be;
          }
          set dataByteLength(t) {
            this._t = t;
          }
          get channelMappingFamily() {
            return this.we;
          }
          get coupledStreamCount() {
            return this.pe;
          }
          get preSkip() {
            return this.Me;
          }
          get outputGain() {
            return this.ve;
          }
          get inputSampleRate() {
            return this.Se;
          }
          get bitDepth() {
            return this.Pt;
          }
          get streamCount() {
            return this.Ie;
          }
          get channelMappingTable() {
            return this.ge;
          }
        }
        const G = {
          0: { mode: "SILK-only", bandwidth: "NB", frameSize: 10 },
          8: { mode: "SILK-only", bandwidth: "NB", frameSize: 20 },
          16: { mode: "SILK-only", bandwidth: "NB", frameSize: 40 },
          24: { mode: "SILK-only", bandwidth: "NB", frameSize: 60 },
          32: { mode: "SILK-only", bandwidth: "MB", frameSize: 10 },
          40: { mode: "SILK-only", bandwidth: "MB", frameSize: 20 },
          48: { mode: "SILK-only", bandwidth: "MB", frameSize: 40 },
          56: { mode: "SILK-only", bandwidth: "MB", frameSize: 60 },
          64: { mode: "SILK-only", bandwidth: "WB", frameSize: 10 },
          72: { mode: "SILK-only", bandwidth: "WB", frameSize: 20 },
          80: { mode: "SILK-only", bandwidth: "WB", frameSize: 40 },
          88: { mode: "SILK-only", bandwidth: "WB", frameSize: 60 },
          96: { mode: "Hybrid", bandwidth: "SWB", frameSize: 10 },
          104: { mode: "Hybrid", bandwidth: "SWB", frameSize: 20 },
          112: { mode: "Hybrid", bandwidth: "FB", frameSize: 10 },
          120: { mode: "Hybrid", bandwidth: "FB", frameSize: 20 },
          128: { mode: "CELT-only", bandwidth: "NB", frameSize: 2.5 },
          136: { mode: "CELT-only", bandwidth: "NB", frameSize: 5 },
          144: { mode: "CELT-only", bandwidth: "NB", frameSize: 10 },
          152: { mode: "CELT-only", bandwidth: "NB", frameSize: 20 },
          160: { mode: "CELT-only", bandwidth: "WB", frameSize: 2.5 },
          168: { mode: "CELT-only", bandwidth: "WB", frameSize: 5 },
          176: { mode: "CELT-only", bandwidth: "WB", frameSize: 10 },
          184: { mode: "CELT-only", bandwidth: "WB", frameSize: 20 },
          192: { mode: "CELT-only", bandwidth: "SWB", frameSize: 2.5 },
          200: { mode: "CELT-only", bandwidth: "SWB", frameSize: 5 },
          208: { mode: "CELT-only", bandwidth: "SWB", frameSize: 10 },
          216: { mode: "CELT-only", bandwidth: "SWB", frameSize: 20 },
          224: { mode: "CELT-only", bandwidth: "FB", frameSize: 2.5 },
          232: { mode: "CELT-only", bandwidth: "FB", frameSize: 5 },
          240: { mode: "CELT-only", bandwidth: "FB", frameSize: 10 },
          248: { mode: "CELT-only", bandwidth: "FB", frameSize: 20 },
        };
        class $ extends l {
          static getPacket(t) {
            const e = {
              config: G[248 & t[0]],
              channels: 4 & t[0] ? 2 : 1,
              code: 3 & t[0],
            };
            switch (e.code) {
              case 0:
                return (e.frameCount = 1), e;
              case 1:
              case 2:
                return (e.frameCount = 2), e;
              case 3:
                return (
                  (e.isVbr = Boolean(128 & t[1])),
                  (e.hasOpusPadding = Boolean(64 & t[1])),
                  (e.frameCount = 63 & t[1]),
                  e
                );
            }
          }
          constructor(t, e) {
            let s = null;
            if (e) {
              s = new W(e, !0);
              const i = $.getPacket(t);
              (s.samplesPerFrame =
                ((i.config.frameSize * i.frameCount) / 1e3) * e.sampleRate),
                (s.dataByteLength = t.length);
            }
            super(s, t);
          }
        }
        class j extends d {
          constructor(t) {
            super(t), (this.CodecFrame = $), (this.Ee = null), (this.Et = 26);
          }
          get codec() {
            return "opus";
          }
          parseFrames(t) {
            return 0 === t.header.pageSequenceNumber
              ? ((this.Ee = W.getHeader(t.data, this.vt)),
                { frames: [], remainingData: 0 })
              : 1 === t.header.pageSequenceNumber
              ? { frames: [], remainingData: 0 }
              : {
                  frames: t.segments
                    .filter((t) => 79 !== t[0] && 112 !== t[1])
                    .map((t) => new $(t, this.Ee)),
                  remainingData: 0,
                };
          }
        }
        class K extends l {
          constructor(t, e, s) {
            e && ((e.dataByteLength = t.length), (e.samplesPerFrame = s)),
              super(e, t);
          }
        }
        const q = {
          6: 64,
          7: 128,
          8: 256,
          9: 512,
          10: 1024,
          11: 2048,
          12: 4096,
          13: 8192,
        };
        class Y extends u {
          static getHeader(t, e) {
            const s = { length: 29 };
            if (t.length < 29) return new Y(s, !1);
            const i = c.getKey(t.subarray(0, 29)),
              n = e.getHeader(i);
            if (n) return new Y(n, !0);
            if (
              1 !== t[0] ||
              118 !== t[1] ||
              111 !== t[2] ||
              114 !== t[3] ||
              98 !== t[4] ||
              105 !== t[5] ||
              115 !== t[6]
            )
              return null;
            const r = new DataView(Uint8Array.of(...t.subarray(0, 29)).buffer);
            if (((s.version = r.getUint32(7, !0)), 0 !== s.version))
              return null;
            (s.channels = t[11]),
              (s.sampleRate = r.getUint32(12, !0)),
              (s.bitrateMaximum = r.getInt32(16, !0)),
              (s.bitrateNominal = r.getInt32(20, !0)),
              (s.bitrateMinimum = r.getInt32(24, !0)),
              (s.blocksize1 = q[(240 & t[28]) >> 4]),
              (s.blocksize0 = q[15 & t[28]]),
              (s.bitDepth = 32),
              (s.bytes = t.subarray(0, s.length));
            const { length: a, bytes: h, version: o, ...d } = s;
            return e.setHeader(i, s, d), s;
          }
          constructor(t, e) {
            super(t, e),
              (this.Be = t.version),
              (this.Le = t.bitrateMaximum),
              (this.Ce = t.bitrateNominal),
              (this.Te = t.bitrateMinimum),
              (this.Pt = t.bitDepth),
              (this._e = t.blocksize0),
              (this.xe = t.blocksize1),
              (this.Ae = t.codecPrivate);
          }
          set dataByteLength(t) {
            this._t = t;
          }
          get blocksize0() {
            return this._e;
          }
          get blocksize1() {
            return this.xe;
          }
          get codecPrivate() {
            return this.Ae;
          }
          get bitrateNominal() {
            return this.Ce;
          }
        }
        class Q extends d {
          constructor(t) {
            super(t),
              (this.CodecFrame = K),
              (this.Et = 29),
              (this.De = null),
              (this.Ae = { lacing: [], vorbisHead: null, vorbisSetup: null }),
              (this.Pe = { count: 0 }),
              (this.Re = 0),
              (this.ze = 0);
          }
          get codec() {
            return "vorbis";
          }
          parseFrames(t) {
            if (0 === t.header.pageSequenceNumber)
              return (
                (this.De = Y.getHeader(t.data, this.vt)),
                (this.Ae.vorbisHead = t.segments[0]),
                (this.Ae.lacing = this.Ae.lacing.concat(
                  ...t.header.pageSegmentBytes,
                )),
                { frames: [], remainingData: 0 }
              );
            if (1 === t.header.pageSequenceNumber) {
              this.Ae.vorbisSetup = t.data;
              for (const e of t.header.pageSegmentBytes)
                if ((this.Ae.lacing.push(e), 255 !== e)) break;
              return (
                (this.De.codecPrivate = this.Ae),
                (this.Pe = this.Fe(t.segments[1])),
                { frames: [], remainingData: 0 }
              );
            }
            return {
              frames: t.segments.map(
                (t) => new K(t, new Y(this.De, !0), this.ke(t)),
              ),
              remainingData: 0,
            };
          }
          ke(t) {
            const e = t[0] >> 1,
              s = this.Pe[e & this.Pe.mask];
            s &&
              (this.Re =
                e & this.Pe.prevMask ? this.De.blocksize1 : this.De.blocksize0),
              (this.ze = s ? this.De.blocksize1 : this.De.blocksize0);
            const i = (this.Re + this.ze) >> 2;
            return (this.Re = this.ze), i;
          }
          Fe(t) {
            const e = new o(t);
            let s,
              n = { count: 0 };
            for (; 1 != (1 & e.read(1)); );
            for (; n.count < 64 && e.position > 0; ) {
              const t = h(e.read(8));
              if (t in n)
                throw (
                  (i(
                    "received duplicate mode mapping, failed to parse vorbis modes",
                  ),
                  new Error("Failed to read Vorbis stream"))
                );
              let r = 0;
              for (; 0 === e.read(8) && r++ < 3; );
              if (4 !== r) {
                if (1 + ((126 & h(s)) >> 1) !== n.count)
                  throw (
                    (i(
                      "mode count did not match actual modes, failed to parse vorbis modes",
                    ),
                    new Error("Failed to read Vorbis stream"))
                  );
                break;
              }
              (s = e.read(7)), (n[t] = 1 & s), (e.position += 6), n.count++;
            }
            return (
              (n.mask = (1 << Math.log2(n.count)) - 1),
              (n.prevMask = 1 + (1 | n.mask)),
              n
            );
          }
        }
        class J extends d {
          constructor(t) {
            super(),
              (this.bt = t),
              (this.CodecFrame = P),
              (this.Et = 283),
              (this.Ue = null);
          }
          get codec() {
            return this.Ue || "";
          }
          at(t, e) {
            return String.fromCharCode(...e).match(t);
          }
          getCodec({ data: t }) {
            return this.at(/\x7fFLAC/, t.subarray(0, 5))
              ? ((this.Oe = new N(this.bt)), "flac")
              : this.at(/OpusHead/, t.subarray(0, 8))
              ? ((this.Oe = new j(this.bt)), "opus")
              : this.at(/\x01vorbis/, t.subarray(0, 7))
              ? ((this.Oe = new Q(this.bt)), "vorbis")
              : void 0;
          }
          parseFrames(t) {
            const e = this.fixedLengthFrame(t);
            return e.frames.length &&
              (this.Ue || ((this.Ue = this.getCodec(e.frames[0])), this.Ue))
              ? {
                  frames: e.frames.flatMap(
                    (t) => this.Oe.parseFrames(t).frames,
                  ),
                  remainingData: e.remainingData,
                }
              : { frames: [], remainingData: e.remainingData };
          }
        }
        class Z {
          constructor({ name: t, contents: e = [], children: s = [] }) {
            (this.Ve = t), (this.Ne = e), (this.He = s);
          }
          static stringToByteArray(t) {
            return [...t].map((t) => t.charCodeAt(0));
          }
          static getFloat64(t) {
            const e = new Uint8Array(8);
            return new DataView(e.buffer).setFloat64(0, t), e;
          }
          static getUint64(t) {
            const e = new Uint8Array(8);
            return new DataView(e.buffer).setBigUint64(0, BigInt(t)), e;
          }
          static getUint32(t) {
            const e = new Uint8Array(4);
            return new DataView(e.buffer).setUint32(0, t), e;
          }
          static getUint16(t) {
            const e = new Uint8Array(2);
            return new DataView(e.buffer).setUint16(0, t), e;
          }
          static getInt16(t) {
            const e = new Uint8Array(2);
            return new DataView(e.buffer).setInt16(0, t), e;
          }
          static *flatten(t) {
            for (const e of t) Array.isArray(e) ? yield* Z.flatten(e) : yield e;
          }
          get contents() {
            const t = new Uint8Array(this.length),
              e = this.We();
            let s = 0;
            for (const i of Z.flatten(e))
              "object" != typeof i
                ? ((t[s] = i), s++)
                : (t.set(i, s), (s += i.length));
            return t;
          }
          get length() {
            return this.Ge();
          }
          We() {
            return [this.Ne, ...this.He.map((t) => t.We())];
          }
          Ge() {
            let t;
            return (
              (t = Array.isArray(this.Ne)
                ? this.Ne.reduce(
                    (t, e) => t + (void 0 === e.length ? 1 : e.length),
                    0,
                  )
                : void 0 === this.Ne.length
                ? 1
                : this.Ne.length),
              t + this.He.reduce((t, e) => t + e.length, 0)
            );
          }
          addChild(t) {
            this.He.push(t);
          }
        }
        class X extends Z {
          constructor(t, { contents: e, children: s } = {}) {
            super({ name: t, contents: e, children: s });
          }
          We() {
            return [...this.$e, ...Z.stringToByteArray(this.Ve), ...super.We()];
          }
          Ge() {
            return (
              this.xt ||
                ((this.xt = 4 + this.Ve.length + super.Ge()),
                (this.$e = Z.getUint32(this.xt))),
              this.xt
            );
          }
        }
        class tt extends Z {
          constructor(t, { contents: e, tags: s } = {}) {
            super({ name: t, contents: e, children: s });
          }
          static getLength(t) {
            const e = Z.getUint32(t);
            return e.every((t, e, s) => 0 === t && ((s[e] = 128), !0)), e;
          }
          We() {
            return [this.Ve, ...this.$e, ...super.We()];
          }
          Ge() {
            if (!this.xt) {
              const t = super.Ge();
              (this.$e = tt.getLength(t)), (this.xt = 1 + t + this.$e.length);
            }
            return this.xt;
          }
          addTag(t) {
            this.addChild(t);
          }
        }
        class et {
          constructor(t) {
            this.Ue = t;
          }
          getCodecBox(t) {
            switch (this.Ue) {
              case "mp3":
                return this.getMp4a(t, 107);
              case "mp4a.40.2":
                return this.getMp4a(t, 64);
              case "opus":
                return this.getOpus(t);
              case "flac":
                return this.getFlaC(t);
            }
          }
          getOpus(t) {
            return new X("Opus", {
              contents: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                t.channels,
                0,
                t.bitDepth,
                0,
                0,
                0,
                0,
                X.getUint16(t.sampleRate),
                0,
                0,
              ],
              children: [
                new X("dOps", {
                  contents: [
                    0,
                    t.channels,
                    X.getUint16(t.preSkip),
                    X.getUint32(t.inputSampleRate),
                    X.getInt16(t.outputGain),
                    t.channelMappingFamily,
                    0 !== t.channelMappingFamily
                      ? [
                          t.streamCount,
                          t.coupledStreamCount,
                          t.channelMappingTable,
                        ]
                      : [],
                  ],
                }),
              ],
            });
          }
          getFlaC(t) {
            return new X("fLaC", {
              contents: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                t.channels,
                0,
                t.bitDepth,
                0,
                0,
                0,
                0,
                X.getUint16(t.sampleRate),
                0,
                0,
              ],
              children: [
                new X("dfLa", {
                  contents: [
                    0,
                    0,
                    0,
                    0,
                    128,
                    0,
                    0,
                    34,
                    X.getUint16(t.blockSize),
                    X.getUint16(t.blockSize),
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    X.getUint32(
                      (t.sampleRate << 12) |
                        (t.channels << 8) |
                        ((t.bitDepth - 1) << 4),
                    ),
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
                    0,
                    0,
                    0,
                    0,
                  ],
                }),
              ],
            });
          }
          getMp4a(t, e) {
            const s = new tt(4, {
              contents: [e, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            });
            return (
              64 === e &&
                s.addTag(new tt(5, { contents: t.audioSpecificConfig })),
              new X("mp4a", {
                contents: [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  t.channels,
                  0,
                  16,
                  0,
                  0,
                  0,
                  0,
                  X.getUint16(t.sampleRate),
                  0,
                  0,
                ],
                children: [
                  new X("esds", {
                    contents: [0, 0, 0, 0],
                    children: [
                      new tt(3, {
                        contents: [0, 1, 0],
                        tags: [s, new tt(6, { contents: 2 })],
                      }),
                    ],
                  }),
                ],
              })
            );
          }
          getInitializationSegment(t) {
            return new Z({
              children: [
                new X("ftyp", {
                  contents: [
                    X.stringToByteArray("iso5"),
                    0,
                    0,
                    2,
                    0,
                    X.stringToByteArray("iso6mp41"),
                  ],
                }),
                new X("moov", {
                  children: [
                    new X("mvhd", {
                      contents: [
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
                        3,
                        232,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        1,
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
                        1,
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
                        1,
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
                        64,
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
                        2,
                      ],
                    }),
                    new X("trak", {
                      children: [
                        new X("tkhd", {
                          contents: [
                            0,
                            0,
                            0,
                            3,
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
                            1,
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
                            0,
                            0,
                            0,
                            1,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
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
                            1,
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
                            64,
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
                          ],
                        }),
                        new X("mdia", {
                          children: [
                            new X("mdhd", {
                              contents: [
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
                                X.getUint32(t.sampleRate),
                                0,
                                0,
                                0,
                                0,
                                85,
                                196,
                                0,
                                0,
                              ],
                            }),
                            new X("hdlr", {
                              contents: [
                                0,
                                0,
                                0,
                                0,
                                X.stringToByteArray("mhlr"),
                                X.stringToByteArray("soun"),
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
                              ],
                            }),
                            new X("minf", {
                              children: [
                                new X("stbl", {
                                  children: [
                                    new X("stsd", {
                                      contents: [0, 0, 0, 0, 0, 0, 0, 1],
                                      children: [this.getCodecBox(t)],
                                    }),
                                    new X("stts", {
                                      contents: [0, 0, 0, 0, 0, 0, 0, 0],
                                    }),
                                    new X("stsc", {
                                      contents: [0, 0, 0, 0, 0, 0, 0, 0],
                                    }),
                                    new X("stsz", {
                                      contents: [
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
                                      ],
                                    }),
                                    new X("stco", {
                                      contents: [0, 0, 0, 0, 0, 0, 0, 0],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    new X("mvex", {
                      children: [
                        new X("trex", {
                          contents: [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            1,
                            0,
                            0,
                            0,
                            1,
                            X.getUint32(t.samplesPerFrame),
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }).contents;
          }
          getMediaSegment(t) {
            return new Z({
              children: [
                new X("moof", {
                  children: [
                    new X("mfhd", { contents: [0, 0, 0, 0, 0, 0, 0, 0] }),
                    new X("traf", {
                      children: [
                        new X("tfhd", { contents: [0, 2, 0, 0, 0, 0, 0, 1] }),
                        new X("tfdt", { contents: [0, 0, 0, 0, 0, 0, 0, 0] }),
                        new X("trun", {
                          contents: [
                            0,
                            0,
                            2,
                            1,
                            X.getUint32(t.length),
                            X.getUint32(92 + 4 * t.length),
                            ...t.map(({ data: t }) => X.getUint32(t.length)),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new X("mdat", { contents: t.map(({ data: t }) => t) }),
              ],
            }).contents;
          }
        }
        class st extends Z {
          constructor(
            t,
            { contents: e, children: s, isUnknownLength: i = !1 } = {},
          ) {
            super({ name: t, contents: e, children: s }), (this.je = i);
          }
          static getUintVariable(t) {
            let e;
            if (t < 127) e = [128 | t];
            else if (t < 16383) (e = Z.getUint16(t)), (e[0] |= 64);
            else if (t < 2097151)
              (e = Z.getUint32(t).subarray(1)), (e[0] |= 32);
            else if (t < 268435455) (e = Z.getUint32(t)), (e[0] |= 16);
            else if (t < 34359738367)
              (e = Z.getUint64(t).subarray(3)), (e[0] |= 8);
            else if (t < 4398046511103)
              (e = Z.getUint64(t).subarray(2)), (e[0] |= 4);
            else if (t < 562949953421311)
              (e = Z.getUint64(t).subarray(1)), (e[0] |= 2);
            else if (t < 72057594037927940) (e = Z.getUint64(t)), (e[0] |= 1);
            else if ("number" != typeof t || isNaN(t))
              throw (
                (i(
                  `EBML Variable integer must be a number, instead received ${t}`,
                ),
                new Error("mse-audio-wrapper: Unable to encode WEBM"))
              );
            return e;
          }
          We() {
            return [...this.Ve, ...this.$e, ...super.We()];
          }
          Ge() {
            return (
              this.xt ||
                ((this.Ke = super.Ge()),
                (this.$e = this.je
                  ? [1, 255, 255, 255, 255, 255, 255, 255]
                  : st.getUintVariable(this.Ke)),
                (this.xt = this.Ve.length + this.$e.length + this.Ke)),
              this.xt
            );
          }
        }
        const it = [225],
          nt = [98, 100],
          rt = [159],
          at = [31, 67, 182, 117],
          ht = [86, 170],
          ot = [134],
          ct = [99, 162],
          dt = [66, 130],
          lt = [66, 133],
          ut = [66, 135],
          mt = [26, 69, 223, 163],
          ft = [66, 242],
          yt = [66, 243],
          wt = [66, 247],
          gt = [66, 134],
          pt = [156],
          bt = [21, 73, 169, 102],
          St = [77, 128],
          vt = [181],
          Mt = [86, 187],
          It = [24, 83, 128, 103],
          Et = [163],
          Bt = [231],
          Lt = [42, 215, 177],
          Ct = [174],
          Tt = [215],
          _t = [22, 84, 174, 107],
          xt = [131],
          At = [115, 197],
          Dt = [87, 65];
        class Pt {
          constructor(t) {
            switch (t) {
              case "opus":
                (this.qe = "A_OPUS"),
                  (this.Ye = (t) => [
                    new st(ht, {
                      contents: st.getUint32(this.Qe(t.preSkip) * this.Je),
                    }),
                    new st(Mt, {
                      contents: st.getUint32(this.Qe(3840) * this.Je),
                    }),
                    new st(ct, { contents: t.bytes }),
                  ]);
                break;
              case "vorbis":
                (this.qe = "A_VORBIS"),
                  (this.Ye = (t) => [
                    new st(ct, {
                      contents: [
                        2,
                        t.codecPrivate.lacing,
                        t.codecPrivate.vorbisHead,
                        t.codecPrivate.vorbisSetup,
                      ],
                    }),
                  ]);
            }
            this.fe = 0;
          }
          Qe(t) {
            return (t / this.At) * 1e3;
          }
          getInitializationSegment(t) {
            return (
              (this.At = t.sampleRate),
              new Z({
                children: [
                  new st(mt, {
                    children: [
                      new st(gt, { contents: 1 }),
                      new st(wt, { contents: 1 }),
                      new st(ft, { contents: 4 }),
                      new st(yt, { contents: 8 }),
                      new st(dt, { contents: st.stringToByteArray("webm") }),
                      new st(ut, { contents: 4 }),
                      new st(lt, { contents: 2 }),
                    ],
                  }),
                  new st(It, {
                    isUnknownLength: !0,
                    children: [
                      new st(bt, {
                        children: [
                          new st(Lt, { contents: st.getUint32(1e6) }),
                          new st(St, {
                            contents: st.stringToByteArray("mse-audio-wrapper"),
                          }),
                          new st(Dt, {
                            contents: st.stringToByteArray("mse-audio-wrapper"),
                          }),
                        ],
                      }),
                      new st(_t, {
                        children: [
                          new st(Ct, {
                            children: [
                              new st(Tt, { contents: 1 }),
                              new st(At, { contents: 1 }),
                              new st(pt, { contents: 0 }),
                              new st(ot, {
                                contents: st.stringToByteArray(this.qe),
                              }),
                              new st(xt, { contents: 2 }),
                              new st(it, {
                                children: [
                                  new st(rt, { contents: t.channels }),
                                  new st(vt, {
                                    contents: st.getFloat64(t.sampleRate),
                                  }),
                                  new st(nt, { contents: t.bitDepth }),
                                ],
                              }),
                              ...this.Ye(t),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }).contents
            );
          }
          getMediaSegment(t) {
            let e = 0;
            const s = new st(at, {
              children: [
                new st(Bt, {
                  contents: st.getUintVariable(Math.round(this.Qe(this.fe))),
                }),
                ...t.map(
                  ({ data: t, header: s }) =>
                    new st(Et, {
                      contents: [
                        129,
                        st.getInt16(
                          Math.round(this.Qe(e, void (e += s.samplesPerFrame))),
                        ),
                        128,
                        t,
                      ],
                    }),
                ),
              ],
            });
            return (this.fe += e), s.contents;
          }
        }
        const Rt = () => {};
        const zt = class {
          constructor(t, e = {}) {
            (this.Ze = t),
              (this.PREFERRED_CONTAINER = e.preferredContainer || "fmp4"),
              (this.MIN_FRAMES = e.minFramesPerSegment || 4),
              (this.MAX_FRAMES = e.maxFramesPerSegment || 20),
              (this.MIN_FRAMES_LENGTH = e.minBytesPerSegment || 1022),
              (this.bt = e.onCodecUpdate || Rt),
              (this.Xe = e.onMimeType || Rt),
              (this.ts = []),
              (this.es = new Uint8Array(0)),
              (this.ss = this.ns()),
              (this.T = this.T()),
              this.T.next();
          }
          get mimeType() {
            return this.rs;
          }
          get inputMimeType() {
            return this.Ze;
          }
          *iterator(t) {
            for (let e = this.T.next(t); e.value; e = this.T.next())
              yield e.value;
          }
          ns() {
            return this.Ze.match(/aac/)
              ? new A(this.bt)
              : this.Ze.match(/mpeg/)
              ? new M(this.bt)
              : this.Ze.match(/ogg/)
              ? new J(this.bt)
              : void 0;
          }
          hs() {
            switch (this.ss.codec) {
              case "mp3":
                return (this.rs = 'audio/mp4;codecs="mp3"'), new et("mp3");
              case "mp4a.40.2":
                return (
                  (this.rs = 'audio/mp4;codecs="mp4a.40.2"'),
                  new et("mp4a.40.2")
                );
              case "flac":
                return (this.rs = 'audio/mp4;codecs="flac"'), new et("flac");
              case "vorbis":
                return (
                  (this.rs = 'audio/webm;codecs="vorbis"'), new Pt("vorbis")
                );
              case "opus":
                return "webm" === this.PREFERRED_CONTAINER
                  ? ((this.rs = 'audio/webm;codecs="opus"'), new Pt("opus"))
                  : ((this.rs = 'audio/mp4;codecs="opus"'), new et("opus"));
            }
          }
          *T() {
            let t;
            for (; !t; ) yield* this.os(), (t = this.cs());
            (this.ds = this.hs()), this.Xe(this.rs);
            let e = r(
              this.ds.getInitializationSegment(t[0][0].header),
              ...t.map((t) => this.ds.getMediaSegment(t)),
            );
            for (;;)
              yield* this.os(e),
                (t = this.cs()),
                (e = t ? r(...t.map((t) => this.ds.getMediaSegment(t))) : null);
          }
          *os(t) {
            let e = yield t;
            for (; !e; ) e = yield;
            this.es = r(this.es, e);
          }
          cs() {
            const { frames: t, remainingData: e } = this.ss.parseFrames(
              this.es,
            );
            if (
              ((this.ts = this.ts.concat(t)),
              (this.es = this.es.subarray(e)),
              this.ts.length >= this.MIN_FRAMES &&
                this.ts.reduce((t, e) => t + e.data.length, 0) >=
                  this.MIN_FRAMES_LENGTH)
            ) {
              const t = this.ts.length % this.MAX_FRAMES,
                e = t < this.MIN_FRAMES ? this.ts.length - t : this.ts.length,
                s = [];
              for (let t = 0; t < e; t++) {
                const e = Math.floor(t / this.MAX_FRAMES);
                s[e] || (s[e] = []), s[e].push(this.ts.shift());
              }
              return s;
            }
          }
        };
      },
      115: (t) => {
        class e {
          constructor() {
            this.ls = [];
          }
          hasEventListener(t, e) {
            return this.ls.some((s) => s.type === t && s.listener === e);
          }
          addEventListener(t, e, s = {}) {
            return (
              this.hasEventListener(t, e) ||
                this.ls.push({ type: t, listener: e, options: s }),
              this
            );
          }
          removeEventListener(t, e) {
            const s = this.ls.findIndex(
              (s) => s.type === t && s.listener === e,
            );
            return s >= 0 && this.ls.splice(s, 1), this;
          }
          removeEventListeners() {
            return (this.ls = []), this;
          }
          dispatchEvent(t) {
            return (
              this.ls
                .filter((e) => e.type === t.type)
                .forEach((e) => {
                  const {
                    type: s,
                    listener: i,
                    options: { once: n },
                  } = e;
                  i.call(this, t), !0 === n && this.removeEventListener(s, i);
                }),
              this
            );
          }
        }
        try {
          new EventTarget(), (t.exports = EventTarget);
        } catch {
          t.exports = e;
        }
      },
      187: (t, e, s) => {
        const { IcecastReadableStream: i, IcecastMetadataQueue: n } = s(43),
          r = s(388).Z,
          a = s(115),
          h = () => {},
          o = new WeakMap(),
          c = "playing",
          d = "stopping",
          l = "stopped",
          u = "retrying",
          m = "play",
          f = "load",
          y = "streamstart",
          w = "stream",
          g = "streamend",
          p = "metadata",
          b = "metadataenqueue",
          S = "codecupdate",
          v = "stop",
          M = "retry",
          I = "retrytimeout",
          E = "warn",
          B = "error",
          L = Symbol(),
          C = Symbol(),
          T = Symbol(),
          _ = Symbol(),
          x = Symbol(),
          A = Symbol(),
          D = Symbol(),
          P = Symbol(),
          R = Symbol(),
          z = Symbol(),
          F = Symbol(),
          k = Symbol(),
          U = Symbol(),
          O = Symbol(),
          V = Symbol(),
          N = Symbol(),
          H = Symbol(),
          W = Symbol(),
          G = Symbol(),
          $ = Symbol(),
          j = Symbol(),
          K = Symbol(),
          q = Symbol(),
          Y = Symbol(),
          Q = Symbol(),
          J = Symbol(),
          Z = Symbol(),
          X = Symbol(),
          tt = Symbol(),
          et = Symbol(),
          st = Symbol(),
          it = Symbol(),
          nt = Symbol(),
          rt = Symbol(),
          at = Symbol(),
          ht = Symbol(),
          ot = Symbol(),
          ct = Symbol(),
          dt = Symbol(),
          lt = Symbol();
        t.exports = class extends a {
          constructor(t, e = {}) {
            super(),
              o.set(this, {}),
              (o.get(this)[A] = t),
              (o.get(this)[C] = e.audioElement || new Audio()),
              (o.get(this)[T] = e.icyMetaInt),
              (o.get(this)[_] = e.icyDetectionTimeout),
              (o.get(this)[L] = e.metadataTypes || ["icy"]),
              (o.get(this)[F] = o.get(this)[L].includes("icy")),
              (o.get(this)[x] = e.enableLogging || !1),
              (o.get(this)[D] = (e.retryDelayRate || 0.1) + 1),
              (o.get(this)[P] = 1e3 * (e.retryDelayMin || 0.5)),
              (o.get(this)[R] = 1e3 * (e.retryDelayMax || 2)),
              (o.get(this)[z] = 1e3 * (e.retryTimeout || 30)),
              (o.get(this)[H] = {
                [m]: e.onPlay || h,
                [f]: e.onLoad || h,
                [y]: e.onStreamStart || h,
                [w]: e.onStream || h,
                [g]: e.onStreamEnd || h,
                [p]: e.onMetadata || h,
                [b]: e.onMetadataEnqueue || h,
                [S]: e.onCodecUpdate || h,
                [v]: e.onStop || h,
                [M]: e.onRetry || h,
                [I]: e.onRetryTimeout || h,
                [E]: (...t) => {
                  o.get(this)[x] &&
                    console.warn(
                      "icecast-metadata-js",
                      t.reduce((t, e) => t + "\n  " + e, ""),
                    ),
                    e.onWarn && e.onWarn(...t);
                },
                [B]: (...t) => {
                  o.get(this)[x] &&
                    console.error(
                      "icecast-metadata-js",
                      t.reduce((t, e) => t + "\n  " + e, ""),
                    ),
                    e.onError && e.onError(...t);
                },
              }),
              (o.get(this)[U] = new n({
                onMetadataUpdate: (...t) => this[tt](p, ...t),
                onMetadataEnqueue: (...t) => this[tt](b, ...t),
              })),
              (o.get(this)[q] = () => {
                clearTimeout(o.get(this)[Z]),
                  this.removeEventListener(y, o.get(this)[q]),
                  o.get(this)[C].removeEventListener("waiting", o.get(this)[X]),
                  o.get(this)[C].removeEventListener("canplay", o.get(this)[j]),
                  o.get(this)[C].pause(),
                  o.get(this)[U].purgeMetadataQueue(),
                  this[st]();
              }),
              (o.get(this)[$] = () => {
                this.play();
              }),
              (o.get(this)[G] = () => {
                this.stop();
              }),
              (o.get(this)[j] = () => {
                o.get(this)[C].play(), (this[W] = c), this[tt](m);
              }),
              (o.get(this)[K] = (t) => {
                this[tt](
                  B,
                  "The audio element encountered an error",
                  {
                    1: "MEDIA_ERR_ABORTED The fetching of the associated resource was aborted by the user's request.",
                    2: "MEDIA_ERR_NETWORK Some kind of network error occurred which prevented the media from being successfully fetched, despite having previously been available.",
                    3: "MEDIA_ERR_DECODE Despite having previously been determined to be usable, an error occurred while trying to decode the media resource, resulting in an error.",
                    4: "MEDIA_ERR_SRC_NOT_SUPPORTED The associated resource or media provider object (such as a MediaStream) has been found to be unsuitable.",
                    5: "MEDIA_ERR_ENCRYPTED",
                  }[t.target.error.code] || `Code: ${t.target.error.code}`,
                  `Message: ${t.target.error.message}`,
                );
              }),
              this[dt](),
              (this[W] = l),
              this[st](),
              (o.get(this)[k] = {});
          }
          get audioElement() {
            return o.get(this)[C];
          }
          get icyMetaInt() {
            return o.get(this)[k].icyMetaInt;
          }
          get metadataQueue() {
            return o.get(this)[U].metadataQueue;
          }
          get state() {
            return o.get(this)[W];
          }
          set [W](t) {
            this.dispatchEvent(new CustomEvent(t)), (o.get(this)[W] = t);
          }
          [dt]() {
            const t = o.get(this)[C];
            t.addEventListener("pause", o.get(this)[G]),
              t.addEventListener("play", o.get(this)[$]),
              t.addEventListener("error", o.get(this)[K]);
          }
          detachAudioElement() {
            const t = o.get(this)[C];
            t.removeEventListener("pause", o.get(this)[G]),
              t.removeEventListener("play", o.get(this)[$]),
              t.removeEventListener("canplay", o.get(this)[j]),
              t.removeEventListener("error", o.get(this)[K]);
          }
          async play() {
            if (this.state === l) {
              let t;
              (o.get(this)[O] = new AbortController()),
                (this[W] = "loading"),
                this[tt](f);
              const e = () =>
                this[ht]()
                  .then(
                    async (t) => (
                      this[tt](y),
                      this[ot](t).finally(() => {
                        this[tt](g);
                      })
                    ),
                  )
                  .catch(async (s) => {
                    if ("AbortError" !== s.name) {
                      if (await this[lt](s)) return this[tt](M), e();
                      o.get(this)[O].abort(),
                        o.get(this)[W] !== d &&
                          o.get(this)[W] !== l &&
                          (this[tt](B, s), (t = s));
                    }
                  });
              e().finally(() => {
                o.get(this)[q](),
                  t && !t.message.match(/network|fetch|offline/) && this[et](),
                  this[tt](v),
                  (this[W] = l);
              }),
                await new Promise((t) => {
                  this.addEventListener("play", t, { once: !0 });
                });
            }
          }
          async stop() {
            this.state !== l &&
              this.state !== d &&
              ((this[W] = d),
              o.get(this)[O].abort(),
              await new Promise((t) => {
                this.addEventListener("stop", t, { once: !0 });
              }));
          }
          async [lt](t) {
            if (0 === o.get(this)[z]) return !1;
            if (o.get(this)[W] === u)
              return (
                await new Promise((t) => {
                  this.addEventListener(d, t, { once: !0 });
                  const e = Math.min(
                    o.get(this)[P] * o.get(this)[D] ** o.get(this)[J]++,
                    o.get(this)[R],
                  );
                  setTimeout(() => {
                    this.removeEventListener(d, t), t();
                  }, e + 0.3 * e * Math.random());
                }),
                o.get(this)[W] === u
              );
            if (
              o.get(this)[W] !== d &&
              o.get(this)[W] !== l &&
              (t.message.match(/network|fetch|offline|Error in body stream/i) ||
                "HTTP Response Error" === t.name)
            ) {
              this[tt](B, t),
                (this[W] = u),
                this.addEventListener(y, o.get(this)[q], { once: !0 }),
                o.get(this)[F] &&
                  this[tt](
                    E,
                    "This stream was requested with ICY metadata.",
                    'If there is a CORS preflight failure, try removing "icy" from the metadataTypes option.',
                    "See https://github.com/eshaz/icecast-metadata-js#cors for more details.",
                  );
              const e = new Promise((t) => {
                (o.get(this)[X] = t),
                  o.get(this)[C].addEventListener("waiting", o.get(this)[X], {
                    once: !0,
                  });
              });
              return (
                (o.get(this)[Z] = setTimeout(() => {
                  e.then(() => {
                    o.get(this)[W] === u && (this[tt](I), this.stop());
                  });
                }, o.get(this)[z])),
                (o.get(this)[J] = 0),
                !0
              );
            }
            return !1;
          }
          async [ht]() {
            const t = await fetch(o.get(this)[A], {
              method: "GET",
              headers: o.get(this)[F] ? { "Icy-MetaData": 1 } : {},
              signal: o.get(this)[O].signal,
            });
            if (!t.ok) {
              const e = new Error(`${t.status} received from ${t.url}`);
              throw ((e.name = "HTTP Response Error"), e);
            }
            return t;
          }
          async [ot](t) {
            o
              .get(this)
              [C].addEventListener("canplay", o.get(this)[j], { once: !0 }),
              (o.get(this)[k] = new i(t, {
                onMetadata: (t) => {
                  o.get(this)[U].addMetadata(
                    t,
                    (o.get(this)[V] &&
                      o.get(this)[V].sourceBuffers.length &&
                      Math.max(
                        o.get(this)[V].sourceBuffers[0].timestampOffset,
                        o.get(this)[V].sourceBuffers[0].buffered.length
                          ? o.get(this)[V].sourceBuffers[0].buffered.end(0)
                          : 0,
                      )) ||
                      0,
                    o.get(this)[C].currentTime,
                  );
                },
                onStream: this[ct](t.headers.get("content-type")),
                onError: (...t) => this[tt](E, ...t),
                metadataTypes: o.get(this)[L],
                icyMetaInt: o.get(this)[T],
                icyDetectionTimeout: o.get(this)[_],
              })),
              await o.get(this)[k].startReading();
          }
          async [nt](t) {
            if (MediaSource.isTypeSupported(t)) return t;
            {
              const e = await new Promise((e) => {
                o.get(this)[Y] = new r(t, {
                  onCodecUpdate: (...t) => this[tt](S, ...t),
                  onMimeType: e,
                });
              });
              if (!MediaSource.isTypeSupported(e)) {
                this[tt](
                  B,
                  `Media Source Extensions API in your browser does not support ${t} or ${e}`,
                  "See: https://caniuse.com/mediasource and https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API",
                );
                const s = new Error(`Unsupported Media Source Codec ${e}`);
                throw ((s.name = "CodecError"), s);
              }
              return e;
            }
          }
          async [it](t) {
            await o.get(this)[Q],
              (o.get(this)[N] = 0),
              (o.get(this)[V].addSourceBuffer(t).mode = "sequence");
          }
          async [st]() {
            try {
              const t = (o.get(this)[V] = new MediaSource());
              (o.get(this)[C].src = URL.createObjectURL(t)),
                (o.get(this)[Q] = new Promise((e) => {
                  t.addEventListener("sourceopen", e, { once: !0 });
                }));
            } catch (t) {
              this[tt](
                B,
                "Media Source Extensions API in your browser is not supported",
                "See: https://caniuse.com/mediasource and https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API",
                t,
              ),
                (o.get(this)[Q] = new Promise(h)),
                this[et]();
            }
          }
          [ct](t) {
            const e = this[nt](t).then((t) => this[it](t)),
              s = async ({ stream: t }) => {
                this[tt](w, t), await e, await this[at](t);
              },
              i = o.get(this)[Y];
            return i
              ? async ({ stream: t }) => {
                  for await (const e of i.iterator(t)) await s({ stream: e });
                }
              : s;
          }
          async [rt]() {
            return new Promise((t) => {
              o.get(this)[V].sourceBuffers[0].addEventListener("updateend", t, {
                once: !0,
              });
            });
          }
          async [at](t) {
            this.state !== d &&
              (o.get(this)[V].sourceBuffers[0].appendBuffer(t),
              await this[rt](),
              o.get(this)[C].currentTime > 10 &&
                o.get(this)[N] + 1e4 < Date.now() &&
                ((o.get(this)[N] = Date.now()),
                o
                  .get(this)
                  [V].sourceBuffers[0].remove(
                    0,
                    o.get(this)[C].currentTime - 10,
                  ),
                await this[rt]()));
          }
          [tt](t, ...e) {
            this.dispatchEvent(new CustomEvent(t, { detail: e })),
              o.get(this)[H][t](...e);
          }
          [et]() {
            this[tt](
              B,
              "Falling back to HTML5 audio with no metadata updates. See the console for details on the error.",
            );
            const t = o.get(this)[C];
            (t.crossOrigin = "anonymous"),
              (this.play = async () => {
                o.get(this)[W] !== c &&
                  (t.addEventListener("canplay", o.get(this)[j], { once: !0 }),
                  (t.src = o.get(this)[A]),
                  await new Promise((t) => {
                    this.addEventListener("play", t, { once: !0 });
                  }));
              }),
              (this.stop = () => {
                t.removeEventListener("canplay", o.get(this)[j]),
                  t.pause(),
                  t.removeAttribute("src"),
                  t.load(),
                  (this[W] = l),
                  this[tt](v);
              }),
              o.get(this)[Q].then(() => this.play());
          }
        };
      },
      758: () => {},
    },
    e = {};
  function s(i) {
    if (e[i]) return e[i].exports;
    var n = (e[i] = { exports: {} });
    return t[i](n, n.exports, s), n.exports;
  }
  return (
    (s.n = (t) => {
      var e = t && t.us ? () => t.default : () => t;
      return s.d(e, { a: e }), e;
    }),
    (s.d = (t, e) => {
      for (var i in e)
        s.o(e, i) &&
          !s.o(t, i) &&
          Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
    }),
    (s.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (s.r = (t) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "us", { value: !0 });
    }),
    s(187)
  );
})();
