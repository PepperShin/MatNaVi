// src/UI/pages/RegionalPage.jsx

import React from "react";
import { Container } from "react-bootstrap";
import Header from "../../components/Header";
import TourList from "../../components/TourList";

function RegionalPage() {
  return (
    <>
      <Header />
      <Container className="my-4">
        <TourList />
      </Container>
    </>
  );
}

export default RegionalPage;
