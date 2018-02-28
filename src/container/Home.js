import React, { Component } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import * as dataCall from '../utils/dataCall';
import Panel from '../component/Panel';
import SelectableList from '../component/SelectableList';

import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

const style = {
  list: {
    height: '60vh',
    overflowY: 'scroll',
  },
  textFieldContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  calendarContainer: {
    height: '60vh',
    width: '60%'
  }
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generated: '',
      list: [],
      open: false,
      textField: {
        min: {
          errorText: '',
          value: 0,
        },
        max: {
          errorText: '',
          value: 1,
        },
      },
      timestamp: '',
      valid: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handleSnackbar = this.handleSnackbar.bind(this);
  }

  componentWillMount() {
    dataCall.getEmployees().then(employees => {
      this.setState({ list: employees });
    });
  }

  checkInput(input, key) {
    let copy = Object.assign({}, this.state);
    copy.textField[key].value = parseInt(input, 10);
    if (!isNaN(input)) {
      if (input !== '') {
        this.checkOtherInput(copy, key);
      } else {
        copy.textField[key].errorText = 'Required.';
        copy.valid = false;
      }
    } else {
      copy.textField[key].errorText = 'Number required.';
      copy.valid = false;
    }
    return copy;
  }

  checkOtherInput(copy, key) {
    const otherInput = copy.textField[this.getOtherKey(key)].value;
    if (!isNaN(otherInput)) {
      if (otherInput !== '') {
        if (copy.textField['min'].value < copy.textField['max'].value) {
          copy.textField['min'].errorText = '';
          copy.textField['max'].errorText = '';
          copy.valid = true;
        } else {
          copy.textField[key].errorText = key === 'min' ? 'Must be less than max.' : 'Must be greater than min.';
          copy.valid = false;
        }
      } else {
        copy.textField[key].errorText = '';
        copy.valid = false;
      }
    } else {
      copy.textField[key].errorText = '';
      copy.valid = false;
    }
  }

  getOtherKey(key) {
    return key === 'min' ? 'max' : 'min';
  }

  handleChange(event) {
    this.setState(this.checkInput(event.target.value, event.target.id));
  }

  handleGenerate(event) {
    if (this.state.valid) {
      this.setState({
        generated: Math.floor(Math.random() * (this.state.textField['max'].value - this.state.textField['min'].value + 1)) + this.state.textField['min'].value,
        timestamp: moment().format(),
      },
        () => {
          const entry = [
            <ListItem
              insetChildren={false}
              primaryText={'[' + this.state.textField['min'].value + ', ' + this.state.textField['max'].value + ']: ' + this.state.generated}
              secondaryText={(this.state.list.length + 1) + ', ' + this.state.timestamp}
            />
          ];
          this.setState({
            list: entry.concat(this.state.list)
          });
        });
    } else {
      this.handleSnackbar();
    }
  }

  handleSnackbar() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div>
        <Panel>
          <RaisedButton
            primary={true}
            label="GENERATE Shift"
            onTouchTap={this.handleGenerate}
          />
          <SelectableList defaultValue={-1} style={style.list}>
            <ListItem
              selected={true}
              key={-1}
              value={-1}
              insetChildren={false}
              primaryText={`Total ${this.state.list.length} Employees`}
            />
            <Divider />
            {this.state.list.map((item, index) =>
              <ListItem
                key={index}
                value={item.id}
                insetChildren={false}
                primaryText={item.id + ": " + item.name}
              />
            )}
          </SelectableList>
        </Panel>
        <div style={style.calendarContainer}>
        <BigCalendar
          events={[{
            id: 0,
            title: 'All Day Event very long title',
            allDay: true,
            start: new Date(2015, 3, 0),
            end: new Date(2015, 3, 1),
          },]}
          popup
          defaultDate={new Date(2015, 3, 1)}
        />
        </div>
        <Snackbar
          autoHideDuration={3000}
          message="Fill the fields correctly."
          onRequestClose={this.handleSnackbar}
          open={this.state.open}
        />
      </div>
    );
  }
}
