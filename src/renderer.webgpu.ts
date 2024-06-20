import { Renderer } from './renderer';

let WebGPU: WEBGPU;

export class RendererWebGPU extends Renderer {
    setEnv(env) {
        this.env = env;
    }

    setGl(g) {
        WebGPU = g;
    }

    setPp(pp) {
        this.PP = pp;
    }

    render(time = 0) {
        const sec = time / 1000;

        this.animate(sec);

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

    renderScene() {
        let { renderPassDescriptor, context, device } = WebGPU;

        if (this.PP.target) {
            renderPassDescriptor = {
                ...renderPassDescriptor,
                colorAttachments: this.PP.target,
                // @ts-expect-error
                depthStencilAttachment: this.PP.pipeline.pass.depthStencilAttachment
            };
        } else {
            renderPassDescriptor = {...renderPassDescriptor, colorAttachments: [
                {
                    // attachment is acquired in render loop.
                    view: context.getCurrentTexture().createView(),
                    storeOp: 'store' as GPUStoreOp,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
                }
            ]};
        }

        const commandEncoder = device.createCommandEncoder();
        WebGPU.commandEncoder = commandEncoder;
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        this.scene.opaqueChildren.forEach(mesh => {
            //if (mesh.visible) {
            passEncoder.setPipeline(mesh.pipeline);
            mesh.drawWebGPU(WebGPU, passEncoder, this.getState());
            //}
        });
        this.scene.transparentChildren.forEach(mesh => {
            //if (mesh.visible) {
            passEncoder.setPipeline(mesh.pipeline);
            mesh.drawWebGPU(WebGPU, passEncoder, this.getState());
            //}
        });
        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
    }
}
