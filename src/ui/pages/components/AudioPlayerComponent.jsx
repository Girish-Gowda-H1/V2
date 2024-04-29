import { Fragment } from 'react';

export default function CheckboxComponent() {
  return (
    <Fragment>
      <h1>Audio Player</h1>

      <audio id="myAudio" controls>
        <source src="https://samplelib.com/lib/preview/mp3/sample-12s.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </Fragment>
  );
}
