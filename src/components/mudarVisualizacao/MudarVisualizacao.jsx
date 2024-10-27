import {
  Box,
  Button,
  ButtonBase,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import TableRowsIcon from "@mui/icons-material/TableRows";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useNavigate, useSearchParams } from "react-router-dom";

const MudarVisualizacao = ({
  opcoesFiltro,
  visualiacaoPadrao = "cards",
  setVisualizacao,
  setFiltroStatus,
}) => {
  const [selecionado, setSelecionado] = useState(visualiacaoPadrao);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    params.set(key, value);

    setSearchParams(params);
  };

  const removeParam = (key) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    setSearchParams(params);
  };

  const handleClose = (filtro, index) => {
    index === opcoesFiltro.length - 1
      ? removeParam("status")
      : updateParam("status", filtro);

    setAnchorEl(null);
  };

  const handleSelecionar = (item) => {
    item !== "cards" ? updateParam("view", item) : removeParam("view");
    setSelecionado(item);
  };

  return (
    <Box className="flexRowEnd" m={2} gap={2}>
      <Tooltip title="Filtro">
        <Button
          onClick={handleClick}
          className="flexRowCenter"
          sx={{
            bgcolor: "#ffffff",
            width: 40,
            height: 40,
            border: "1px solid #e2e2e2",
            borderRadius: 2,
          }}
        >
          <FilterAltIcon />
        </Button>
      </Tooltip>
      <ButtonGroup>
        <Tooltip title="Lista">
          <Button
            onClick={() => handleSelecionar("list")}
            className="flexRowCenter"
            sx={{
              bgcolor: selecionado === "list" ? "#d9d9d9" : "#ffffff",
              width: 40,
              height: 40,
              border: "1px solid #e2e2e2",
              borderRadius: 2,
            }}
          >
            <TableRowsIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Cards">
          <Button
            onClick={() => handleSelecionar("cards")}
            className="flexRowCenter"
            sx={{
              bgcolor: selecionado === "cards" ? "#d9d9d9" : "#ffffff",
              width: 40,
              height: 40,
              border: "1px solid #e2e2e2",
              borderRadius: 2,
            }}
          >
            <BorderAllIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {opcoesFiltro &&
          opcoesFiltro.map((filtro, index) => {
            return (
              <MenuItem
                key={index}
                onClick={() => handleClose(filtro.id, index)}
              >
                {filtro.value}
              </MenuItem>
            );
          })}
      </Menu>
    </Box>
  );
};

export default MudarVisualizacao;
