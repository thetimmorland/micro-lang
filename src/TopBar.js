import React from "react";

import { AppBar, Toolbar, Grid } from "@material-ui/core";

export default function TopBar({ children }) {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            {children.map((child, index) => (
              <Grid item key={index}>
                {child}
              </Grid>
            ))}
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
