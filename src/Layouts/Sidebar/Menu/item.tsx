/*
 * @license
 * Copyright Ahmed Elywa. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useEffect } from 'react';
import { Iconsss, ItemIcon } from '../Icon';
import { MenuItemType } from '../types';
import { ItemStyle } from './style';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';

interface ItemProps {
  item: MenuItemType;
  toggleSidebar?: () => void;
  toggleSubMenu: (item: MenuItemType) => void;
  selectItem: (id: number[]) => void;
  id: number[];
  Link: any;
  nextJs?: boolean;
  currentPath: string;
}

const Item: React.FC<ItemProps> = observer(
  ({ item, toggleSidebar, toggleSubMenu, selectItem, id, Link, nextJs, currentPath }) => {
    const { loginStore } = useMst();

    useEffect(() => {
      const link = nextJs ? item.link?.href : item.link?.to;
      if (link && (currentPath === link || (item.hasDynamicPath && currentPath?.startsWith(link))) && !item.selected)
        selectItem(id);
    }, [currentPath]);

    const onClickHandler = () => {
      !item.selected && selectItem(id);
      toggleSidebar && toggleSidebar();
    };

    const handleToggleSubMenu = () => {
      toggleSubMenu(item);
    };

    const LinkContent: React.FC<{ item: MenuItemType }> = ({ item }) => {
      return (
        <>
          <ItemIcon icon={item.icon} className="menu-icon" />
          <span className="menu-title">{loginStore.language === 'th' ? item.title_th : item.title_en}</span>
        </>
      );
    };

    return (
      <ItemStyle className={item.group ? 'menu-item menu-group' : 'menu-item'}>
        {item.group ? (
          <span>
            <ItemIcon icon={item.icon} className="menu-icon" />
            {loginStore.language === 'th' ? item.title_th : item.title_en}
          </span>
        ) : item.link && !item.children ? (
          nextJs ? (
            <Link {...item.link}>
              <a onClick={onClickHandler} className={item.selected ? 'active' : ''}>
                <LinkContent item={item} />
              </a>
            </Link>
          ) : (
            <Link {...item.link} className={item.selected ? 'active' : ''} onClick={onClickHandler}>
              <LinkContent item={item} />
            </Link>
          )
        ) : item.url && !item.children ? (
          <a href={item.url}>
            <LinkContent item={item} />
          </a>
        ) : item.children ? (
          <>
            <a
              href="#"
              title={loginStore.language === 'th' ? item.title_th : item.title_en}
              onClick={(e) => {
                e.preventDefault();
                handleToggleSubMenu();
              }}
              className={item.selected ? 'active' : ''}
            >
              <ItemIcon icon={item.icon} className="menu-icon" />
              <span className="menu-title">{loginStore.language === 'th' ? item.title_th : item.title_en}</span>
              <i className="chevron">
                {item.expanded ? <Iconsss name="chevron-down-outline" /> : <Iconsss name="chevron-left-outline" />}
              </i>
            </a>
            <ul className={item.expanded ? 'menu-items expanded' : 'menu-items collapsed'}>
              {item.children.map((item2, index) => {
                return (
                  !item.hidden && (
                    <Item
                      key={index}
                      item={item2}
                      id={id.concat([index])}
                      Link={Link}
                      nextJs={nextJs}
                      currentPath={currentPath}
                      selectItem={selectItem}
                      toggleSidebar={toggleSidebar}
                      toggleSubMenu={toggleSubMenu}
                    />
                  )
                );
              })}
            </ul>
          </>
        ) : (
          ''
        )}
      </ItemStyle>
    );
  },
);

export default Item;
