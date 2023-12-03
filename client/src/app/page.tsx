"use client"
import Image from 'next/image'
import styles from './page.module.css'
import SignIn from '@/components/SignIn'
import { Autocomplete, InputAdornment, Box, Chip, List, ListItemButton, ListItemIcon, ListSubheader, Stack, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import ListItemText from '@mui/material/ListItemText';
import DraftsIcon from '@mui/icons-material/Drafts';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Fragment, useEffect, useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import InstructionItem from '@/components/InstructionItem'
import axios from 'axios'
import { Category, Device, Instruction } from '@/types'
import { top100Films } from './consts'
import Search from '@/components/Search'
import SearchIcon from '@mui/icons-material/Search';
import ThreeScene from '@/components/Animation'

export default function Home() {
  const [open, setOpen] = useState(true);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  console.log(instructions);
  const [devices, setDevices] = useState<Device[]>([]);

  const [deviceSelectValue, setDeviceSelectValue] = useState<Device[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [categorySelectValue, setCategorySelectValue] = useState<Category[]>([]);

  const [searchValue, setSearchValue] = useState<string>('');

  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    const params = new URLSearchParams();
    deviceSelectValue.length && params.append('deviceIds', deviceSelectValue.map(({id}) => id).join(','));
    categorySelectValue.length && params.append('categoryIds', categorySelectValue.map(({id}) => id).join(','));
    searchValue.length && params.append('name', searchValue);
    axios.get<Instruction[]>('http://localhost:8000/instructions', {
      params
    }).then(resp => {
      console.log(resp);
      setInstructions(resp.data);
    })
  }, [deviceSelectValue, categorySelectValue, searchValue])

  useEffect(() => {
    axios.get<Device[]>('http://localhost:8000/devices').then(resp => {
      setDevices(resp.data);
      // setDeviceSelectValue(resp.data);
    })
    axios.get<Category[]>('http://localhost:8000/categories').then(resp => {
      setCategories(resp.data);
      // setDeviceSelectValue(resp.data);
    })
  }, [])
  return (
    <main className={styles.main}>
      <Typography variant='h3' sx={{textAlign: 'center', marginBottom: '20px'}}>Інтерактивна система покрокових інструкцій для користувачів смартфонів</Typography>
      <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', gap: 2}}>
        <Autocomplete
          sx={{flexGrow: 1, width: '100%', maxWidth: 500}}
          
          multiple

          options={devices}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => setDeviceSelectValue(value)}
          value={deviceSelectValue}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Фільтрація за девайсом"
              placeholder="Телефон"
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )
          }}
          renderTags={(tagValue, getTagProps) => {
            return tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
            ))
          }}
        />
        <Autocomplete
           sx={{flexGrow: 1, width: '100%', maxWidth: 500}}
          multiple
          id="tags-standard"
          options={categories}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => setCategorySelectValue(value)}
          value={categorySelectValue}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Фільтрація за категорією"
              placeholder="Загальна"
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )
          }}
          renderTags={(tagValue, getTagProps) => {
            return tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
            ))
          }}
        />
        <TextField
          sx={{flexGrow: 1, width: '100%', maxWidth: 500}}
          id="input-with-icon-textfield"
          label="Пошук за назвою"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
      </Box>
      <List
        sx={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}
        component="ul"
        aria-labelledby="nested-list-subheader"
      >
        {instructions.map(item => <InstructionItem key={item.id} item={item}/>)}
      </List>
    </main>
  )
}
