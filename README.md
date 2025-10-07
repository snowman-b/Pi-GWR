# Pi 100 Stopwatch

A tiny web app: type the first 100 digits of π after `3.` and see how fast you are.

## Features
- Shows `3.` prefix, you type the next 100 digits
- Timer starts at your first correct digit and updates in hundredths
- Stops on first mistake and flashes red with "Try Again"
- Stops on the 100th digit and flashes green with "Well Done"
- Reset button

## Run locally
Any static server works. On macOS you can use Python's http.server:

```bash
# from the repo root
python3 -m http.server 5173
```

Then open http://localhost:5173 in your browser.

Alternatively, open `index.html` directly in a browser (some browsers restrict file:// timers; a local server is recommended).

## Notes
- Input is restricted to digits and capped at 100 characters.
- Validation checks every character; a wrong digit immediately ends the run.
- Timer format: `mm:ss.hh` (hundredths).

## Credits
First 100 digits string embedded directly in `script.js`.