'use client'
import { Instruction } from "@/types";
import { Box, Checkbox, Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import ReplayIcon from '@mui/icons-material/Replay';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from './page.module.css';
import Link from "next/link";

type InstructionPageProps = {
  params: {
    id: string
  }
}

const InstructionPage: FC<InstructionPageProps> = ({ params: { id } }) => {
  const [instruction, setInstruction] = useState<Instruction>();
  useEffect(() => {
    axios.get<Instruction>(`http://localhost:8000/instructions/${id}`)
      .then(resp => {
        setInstruction(resp.data);
      })
  }, [id])
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
  };
  const [rateState, setRateState] = useState<'like' | 'dislike' | 'none'>('none');
  useEffect(() => {
    if(rateState === 'none') return;
    axios.post(`http://localhost:8000/instructions/${id}/rate`, {
      isLiked: rateState === 'like' ? true : false
    })
    .then(resp => {
      console.log(resp);
    })
  }, [rateState, id])
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
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <ReplayIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={content} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
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