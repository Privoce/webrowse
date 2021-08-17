import { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 4px solid #fff;
    border-radius: 50%;
    &.side {
      display: none;
    }
  }
  .tip {
    text-transform: capitalize;
    padding: 1em;
    border-radius: 0.5em;
    background-color: var(--vera-camera-bg-color);
    font-size: 2.2em;
    color: var(--vera-font-color);
  }
`;
let STOP = false;
const draw = async ({ video, canvas, offCanvas, net }) => {
  if (STOP) return;
  let ctx = canvas.getContext('2d');
  console.log('start draw');
  let offCtx = offCanvas.getContext('2d');
  offCtx.drawImage(video, 0, 0);
  const res = await net.segmentPerson(offCanvas);
  const { videoWidth, videoHeight } = video;
  tf.tidy(() => {
    const maskTensor = tf.tensor3d(res.data, [videoWidth, videoHeight, 1]);
    const imageTensor = tf.browser.fromPixels(offCanvas);
    const t1 = tf.mul(imageTensor, maskTensor);
    const t2 = tf.concat([t1, tf.mul(maskTensor, 255)], 2);
    t2.data().then((rawData) => {
      const rawImageData = new ImageData(new Uint8ClampedArray(rawData), videoWidth, videoHeight);
      ctx.putImageData(rawImageData, 0, 0);
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    });
  });
  requestAnimationFrame(draw.bind(this, { video, canvas, offCanvas, net }));
};
const bgRemove = async (videoEle, canvas, offCanvas) => {
  const net = await bodyPix.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2
  });
  draw({ video: videoEle, canvas, offCanvas, net });
};
export default function BgRemoveMask({ video = null, color }) {
  const [processing, setProcessing] = useState(true);
  const renderRef = useRef(null);
  const side = useRef(null);
  useEffect(() => {
    const startProcess = async () => {
      await bgRemove(video, renderRef.current, side.current);
      setProcessing(false);
    };
    if (video) {
      console.log('start processing');
      STOP = false;
      startProcess();
    }
    return () => {
      console.log('bg remove off');
      STOP = true;
    };
  }, [video]);
  if (!video) return null;
  return (
    <StyledWrapper>
      <canvas ref={side} className="side" width={video.videoWidth} height={video.videoHeight}></canvas>
      <canvas ref={renderRef} className="render" width={video.videoWidth} height={video.videoHeight} style={{ borderColor: color }}></canvas>
      {processing && <div className="tip">processing</div>}
    </StyledWrapper>
  );
}
