# Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1. The H5P editor needs a server running.  I cloned https://github.com/Lumieducation/H5P-Nodejs-library and ran `npm start` in the `packages/h5p-rest-example-server` folder.  Be sure to run `npm install` in that repository's root folder first.

2. Run `yarn start`.

3. [http://localhost:3000](http://localhost:3000) should display an H5P editor.  Maybe you don't see any exercise types.  In that case, run the `packages/h5p-rest-example-client` in the other repository, log in as admin and install the multiple choice plugin.

4. Create a multiple choice task and click save.  Saving does not actually work (due to the login model of the example server), but the save method is the only place where I could access the editor content as JSON.  For now it is just displayed below the editor.  You may have to click save twice.
