export default function Cursor({ enable = true }) {
  let color = enable ? `var(--vera-theme-color)` : `var(--vera-control-disable-color)`;

  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" >
      <g clipPath="url(#clip0)">
        <path d="M9.44341 10.2854H6.12828L7.873 14.5352C7.99453 14.8298 7.85566 15.1602 7.57787 15.2852L6.04147 15.9548C5.75506 16.0798 5.43387 15.9369 5.31234 15.6512L3.65444 11.6157L0.946187 14.4013C0.585281 14.7724 0 14.4863 0 13.9995V0.57208C0 0.0595798 0.622531 -0.190264 0.946156 0.17033L9.83403 9.31227C10.1925 9.66161 9.928 10.2854 9.44341 10.2854Z" fill={color} />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="10" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>

  );
}
