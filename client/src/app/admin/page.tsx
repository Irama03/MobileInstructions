'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Category, Device, Instruction } from '@/types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import clsx from 'clsx';
import { Autocomplete, Chip } from '@mui/material';

export default function Admin() {
  const router = useRouter();
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [instructions, setInstructions] = React.useState<Instruction[]>([]);
  console.log(devices, categories, instructions)
  React.useEffect(() => {
    axios.get<Device[]>('http://localhost:8000/devices').then(resp => {
      setDevices(resp.data);
      // setDeviceSelectValue(resp.data);
    })
    axios.get<Category[]>('http://localhost:8000/categories').then(resp => {
      setCategories(resp.data);
      // setDeviceSelectValue(resp.data);
    })
    axios.get<Instruction[]>('http://localhost:8000/instructions').then(resp => {
      setInstructions(resp.data);
      // setDeviceSelectValue(resp.data);
    })
  }, [])

  const deleteInstruction = (id) => {
    axios.delete(`http://localhost:8000/admin/instructions/${id}`, {
      headers: {
        token: '72a2d74e-0e47-457c-a123-e11b9e4cf7eb'
      }
    }).then(resp => {
      console.log(resp);
      setInstructions(prev => prev.filter(item => item.id !== id))
    })
  }
  const deleteCategory = (id) => {
    axios.delete(`http://localhost:8000/admin/categories/${id}`, {
      headers: {
        token: '72a2d74e-0e47-457c-a123-e11b9e4cf7eb'
      }
    }).then(resp => {
      console.log(resp);
      setCategories(prev => prev.filter(item => item.id !== id))
    })
  }
  const deleteDevice = (id) => {
    axios.delete(`http://localhost:8000/admin/devices/${id}`, {
      headers: {
        token: '72a2d74e-0e47-457c-a123-e11b9e4cf7eb'
      }
    }).then(resp => {
      console.log(resp);
      setDevices(prev => prev.filter(item => item.id !== id))
    })
  }
  const createInstruction = () => {
    axios.post(`http://localhost:8000/admin/instructions/`, {
      name: inputValues.name,
      steps: inputValues.steps.map((step, index) => ({
        order: index,
        content: step
      })),
      categoryId: inputValues.categoryId.id,
      deviceIds: inputValues.deviceIds.map(item => item.id)
    },{
      headers: {
        token: '72a2d74e-0e47-457c-a123-e11b9e4cf7eb'
      }
    }).then(resp => {
      console.log(resp);
      handleClose();
      setInstructions(prev =>  [resp.data, ...prev])
    })
  }
  const editInstruction = (id) => {
    axios.put(`http://localhost:8000/admin/instructions/${id}`, {
      name: instructionEditState.name,
      steps: instructionEditState.steps.map((step, index) => ({
        order: index + 1,
        content: step.content
      })),
      categoryId: instructionEditState.category.id,
      deviceIds: instructionEditState.devices.map(item => item.id),
      // likes_quant: 0,
      // dislikes_quant: 0
    },{
      headers: {
        token: '72a2d74e-0e47-457c-a123-e11b9e4cf7eb'
      }
    }).then(resp => {
      console.log(resp);
      handleInstructionEditClose();
      setInstructions(prev =>  {
        const result = [...prev];
        const index = result.findIndex(val => val.id === resp.data.id)
        result[index] = resp.data;
        return result
      })
    })
  }
  const [open, setOpen] = React.useState(false);
  const [nestedOpen, setNestedOpen] = React.useState(false);
  const handleNestedOpen = () => setNestedOpen(true);
  const handleNestedClose = () => setNestedOpen(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [instructionEditOpen, setInstructionEditOpen] = React.useState(false);
  const [instructionEditNestedOpen, setInstructionEditNestedOpen] = React.useState(false);
  const handleInstructionEditOpen = () => setInstructionEditOpen(true);
  const handleInstructionEditClose = () => setInstructionEditOpen(false);
  const handleInstructionEditNestedOpen = () => setInstructionEditNestedOpen(true);
  const handleInstructionEditNestedClose = () => setInstructionEditNestedOpen(false);
  const [instructionEditState, setInstructionEditState] = React.useState(null);


  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
  const handleCategoryModalOpen = () => setCategoryModalOpen(true);
  const handleCategoryModalClose = () => setCategoryModalOpen(false);

  const [deviceModalOpen, setDeviceModalOpen] = React.useState(false);
  const handleDeviceModalOpen = () => setDeviceModalOpen(true);
  const handleDeviceModalClose = () => setDeviceModalOpen(false);

  const [inputValues, setInputValues] = React.useState({
    name: '',
    deviceIds: [],
    categoryId: null,
    steps: []
  })
  console.log(inputValues)
  const [stepInput, setStepInput] = React.useState('');
  const [categoryInput, setCategoryInput] = React.useState('');
  const createCategory = () => {
    axios.post(`http://localhost:8000/admin/categories/`, {
      name: categoryInput,
    },{
      headers: {
        token: '72a2d74e-0e47-457c-a123-e11b9e4cf7eb'
      }
    }).then(resp => {
      console.log(resp);
      handleCategoryModalClose();
      setCategories(prev =>  [...prev, resp.data])
    })
  }
  const [deviceInput, setDeviceInput] = React.useState('');
  const createDevice = () => {
    axios.post(`http://localhost:8000/admin/devices/`, {
      name: deviceInput,
    },{
      headers: {
        token: '72a2d74e-0e47-457c-a123-e11b9e4cf7eb'
      }
    }).then(resp => {
      console.log(resp);
      handleDeviceModalClose();
      setDevices(prev =>  [...prev, resp.data])
    })
  }
  console.log(instructionEditState, devices)
  return <main className={styles.main}>
    <div className={styles.flexbox}>
      <h1>Інструкції</h1>
        <AddIcon onClick={handleOpen}/>
    </div>
    <ul className={styles.list}>
      {instructions.map((item, index) => <li key={index} className={styles.instruction} onClick={() => {
        handleInstructionEditOpen();
        setInstructionEditState(item)
      }}>
        {item.name}
        <DeleteIcon onClick={(e) => {
          deleteInstruction(item.id);
          e.stopPropagation()
        }}/>
      </li>)}
    </ul>
    <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 500 }}>
          <h2 id="unstyled-modal-title" className="modal-title">
            Створення інструкції
          </h2>
          <TextField value={inputValues.name} onChange={e => setInputValues(prev => ({...prev, name: e.target.value}))} id="outlined-basic" label="Назва інструкції" variant="standard" />
          <Autocomplete
            sx={{flexGrow: 1, width: '100%', maxWidth: 500}}

            multiple

            options={devices}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => setInputValues(prev => ({
              ...prev,
              deviceIds: value
            }))}
            value={inputValues.deviceIds}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Оберіть девайси"
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


            options={categories}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => setInputValues(prev => ({
              ...prev,
              categoryId: value
            }))}
            value={inputValues.categoryId}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Оберіть категорію"
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
          <div style={{marginTop: 16}}>
          <div className={styles.flexbox}>
            <p>Кроки інструкції</p>
            <AddIcon onClick={handleNestedOpen}/>
          </div>
          <ul className={styles.list}>
            {inputValues.steps.map((step, index) => <li key={index} className={styles.instruction}>
                {step}
                <DeleteIcon onClick={() => setInputValues(prev => ({
                  ...prev,
                  steps: prev.steps.filter(item => item !== step)
                }))}/>
            </li>)}
          </ul>
          </div>
          <Button variant="contained" sx={{mt: 2}}
              onClick={createInstruction}>Створити Інструкцію</Button>  
          <Modal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={nestedOpen}
            onClose={handleNestedClose}
            slots={{ backdrop: StyledBackdrop }}
          >
            <ModalContent sx={{ width: 300 }}>
              <h3>Додати крок</h3>
              <TextField label="Опис кроку" variant="standard" 
              value={stepInput} onChange={(e) => setStepInput(e.target.value)}/>
              <Button variant="contained" 
              onClick={() => {
                setInputValues(prev => ({
                  ...prev,
                  steps: [...prev.steps, stepInput]
                }))
                setStepInput('');
                handleNestedClose()
              }}>Додати</Button>  
            </ModalContent>
          </Modal>
        </ModalContent>
      </Modal>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={instructionEditOpen}
        onClose={handleInstructionEditClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 500 }}>
          <h2 id="unstyled-modal-title" className="modal-title">
            Редагування інструкції
          </h2>
          <TextField value={instructionEditState?.name} onChange={e => setInstructionEditState(prev => ({...prev, name: e.target.value}))} id="outlined-basic" label="Назва інструкції" variant="standard" />
          <Autocomplete
            sx={{flexGrow: 1, width: '100%', maxWidth: 500}}

            multiple

            options={devices}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => setInstructionEditState(prev => ({
              ...prev,
              devices: value
            }))}
            value={instructionEditState?.devices}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Оберіть девайси"
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


            options={categories}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => setInstructionEditState(prev => ({
              ...prev,
              category: value
            }))}
            value={instructionEditState?.category}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Оберіть категорію"
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
          <div style={{marginTop: 16}}>
          <div className={styles.flexbox}>
            <p>Кроки інструкції</p>
            <AddIcon onClick={handleInstructionEditNestedOpen}/>
          </div>
          <ul className={styles.list}>
            {instructionEditState?.steps.map((step, index) => <li key={index} className={styles.instruction}>
                {step.content}
                <DeleteIcon onClick={() => setInstructionEditState(prev => ({
                  ...prev,
                  steps: prev.steps.filter(item => item.content !== step.content)
                }))}/>
            </li>)}
          </ul>
          </div>
          <Button variant="contained" sx={{mt: 2}}
              onClick={() => editInstruction(instructionEditState.id)}>Редагувати Інструкцію</Button>  
          <Modal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={instructionEditNestedOpen}
            onClose={handleInstructionEditNestedClose}
            slots={{ backdrop: StyledBackdrop }}
          >
            <ModalContent sx={{ width: 300 }}>
              <h3>Додати крок</h3>
              <TextField label="Опис кроку" variant="standard" 
              value={stepInput} onChange={(e) => setStepInput(e.target.value)}/>
              <Button variant="contained" 
              onClick={() => {
                setInstructionEditState(prev => ({
                  ...prev,
                  steps: [...prev.steps, {
                    content: stepInput
                  }]
                }))
                setStepInput('');
                handleInstructionEditNestedClose()
              }}>Додати</Button>  
            </ModalContent>
          </Modal>
        </ModalContent>
      </Modal>
      <div className={styles.flexbox} style={{marginTop: 20}}>
      <h1>Категорії</h1>
        <AddIcon onClick={handleCategoryModalOpen}/>
    </div>
    <ul className={styles.list}>
      {categories.map((item, index) => <li key={index} className={styles.instruction}>
        {item.name}
        <DeleteIcon onClick={() => deleteCategory(item.id)}/>
      </li>)}
    </ul>
    <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={categoryModalOpen}
        onClose={handleCategoryModalClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 500 }}>
          <h2 id="unstyled-modal-title" className="modal-title">
            Створення категорії
          </h2>
          <TextField value={categoryInput} onChange={e => setCategoryInput(e.target.value)} id="outlined-basic" label="Назва категорії" variant="standard" />
          
          <Button variant="contained" sx={{mt: 2}}
              onClick={createCategory}>Створити Категорію</Button>  
         
        </ModalContent>
      </Modal>
      <div className={styles.flexbox} style={{marginTop: 20}}>
      <h1>Девайси</h1>
        <AddIcon onClick={handleDeviceModalOpen}/>
    </div>
    <ul className={styles.list}>
      {devices.map((item, index) => <li key={index} className={styles.instruction}>
        {item.name}
        <DeleteIcon onClick={() => deleteDevice(item.id)}/>
      </li>)}
    </ul>
    <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={deviceModalOpen}
        onClose={handleDeviceModalClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 500 }}>
          <h2 id="unstyled-modal-title" className="modal-title">
            Створення девайсу
          </h2>
          <TextField value={deviceInput} onChange={e => setDeviceInput(e.target.value)} id="outlined-basic" label="Назва девайсу" variant="standard" />
          
          <Button variant="contained" sx={{mt: 2}}
              onClick={createDevice}>Створити Девайс</Button>  
         
        </ModalContent>
      </Modal>
  </main>;
}

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Backdrop = React.forwardRef<
  HTMLDivElement,
  { open?: boolean; className: string }
>((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ 'MuiBackdrop-open': open }, className)}
      ref={ref}
      {...other}
    />
  );
});

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const ModalContent = styled('div')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `,
);