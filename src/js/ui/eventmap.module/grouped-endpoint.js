import React from 'react';

export default function GroupedEndpoint(props) {
  // let optionID = props.id;
  // var selectedEndpoint = function(){}
  return (
    <div className='border-bottom mb-2 pb-3'>
      <p className='font-weight-bold mb-2'>
      {props.data.service.name}
      </p>
      <div>
        {
          props.data.endpoint.map((endpoint , idx) => {
            let checked = props.checkedEndpoint.includes(endpoint.id);
            return (<div className="form-check" key={endpoint.id + idx}>
            <input className="form-check-input" name={props.listName} type={props.listType}
              value={endpoint.id} id={endpoint.id}
              checked={checked}
              onChange={props.selectedEndpointHandler} />
            <label className="form-check-label rounded" htmlFor={endpoint.id}
              style={!endpoint.active ? { textDecoration: "line-through" } : null}>
              <span className="checkmark"></span>
              {endpoint.url}
            </label>
          </div>);
          })
        }
      </div>
      
    </div>
  )
}