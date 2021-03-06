PP64.ns("events");

Object.assign(PP64.events, (function() {
  let _eventsViewInstance;

  /** Custom events list view */
  const EventsView = class EventsView extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        hasError: false
      };
    }

    render() {
      if (this.state.hasError) {
        return (
          <p>An error was encountered.</p>
        );
      }

      let listing = null;

      const customEvents = PP64.adapters.events.getCustomEvents();
      if (!customEvents.length) {
        listing = (
          <tr><td>No custom events present — load or create your own!</td></tr>
        );
      }
      else {
        listing = customEvents.map(customEvent => {
          return (
            <EventRow key={customEvent.id} event={customEvent}
              onDeleteEvent={this.onDeleteEvent} />
          );
        });
      }

      const Button = PP64.controls.Button;
      return (
        <div className="eventsViewContainer">
          <h3>Events</h3>
          <table className="eventsViewTable">
            {Array.isArray(listing) ? (
              <thead>
                <tr>
                  <th className="eventsViewTableIconColumn"></th>
                  <th className="eventsViewTableIconColumn"></th>
                  <th></th>
                </tr>
              </thead>
            ) : null }
            <tbody>
              {listing}
            </tbody>
          </table>
        </div>
      );
    }

    componentDidMount() {
      _eventsViewInstance = this;
    }

    componentWillUnmount() {
      _eventsViewInstance = null;
    }

    componentDidCatch(error, info) {
      this.setState({ hasError: true });
      console.error(error);
    }

    onDeleteEvent = (event) => {
      if (window.confirm(`Are you sure you want to delete ${event.name}?`)) {
        PP64.adapters.events.removeEvent(event.id);
        this.forceUpdate();
      }
    }
  }

  const EventRow = class EventRow extends React.Component {
    render() {
      return (
        <tr className="eventTableRow">
          <td>
            <img src="img/events/delete.png"
              alt="Delete event" title="Delete event"
              onClick={() => { this.props.onDeleteEvent(this.props.event)} } />
          </td>
          <td>
            <img src="img/events/export.png"
              alt="Download event code" title="Download event code"
              onClick={this.onExportEvent} />
          </td>
          <td className="eventNameTableCell" onClick={this.onEditEvent}>
            <span className="eventNameText">{this.props.event.name}</span>
            <img src="img/events/edit.png" className="eventEditCellIcon"
              alt="Edit event" title="Edit event"/>
          </td>
        </tr>
      );
    }

    onEditEvent = () => {
      PP64.app.changeCurrentEvent(this.props.event);
      PP64.app.changeView($viewType.CREATEEVENT);
    }

    onExportEvent = () => {
      const event = this.props.event;
      let asmBlob = new Blob([event.asm]);
      saveAs(asmBlob, event.name + ".s");
    }
  }

  return {
    EventsView,
    refreshEventsView: function() {
      if (_eventsViewInstance) {
        _eventsViewInstance.forceUpdate();
      }
    },
  };
})());