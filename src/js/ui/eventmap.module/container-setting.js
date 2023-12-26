import React from 'react';
import ListService from './list-service';

export default class ContainerSetting extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ListService/>
      </div>
    );
  }
}