import React, { useCallback, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import "./EForm.css";
import { useStateValue } from "../../StateProvider";

function EForm() {
  const [{ n, phi }, dispatch] = useStateValue();

  const evalue = useRef();

  const submit = useCallback(() => {
    if (evalue.current.value.length <= 0) return;

    dispatch({
      type: "SET_E",
      item: {
        e: evalue.current.value,
      },
    });
  }, [dispatch]);

  return (
    <Paper elevation={2} className="eform__container">
      <Typography variant="h5" gutterBottom>
        The value of <em>n</em> is: <strong>{n}</strong>.
      </Typography>
      <Typography variant="h5" gutterBottom>
        The value of <em>&phi;(n)</em> is: <strong>{phi}</strong>.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Enter a public key, <em>e (1 &lt; e &lt; {phi})</em>, such that{" "}
        <em>e</em> and <em>{phi}</em> are relatively prime (The <em>gcd</em> of{" "}
        <em>e</em> and <em>{phi}</em> is <em>1</em>).
      </Typography>
      <div className="eform__form">
        <FormControl className="eform__formControl" variant="outlined">
          <TextField
            id="outlined-p-value"
            type="number"
            inputRef={evalue}
            variant="outlined"
            label="Enter the value of e"
          />
        </FormControl>
      </div>
      <Button
        variant="contained"
        color="primary"
        className="eform__button"
        onClick={submit}
      >
        Next
      </Button>
    </Paper>
  );
}

export default EForm;
