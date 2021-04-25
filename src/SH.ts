import { Vector3 } from './matrix';

const SH3ylmBasisConstants = [
    Math.sqrt(1 / (4 * Math.PI)),

    -Math.sqrt(3 / (4 * Math.PI)),
    Math.sqrt(3 / (4 * Math.PI)),
    -Math.sqrt(3 / (4 * Math.PI)),

    Math.sqrt(15 / (4 * Math.PI)),
    -Math.sqrt(15 / (4 * Math.PI)),
    Math.sqrt(5 / (16 * Math.PI)),
    -Math.sqrt(15 / (4 * Math.PI)),
    Math.sqrt(15 / (16 * Math.PI))
];

export class SphericalHarmonics {
    public preScaled = false;

    public l00: Vector3 = new Vector3();

    public l1_1: Vector3 = new Vector3();

    public l10: Vector3 = new Vector3();

    public l11: Vector3 = new Vector3();

    public l2_2: Vector3 = new Vector3();

    public l2_1: Vector3 = new Vector3();

    public l20: Vector3 = new Vector3();

    public l21: Vector3 = new Vector3();

    public l22: Vector3 = new Vector3();

    public scaleInPlace(scale: number): void {
        this.l00.scale(scale);
        this.l1_1.scale(scale);
        this.l10.scale(scale);
        this.l11.scale(scale);
        this.l2_2.scale(scale);
        this.l2_1.scale(scale);
        this.l20.scale(scale);
        this.l21.scale(scale);
        this.l22.scale(scale);
    }

    public convertIrradianceToLambertianRadiance(): void {
        this.scaleInPlace(1.0 / Math.PI);
    }

    public preScaleForRendering(): void {
        this.preScaled = true;

        this.l00.scale(SH3ylmBasisConstants[0]);

        this.l1_1.scale(SH3ylmBasisConstants[1]);
        this.l10.scale(SH3ylmBasisConstants[2]);
        this.l11.scale(SH3ylmBasisConstants[3]);

        this.l2_2.scale(SH3ylmBasisConstants[4]);
        this.l2_1.scale(SH3ylmBasisConstants[5]);
        this.l20.scale(SH3ylmBasisConstants[6]);
        this.l21.scale(SH3ylmBasisConstants[7]);
        this.l22.scale(SH3ylmBasisConstants[8]);
    }

    public static FromArray(data: ArrayLike<ArrayLike<number>>): SphericalHarmonics {
        const sh = new SphericalHarmonics();
        Vector3.FromArrayToRef(data[0], 0, sh.l00);
        Vector3.FromArrayToRef(data[1], 0, sh.l1_1);
        Vector3.FromArrayToRef(data[2], 0, sh.l10);
        Vector3.FromArrayToRef(data[3], 0, sh.l11);
        Vector3.FromArrayToRef(data[4], 0, sh.l2_2);
        Vector3.FromArrayToRef(data[5], 0, sh.l2_1);
        Vector3.FromArrayToRef(data[6], 0, sh.l20);
        Vector3.FromArrayToRef(data[7], 0, sh.l21);
        Vector3.FromArrayToRef(data[8], 0, sh.l22);
        return sh;
    }
}

export class SphericalPolynomial {
    private _harmonics: SphericalHarmonics;

    public get preScaledHarmonics(): SphericalHarmonics {
        if (!this._harmonics.preScaled) {
            this._harmonics.preScaleForRendering();
        }
        return this._harmonics;
    }

    public x: Vector3 = new Vector3();

    public y: Vector3 = new Vector3();

    public z: Vector3 = new Vector3();

    public xx: Vector3 = new Vector3();

    public yy: Vector3 = new Vector3();

    public zz: Vector3 = new Vector3();

    public xy: Vector3 = new Vector3();

    public yz: Vector3 = new Vector3();

    public zx: Vector3 = new Vector3();

    public scale(scale: number) {
        this.x.scale(scale);
        this.y.scale(scale);
        this.z.scale(scale);
        this.xx.scale(scale);
        this.yy.scale(scale);
        this.zz.scale(scale);
        this.yz.scale(scale);
        this.zx.scale(scale);
        this.xy.scale(scale);
    }

    public static FromHarmonics(harmonics: SphericalHarmonics): SphericalPolynomial {
        const result = new SphericalPolynomial();
        result._harmonics = harmonics;

        result.x = harmonics.l11.scale2(1.02333).scale2(-1);
        result.y = harmonics.l1_1.scale2(1.02333).scale2(-1);
        result.z = harmonics.l10.scale2(1.02333);

        result.xx = harmonics.l00
            .scale2(0.886277)
            .subtract2(harmonics.l20.scale2(0.247708))
            .add2(harmonics.l22.scale2(0.429043));
        result.yy = harmonics.l00
            .scale2(0.886277)
            .subtract2(harmonics.l20.scale2(0.247708))
            .subtract2(harmonics.l22.scale2(0.429043));
        result.zz = harmonics.l00.scale2(0.886277).add2(harmonics.l20.scale2(0.495417));

        result.yz = harmonics.l2_1.scale2(0.858086).scale2(-1);
        result.zx = harmonics.l21.scale2(0.858086).scale2(-1);
        result.xy = harmonics.l2_2.scale2(0.858086);

        result.scale(1.0 / Math.PI);

        return result;
    }
}
