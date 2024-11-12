"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
  IconButton,
  Typography,
  Container,
  styled,
} from "@mui/material";
import charPatterns from "../data/chartPattern"; 

const StyledContainer = styled(Container)({
  padding: "24px",
  maxWidth: "1000px !important",
});

const ColorButton = styled(IconButton)<{ color: string; isSelected: boolean }>(
  ({ color, isSelected }) => ({
    width: "40px",
    height: "40px",
    backgroundColor: color,
    margin: "0 8px",
    border: isSelected ? "3px solid #fff" : "none",
    boxShadow: isSelected ? "0 0 10px rgba(255,255,255,0.5)" : "none",
    "&:hover": {
      backgroundColor: color,
      opacity: 0.8,
    },
  })
);

const LedGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(20, 1fr)",
  gap: "4px",
  padding: "20px",
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  aspectRatio: "2/1",
});

const LedCell = styled(Box)<{ active: boolean; color: string }>(
  ({ active, color }) => ({
    aspectRatio: "1/1",
    backgroundColor: active ? color : "#333",
    borderRadius: "4px",
    transition: "all 0.1s ease",
    boxShadow: active ? `0 0 10px ${color}` : "none",
  })
);

const ControlPanel = styled(Paper)({
  padding: "24px",
  marginBottom: "24px",
  backgroundColor: "#2a2a2a",
  color: "#fff",
});

const colors = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff8800",
  "#ff0088",
  "#800000",
  "#808000",
  "#008000",
  "#800080",
  "#008080",
  "#000080",
  "#ffa500",
  "#a52a2a",
  "#8a2be2",
  "#5f9ea0",
  "#d2691e",
  "#ff7f50",
  "#6495ed",
  "#dc143c",
  "#00ced1",
  "#9400d3",
];

const LedTextDisplay: React.FC = () => {
  const [text, setText] = useState<string>("HELLO");
  const [selectedColor, setSelectedColor] = useState<string>("#ff0000");
  const [isRandomColor, setIsRandomColor] = useState<boolean>(false);
  const [displayColor, setDisplayColor] = useState<string>(selectedColor);
  const [offset, setOffset] = useState<number>(0);
  const [totalWidth, setTotalWidth] = useState<number>(0);

  const GRID_HEIGHT = 15;
  const GRID_WIDTH = 20;

  useEffect(() => {
    const width = text.length * 8; // 6 for character width + 2 for spacing
    setTotalWidth(width);
    setOffset(0);
  }, [text]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setOffset((prev) => {
        const totalDistance = totalWidth + GRID_WIDTH;
        return (prev + 1) % totalDistance;
      });
    }, 200);

    return () => clearInterval(animationInterval);
  }, [totalWidth]);

  useEffect(() => {
    let colorInterval: NodeJS.Timeout | undefined;
    if (isRandomColor) {
      colorInterval = setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setDisplayColor(randomColor);
      }, 2000);
    } else {
      setDisplayColor(selectedColor);
    }

    return () => clearInterval(colorInterval);
  }, [isRandomColor, selectedColor]);

  const getFullPattern = () => {
    const fullPattern = Array(GRID_HEIGHT)
      .fill(null)
      .map(() => Array(GRID_WIDTH).fill(0));
    let currentCol = GRID_WIDTH - offset;

    const patternHeight = charPatterns["H"].length;
    const startRow = Math.floor((GRID_HEIGHT - patternHeight) / 2);

    for (const char of text.toUpperCase()) {
      const pattern = charPatterns[char] || charPatterns[" "];

      for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
          const col = currentCol + j;
          const row = startRow + i;

          if (row >= 0 && row < GRID_HEIGHT && col >= 0 && col < GRID_WIDTH) {
            fullPattern[row][col] = pattern[i][j];
          }
        }
      }
      currentCol += 8;
    }
    return fullPattern;
  };

  const inputUISection = () => (
    <ControlPanel elevation={3}>
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        LED Text Display
      </Typography>
      <TextField
        fullWidth
        label="Enter Text"
        value={text}
        onChange={(e) => setText(e.target.value.toUpperCase())}
        sx={{
          marginBottom: 3,
          "& .MuiInputLabel-root": { color: "#888" },
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#fff" },
          },
        }}
      />

      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
          Select Color
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {colors.map((color) => (
            <ColorButton
              key={color}
              color={color}
              isSelected={selectedColor === color}
              onClick={() => setSelectedColor(color)}
              disabled={isRandomColor}
            />
          ))}
        </Box>
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={isRandomColor}
            onChange={(e) => setIsRandomColor(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: selectedColor,
              },
            }}
          />
        }
        label="Random Color Change"
      />
    </ControlPanel>
  );

  const gridUISection = () => (
    <Paper
      elevation={5}
      sx={{
        backgroundColor: "#000",
        padding: 2,
        borderRadius: 2,
      }}
    >
      <LedGrid>
        {getFullPattern().map((row, i) =>
          row.map((cell, j) => (
            <LedCell
              key={`${i}-${j}`}
              active={cell === 1}
              color={displayColor}
            />
          ))
        )}
      </LedGrid>
    </Paper>
  );

  return (
    <StyledContainer>
      {inputUISection()}
      {gridUISection()}
    </StyledContainer>
  );
};

export default LedTextDisplay;
