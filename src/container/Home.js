import React, { Component } from 'react';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import moment from 'moment';
import * as dataCall from '../utils/dataCall';
import Panel from '../component/Panel';
import SelectableList from '../component/SelectableList';
import calculate from '../utils/shifts';

const style = {
  list: {
    height: '80vh',
    overflowY: 'scroll',
  },
  textFieldContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generated: '',
      employees: [],
      open: false,
      timestamp: '',
      valid: true,
      checked: true,
      events: [],
    };
    this.handleGenerate = this.handleGenerate.bind(this);
    this.updateCheck = this.updateCheck.bind(this);
    this.handleSnackbar = this.handleSnackbar.bind(this);
  }

  componentWillMount() {
    dataCall.getEmployees().then(employees => {
      this.setState({ employees });
    });
  }

  componentDidMount() {
    let dataCalls = [];
    dataCalls.push(dataCall.getRuleDefinitions());
    dataCalls.push(dataCall.getShiftRules());
    dataCalls.push(dataCall.getTimeOff());
    dataCalls.push(dataCall.getWeeks());
    Promise.all(dataCalls).then(values => {
      this.setState({
        rulesDefinitions: values[0],
        shiftRules: values[1],
        timeoff: values[2],
      }, () => {
        let {schedule, events} = calculate(this.state);
        if (schedule) {
          dataCall.postData(schedule);
          this.setState({
            events
          })
        }

      });
    });
  }

  handleGenerate(event) {
    if (this.state.valid) {
      this.setState({
        generated: [],
        timestamp: moment().format(),
      });
    } else {
      this.handleSnackbar();
    }
  }

  handleSnackbar() {
    this.setState({ open: !this.state.open });
  }

  updateCheck() {
    this.setState((oldState) => {
      return {
        checked: !oldState.checked,
      };
    });
  }

  render() {
    return (
      <div>
        <Panel events={this.state.events}>
          <Checkbox
            checkedIcon={<ActionFavorite />}
            label="TimeOff Requests"
            checked={this.state.checked}
            onCheck={this.updateCheck.bind(this)}
          />
          <SelectableList defaultValue={-1} style={style.list}>
            <ListItem
              selected={true}
              key={-1}
              value={-1}
              insetChildren={false}
              primaryText={`Total ${this.state.employees.length} Employees`}
            />
            <Divider />
            {this.state.employees.map((item, index) =>
              <ListItem
                key={index}
                value={item.id}
                insetChildren={false}
                primaryText={item.id + ": " + item.name}
              />
            )}
          </SelectableList>
        </Panel>
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
