import React from "react";

const SidebarLinkGroup = ({
  children,
  activecondition,
  open,
  setOpen,
}) => {
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${activecondition && "bg-gray-100 dark:bg-gray-900/50"}`}>
      {children(handleClick, open)}
    </li>
  );
};

export default SidebarLinkGroup;