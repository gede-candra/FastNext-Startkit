type IconName = "dashboard" | "key" | "logout" | "menu" | "user" | "x";

type IconProps = {
  className?: string;
  name: IconName;
};

export function Icon({ className, name }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      {name === "dashboard" ? (
        <>
          <path d="M4 4H10V10H4V4Z" />
          <path d="M14 4H20V10H14V4Z" />
          <path d="M4 14H10V20H4V14Z" />
          <path d="M14 14H20V20H14V14Z" />
        </>
      ) : null}
      {name === "user" ? (
        <>
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" />
          <path d="M5 20C5.8 16.8 8.2 15 12 15C15.8 15 18.2 16.8 19 20" />
        </>
      ) : null}
      {name === "key" ? (
        <>
          <path d="M14 10C14 7.79086 12.2091 6 10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14C12.2091 14 14 12.2091 14 10Z" />
          <path d="M13 13L20 20" />
          <path d="M17 17L15 19" />
          <path d="M19 15L17 17" />
        </>
      ) : null}
      {name === "logout" ? (
        <>
          <path d="M10 6H6V18H10" />
          <path d="M14 8L18 12L14 16" />
          <path d="M18 12H10" />
        </>
      ) : null}
      {name === "menu" ? (
        <>
          <path d="M4 7H20" />
          <path d="M4 12H20" />
          <path d="M4 17H20" />
        </>
      ) : null}
      {name === "x" ? (
        <>
          <path d="M7 7L17 17" />
          <path d="M17 7L7 17" />
        </>
      ) : null}
    </svg>
  );
}
