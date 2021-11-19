// Copyright 2021 Justin Hu
// This file is part of EmulateTM.
//
// EmulateTM is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// EmulateTM is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
// for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with EmulateTM. If not, see <https://www.gnu.org/licenses/>.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/** @type {number} */
let stepIndex = 0;
/** @type {{result: "Accepted" | "Rejected" | "Timed Out", steps: {state: string, tape: string, position: number}[]}} */
let record;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

function render() {
  if (record === undefined) {
    canvas.height = canvas.clientHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.width = canvas.clientWidth;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  if (stepIndex === 0) {
    document.getElementById("run-start").disabled = true;
    document.getElementById("run-back").disabled = true;
  } else {
    document.getElementById("run-start").disabled = false;
    document.getElementById("run-back").disabled = false;
  }
  if (stepIndex === record.steps.length) {
    document.getElementById("run-next").disabled = true;
    document.getElementById("run-end").disabled = true;
  } else {
    document.getElementById("run-next").disabled = false;
    document.getElementById("run-end").disabled = false;
  }

  const step =
    stepIndex === record.steps.length
      ? record.steps[stepIndex - 1]
      : record.steps[stepIndex];

  canvas.height = canvas.clientHeight;
  const cellWidth = canvas.height * 0.25;
  const tapeWidth = (step.tape.length + 2) * cellWidth;
  canvas.style.width = `${Math.max(tapeWidth, window.innerWidth)}px`;
  canvas.width = canvas.clientWidth;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x = Math.max((window.innerWidth - tapeWidth) / 2, 0);
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `${
    canvas.height * 0.2
  }px SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace`;

  ctx.strokeRect(x, cellWidth / 2, cellWidth, cellWidth);
  ctx.fillText("\u{2026}", x + cellWidth / 2, cellWidth);
  x += cellWidth;
  for (let idx = 0; idx < step.tape.length; idx++) {
    const character = step.tape[idx];
    ctx.strokeRect(x, cellWidth / 2, cellWidth, cellWidth);
    ctx.fillText(character, x + cellWidth / 2, cellWidth);

    if (idx === step.position) {
      ctx.fillText("\u{2191}", x + cellWidth / 2, cellWidth * 2);
      ctx.save();
      if (stepIndex === record.steps.length)
        ctx.fillStyle = record.result === "Accepted" ? "#00ff00" : "#ff0000";
      ctx.fillText(step.state, x + cellWidth / 2, cellWidth * 3);
      ctx.restore();
    }

    x += cellWidth;
  }
  ctx.strokeRect(x, cellWidth / 2, cellWidth, cellWidth);
  ctx.fillText("\u{2026}", x + cellWidth / 2, cellWidth);
  x += cellWidth;
}

/**
 * @param {{result: "Accepted" | "Rejected" | "Timed Out", steps: {state: string, tape: string, position: number}[]}} record
 */
export function display(recordIn) {
  stepIndex = 0;
  record = recordIn;
  render();
}

export function clear() {
  record = undefined;
  render();
}

document.addEventListener("resize", () => {
  render();
});

document.getElementById("run-start").addEventListener("click", () => {
  stepIndex = 0;
  render();
});

document.getElementById("run-back").addEventListener("click", () => {
  --stepIndex;
  render();
});

document.getElementById("run-next").addEventListener("click", () => {
  ++stepIndex;
  render();
});

document.getElementById("run-end").addEventListener("click", () => {
  stepIndex = record.steps.length;
  render();
});

window.addEventListener("resize", () => {
  resize();
});
function resize() {
  const remainingSize =
    window.innerHeight -
    document.getElementById("row-0").offsetHeight -
    document.getElementById("row-1").offsetHeight;
  for (const element of document.getElementsByClassName("pinned"))
    element.style.maxHeight = `${remainingSize}px`;
}
resize();
