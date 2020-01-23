// Import JS libs
import * as $ from 'jquery';
// Components
import componentOne from "@components/component_one";
// JSON data
import json from "./JSON/test.json"

// Images
import SomeImage from "../assets/images/DesktopWallpaper.jpg"

//Styles
require('../css/style.css');

console.log("JSON file content:", json);

document.body.appendChild(componentOne());

const img = document.createElement("img");
img.src = SomeImage;
console.log(img);
document.body.appendChild(img);

$('pre').html("Jquery works!");