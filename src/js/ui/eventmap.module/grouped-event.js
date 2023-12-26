import React from 'react';

export default function GroupedEvent(props) {
  // let optionID = props.id;
  // var selectedevent = function(){}
  const __listName = "listener_event";
  const __listType = "radio";
  return (
    <div className='border-bottom mb-2 pb-3'>
      <p className='font-weight-bold mb-2'>
        {props.data.service.name}
      </p>
      <div>
        {
          props.data.event.map((event , idx) => {
            //let checked = props.checkedEvent.includes(event.event_id);
            return(<div className="form-check" key={event.key + idx}>
              <input className="form-check-input" name={__listName}
                value={event.value} id={event.html_id} type={__listType}
                // defaultChecked={event.event_id === this.state.listener.event_id}
                onChange={props.selectedEventHandler} />
              <label className="form-check-label" htmlFor={event.html_id}>
                <span className="checkmark"></span>
                {event.text}
              </label>
            </div>);
          })
        }
      </div>

    </div>
  )
}