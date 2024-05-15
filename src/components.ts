export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}

interface FilePickerProps {
  onAcceptedFile(file: File): void
}

export function setupFilePicker(selector: string, props: FilePickerProps) {
  const el = document.querySelector<HTMLInputElement>(selector);
  if (!el) return;

  el.addEventListener('change', function () {
    const [file] = Array.from(this.files || []);
    file != null && props.onAcceptedFile(file)
  })
}

export function setupInfoView(selector: string) {
  const el = document.querySelector<HTMLInputElement>(selector);

  function updateText(text: string) {
    el && (el.innerText = text);
  }

  return {
    updateText
  }

}