import './style.css'
import { setupFilePicker, setupInfoView } from './components.ts'
import { streamToBlob } from './lib/stream-to-blob.ts';

const SELECTORS = {
  input: "#js-file-picker",
  inputInfo: "#js-i-data",
  outputInfo: "#js-o-data"
}

const inputInfo = setupInfoView(SELECTORS.inputInfo);
const outputInfo = setupInfoView(SELECTORS.outputInfo);


async function onAcceptedFile(file: File) {
  inputInfo.updateText(`${file.name}: ${file.size}bytes`);

  const stream = file.stream();

  const { blob, mimeType, ext } = await streamToBlob(stream);

  outputInfo.updateText(`${mimeType}/${ext}: ${blob.size}bytes`);
}

setupFilePicker(SELECTORS.input, {
  onAcceptedFile
})

