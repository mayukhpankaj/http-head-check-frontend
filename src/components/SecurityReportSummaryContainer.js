import "./SecurityReportSummaryContainer.css";

const SecurityReportSummaryContainer = ({ securitySummaryText = "hello" }) => {
  return <h3 className="assetsrow1">{securitySummaryText}</h3>;
};

export default SecurityReportSummaryContainer;
