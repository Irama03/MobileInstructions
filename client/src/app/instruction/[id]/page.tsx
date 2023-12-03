'use client'
import {Commands, Instruction, Step} from "@/types";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import axios from "axios";
import {FC, useContext, useEffect, useState} from "react";
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {useSpeechSynthesis} from 'react-speech-kit';

import styles from './page.module.css';
import Link from "next/link";
import {ActionContext} from "@/app/app";

type InstructionPageProps = {
  params: {
    id: string
  }
}

const InstructionPage: FC<InstructionPageProps> = ({ params: { id } }) => {

  const [instruction, setInstruction] = useState<Instruction>();
  const [currentStep, setCurrentStep] = useState<Step>();
  const [message, setMessage] = useState('');
  const { speak, cancel, speaking } = useSpeechSynthesis();

  useEffect(() => {
    axios.get<Instruction>(`http://localhost:8000/instructions/${id}`)
      .then(resp => {
        setInstruction(resp.data);
        setCurrentStep(resp.data.steps[0]);
      })
  }, [id]);

  const [checked, setChecked] = useState<number[]>([]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    const nextStep = instruction!.steps[currentStep!.order];
    if (nextStep) setCurrentStep(nextStep);
    else setMessage("Інструкцію виконано!");
  };

  const [rateState, setRateState] = useState<'like' | 'dislike' | 'none'>('none');

  useEffect(() => {
    if(rateState === 'none') return;
    axios.post(`http://localhost:8000/instructions/${id}/rate`, {
      isLiked: rateState === 'like'
    })
    .then(resp => {
      console.log(resp);
    })
  }, [rateState, id]);

  const action = useContext(ActionContext);

  const readText = (text) => {
    speak({ text: text });
  }

  useEffect(() => {
    if (instruction && currentStep) {
      switch (action.command) {
        case (Commands.START_READ_STEP || Commands.REPEAT_READ_STEP):
          readText(currentStep!.content);
          action.command = Commands.DO_NOTHING;
          console.log('Start read step');
          break;
        case Commands.STOP_READ_STEP:
          cancel();
          action.command = Commands.DO_NOTHING;
          console.log('Stop read step');
          break;
        case Commands.STEP_IS_DONE:
          handleToggle(currentStep!.id);
          action.command = Commands.DO_NOTHING;
          console.log('Step is done: ' + currentStep!.content);
          break;
        case Commands.DO_NOTHING:
          console.log('Do nothing...');
          break;
        default:
          break;
      }
    }
  }, [action, readText])

  return <main className={styles.main}>
    <Link style={{alignSelf: 'flex-start', marginBottom: 20}} href='/'>
      <Button variant="contained" startIcon={<ArrowBackIcon />}>
        Повернутись до інструкцій
      </Button>
    </Link>
    <Typography sx={{textAlign: 'center'}} variant="h4">{instruction?.name}</Typography>
    <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
      {instruction?.steps.map(({id, content}) => {
        const labelId = `checkbox-list-label-${id}`;
        return (
          <ListItem
            key={id}
            disablePadding
          >
            <ListItemButton disabled={currentStep?.id !== id} role={undefined} onClick={handleToggle(id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={content}/>
            </ListItemButton>
            {currentStep?.id === id ?
                <IconButton edge="end" aria-label="comments"
                        onClick={() => speaking ? cancel() : readText(content)}>
                  {speaking ? <StopIcon /> : <PlayArrowIcon />}
                </IconButton>
                : null}
          </ListItem>
        );
      })}
    </List>
    <Typography marginBottom="15px" variant="h5">{message}</Typography>
    <Typography>Чи була вам корисна інструкція?</Typography>
    <Box>
      <IconButton onClick={() => setRateState(rateState === 'like' ? 'none': 'like' )}>
        {rateState === 'like' ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
        <Typography sx={{marginLeft: 1}}>{instruction?.likes_quant}</Typography>
      </IconButton>
      <IconButton onClick={() => setRateState(rateState === 'dislike' ? 'none': 'dislike' )}>
        {rateState === 'dislike' ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
        <Typography sx={{marginLeft: 1}}>{instruction?.dislikes_quant}</Typography>
      </IconButton>
    </Box>
  </main>
}

export default InstructionPage;
