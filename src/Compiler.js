import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: { height: "100%", width: "100%" },
}));

export default function Compiler({ code }) {
  const classes = useStyles();

  return <div className={classes.root}></div>;
}
