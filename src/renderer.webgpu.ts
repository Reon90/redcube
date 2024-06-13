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
            }
            this.renderScene();
            this.clean();
        }

        this.fps.tick(time);

        requestAnimationFrame(this.render.bind(this));
    }

    updateGeometry(mesh, geometry) {
        mesh.geometry.updateWebGPU(WebGPU, geometry);
    }

    renderScene() {
        const { renderPassDescriptor, context, device } = WebGPU;

        const state = this.getState();
        renderPassDescriptor.colorAttachments[0].view = state.renderState.isprerefraction
            // @ts-expect-error
            ? this.PP.target[0]
            : context.getCurrentTexture().createView();

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
