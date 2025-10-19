import tableStyle from "./table.module.css";

function Table({ columns = [], data = [], transposed = false }) {
  if (!data.length || !columns.length) return <p>No data available</p>;
  if (!transposed) {
    return (
      <table className={tableStyle.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => {
                const value =
                  typeof col.accessor === "function"
                    ? col.accessor(row)
                    : row[col.accessor];
                return <td key={j}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const transposedRows = columns.map((col) => ({
    label: col.header,
    values: data.map((row) =>
      typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]
    ),
  }));

  return (
    <table className={tableStyle.table}>
      <thead>
        <tr>
          <th></th>
          {data.map((row, i) => (
            <th key={i}>{row.category}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transposedRows
          .filter((row) => row.label !== "Category")
          .map((row, i) => (
            <tr key={i}>
              <td>{row.label}</td>
              {row.values.map((val, j) => (
                <td key={j}>{val}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default Table;
