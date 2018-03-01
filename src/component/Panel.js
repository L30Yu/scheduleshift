import React, {Component} from 'react';
import Paper from 'material-ui/Paper';

import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

const style = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '600px'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '8px',
    marginRight: '8px',
    marginTop: '8px',
    padding: '8px',
  },
  leftPaper: {
    width: '20%'
  },
  rightPaper: {
    width: '70%'
  }
};

export default class Panel extends Component {
  render() {
    return (
      <div style={style.container}>
        <Paper style={{...style.leftPaper, ...style.paper}} zDepth={1}>
          {this.props.children}
        </Paper>
        <Paper style={{...style.rightPaper, ...style.paper}}>
          <BigCalendar
            events={this.props.events ? this.props.events : []}
            popup
            defaultDate={new Date(2015, 5, 1)}
            views={['month']}
          />
        </Paper>
      </div>
    );
  }
}
