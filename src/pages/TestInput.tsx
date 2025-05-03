import React from "react";

const TestInput = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <input
        type="text"
        placeholder="Teste teclado"
        style={{ fontSize: 24, padding: 16, borderRadius: 8, border: "1px solid #ccc", width: 300 }}
      />
    </div>
  );
};

export default TestInput; 