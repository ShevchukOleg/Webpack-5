// Import JS libs
import * as $ from 'jquery';
// Components
import componentOne from "@components/component_one";
// JSON data
import json from "./JSON/test.json"

// Images
import SomeImage from "../assets/resource/images/DesktopWallpaper.jpg"

//inputs
import html from '../index.html';

import '../css/style.css';
import '../scss/style.scss';

console.log("JSON file content:", json);

document.body.appendChild(componentOne());

const img = document.createElement("img");
img.src = SomeImage;
console.log(img);
document.body.appendChild(img);

$('pre').html("Jquery works!");

// new JS featuters
async function start() {
  return await Promise.resolve("Async is working");
}

start().then(console.log);

class Util {
  static id = Date.now();
}

console.log("Id:", Util.id);