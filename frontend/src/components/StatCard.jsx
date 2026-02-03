import { Card } from "./Card";

export const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color = "primary",
}) => {
  const colors = {
    primary: "bg-primary-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors[color]} text-white`}>
          <Icon size={24} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {trend && (
          <div
            className={`text-sm font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>
    </Card>
  );
};
