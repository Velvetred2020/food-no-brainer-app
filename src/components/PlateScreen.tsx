type Props = {
  mode: "plate" | "splitting";
  onClick?: () => void;
};

export default function PlateScreen({ mode, onClick }: Props) {
  return (
    <div
      className={`plate ${mode === "splitting" ? "splitting" : ""}`}
      onClick={onClick}
    >
      🍽️
    </div>
  );
}