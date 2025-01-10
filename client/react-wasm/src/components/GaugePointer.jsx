import * as React from 'react';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

export default function speedTest(props) {
  let speedValue =[30]  
  return (
    <div className="center-container">
    <GaugeContainer
      width={200}
      height={200}
      startAngle={-110}
      endAngle={110}
      value={30}
    >
      <GaugeReferenceArc />
      <GaugeValueArc />
      <GaugePointer />
      <text
        x="100" // Center horizontally (assuming width = 200)
        y="180" // Position near the bottom (adjust as needed)
        textAnchor="middle" // Align text in the center
        fontSize="16"
        fill="black"
      >
        {speedValue}
      </text>
    </GaugeContainer>
    </div>
  );
}
