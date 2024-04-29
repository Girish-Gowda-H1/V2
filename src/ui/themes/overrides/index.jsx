// third-party
import merge from 'lodash.merge';

// project import
import Autocomplete from './Autocomplete';
import Badge from './Badge';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Chip from './Chip';
import IconButton from './IconButton';
import InputLabel from './InputLabel';
import LinearProgress from './LinearProgress';
import Link from './Link';
import ListItemIcon from './ListItemIcon';
import OutlinedInput from './OutlinedInput';
import Paper from './Paper';
import SvgIcon from './SvgIcon';
import Switch from './Switch';
import Tab from './Tab';
import TableCell from './TableCell';
import Tabs from './Tabs';
import TextField from './TextField';
import Typography from './Typography';
import Modal from './Modal';

// ==============================|| OVERRIDES - MAIN ||============================== //

export default function ComponentsOverrides(theme) {
  return merge(
    Autocomplete(theme),
    Button(theme),
    Badge(theme),
    Card(theme),
    Checkbox(theme),
    Radio(theme),
    Chip(theme),
    IconButton(theme),
    InputLabel(theme),
    LinearProgress(),
    Link(),
    ListItemIcon(),
    Modal(theme),
    OutlinedInput(theme),
    Paper(theme),
    SvgIcon(theme),
    Switch(theme),
    Tab(theme),
    TableCell(theme),
    Tabs(),
    TextField(theme),
    Typography()
  );
}
