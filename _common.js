async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    //console.log(data.toString());
    return data.toString()
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function genID() {
  return `1P${zeroPad(getRandomInt(999),3)}X${Date.now()}`
}
