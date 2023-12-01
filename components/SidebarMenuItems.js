export default function SidebarMenuItems({ text, Icon, active }) {
  return (
    <div className="hoverEfecct flex items-center text-gray-700 justify-center lg:justify-start text-lg space-x-3 ">
      <Icon />
      <span className={`${active && "font-bold"} hidden lg:inline`}>{text}</span>
    </div>
  );
}
