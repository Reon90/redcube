import { Renderer } from './renderer';

let WebGPU: WEBGPU;

export class RendererWebGPU extends Renderer {
    setEnv(env) {
        this.env = env;
    }

    setGl(g) {
        WebGPU = g;
    }

    render(time = 0) {
        const sec = time / 1000;

        const commandEncoder = WebGPU.device.createCommandEncoder();
        WebGPU.commandEncoder = commandEncoder;

        this.animate(sec);

        if (this.reflow) {
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

        renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();

        const passEncoder = WebGPU.commandEncoder.beginRenderPass(renderPassDescriptor);
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
        device.queue.submit([WebGPU.commandEncoder.finish()]);
    }
}
