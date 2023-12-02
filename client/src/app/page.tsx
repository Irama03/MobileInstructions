"use client"
import Image from 'next/image'
import styles from './page.module.css'
import SignIn from '@/components/SignIn'
import { List, ListItemButton, ListItemIcon, ListSubheader } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import ListItemText from '@mui/material/ListItemText';
import DraftsIcon from '@mui/icons-material/Drafts';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Fragment, useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { instructions } from './consts'
import InstructionItem from '@/components/InstructionItem'

export default function Home() {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <main className={styles.main}>
        <List
      sx={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 2 }}
      component="ul"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="h1" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
    >
      {instructions.map(item => <InstructionItem key={item.id} item={item}/>)}
    </List>
    </main>
  )
}
