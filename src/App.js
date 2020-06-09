import React from "react";

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";

import {
  Typography,
  Link,
  IconButton,
  Fab,
  Grid,
  Paper,
} from "@material-ui/core";
import { GitHub, PlayArrow } from "@material-ui/icons";

import TopBar from "./TopBar";
import Compiler from "./Compiler";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "99vh",
  },
  appBarSpacer: {
    flexGrow: 0,
    flexShrink: 0,
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    width: "100%",
    padding: theme.spacing(1),
  },
  item: {
    display: "flex",
    flexGrow: 1,
  },
  paper: {
    flexGrow: 1,
    minHeight: 500,
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const codeTemplate = `PRINT "How many fibonacci numbers do you want?"
INPUT nums
PRINT ""

LET a = 0
LET b = 1
WHILE nums > 0 REPEAT
    PRINT a
    LET c = a + b
    LET a = b
    LET b = c
    LET nums = nums - 1
ENDWHILE`;

function App() {
  const classes = useStyles();

  const editorRef = React.useRef(null);
  const [code, setCode] = React.useState("");

  const compile = () => {
    const { editor } = editorRef.current;
    setCode(editor.getSession().getValue());
  };

  return (
    <div className={classes.root}>
      <TopBar>
        <Typography variant="h6">µLang</Typography>
        <Link
          color="inherit"
          href="https://github.com/thetimmorland/micro-lang/"
          target="_blank"
        >
          <IconButton color="inherit">
            <GitHub />
          </IconButton>
        </Link>
      </TopBar>
      <div className={classes.appBarSpacer} />
      <Grid container spacing={1} className={classes.content}>
        <Grid item md={6} xs={12} className={classes.item}>
          <Paper square className={classes.paper}>
            <AceEditor
              ref={editorRef}
              value={codeTemplate}
              height="100%"
              width="100%"
            />
          </Paper>
        </Grid>
        <Grid item className={classes.item}>
          <Paper square className={classes.paper}>
            <Compiler value={code} />
          </Paper>
        </Grid>
      </Grid>
      <Fab color="secondary" onClick={compile} className={classes.fab}>
        <PlayArrow />
      </Fab>
    </div>
  );
}

export default App;
