import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useMachine } from "@xstate/react";
import { machineModel } from "./stateMachine";

function App() {
  const [current, send] = useMachine(machineModel);
console.log(current);

  const handleChange = POSTFIX => ({ target: { value } }) =>
    send({ type: `SET_${POSTFIX}`, value });

  const errors = {
    name: current.matches("build.personal.invalid") && !current.context.name,
    contact:
      current.matches("build.personal.invalid") &&
      !(current.context.phone || current.context.email)
  };

  return (
    <div>
      {current.matches('home') && (
        <button onClick={() => send("BUILD")} data-testid="build-button">Build Your Resume</button>
      )}
      {current.matches('build') && (
        <div data-testid="build-layout-wrapper">
          {current.matches('build.personal') && (
            <>
              <input
                name="name"
                placeholder="Elon Musk"
                onChange={handleChange("NAME")}
                defaultValue={current.context.name}
                data-testid="name"
              />
              <input
                name="email"
                placeholder="Elon.Musk@SpaceTesla.X"
                onChange={handleChange("EMAIL")}
                defaultValue={current.context.email}
                data-testid="email"
              />
              <button onClick={() => send({ type: "NEXT_STEP" })} data-testid="next-button">Next Step</button>
              <button
                type="button"
                onClick={() => send({ type: "HOME" })}
                data-testid="save-button"
              >
                Save & Go Back
              </button>
              {errors.name && <div>Name is required.</div>}
              {errors.contact && <div>Please enter valid contact info.</div>}
            </>
          )}
          {current.matches('build.experience') && (
            <div data-testid="exp-container">
              {current.matches('build.experience.idle') && (
                <button onClick={() => send({ type: "CREATE_EXPERIENCE_CLICK" })} data-testid="add-draft-button">Add Work Experience</button>
              )}
              {current.matches('build.experience.create') && (
                <button onClick={() => send({ type: "SAVE_DRAFT" })} data-testid="save-draft-button">Save Work Experience</button>
              )}
              <button onClick={() => send({ type: "NEXT_STEP" })} data-testid="next-button">Next Step</button>
              <button
                type="button"
                onClick={() => send({ type: "HOME" })}
                data-testid="save-button"
              >
                Save & Go Back
              </button>
              {errors.name && <div>Name is required.</div>}
              {errors.contact && <div>Please enter valid contact info.</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
