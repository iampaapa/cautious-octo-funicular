import React, { useRef, useEffect } from 'react';
import './Visualizer.css';

const Visualizer: React.FC<{ analyser: AnalyserNode }> = ({ analyser }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const draw = () => {
            requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = canvas.width / 10;
            let x = 0;

            for (let i = 0; i < 5; i++) {
                const barHeight = dataArray[i] / 2;
                canvasCtx.fillStyle = 'white';
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 10;
            }
        };

        draw();
    }, [analyser]);

    return <canvas ref={canvasRef} width="600" height="400"></canvas>;
};

export default Visualizer;
