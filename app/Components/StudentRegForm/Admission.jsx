import React from "react";
import styles from "../../css/registerform.module.css";

const Admission = ({
  admissionInfo,
  setadmissionInfo,
  error,
  handleInputChange,
  handleDateChange,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Generates numbers 1-31
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Generate 10 years
  return (
    <div className={styles.section}>
      <div className={styles.RegFormTitle}>
        <h1>Admission Information</h1>
      </div>
      <div className={styles.personalInfoGridadmission}>
        <div className={styles.personalInfoItem}>
          <label htmlFor="admissionNumber">Admission Number</label>
          <input
            type="text"
            name="admissionNumber"
            value={admissionInfo.admissionNumber}
            placeholder="Enter Admission Number"
            onChange={(e) => handleInputChange(e, setadmissionInfo)}
            required
          />
          {error?.admissionNumber && (
            <p className={styles.error}>{error.admissionNumber}</p>
          )}
        </div>
        <div>
          <label htmlFor="admissionDate">Admission Date</label>
          <div className={styles.personalInfoItemgrid}>
            <div className={styles.personalInfoGridadmissionitem}>
              <select
                name="DD"
                value={admissionInfo.admissionDate.DD}
                onChange={handleDateChange}
                required
              >
                <option value="">DD</option> {/* Placeholder option */}
                {days.map((day) => (
                  <option key={day} value={day.toString().padStart(2, "0")}>
                    {day.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              {error?.admissionDate?.DD && (
                <p className={styles.error}>{error.admissionDate.DD}</p>
              )}
            </div>
            <div className={styles.personalInfoGridadmissionitem}>
              <select
                name="MM"
                value={admissionInfo.admissionDate.MM}
                onChange={handleDateChange}
                required
              >
                <option value="">MM</option>
                {months.map((month, index) => (
                  <option
                    key={index}
                    value={(index + 1).toString().padStart(2, "0")}
                  >
                    {month}
                  </option>
                ))}
              </select>
              {error?.admissionDate?.MM && (
                <p className={styles.error}>{error.admissionDate.MM}</p>
              )}
            </div>
            <div className={styles.personalInfoGridadmissionitem}>
              <select
                name="YY"
                value={admissionInfo.admissionDate.YY}
                onChange={handleDateChange}
                required
              >
                <option value="">YYYY</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {error?.admissionDate?.YY && (
                <p className={styles.error}>{error.admissionDate.YY}</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="Status">Status</label>

          <button
            className={admissionInfo.Status ? styles.StatActive : styles.Stat}
          >
            {admissionInfo.Status ? " Active" : "Deactivated"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admission;
