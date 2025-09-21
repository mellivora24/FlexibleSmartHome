import React from "react";
import Svg, { Circle, Defs, LinearGradient, Stop, Text } from "react-native-svg";

interface GaugeProps {
  size?: number;
  value?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
  size = 100,
  value = 0,
}) => {
  const radius = size / 2;
  const strokeWidth = 10;
  const center = size / 2;
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const offset = circumference - (value / 100) * circumference;
  const color = value > 70 ? "red" : value > 40 ? "orange" : "green";

  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%"   stopColor='red' />
          <Stop offset="100%" stopColor='green' />
        </LinearGradient>
      </Defs>

      <Circle
        cx={center}
        cy={center}
        r={radius - strokeWidth}
        stroke="#e6e6e6"
        strokeWidth={strokeWidth}
        fill="none"
      />

      <Circle
        cx={center}
        cy={center}
        r={radius - strokeWidth}
        stroke="url(#grad)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${center}, ${center}`}
      />

      <Text
        x={center}
        y={center}
        fill="#333"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {`${value}%`}
      </Text>
    </Svg>
  );
};
