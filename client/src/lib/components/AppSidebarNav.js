import React from 'react';
import { NavLink } from 'next/link';
import PropTypes from 'prop-types';
import { CBadge } from '@coreui/react';

export const AppSidebarNav = ({ items }) => {
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component || NavLink; 
    return (
      <Component key={index} {...rest}>
        {navLink(name, icon, badge)}
      </Component>
    );
  };

  const navGroup = (item, index) => {
    const { component, name, icon, ...rest } = item;
    const Component = component;
    return (
      <Component key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((subItem, subIndex) =>
          subItem.items ? (
            navGroup(subItem, subIndex)
          ) : (
            navItem(subItem, subIndex)
          )
        )}
      </Component>
    );
  };

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
