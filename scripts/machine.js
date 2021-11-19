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

import { clear } from "./display.js";

class Machine {
  /**
   * @param {Map<string, Map<string, {state: string, symbol: string, move: "left" | "right"}>>} transitions
   * @param {Set<string>} accepting
   * @param {string} start
   */
  constructor(transitions, accepting, start) {
    /** @type {Map<string, Map<string, {state: string, symbol: string, move: "left" | "right"}>>} */
    this.transitions = transitions;

    /** @type {Set<string>} */
    this.accepting = accepting;

    /** @type {string} */
    this.start = start;

    /** @type {Map<string, {result: "Accepted" | "Rejected" | "Timed Out", steps: {state: string, tape: string, position: number}[]}>} */
    this.record = new Map();
  }

  /**
   * @param {string} tape
   * @returns {{result: "Accepted" | "Rejected" | "Timed Out", steps: {state: string, tape: string, position: number}[]}}
   */
  run(tape) {
    tape.trim();
    if (tape.length === 0) tape = " ";

    let record = this.record.get(tape);
    if (record !== undefined) return record;
    record = { steps: [] };
    this.record.set(record);

    /** @type {string} */
    let state = this.start;
    /** @type {number} */
    let position = 0;
    for (let stepCount = 0; stepCount < 10000; ++stepCount) {
      record.steps.push({ state: state, tape: tape, position: position });

      const stateTransitions = this.transitions.get(state);
      if (stateTransitions === undefined) {
        record.result = this.accepting.has(state) ? "Accepted" : "Rejected";
        return record;
      }

      const transition = stateTransitions.get(tape[position]);
      if (transition === undefined) {
        record.result = this.accepting.has(state) ? "Accepted" : "Rejected";
        return record;
      }

      state = transition.state;
      tape =
        tape.substring(0, position) +
        transition.symbol +
        tape.substring(position + 1);
      if (transition.move === "left") --position;
      else ++position;

      if (position === tape.length) {
        tape += " ";
      } else if (position === -1) {
        tape = " " + tape;
        position = 0;
      }
    }

    record.result = "Timed Out";
    return record;
  }
}

/** @type {Machine} */
let machine;
/** @returns {Machine} */
export default function getMachine() {
  return machine;
}

document.getElementById("tests-rerun").addEventListener("click", () => {
  clear();
  document.getElementById("error-messages").innerHTML = "";

  // build machine
  let errored = false;
  machine = undefined;

  const transitionChildren = document.getElementById("states-body").children;
  /** @type {Map<string, Map<string, {state: string, symbol: string, move: "left" | "right"}>>} */
  const transitions = new Map();
  for (let idx = 0; idx < transitionChildren.length; idx++) {
    const id = Number.parseInt(
      transitionChildren[idx].id.match(/states-row-([0-9]+)/)[1]
    );

    /** @type {string} */
    const state = document.getElementById(`states-state-${id}`).value;
    if (state.length === 0) {
      document
        .getElementById("error-messages")
        .insertAdjacentHTML(
          "beforeend",
          `<p>initial state for transition ${
            idx + 1
          } is not a valid state - it can't be the empty string</p>`
        );
      errored = true;
    }

    /** @type {string} */
    const symbol = document.getElementById(`states-symbol-${id}`).value;
    if (symbol.length !== 1) {
      document
        .getElementById("error-messages")
        .insertAdjacentHTML(
          "beforeend",
          `<p>initial symbol for transition ${
            idx + 1
          } is not a valid symbol - it must be only one character long</p>`
        );
      errored = true;
    }

    /** @type {string} */
    const nextState = document.getElementById(`states-next-state-${id}`).value;
    if (nextState.length === 0) {
      document
        .getElementById("error-messages")
        .insertAdjacentHTML(
          "beforeend",
          `<p>next state for transition number ${
            idx + 1
          } is not a valid state - it can't be the empty string</p>`
        );
      errored = true;
    }

    /** @type {string} */
    const nextSymbol = document.getElementById(
      `states-next-symbol-${id}`
    ).value;
    if (nextSymbol.length !== 1) {
      document
        .getElementById("error-messages")
        .insertAdjacentHTML(
          "beforeend",
          `<p>next symbol for transition ${
            idx + 1
          } is not a valid symbol - it must be only one character long</p>`
        );
      errored = true;
    }

    /** @type {"left" | "right"} */
    const move = document.getElementById(`states-move-${id}`).value;

    if (
      state.length === 0 ||
      symbol.length !== 1 ||
      nextState.length === 0 ||
      nextSymbol.length !== 1
    )
      continue;

    if (!transitions.has(state)) transitions.set(state, new Map());
    const stateTransitions = transitions.get(state);

    stateTransitions.set(symbol, {
      state: nextState,
      symbol: nextSymbol,
      move: document.getElementById(`states-move-${id}`).value,
    });
  }

  const acceptingChildren = document.getElementById(
    "accepting-states-body"
  ).children;
  /** @type {Set<string>} */
  const accepting = new Set();
  for (let idx = 0; idx < acceptingChildren.length; idx++) {
    const id = Number.parseInt(
      acceptingChildren[idx].id.match(/states-row-([0-9]+)/)[1]
    );

    /** @type {string} */
    const state = document.getElementById(`accepting-states-state-${id}`).value;
    if (state.length === 0) {
      document
        .getElementById("error-messages")
        .insertAdjacentHTML(
          "beforeend",
          `<p>accepting state number ${
            idx + 1
          } is not a valid state - it can't be the empty string</p>`
        );
      errored = true;
    }

    if (state.length === 0) continue;

    accepting.add(state);
  }

  const startState = document.getElementById("start-state").value;
  if (startState.length === 0) {
    document
      .getElementById("error-messages")
      .insertAdjacentHTML(
        "beforeend",
        `<p>start state is not a valid state - it can't be the empty string</p>`
      );
    errored = true;
  }

  document.getElementById("error-message-container").hidden = !errored;
  if (errored) return;

  machine = new Machine(transitions, accepting, startState);

  // run tests
  const testChildren = document.getElementById("tests-body").children;
  for (let idx = 0; idx < testChildren.length; idx++) {
    const id = Number.parseInt(
      testChildren[idx].id.match(/tests-row-([0-9]+)/)[1]
    );

    /** @type {string} */
    document.getElementById(`tests-result-${id}`).innerText = machine.run(
      document.getElementById(`tests-tape-${id}`).value
    ).result;
  }

  console.log(machine);
});
