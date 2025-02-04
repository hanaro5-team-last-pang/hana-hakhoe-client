import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AnchorProps } from '@headlessui/react/dist/internal/floating.js';
import clsx from 'clsx';
import { JSX, ReactNode } from 'react';

interface DropdownProps {
  menuButton: JSX.Element;
  menuItems: JSX.Element[];
  anchor: AnchorProps;
  menuItemsClassName: string;
  children?: ReactNode;
}

export default function Dropdown({
  menuButton,
  menuItems,
  anchor,
  menuItemsClassName,
  children,
}: DropdownProps) {
  return (
    <Menu>
      <MenuButton>{menuButton}</MenuButton>
      <MenuItems anchor={anchor} className={clsx(``, menuItemsClassName)}>
        {children ??
          menuItems.map((item, index) => {
            return <MenuItem key={index}>{item}</MenuItem>;
          })}
      </MenuItems>
    </Menu>
  );
}
