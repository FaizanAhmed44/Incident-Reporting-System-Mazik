export const CustomLoader: React.FC = () => {
    return (
      <div className="custom-loader">
        <svg
          width="48"
          height="48"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#6366F1", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="ring"
          />
          <circle cx="50" cy="20" r="4" fill="#6366F1" className="particle particle-1" />
          <circle cx="80" cy="50" r="4" fill="#3B82F6" className="particle particle-2" />
          <circle cx="50" cy="80" r="4" fill="#3B82F6" className="particle particle-3" />
        </svg>
        <style>
          {`
            .custom-loader {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .custom-loader .ring {
              animation: spin 2s linear infinite;
            }
            .custom-loader .particle {
              animation: orbit 2s linear infinite, pulse 1s ease-in-out infinite;
            }
            .custom-loader .particle-1 {
              animation-duration: 2s, 1s;
            }
            .custom-loader .particle-2 {
              animation-duration: 2.2s, 1s;
              animation-delay: 0.2s;
            }
            .custom-loader .particle-3 {
              animation-duration: 1.8s, 1s;
              animation-delay: 0.4s;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes orbit {
              0% {
                transform: rotate(0deg) translateX(30px) rotate(0deg);
              }
              100% {
                transform: rotate(360deg) translateX(30px) rotate(-360deg);
              }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @media (min-width: 640px) {
              .custom-loader svg {
                width: 64px;
                height: 64px;
              }
            }
            .dark .custom-loader .ring {
              stroke: #E0E7FF;
            }
            .dark .custom-loader .particle {
              fill: #E0E7FF;
            }
          `}
        </style>
      </div>
    );
  };