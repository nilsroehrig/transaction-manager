// Attachment for auto-focus
export function autofocus(node: HTMLElement, enabled: boolean = true) {
  if (enabled) {
    node.focus();
  }
}

