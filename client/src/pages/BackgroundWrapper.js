import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

// Background gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Floating blob animations
const float1 = keyframes`
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-40px); }
`;

const float2 = keyframes`
  0%,100% { transform: translateX(0); }
  50% { transform: translateX(-40px); }
`;

export default function BackgroundWrapper({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #667eea, #764ba2, #ff758c)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 15s ease infinite`,
      }}
    >
      {/* Floating blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
          filter: "blur(120px)",
          top: "15%",
          left: "10%",
          animation: `${float1} 12s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 200, 255, 0.2)",
          filter: "blur(150px)",
          bottom: "15%",
          right: "10%",
          animation: `${float2} 15s ease-in-out infinite`,
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
    </Box>
  );
}
