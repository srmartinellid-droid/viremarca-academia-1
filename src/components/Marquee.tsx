export function Marquee() {
  const items = ["FORÇA", "DISCIPLINA", "PERFORMANCE", "CONSISTÊNCIA"];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((item, index) => (
          <span className={index % 2 ? "outline" : ""} key={item + "-" + index}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
