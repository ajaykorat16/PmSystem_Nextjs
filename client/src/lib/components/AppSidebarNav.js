import React from 'react';
import { NavLink } from 'next/link';
import PropTypes from 'prop-types';
import { CBadge, CNavLink } from '@coreui/react';
import { useRouter } from 'next/navigation';

export const AppSidebarNav = ({ items }) => {
  const router = useRouter()
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
    const { name, badge, icon, to } = item;
    return (
        <CNavLink key={index} onClick={()=>router.push(to)}>
        {navLink(name, icon, badge)}
        </CNavLink>
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
