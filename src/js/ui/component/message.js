import React from 'react';

export function Spinner(props) {
  return (
    <div className="list-status-panel text-primary">
      <p>{props.text}</p>
      <span className="spinner-border"></span>
    </div>
  );
}

export function EmptyState(props) {
  return (
    <div className="bg-light border px-3 py-4 rounded text-capitalize text-center text-primary">
      <h4>{props.text}</h4>
    </div>
  );
}

export function WarningMessage(props) {
  return (
    <p className="alert alert-warning m-1" role="alert">
      {props.text}
    </p>);
}
