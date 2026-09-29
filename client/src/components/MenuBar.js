import { useState } from "react";
import { MenuMenu, MenuItem, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Routes } from "../routes/routes";

const MenuBar = () => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? Routes.Home : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <div>
      <Menu pointing secondary size="massive" color="teal">
        <MenuItem
          name="home"
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to={Routes.Home}
        />
        <MenuMenu position="right">
          <MenuItem
            name="login"
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to={Routes.Login}
          />
          <MenuItem
            name="register"
            active={activeItem === "register"}
            onClick={handleItemClick}
            as={Link}
            to={Routes.Register}
          />
        </MenuMenu>
      </Menu>
    </div>
  );
};

export default MenuBar;
