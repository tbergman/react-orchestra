import React from 'react';
import classnames from 'classnames';
// import {
//   loadInstrument,
//   stopPlayingNote,
//   playSound,
//   getNoteBlob,
//   playNote,
//   loadSound,
// } from '../MusicManager';
import callIfExists from '../utils/callIfExists';

class Instrument extends React.Component {
  constructor(props) {
    super(props);
    this.onStartPlaying = this.onStartPlaying.bind(this);
    this.onStopPlaying = this.onStopPlaying.bind(this);
    this.onNoteLoaded = this.onNoteLoaded.bind(this);
    this.loadingNotesCounter = 0;
    this.state = {
      isLoaded: false,
    };
  }
  async onStartPlaying(noteName) {
    callIfExists(this.props.onStartPlaying, noteName);
  }
  async onStopPlaying(noteName) {
    callIfExists(this.props.onStopPlaying, noteName);
  }
  async onNoteLoaded(instrumentName, noteName) {
    this.loadingNotesCounter += 1;
    const noteCount = this.props.children.length;
    if (noteCount === this.loadingNotesCounter) {
      this.setState({ isLoaded: true });
      callIfExists(this.props.onInstrumentLoaded, this.props.name, noteName);
    }
  }
  render() {
    // Because I can !
    const loader = this.state.isLoaded ?
      null :
      this.props.loader ? this.props.loader : <div><span>Loading  Instrument 🚚 🚚 🚚</span></div>;
    return (
      <div
        style={this.props.style}
        className={
          classnames({ 'ro-instrument-loading': !this.state.isLoaded }, { 'ro-instrument-loaded': this.state.isLoaded })
        }
      >
        { loader }
        {
          React.Children.map(this.props.children, child =>
            React.cloneElement(child,
              {
                instrumentName: child.props.instrumentName || this.props.name,
                onStartPlaying: this.onStartPlaying,
                onStopPlaying: this.onStopPlaying,
                onNoteLoaded: this.onNoteLoaded,
                interactive: this.props.interactive || true,
              },
            ),
          )
        }
      </div>
    );
  }
}

Instrument.defaultProps = {
  name: 'acoustic_grand_piano',
};

export default Instrument;
