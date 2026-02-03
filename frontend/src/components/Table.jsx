export const Table = ({ columns, data, onRowClick }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
          >
            {columns.map((col, colIdx) => (
              <td
                key={colIdx}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {col.render ? col.render(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    {data.length === 0 && (
      <div className="text-center py-8 text-gray-500">No data available</div>
    )}
  </div>
);
