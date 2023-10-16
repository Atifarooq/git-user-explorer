import React, { FC, useState, useEffect } from "react";
import { IconButton, Paper, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "../../hooks/useDebounce";

const TypeAhead: FC<any> = ({ onChanged, hidden }) => {
  const [term, setTerm] = useState('');
  const debouncedValue: string = useDebounce(term, 200);

  useEffect(() => {
    onChanged(debouncedValue);
  }, [debouncedValue, onChanged]);

  return (
    <Paper elevation={0} component="form" sx={{ display: hidden ? 'none' : 'flex', flex: 1 }}>
      <IconButton type="button" aria-label="search" disabled={true}>
        <SearchIcon />
      </IconButton>
      <InputBase
        fullWidth
        placeholder="Search for GitHub users..."
        inputProps={{ "aria-label": "Search for GitHub users..." }}
        value={term}
        onChange={e => setTerm(e.target.value)}
      />
    </Paper>
  );
};

export default TypeAhead;
