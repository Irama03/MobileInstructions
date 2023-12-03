import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { FC, Fragment, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { purple, blue } from '@mui/material/colors';
import { Instruction } from '@/types';
import Link from 'next/link';

type InstructionItemProps = {
  item: Instruction
}

const InstructionItem: FC<InstructionItemProps> = ({item}) =>  {
  return <Link href={`/instruction/${item.id}`} >
  <ListItemButton sx={{background: blue[50]}}>
      <ListItemIcon>
        <IntegrationInstructionsIcon />
      </ListItemIcon>
      <Box>
      <ListItemText primary={item.name} secondary={item.category.name}/>
      <List component="div" disablePadding>
        {item.devices.map(device => <ListItem key={device.id}>
          <ListItemText secondary={device.name} />
        </ListItem>)}
      </List>
      </Box>
  </ListItemButton>
  </Link>
}

export default InstructionItem;