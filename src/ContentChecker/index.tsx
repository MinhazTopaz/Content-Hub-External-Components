import ReactDOM from "react-dom";
import React from "react";
import CheckDuplicateContent from "./CheckDuplicateContent";

interface Context {}

export default function createExternalRoot(container: HTMLElement) {
  return {
    render(context: Context) {
      console.log(context);

      ReactDOM.render(<CheckDuplicateContent />, container);
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}
