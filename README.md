# Piano Flow
A music game follows the piano flows. Its rhythm mode inspired by Touch Pianist, thanks to Batuhan Bozkurt. The main purpose I made it was to achieve a dream of my youth and to help me practice the fundamentals of MUG.

I need to be honest with you, the game has a bad playability which can't make you feel completely immersed with simple interaction. Maybe it will improve your gameplay through a virtual reality headset, but I think the best experience is on a real piano nowadays.

## Run on Local
``` bash
$ git clone git@github.com:SuneBear/Piano-Flow.git
$ cd Piano-Flow
$ npm install
$ npm start
```

## Source File Structure
``` base
├── assets        # Common Static Resources
├── game          # Game Core
├── services      # Common Data and Context Status
├── styles        # GLobal Styles
├── uis           # App UI Components
├── utils         # App Helpers
├── views         # App BLL Components

├── app.vue       # App Main
├── index.html    # Template for HTML Webpack Plugin
├── lib.js        # Dependencies Entry Point
├── loading.js    # Loading Entry Point
├── main.js       # Client Entry Point
├── router.js     # Route Map and Router Instance
```
The structure is a experimental combination of SPA based on Vue 2 and MUG based on Pixi.js, MIDI.js, etc. They are basically independent, but using the shared assets and services.

## Further Improvements
- Brand Redesign & UI Redesign & Animation Tuning
- Gameplay: Add some different modes
- Music: Optimize timbre & rhythm
- Refactor game, make code more abstract :(

## Dependencies & References

#### Frameworks & Libraries
- [Vue](https://github.com/vuejs/vue) - Simple yet powerful library for building modern web interfaces.
- [Pixi.js](https://github.com/pixijs/pixi.js) - Super fast HTML 5 2D rendering engine that uses webGL with canvas fallback.
- [Midi.js](https://github.com/SuneBear/midi.js) - A modern JavaScript port of MIDI.js.
- [RxJS](https://github.com/Reactive-Extensions/RxJS) - The Reactive Extensions for JavaScript.

#### Video & Games
- [From Paper to Screen](https://vimeo.com/69375692) - Animation which shows typography evolution from paper to screen.
- [Touch Pianist](http://touchpianist.com) - Tap in Rhythm and Perform Your Favourite Music.
- [Euphony](https://github.com/qiao/euphony) - A web-based MIDI player and visualizer.
- [NeoTrap](https://github.com/omarhuseynov011/NeoTrap) - A Music based fast-paced action game.

#### Font
- [EB Garamond](http://www.georgduffner.at/ebgaramond) - A revival of Claude Garamont’s famous humanist typeface from the mid-16th century.

## License
This game is licensed under the MIT license.
