import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Container } from "react-bootstrap";

function SummaryCard({ title, amount }) {
  return (
    <Container className="mb-3">
      <Card
        sx={{
          minWidth: 200,
          textAlign: "center",
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#f9f9f9",
          transition: "transform 0.2s ease-in-out",
          "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
        }}
      >
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {amount}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SummaryCard;
