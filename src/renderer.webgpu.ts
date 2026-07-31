import { Frustum } from './matrix';
import { WebGPUProfiler } from './profile';
import { Renderer } from './renderer';
import { PostProcessing } from './postprocessing.webgpu';
import { Mesh } from './objects/index';
import { Attributes } from './objects/geometry';
import type { State } from './state';

const DEBUG_PROFILING = false;

export class RendererWebGPU extends Renderer {
    profiler: WebGPUProfiler;

    constructor(getState: () => State) {
        super(getState);
        this.profiler = new WebGPUProfiler((getState().gl as WEBGPU).device, { maxTimestampWrites: 64 });
    }

    private get pp(): PostProcessing {
        return this.getState().pp as PostProcessing;
    }

    async render(time = 0) {
        const sec = time / 1000;

        if (!window.__FORCE_DETERMINISTIC__) {
            this.animate(sec);
        }

        if (this.reflow) {
            if (this.pp.hasPrePass) {
                this.pp.bindPrePass();
                this.pp.preProcessing();
                this.pp.target = undefined;
            }
            if (this.pp.hasPostPass) {
                this.pp.bindPostPass();
            }

            await this.renderScene();
            this.clean();

            if (this.pp.hasPostPass) {
                this.pp.postProcessing();
            }
        }

        this.fps.tick(time);

        requestAnimationFrame(this.render.bind(this));
    }

    updateGeometry(mesh: Mesh, geometry: Attributes) {
        const WebGPU = this.getState().gl as WEBGPU;
        mesh.geometry.updateWebGPU(WebGPU, geometry);
    }

    updateMaterial(mesh: Mesh, type: string, out: { elements: Float32Array }) {
        const WebGPU = this.getState().gl as WEBGPU;
        const s = type.split('/');
        const last = s[s.length - 1];

        if (last === 'offset' || last === 'rotation' || last === 'scale') {
            const name = s[s.length - 4];
            mesh.material.setTextureWebGPU(WebGPU, name, last, out);
        } else {
            mesh.repaint = true;
            mesh.material.setColorWebGPU(WebGPU, s[s.length - 1], out);
        }
    }

    async renderScene() {
        const WebGPU = this.getState().gl as WEBGPU;
        const { context, device, newRenderTarget } = WebGPU;
        let { renderPassDescriptor } = WebGPU;

        const s = this.getState();
        if (s.needUpdateView || this.reflow) {
            const planes = Frustum(s.camera.getViewProjMatrix());

            s.scene.meshes.forEach((mesh) => {
                mesh.visible = mesh.parent!.visible && mesh.isVisible(planes);
            });

            s.scene.opaqueChildren.sort((a, b) => a.distance - b.distance);
            s.scene.transparentChildren.sort((a, b) => a.distance - b.distance);
        }

        if (this.pp.target) {
            renderPassDescriptor = {
                ...renderPassDescriptor,
                label: 'g-pass',
                colorAttachments: this.pp.target,
                depthStencilAttachment: this.pp.pipeline.pass!.depthStencilAttachment,
            };
        } else {
            renderPassDescriptor = {
                ...renderPassDescriptor,
                label: 'main-pass',
                colorAttachments: [
                    {
                        // attachment is acquired in render loop.
                        view: newRenderTarget!,
                        resolveTarget: context.getCurrentTexture().createView(),
                        storeOp: 'store' as GPUStoreOp,
                        loadOp: 'clear' as GPULoadOp,
                        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                    },
                ],
            };
        }

        this.profiler.beginFrame();
        const commandEncoder = device.createCommandEncoder({ label: 'main-command-encoder' });
        const passEncoder = this.profiler.beginTimedRenderPass(commandEncoder, renderPassDescriptor, 'main-pass');
        // s.env.drawQuad(WebGPU, passEncoder);

        s.stateBuffer!.updateWebGPU(WebGPU, 'isTone', s.renderState.isprerefraction ? 0 : 1);
        if (s.needUpdateView) {
            s.cameraBuffer!.updateWebGPU(WebGPU, 'view', s.camera.matrixWorldInvert.elements);
            s.cameraBuffer!.updateWebGPU(WebGPU, 'light', s.light!.matrixWorldInvert.elements);

            s.lights.forEach((light, i) => {
                s.lightPosBuffer!.store!.set(light.getPosition(), i * 4);
            });
            device.queue.writeBuffer(
                s.lightPosBuffer!.bufferWebGPU!,
                0,
                s.lightPosBuffer!.store!.buffer,
                s.lightPosBuffer!.store!.byteOffset,
                s.lightPosBuffer!.store!.byteLength,
            );
        }
        if (s.needUpdateProjection) {
            s.cameraBuffer!.updateWebGPU(WebGPU, 'projection', s.camera.projection.elements);
        }

        device.queue.writeBuffer(
            s.lightColorBuffer!.bufferWebGPU!,
            0,
            s.lightColorBuffer!.store!.buffer,
            s.lightColorBuffer!.store!.byteOffset,
            s.lightColorBuffer!.store!.byteLength,
        );
        s.lights.forEach((light, i) => {
            const offset = i * 4 * Float32Array.BYTES_PER_ELEMENT;
            if (light.visible === false) {
                device.queue.writeBuffer(s.lightColorBuffer!.bufferWebGPU!, offset, new Float32Array([0, 0, 0, 0]).buffer, 0, 16);
            }
        });

        s.scene.opaqueChildren.forEach((mesh) => {
            if (mesh.visible) {
                passEncoder.setPipeline((s.renderState.isprerefraction ? mesh.pipeline2 : mesh.pipeline)!);
                mesh.drawWebGPU(WebGPU, passEncoder, mesh.order, s);
            }
        });
        s.scene.transparentChildren.forEach((mesh) => {
            if (mesh.visible) {
                passEncoder.setPipeline((s.renderState.isprerefraction ? mesh.pipeline2 : mesh.pipeline)!);
                mesh.drawWebGPU(WebGPU, passEncoder, mesh.order, s);
            }
        });
        passEncoder.end();

        this.profiler.resolveQueries(commandEncoder);
        device.queue.submit([commandEncoder.finish()]);

        if (DEBUG_PROFILING) {
            const timings = await this.profiler.endFrame();
            console.table({
                frame: timings.frameIndex,
                cpuEncodeMs: timings.cpuEncodeMs.toFixed(3),
                gpuTotalMs: timings.gpuTotalMs?.toFixed(3),
            });
            timings.passes.forEach((p) => {
                if (p.durationMs !== undefined) {
                    console.log(`${p.label} (${p.kind}): ${p.durationMs.toFixed(3)} ms`);
                }
            });
        }
    }
}
