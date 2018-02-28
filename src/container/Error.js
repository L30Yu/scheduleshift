import React, {Component} from 'react';
import url from 'url';

import Panel from '../component/Panel';

const style = {
  text: {
    color: '#777',
  }
};

export default class Error extends Component {
  render() {
    return (
      <Panel>
        <div>
          <p>
            <b>404.</b> <text style={style.text}>That's an error.</text>
          </p>
          <p>
            The requested URL {url.parse(window.location.href).path} was not found.<br />
            <text style={style.text}>
              That's all we know.
            </text>
          </p>
        </div>
      </Panel>
    );
  }
}
