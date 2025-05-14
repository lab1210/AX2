import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineChevronDown } from "react-icons/hi";
const Dropdown = ({ label = "Options", items = [] }) => {
  return (
    <Menu as="div" className="relative inline-block text-left ">
      <div>
        <MenuButton className=" focus:border-[#0071E3]  border-2 p-1.5 border-[#B6B6B6] inline-flex w-full justify-between rounded-sm bg-white sm:text-xs lg:text-sm  text-[#808080]  ">
          {label}
          <HiOutlineChevronDown
            aria-hidden="true"
            className="-mr-1 size-4 text-[#808080]"
          />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-100 mt-2 w-full overflow-y-auto max-h-18 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          {items.map((item, index) => (
            <MenuItem key={index}>
              {({ active }) =>
                item.href ? (
                  <a
                    href={item.href}
                    className={`block px-4 py-2 lg:text-sm sm:text-xs cursor-pointer ${
                      active
                        ? "bg-gray-100 font-bold text-[#808080]"
                        : "text-[#808080] font-bold"
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={item.onClick}
                    className={`block w-full text-left px-4 py-2 lg:text-sm sm:text-xs cursor-pointer ${
                      active ? "bg-blue-50 text-[#808080]" : "text-[#808080]"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              }
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
export default Dropdown;
