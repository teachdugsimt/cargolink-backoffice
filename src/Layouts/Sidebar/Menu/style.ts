/*
 * @license
 * Copyright Ahmed Elywa. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import styled, { css } from 'styled-components';

const MenuStyle = styled.div`
  ${({ theme }) => {
    const divider = `${theme.menuItemDividerWidth} ${theme.menuItemDividerStyle} ${theme.menuItemDividerColor}`;
    return css`
      background-color: ${theme.menuBackgroundColor};
      display: block;
      ul.menu-items {
        margin: 0;
        padding: 0;
      }
      .menu-group,
      .menu-item a {
        font-family: ${theme.menuTextFontFamily};
        font-size: ${theme.menuTextFontSize};
        font-weight: 600;
        line-height: ${theme.menuTextLineHeight};
        padding: ${theme.menuItemPadding};
      }
      .menu-group,
      .menu-group .menu-icon {
        color: #919195;
      }
      .menu-item {
        a {
          color: #919195;
          border-radius: ${theme.menuItemBorderRadius};
        }
        a.active {
          background-color: ${theme.menuItemActiveBackgroundColor};
          color: #253858;
          .menu-icon {
            color: #253858;
          }
        }
        a:hover {
          background-color: ${theme.menuItemHoverBackgroundColor};
          color: #253858;
          cursor: ${theme.menuItemHoverCursor};
          .menu-icon {
            color: #253858;
          }
        }
        .menu-icon {
          color: #919195;
          font-size: ${theme.menuItemIconWidth};
          margin: ${theme.menuItemIconMargin};
          width: 1em;
          text-align: center;
        }
        .expand-state {
          color: ${theme.menuItemIconColor};
        }
      }
      .menu-item {
        border-bottom: ${divider};
        &:first-child {
          border-top: none;
        }
        &:last-child {
          border-bottom: none;
        }
        .menu-item:first-child {
          border-top: ${divider};
        }
      }
      .menu-item > .menu-items {
        background-color: ${theme.menuSubmenuBackgroundColor};
        margin: ${theme.menuSubmenuMargin};
        padding: ${theme.menuSubmenuPadding};
      }
      .menu-item > .menu-items > .menu-item {
        background: ${theme.menuSubmenuBackgroundColor};
        color: #919195;
        a {
          border-color: ${theme.menuSubmenuItemBorderColor};
          border-style: ${theme.menuSubmenuItemBorderStyle};
          border-width: ${theme.menuSubmenuItemBorderWidth};
          padding: ${theme.menuSubmenuItemPadding};
        }
        a.active {
          background-color: ${theme.menuSubmenuItemActiveBackgroundColor};
          border-color: ${theme.menuSubmenuItemActiveBorderColor};
          color: #253858;
          .menu-icon {
            color: #253858;
          }
        }
        a:hover {
          background-color: ${theme.menuSubmenuItemHoverBackgroundColor};
          border-color: ${theme.menuSubmenuItemHoverBorderColor};
          color: #253858;
          .menu-icon {
            color: #253858;
          }
        }
        a.active:hover {
          background-color: ${theme.menuSubmenuItemActiveHoverBackgroundColor};
          border-color: ${theme.menuSubmenuItemActiveHoverBorderColor};
          color: #253858;
          .menu-icon {
            color: #253858;
          }
        }
      }
      .menu-item > .menu-items > .menu-group {
        &,
        & .menu-icon {
          color: #919195;
        }
      }
      .menu-items,
      .menu-item > .menu-items {
        list-style-type: none;
        overflow: hidden;
      }
      .menu-item a {
        display: flex;
        color: #919195;
        text-decoration: none;
        align-items: center;
        .menu-title {
          flex: 1 0 auto;
          ${theme.dir === 'rtl' && 'text-align: right;'}
        }
      }
      .menu-group span {
        display: flex;
      }
    `;
  }}
`;

const ItemStyle = styled.li`
  ul {
    &.expanded {
      max-height: 2000px;
      transition: max-height 0.5s cubic-bezier(1, 0.15, 1, 1);
    }
    &.collapsed {
      max-height: 0;
      transition: max-height 0.5s cubic-bezier(0, 1, 0.3, 1) -100ms;
    }
  }
`;
export { MenuStyle, ItemStyle };
