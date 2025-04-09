import React from "react";
import styles from "../../css/registerform.module.css";

const Token = ({ token, setToken, error }) => {
  return (
    <div className={styles.tokensection}>
      <div className={styles.RegFormTitle}>
        <h1>Verified Token</h1>
      </div>
      <div className={styles.formgrid}>
        <div>
          <label htmlFor="Token">Token</label>
          <input
            type="text"
            value={token}
            placeholder="Enter Copied Token"
            onChange={(e) => setToken(e.target.value)}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Token;
