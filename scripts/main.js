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

import "./display.js";
import "./machine.js";

let counter = 0n;

// states
document.getElementById("states-add-row").addEventListener("click", () => {
  document.getElementById("states-body").insertAdjacentHTML(
    "beforeend",
    `
<tr id="states-row-${counter}">
  <td>
    <input
      type="text"
      class="form-control form-control-sm code-input"
      id="states-state-${counter}"
    />
  </td>
  <td>
    <input
      type="text"
      class="form-control form-control-sm code-input"
      id="states-symbol-${counter}"
    />
  </td>
  <td>
    <input
      type="text"
      class="form-control form-control-sm code-input"
      id="states-next-state-${counter}"
    />
  </td>
  <td>
    <input
      type="text"
      class="form-control form-control-sm code-input"
      id="states-next-symbol-${counter}"
    />
  </td>
  <td>
    <select class="form-select form-select-sm" id="states-move-${counter}">
      <option value="left">Left</option>
      <option value="right">Right</option>
    </select>
  </td>
  <td>
    <button type="reset" class="btn btn-sm btn-danger" id="states-delete-${counter}">
      &#xD7;
    </button>
  </td>
</tr>
`
  );

  const captureCounter = counter;
  document
    .getElementById(`states-delete-${captureCounter}`)
    .addEventListener("click", () => {
      document.getElementById(`states-row-${captureCounter}`).remove();
    });

  ++counter;
});
document.getElementById("states-delete-all").addEventListener("click", () => {
  document.getElementById("states-body").innerHTML = "";
});

document
  .getElementById("accepting-states-add-row")
  .addEventListener("click", () => {
    document.getElementById("accepting-states-body").insertAdjacentHTML(
      "beforeend",
      `
<tr id="accepting-states-row-${counter}">
  <td>
    <input
      type="text"
      class="form-control form-control-sm code-input"
      id="accepting-states-state-${counter}"
    />
  </td>
  <td>
    <button
      type="reset"
      class="btn btn-sm btn-danger"
      id="accepting-states-delete-${counter}"
    >
      &#xD7;
    </button>
  </td>
</tr>
`
    );

    const captureCounter = counter;
    document
      .getElementById(`accepting-states-delete-${captureCounter}`)
      .addEventListener("click", () => {
        document
          .getElementById(`accepting-states-row-${captureCounter}`)
          .remove();
      });

    ++counter;
  });
document
  .getElementById("accepting-states-delete-all")
  .addEventListener("click", () => {
    document.getElementById("accepting-states-body").innerHTML = "";
  });

// tests
document.getElementById("tests-add-row").addEventListener("click", () => {
  document.getElementById("tests-body").insertAdjacentHTML(
    "beforeend",
    `
<tr id="tests-row-${counter}">
  <td>
    <input
      type="text"
      class="form-control form-control-sm code-input"
      id="tests-tape-${counter}"
    />
  </td>
  <td>
    <code id="tests-result-${counter}">Not yet run</code>
  </td>
  <td>
    <button type="reset" class="btn btn-sm btn-primary" id="tests-examine-${counter}">
      &#x1f50d;
    </button>
  </td>
  <td>
    <button type="reset" class="btn btn-sm btn-danger" id="tests-delete-${counter}">
      &#xD7;
    </button>
  </td>
</tr>
`
  );

  const captureCounter = counter;
  document
    .getElementById(`tests-examine-${captureCounter}`)
    .addEventListener("click", () => {
      // TODO
    });
  document
    .getElementById(`tests-delete-${captureCounter}`)
    .addEventListener("click", () => {
      document.getElementById(`tests-row-${captureCounter}`).remove();
    });

  ++counter;
});
document.getElementById("tests-delete-all").addEventListener("click", () => {
  document.getElementById("tests-body").innerHTML = "";
});
