interface LoaderSpinnerProps {
  size?: number;
  color?: string;
}

export default function Loader({
  size = 40,
  color = "#fff",
}: LoaderSpinnerProps = {}) {
  return (
    <div className="w-full h-[200px] flex justify-center items-center">
      <div
        style={{
          width: size,
          height: size,
          border: `4px solid ${color}`,
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
        role="status"
        aria-label="Loading"
      >
        <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      </div>
    </div>
  );
}
