type Props = {
  onSelect: (meal: string) => void;
};

export default function MealSelector({ onSelect }: Props) {
  return (
    <div className="plateGrid">

      <div className="slice topLeft" onClick={() => onSelect("Breakfast")}>
        Breakfast
      </div>

      <div className="slice topRight" onClick={() => onSelect("Lunch")}>
        Lunch
      </div>

      <div className="slice bottomLeft" onClick={() => onSelect("Dinner")}>
        Dinner
      </div>

      <div className="slice bottomRight" onClick={() => onSelect("Snack")}>
        Snack
      </div>

    </div>
  );
}