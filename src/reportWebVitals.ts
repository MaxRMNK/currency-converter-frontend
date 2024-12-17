type ReportHandler = (metric: {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
