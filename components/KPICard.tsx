interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  bgColor: string;
}

const KPICard = ({ title, value, icon, bgColor }: KPICardProps) => (
  <div className={`p-4 rounded-xl shadow-md border ${bgColor}`}>
    <div className="text-sm mb-1 font-medium text-gray-400">
      <span className="text-3xl mr-2 align-middle">{icon}</span>
      <span className="align-middle">{title}</span>
    </div>
    <div className="text-3xl font-extrabold mt-1 text-gray-50">{value}</div>
  </div>
);

export default KPICard; 