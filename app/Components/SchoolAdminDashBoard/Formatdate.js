const formatDate = (dateString, formatType = "long") => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (formatType === "short") {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default formatDate;
