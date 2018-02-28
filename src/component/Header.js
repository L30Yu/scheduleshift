import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleDialog = this.handleDialog.bind(this);
  }

  handleDialog() {
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <div>
        <AppBar
          iconElementRight={
            <IconButton>
              <FontIcon className="material-icons">code</FontIcon>
            </IconButton>
          }
          onRightIconButtonTouchTap={this.handleDialog}
          showMenuIconButton={false}
          title="Schedule Shift"
        />
        <Dialog
          actions={
            <FlatButton label="CLOSE" onTouchTap={this.handleDialog} />
          }
          autoScrollBodyContent={true}
          onRequestClose={this.handleDialog}
          open={this.state.open}
        >
          <List>
            <Subheader>GitHub</Subheader>
            <ListItem
              href="https://github.com/L30Yu/reactdemo"
              primaryText="Schedule Shift" secondaryText="by Leo Yu"
              target="_blank"
            />
            <Divider />
            <Subheader>Dependencies</Subheader>
            <ListItem
              href="https://github.com/callemall/material-ui"
              primaryText="material-ui" secondaryText="0.17.0"
              target="_blank"
            />
            <ListItem
              href="https://github.com/moment/moment/"
              primaryText="moment" secondaryText="2.17.1"
              target="_blank"
            />
            <ListItem
              href="https://github.com/facebook/react"
              primaryText="react" secondaryText="15.4.2"
              target="_blank"
            />
            <ListItem
              href="https://github.com/facebook/react/tree/master/packages/react-dom"
              primaryText="react-dom" secondaryText="15.4.2"
              target="_blank"
            />
            <ListItem
              href="https://github.com/ReactTraining/react-router"
              primaryText="react-router" secondaryText="3.0.2"
              target="_blank"
            />
            <ListItem
              href="https://github.com/zilverline/react-tap-event-plugin"
              primaryText="react-tap-event-plugin" secondaryText="2.0.1"
              target="_blank"
            />
          </List>
        </Dialog>
      </div>
    );
  }
}
