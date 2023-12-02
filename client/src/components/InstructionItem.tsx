import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { FC, Fragment, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { instructions } from '@/app/consts';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { purple, blue } from '@mui/material/colors';

type InstructionItemProps = {
  item: typeof instructions[number]
}

const InstructionItem: FC<InstructionItemProps> = ({item}) =>  {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return <ListItemButton onClick={handleClick} sx={{background: blue[50]}}>
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
}

export default InstructionItem;