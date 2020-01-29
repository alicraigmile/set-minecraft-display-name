'use strict';

// Usage: node set-minecraft-display-name.js /path/to/launcher_profiles.json "New Display Name"
// About: https://github.com/alicraigmile/set-minecraft-display-name/
// Copyright: 2020 Ali Craigmile <ali@craigmile.com>
// Licence: BSD-3-Clause


const fs = require('fs');
const bright = "\x1b[1m";
const reset = "\x1b[0m";
const myArgs = process.argv.slice(2);
const filename = myArgs[0]; // '/Users/USERNAME/Library/Application\ Support/minecraft/launcher_profiles.json';
const newDisplayName = myArgs[1]; // "New Display Name";

let  launcherProfiles, rawdata, ad, adKey, profiles, profileKey, displayName;

//read and parse launcher_profile.json file
try {
    rawdata = fs.readFileSync(filename);
    launcherProfiles = JSON.parse(rawdata);
    ad = launcherProfiles.authenticationDatabase;
    adKey = Object.keys(ad)[0];
    profiles = ad[adKey].profiles;
    profileKey = Object.keys(profiles)[0];
    displayName = profiles[profileKey].displayName;
} catch(error) {
    console.log('file was not found / not a valid launcher_profiles.json: ' + filename);
    process.exit();
}


if (newDisplayName == displayName) {
    console.log('Profile not changed: ' + profileKey + ' (' + bright + displayName + reset + ')');
    process.exit();
}


//keep a copy of the file before we edit it
let backupFilename = filename + '.backup';
fs.renameSync(filename, backupFilename + '.backup');

// make the change
launcherProfiles.authenticationDatabase[adKey].profiles[profileKey].displayName = newDisplayName;

// save our change
let data = JSON.stringify(launcherProfiles, null, 2);
fs.writeFileSync(filename, data);

// all done ;) 
console.log('Profile changed: ' + profileKey + ' (' + bright + displayName + reset + ' -> ' + bright + newDisplayName + reset + '). May the blocks be with you ;)');