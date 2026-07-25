import { Vector3 } from './matrix';
export declare class SphericalHarmonics {
    preScaled: boolean;
    l00: Vector3;
    l1_1: Vector3;
    l10: Vector3;
    l11: Vector3;
    l2_2: Vector3;
    l2_1: Vector3;
    l20: Vector3;
    l21: Vector3;
    l22: Vector3;
    scaleInPlace(scale: number): void;
    convertIrradianceToLambertianRadiance(): void;
    preScaleForRendering(): void;
    static FromArray(data: ArrayLike<ArrayLike<number>>): SphericalHarmonics;
}
export declare class SphericalPolynomial {
    private _harmonics;
    get preScaledHarmonics(): SphericalHarmonics;
    x: Vector3;
    y: Vector3;
    z: Vector3;
    xx: Vector3;
    yy: Vector3;
    zz: Vector3;
    xy: Vector3;
    yz: Vector3;
    zx: Vector3;
    scale(scale: number): void;
    static FromHarmonics(harmonics: SphericalHarmonics): SphericalPolynomial;
}
