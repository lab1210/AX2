import React from "react";
import styles from "../../css/registerform.module.css";

const Parent = ({
  parentInfo,
  setParentInfo,
  handleInputChange,
  errors,
  handleCountryChange,
  handleStateChange,
  countries,
  states,
  cities,
  RelationshipData,
}) => {
  return (
    <div className={styles.sectionlast}>
      <div className={styles.RegFormTitle}>
        <h1>Parent's Information</h1>
      </div>
      <div className={styles.personalInfoGrid}>
        <div className={styles.personalInfoItem}>
          <label htmlFor="ParentfirstName">Parent's First Name</label>
          <input
            type="text"
            name="ParentfirstName"
            value={parentInfo.ParentfirstName}
            placeholder="Enter First Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
          />
          {errors?.ParentfirstName && (
            <p className={styles.error}>{errors.ParentfirstName}</p>
          )}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="ParentmiddleName">Parent's Middle Name</label>
          <input
            type="text"
            name="ParentmiddleName"
            value={parentInfo.ParentmiddleName}
            placeholder="Enter Middle Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
          />
          {errors?.ParentmiddleName && (
            <p className={styles.error}>{errors.ParentmiddleName}</p>
          )}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="ParentlastName">Parent's Last Name</label>
          <input
            type="text"
            name="ParentlastName"
            value={parentInfo.ParentlastName}
            placeholder="Enter Last Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
          />
          {errors?.ParentlastName && (
            <p className={styles.error}>{errors.ParentlastName}</p>
          )}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="Occupation">Parent's Occupation</label>
          <input
            type="text"
            name="Occupation"
            value={parentInfo.Occupation}
            placeholder="Enter  Occupation"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
          />
          {errors?.Occupation && (
            <p className={styles.error}>{errors.Occupation}</p>
          )}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="PhoneNumber">Parent's Phone Number</label>
          <input
            type="text"
            name="PhoneNumber"
            value={parentInfo.PhoneNumber}
            placeholder="Enter Phone No"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
          />
          {errors?.PhoneNumber && (
            <p className={styles.error}>{errors.PhoneNumber}</p>
          )}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="Email">Parent's E-mail</label>
          <input
            type="text"
            name="Email"
            value={parentInfo.Email}
            placeholder="Enter E-mail"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
          />
          {errors?.Email && <p className={styles.error}>{errors.Email}</p>}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="EmergencyContact">Emergency Contact</label>
          <input
            type="text"
            name="EmergencyContact"
            value={parentInfo.EmergencyContact}
            placeholder="Enter Emergency Contact"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
          />
          {errors?.EmergencyContact && (
            <p className={styles.error}>{errors.EmergencyContact}</p>
          )}
        </div>
        <div className={styles.personalInfoItem}>
          <label htmlFor="Address">Address</label>
          <div className={styles.grouppersonalInfoItem}>
            <div>
              <select
                name="country"
                value={parentInfo.country}
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
                value={parentInfo.state}
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
                value={parentInfo.city}
                onChange={(e) => handleInputChange(e, setParentInfo)}
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
        <div className={styles.personalInfoItem}>
          <label htmlFor="ParentGender"> Gender</label>
          <select
            name="ParentGender"
            value={parentInfo.ParentGender}
            onChange={(e) => handleInputChange(e, setParentInfo)}
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
        <div className={styles.personalInfoItem}>
          <label htmlFor="Relationship">Relationship</label>
          <div className={styles.Form_input}>
            <select
              name="Relationship"
              value={parentInfo.Relationship}
              onChange={(e) => handleInputChange(e, setParentInfo)}
              required
            >
              <option value="" disabled>
                Select Relationship Shared
              </option>
              {RelationshipData.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            {errors?.Relationship && (
              <p className={styles.error}>{errors?.parentInfo.Relationship}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parent;
