export default function VaultIcon({ size = 32, color = "#F5F5F5" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Coffre-fort principal */}
      <rect
        x="15"
        y="25"
        width="70"
        height="55"
        rx="8"
        fill={color}
        stroke={color}
        strokeWidth="2"
      />
      
      {/* Porte du coffre */}
      <rect
        x="20"
        y="30"
        width="60"
        height="45"
        rx="6"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Cadenas central */}
      <circle
        cx="50"
        cy="52.5"
        r="12"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      
      {/* Anse du cadenas */}
      <path
        d="M 42 45 Q 42 38 50 38 Q 58 38 58 45"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Clé dans le cadenas */}
      <line
        x1="50"
        y1="52.5"
        x2="50"
        y2="58"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Poignée */}
      <circle
        cx="72"
        cy="52.5"
        r="3"
        fill={color}
      />
      
      {/* Lettres PV */}
      <text
        x="32"
        y="50"
        fontSize="8"
        fontWeight="bold"
        fill={color}
        textAnchor="middle"
      >
        P
      </text>
      <text
        x="68"
        y="50"
        fontSize="8"
        fontWeight="bold"
        fill={color}
        textAnchor="middle"
      >
        V
      </text>
    </svg>
  );
}