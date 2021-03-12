import React, { useCallback, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import "./EncryptOrDecrypt.css";
import { useStateValue } from "../../StateProvider";

function EncryptOrDecrypt() {
  const [{ d, e, n, cipher, message }, dispatch] = useStateValue();

  const messageInput = useRef();
  const cipherInput = useRef();

  const encryptMessage = useCallback(() => {
    dispatch({
      type: "Encrypt",
      item: {
        message: messageInput.current.value,
      },
    });
  }, [dispatch]);

  const decryptCipher = useCallback(() => {
    dispatch({
      type: "Decrypt",
      item: {
        cipher: cipherInput.current.value,
      },
    });
  }, [dispatch]);

  return (
    <Paper elevation={2} className="encryptOrDecrypt__container">
      <Typography variant="h5" gutterBottom>
        The private key, <em>d</em> is: <strong>{d}</strong>.
      </Typography>
      <Typography variant="h5" gutterBottom>
        So, public key pair, <em>(e, n)</em> is:{" "}
        <strong>
          ({e}, {n})
        </strong>
      </Typography>
      <Typography variant="h5" gutterBottom>
        So, private key pair, <em>(d, n)</em> is:{" "}
        <strong>
          ({d}, {n})
        </strong>
      </Typography>
      <Typography variant="h5" gutterBottom>
        Enter a message to encrypt
      </Typography>
      <div className="encryptOrDecrypt__form">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              className="encryptOrDecrypt__formControl"
              variant="outlined"
            >
              <TextField
                id="outlined-p-value"
                type="number"
                inputRef={messageInput}
                multiline={true}
                rows={5}
                rowsMax={5}
                variant="outlined"
                label="Enter a message to encrypt"
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              {cipher}
            </Typography>
          </Grid>
        </Grid>
      </div>
      <Button
        variant="contained"
        color="primary"
        className="encryptOrDecrypt__button"
        onClick={encryptMessage}
      >
        Encrypt
      </Button>
      <Typography variant="h5" gutterBottom style={{ marginTop: "32px" }}>
        Enter cipher text to decrypt the message
      </Typography>
      <div className="encryptOrDecrypt__form">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              className="encryptOrDecrypt__formControl"
              variant="outlined"
            >
              <TextField
                id="outlined-p-value"
                type="number"
                inputRef={cipherInput}
                multiline={true}
                rows={5}
                rowsMax={5}
                variant="outlined"
                label="Enter the cipher text to decrypt the message"
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              {message}
            </Typography>
          </Grid>
        </Grid>
      </div>
      <Button
        variant="contained"
        color="primary"
        className="encryptOrDecrypt__button"
        onClick={decryptCipher}
      >
        Decrypt
      </Button>
    </Paper>
  );
}

export default EncryptOrDecrypt;
