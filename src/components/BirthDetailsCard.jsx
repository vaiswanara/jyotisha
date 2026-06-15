export function BirthDetailsCard({ formData, chartData }) {
  return (
    <section
      className="summary-card"
      tabIndex="0"
      aria-label="Birth Details Summary"
    >
      <div>
        <p className="eyebrow">Birth Chart</p>
        <h2>{formData.name || "Jataka"}</h2>
      </div>
      <dl className="detail-list">
        <div>
          <dt>Date</dt>
          <dd>{formData.dob}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{formData.tob}</dd>
        </div>
        <div>
          <dt>Ayanamsha</dt>
          <dd>
            {chartData?.meta?.ayanamsha_name ||
              chartData?.ayanamsha ||
              "Default"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
