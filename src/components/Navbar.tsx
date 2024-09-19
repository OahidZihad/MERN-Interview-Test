// src/components/Navbar.tsx
import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import BrushIcon from "@mui/icons-material/Brush";
import { Link as RouterLink } from "react-router-dom";

import { LinkProps as RouterLinkProps } from "react-router-dom";

const StyledLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  (props, ref) => <RouterLink ref={ref} {...props} />
);

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <BrushIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <StyledLink
            to="/"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Whiteboard App
          </StyledLink>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
