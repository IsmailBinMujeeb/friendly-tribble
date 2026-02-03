export const Card = ({ children, className = "", title, action }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
  >
    {title && (
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);
