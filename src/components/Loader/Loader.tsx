import "./Loader.scss";

const Loader = ({
  wrapperHeight = "100%",
  ellipsisWidth = "9.8px",
  ellipsisHeight = "9.8px",
}) => {
  return (
    <div className="loader-wrapper" style={{ height: wrapperHeight }}>
      <div className="lds-ellipsis">
        <div style={{ width: ellipsisWidth, height: ellipsisHeight }}></div>
        <div style={{ width: ellipsisWidth, height: ellipsisHeight }}></div>
        <div style={{ width: ellipsisWidth, height: ellipsisHeight }}></div>
        <div style={{ width: ellipsisWidth, height: ellipsisHeight }}></div>
      </div>
    </div>
  );
};

export default Loader;
