const Loader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full bg-white bg-opacity-80">
      <div
        style={{
          width: "100px",
          height: "100px",
          transformStyle: "preserve-3d",
          animation: "spin 2s infinite linear",
        }}
        className="relative"
      >
        <div
          style={{
            transform: "rotateY(0deg) translateZ(50px)",
            backgroundColor: "#3498db",
          }}
          className="absolute w-full h-full bg-opacity-80 border-2 border-white box-border"
        ></div>
        <div
          style={{
            transform: "rotateY(90deg) translateZ(50px)",
            backgroundColor: "#f39c12",
          }}
          className="absolute w-full h-full bg-opacity-80 border-2 border-white box-border"
        ></div>
        <div
          style={{
            transform: "rotateY(180deg) translateZ(50px)",
            backgroundColor: "#e74c3c",
          }}
          className="absolute w-full h-full bg-opacity-80 border-2 border-white box-border"
        ></div>
        <div
          style={{
            transform: "rotateY(270deg) translateZ(50px)",
            backgroundColor: "#2ecc71",
          }}
          className="absolute w-full h-full bg-opacity-80 border-2 border-white box-border"
        ></div>
        <div
          style={{
            transform: "rotateX(90deg) translateZ(50px)",
            backgroundColor: "#9b59b6",
          }}
          className="absolute w-full h-full bg-opacity-80 border-2 border-white box-border"
        ></div>
        <div
          style={{
            transform: "rotateX(-90deg) translateZ(50px)",
            backgroundColor: "#34495e",
          }}
          className="absolute w-full h-full bg-opacity-80 border-2 border-white box-border"
        ></div>
      </div>
    </div>
  );
};

export default Loader;