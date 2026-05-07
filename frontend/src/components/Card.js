export default function Card({ title, value, children }) {
  return (
    <section className="card">
      {title && <h3>{title}</h3>}
      {value && <p className="card-value">{value}</p>}
      {children}
    </section>
  );
}
