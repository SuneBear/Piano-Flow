# Piano Flow
[WIP] A music game follows the piano flows.

## Run on Local
``` bash
$ git clone git@github.com/SuneBear/Piano-Flow.git
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
The structure is a experimental combination of SPA based on Vue 2 and MUG based on Phaser. They basically are independent, but using the shared assets and services.

## Further Improvements
- Brand Redesign & UI Redesign
- Gameplay: add some different modes
- Replace build tool & Refactor game

## Dependencies & References

#### Starter
- [phaser-es6-webpack](https://github.com/lean/phaser-es6-webpack) - A bootstrap project for create games.

#### Frameworks & Libraries
- [Phaser](https://github.com/photonstorm/phaser) - Phaser is a fun, free and fast 2D game framework.
- [Vue](https://github.com/vuejs/vue) - Simple yet powerful library for building modern web interfaces.
- [RxJS](https://github.com/Reactive-Extensions/RxJS) - The Reactive Extensions for JavaScript .

#### Video & Games
- [From Paper to Screen](https://vimeo.com/69375692) - Animation which shows typography evolution from paper to screen.
- [Touch Pianist](http://touchpianist.com) - Tap in Rhythm and Perform Your Favourite Music.

### Font
- [EB Garamond](http://www.georgduffner.at/ebgaramond) - A revival of Claude Garamont’s famous humanist typeface from the mid-16th century.

## License
This game is licensed under the MIT license.
