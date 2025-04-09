import React from "react";
import styles from "../../css/registerform.module.css";

const PersonalInfoForm = ({
  personalInfo,
  setPersonalInfo,
  errors,
  handleInputChange,
  handleCountryChange,
  handleStateChange,
  countries,
  states,
  cities,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.RegFormTitle}>
        <h1>Personal Information</h1>
      </div>
      <div className={styles.personalInfoGrid}>
        <div className={styles.personalInfoItem}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            value={personalInfo.firstName}
            placeholder="Enter First Name"
            onChange={(e) => handleInputChange(e, setPersonalInfo)}
            required
          />
          {errors?.firstName && (
            <p className={styles.error}>{errors.firstName}</p>
          )}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={personalInfo.middleName}
            placeholder="Enter Middle Name"
            onChange={(e) => handleInputChange(e, setPersonalInfo)}
          />
          {errors?.middleName && (
            <p className={styles.error}>{errors.middleName}</p>
          )}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={personalInfo.lastName}
            placeholder="Enter Last Name"
            onChange={(e) => handleInputChange(e, setPersonalInfo)}
            required
          />
          {errors?.lastName && (
            <p className={styles.error}>{errors.lastName}</p>
          )}
        </div>
        <div className={styles.grouppersonalInfoItem}>
          <div>
            <label htmlFor="DOB">DOB</label>
            <input
              type="date" // Use type="date"
              name="DOB"
              value={personalInfo.DOB}
              onChange={(e) => handleInputChange(e, setPersonalInfo)}
              required
            />
            {errors?.DOB && <p className={styles.error}>{errors.DOB}</p>}
          </div>
          <div>
            <label htmlFor="Gender">Gender</label>
            <select
              name="gender"
              value={personalInfo.gender}
              onChange={(e) => handleInputChange(e, setPersonalInfo)}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors?.gender && <p className={styles.error}>{errors.gender}</p>}
          </div>
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="Address">Address</label>
          <div className={styles.grouppersonalInfoItem}>
            <div>
              <select
                name="country"
                value={personalInfo.country}
                onChange={handleCountryChange}
                required
              >
                <option value="" disabled>
                  Select Country
                </option>
                {countries.length > 0 &&
                  countries.map((country) => {
                    return (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    );
                  })}
              </select>
              {errors?.country && (
                <p className={styles.error}>{errors.country}</p>
              )}
            </div>
            <div>
              <select
                name="state"
                value={personalInfo.state}
                onChange={handleStateChange}
                required
              >
                <option value="" disabled>
                  Select State
                </option>
                {states.length > 0 &&
                  states.map((state) => {
                    return (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    );
                  })}
              </select>
              {errors?.state && <p className={styles.error}>{errors.state}</p>}
            </div>
          </div>
        </div>
        <div className={styles.personalInfoItemcity}>
          <div></div>
          <div className={styles.grouppersonalInfoItem}>
            <div>
              <select
                name="city"
                value={personalInfo.city}
                onChange={(e) => handleInputChange(e, setPersonalInfo)}
                required
              >
                <option value="" disabled>
                  Select City
                </option>
                {cities.length > 0 &&
                  cities.map((city) => {
                    return (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    );
                  })}
              </select>
              {errors?.city && <p className={styles.error}>{errors.city}</p>}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
