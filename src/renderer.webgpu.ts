import { Scene, Mesh, Camera, Bone } from './objects/index';
import { Vector, Vector3, Vector4, Frustum } from './matrix';
import { getAnimationComponent, interpolation, walk } from './utils';
import { Parse } from './parse';
import { PostProcessing } from './postprocessing';
import { Particles } from './particles';
import { FPS } from './fps';
import { Light as PPLight } from './postprocessors/light';
import { Env } from './env';
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

        this.animate(sec);


        if (this.reflow) {
            this.renderScene();
            this.clean();
        }

        this.fps.tick(time);

        requestAnimationFrame(this.render.bind(this));
    }

    renderScene() {
        const { renderPassDescriptor, swapChain, device } = WebGPU;

        renderPassDescriptor.colorAttachments[0].view = swapChain
            .getCurrentTexture()
            .createView();

        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        this.scene.opaqueChildren.forEach(mesh => {
            //if (mesh.visible) {
                passEncoder.setPipeline(mesh.pipeline);
                mesh.drawWebGPU(WebGPU, passEncoder, this.getState());
            //}
        });
        passEncoder.endPass();
        device.queue.submit([commandEncoder.finish()]);
    }
}
