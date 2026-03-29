import { Frustum } from './matrix';
import { WebGPUProfiler } from './profile';
import { Renderer } from './renderer';

let WebGPU: WEBGPU;

export class RendererWebGPU extends Renderer {
    profiler: WebGPUProfiler;

    setEnv(env) {
        this.env = env;
    }

    setGl(g) {
        WebGPU = g;
        this.profiler = new WebGPUProfiler(g.device, { maxTimestampWrites: 64 });
    }

    setPp(pp) {
        this.PP = pp;
    }

    async render(time = 0) {
        const sec = time / 1000;

        if (!(window as any).__FORCE_DETERMINISTIC__) {
            this.animate(sec);
        }

        if (this.reflow) {
            if (this.PP.hasPrePass) {
                this.PP.bindPrePass();
                this.PP.preProcessing();
                this.PP.target = undefined;
            }
            if (this.PP.hasPostPass) {
                this.PP.bindPostPass();
            }

            this.renderScene();
            this.clean();

            if (this.PP.hasPostPass) {
                this.PP.postProcessing();
            }
        }

        this.fps.tick(time);

        requestAnimationFrame(this.render.bind(this));
    }

    updateGeometry(mesh, geometry) {
        mesh.geometry.updateWebGPU(WebGPU, geometry);
    }

    updateMaterial(mesh, type, out) {
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
        let { renderPassDescriptor, context, device, newRenderTarget } = WebGPU;

        const s = this.getState();
        if (s.needUpdateView || this.reflow) {
            const planes = Frustum(s.camera.getViewProjMatrix());

            this.scene.meshes.forEach(mesh => {
                mesh.visible = mesh.parent.visible && mesh.isVisible(planes);
            });

            this.scene.opaqueChildren.sort((a, b) => a.distance - b.distance);
            this.scene.transparentChildren.sort((a, b) => a.distance - b.distance);
        }

        if (this.PP.target) {
            renderPassDescriptor = {
                ...renderPassDescriptor,
                label: 'g-pass',
                colorAttachments: this.PP.target,
                // @ts-expect-error
                depthStencilAttachment: this.PP.pipeline.pass.depthStencilAttachment
            };
        } else {
            renderPassDescriptor = {...renderPassDescriptor, label: 'main-pass', colorAttachments: [
                {
                    // attachment is acquired in render loop.
                    view: newRenderTarget,
                    resolveTarget: context.getCurrentTexture().createView(),
                    storeOp: 'store' as GPUStoreOp,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
                }
            ]};
        }

        this.profiler.beginFrame();
        const commandEncoder = device.createCommandEncoder({label: 'main-command-encoder'});
        const passEncoder = this.profiler.beginTimedRenderPass(commandEncoder, renderPassDescriptor, 'main-pass');
        // @ts-ignore
        // this.env.drawQuad(WebGPU, passEncoder);

        s.stateBuffer.updateWebGPU(WebGPU, 'isTone', s.renderState.isprerefraction ? 0 : 1);
        if (s.needUpdateView) {
            s.cameraBuffer.updateWebGPU(WebGPU, 'view', s.camera.matrixWorldInvert.elements);
            s.cameraBuffer.updateWebGPU(WebGPU, 'light', s.light.matrixWorldInvert.elements);

            this.parse.lights.forEach((light, i) => {
                s.lightPosBuffer.store.set(light.getPosition(), i * 4);
            });
            device.queue.writeBuffer(
                s.lightPosBuffer.bufferWebGPU,
                0,
                s.lightPosBuffer.store.buffer,
                s.lightPosBuffer.store.byteOffset,
                s.lightPosBuffer.store.byteLength
            );
        }
        if (s.needUpdateProjection) {
            s.cameraBuffer.updateWebGPU(WebGPU, 'projection', s.camera.projection.elements);
        }

        device.queue.writeBuffer(
            s.lightColorBuffer.bufferWebGPU,
            0,
            s.lightColorBuffer.store.buffer,
            s.lightColorBuffer.store.byteOffset,
            s.lightColorBuffer.store.byteLength
        );
        s.lights.forEach((light, i) => {
            const offset = i * 4 * Float32Array.BYTES_PER_ELEMENT;
            if (light.visible === false) {
                device.queue.writeBuffer(
                    s.lightColorBuffer.bufferWebGPU,
                    offset,
                    new Float32Array([0, 0, 0, 0]).buffer,
                    0,
                    16
                );
            }
        });

        this.scene.opaqueChildren.forEach((mesh) => {
            if (mesh.visible) {
                passEncoder.setPipeline(s.renderState.isprerefraction ? mesh.pipeline2 : mesh.pipeline);
                mesh.drawWebGPU(WebGPU, passEncoder, mesh.order, s);
            }
        });
        this.scene.transparentChildren.forEach(mesh => {
            if (mesh.visible) {
                passEncoder.setPipeline(s.renderState.isprerefraction ? mesh.pipeline2 : mesh.pipeline);
                mesh.drawWebGPU(WebGPU, passEncoder, mesh.order, s);
            }
        });
        passEncoder.end();
        
        this.profiler.resolveQueries(commandEncoder);
        device.queue.submit([commandEncoder.finish()]);
        

        if (false) {
            const timings = await this.profiler.endFrame();
            console.table({
                frame: timings.frameIndex,
                cpuEncodeMs: timings.cpuEncodeMs.toFixed(3),
                gpuTotalMs: timings.gpuTotalMs?.toFixed(3),
            });
            timings.passes.forEach(p => {
                if (p.durationMs !== undefined) {
                    console.log(`${p.label} (${p.kind}): ${p.durationMs.toFixed(3)} ms`);
                }
            });
        }
    }
}
