"use client"
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import styles from './page.module.css'
import SignIn from '@/components/SignIn'
import { Autocomplete, InputAdornment, Box, Chip, List, ListItemButton, ListItemIcon, ListSubheader, Stack, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import ListItemText from '@mui/material/ListItemText';
import DraftsIcon from '@mui/icons-material/Drafts';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {Fragment, useContext, useEffect, useState} from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import InstructionItem from '@/components/InstructionItem'
import axios from 'axios'
import {Category, Commands, Device, Instruction} from '@/types'
import { top100Films } from './consts'
import Search from '@/components/Search'
import SearchIcon from '@mui/icons-material/Search';
import ThreeScene from '@/components/Animation'
import {ActionContext} from "@/app/app";
import {useSpeechSynthesis} from 'react-speech-kit';

export default function Home() {
  const [openDevicesFilter, setOpenDevicesFilter] = useState(false);
  const [openCategoriesFilter, setOpenCategoriesFilter] = useState(false);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  console.log(instructions);
  const [devices, setDevices] = useState<Device[]>([]);

  const [deviceSelectValue, setDeviceSelectValue] = useState<Device[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [categorySelectValue, setCategorySelectValue] = useState<Category[]>([]);

  const [searchValue, setSearchValue] = useState<string>('');

  const {action, setAction} = useContext(ActionContext);
  const { speak } = useSpeechSynthesis();

  const say = (text) => {
    speak({ text: text });
  }

  const router = useRouter();

  const goToInstructionPage = (instructionId) => {
    setAction({command: Commands.DO_NOTHING});
    router.push('/instruction/' + instructionId);
  }

  const reactToWrongInstructionChoice = () => {
    say('Оберіть одну з наявних інструкцій');
    setAction({command: Commands.DO_NOTHING});
  }

  const processInstructionChoice = (id) => {
    const instruction = instructions.find(i => i.id === id);
    if (instruction) goToInstructionPage(id);
    else reactToWrongInstructionChoice();
  }

  useEffect(() => {
    const lowerArg = action.argument ? action.argument.toLowerCase() : '';
    switch (action.command) {
      case Commands.FILTER:
        if (action.argument === 'девайсом' || action.argument === 'девайс') {
          setOpenDevicesFilter(true);
          say('Який девайс?');
          setAction({command: Commands.WAIT_FOR_FILTER_BY_DEVICE_REPLAY});
        }
        else if (action.argument === 'категорією') {
          setOpenCategoriesFilter(true);
          say('Яка категорія?');
          setAction({command: Commands.WAIT_FOR_FILTER_BY_CATEGORY_REPLAY});
        }
        else {
          say('Фільтрація за девайсом чи за категорією?');
          setAction({command: Commands.WAIT_FOR_FILTER_TYPE_REPLAY});
        }
        console.log('Filter');
        break;
      case Commands.FILTER_BY_PARTICULAR_DEVICE:
        const device = devices.find((d) => d.name.toLowerCase() === lowerArg);
        if (device) {
          setDeviceSelectValue([device]);
          setOpenDevicesFilter(false);
          setAction({command: Commands.DO_NOTHING});
        }
        else {
          say('Оберіть один із наявних девайсів');
          setAction({command: Commands.WAIT_FOR_FILTER_BY_DEVICE_REPLAY});
        }
        console.log('Filter by device: ' + action.argument);
        break;
      case Commands.FILTER_BY_PARTICULAR_CATEGORY:
        const category = categories.find((c) => c.name.toLowerCase().includes(lowerArg));
        if (category) {
          setCategorySelectValue([category]);
          setOpenCategoriesFilter(false);
          setAction({command: Commands.DO_NOTHING});
        }
        else {
          say('Оберіть одну із наявних категорій');
          setAction({command: Commands.WAIT_FOR_FILTER_BY_CATEGORY_REPLAY});
        }
        console.log('Filter by category: ' + action.argument);
        break;
      case Commands.CLEAR_FILTER:
        setDeviceSelectValue([]);
        setOpenDevicesFilter(false);
        setCategorySelectValue([]);
        setOpenCategoriesFilter(false);
        setAction({command: Commands.DO_NOTHING});
        console.log('Clear filter');
        break;
      case Commands.GO_TO_INSTRUCTION:
        const numberArg = Number(action.argument);
        if (numberArg)
          processInstructionChoice(numberArg);
        else if (lowerArg === 'один')
          processInstructionChoice(1);
        else if (lowerArg === "п'ять" || lowerArg === "п'ятий" || lowerArg === "п'яте" || lowerArg === "п'яту")
          processInstructionChoice(5);
        else if (lowerArg === "дев'ять" || lowerArg === "дев'ятий" || lowerArg === "дев'яте" || lowerArg === "дев'яту")
          processInstructionChoice(9);
        else if (lowerArg === "п'ятнадцять" || lowerArg === "п'ятнадцятий" || lowerArg === "п'ятнадцяте" || lowerArg === "п'ятнадцяту")
          processInstructionChoice(15);
        else if (lowerArg === "дев'ятнадцять" || lowerArg === "дев'ятнадцятий" || lowerArg === "дев'ятнадцяте" || lowerArg === "дев'ятнадцяту")
          processInstructionChoice(19);
        else {
          const instruction = instructions.find(i => i.name.toLowerCase().includes(lowerArg));
          if (instruction) goToInstructionPage(instruction.id);
          else reactToWrongInstructionChoice();
        }
        console.log('Go to instruction');
        break;
      case Commands.DO_NOTHING:
        console.log('Do nothing...');
        break;
      default:
        break;
    }
  }, [action])

  const compareInstructions = (i1, i2) => {
    if (i1.id < i2.id) return -1;
    if (i1.id > i2.id) return 1;
    return 0;
  }
  useEffect(() => {
    const params = new URLSearchParams();
    deviceSelectValue.length && params.append('deviceIds', deviceSelectValue.map(({id}) => id).join(','));
    categorySelectValue.length && params.append('categoryIds', categorySelectValue.map(({id}) => id).join(','));
    searchValue.length && params.append('name', searchValue);
    axios.get<Instruction[]>('http://localhost:8000/instructions', {
      params
    }).then(resp => {
      console.log(resp);
      setInstructions(resp.data.sort((i1, i2) => compareInstructions(i1, i2)));
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
          open={openDevicesFilter}
          onOpen={() => {
            setOpenDevicesFilter(true);
          }}
          onClose={() => {
            setOpenDevicesFilter(false);
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
           open={openCategoriesFilter}
           onOpen={() => {
             setOpenCategoriesFilter(true);
           }}
           onClose={() => {
             setOpenCategoriesFilter(false);
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
