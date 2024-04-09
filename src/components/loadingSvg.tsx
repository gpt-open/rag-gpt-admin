import clsx from "clsx";

const LoadingSvg = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 25 25"
    className={clsx("h-[1.2rem] w-[1.2rem] mr-1 fill-zinc-50", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <rect x="11" y="1" width="2" height="5" opacity=".14"></rect>
      <rect
        x="11"
        y="1"
        width="2"
        height="5"
        transform="rotate(30 12 12)"
        opacity=".29"
      ></rect>
      <rect
        x="11"
        y="1"
        width="2"
        height="5"
        transform="rotate(60 12 12)"
        opacity=".43"
      ></rect>
      <rect
        x="11"
        y="1"
        width="2"
        height="5"
        transform="rotate(90 12 12)"
        opacity=".57"
      ></rect>
      <rect
        x="11"
        y="1"
        width="2"
        height="5"
        transform="rotate(120 12 12)"
        opacity=".71"
      ></rect>
      <rect
        x="11"
        y="1"
        width="2"
        height="5"
        transform="rotate(150 12 12)"
        opacity=".86"
      ></rect>
      <rect
        x="11"
        y="1"
        width="2"
        height="5"
        transform="rotate(180 12 12)"
      ></rect>
      <animateTransform
        attributeName="transform"
        type="rotate"
        calcMode="discrete"
        dur="0.75s"
        values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
        repeatCount="indefinite"
      ></animateTransform>
    </g>
  </svg>
);

export default LoadingSvg;
