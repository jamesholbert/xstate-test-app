const { Machine, assign, send } = require("xstate");

const {
  setContext,
  pushArray,
  appendArrayWithArray,
  sliceArray,
  removeElementFromArray,
  replaceElementInArray,
  reorderArray,
  toggleItem,
  setContextArrayElementById,
  setContextArrayElementByName,
  setContextKey,
  clearContextKey,
  setContextKeyArrayElement,
  reorderContextKeyArray,
  setContextKeyArrayElementById,
  pushContextKeyArrayElement,
  removeElementFromKeyArray,
  toggleFieldKeyArrayElement,
  createMasterListOfSkills,
  createFinalListOfSkills  
} = require('./actions');

const blankExperience = index => ({
  index,
  id: JSON.stringify(new Date()),
  employer: "",
  startDate: new Date(),
  endDate: new Date(),
  workTasks: [],
  skills: [],
  suggestTasksResolved: false
});

const blankEducation = index => ({
  index,
  id: JSON.stringify(new Date()),
  degree: "",
  status: true,
  area: "",
  skills: []
});

const blankSkill = index => ({
  index,
  id: JSON.stringify(new Date())
});

// guards
const validWorkExperience = (context, event) =>
  context.experienceDraft.jobTitle && !event.loading;

const validFurtherEd = context =>
  context.educationDraft.level && context.educationDraft.area;

const validSkillState = context =>
  context.skillDraft.name;

const validTargetTitle = context => context.targetJobTitle;
const validContactInfo = context => context.name && (context.phone || context.email);
const validResume = context =>
  context.name && (context.addedSkills.filter(skill => skill.checked).length || context.addedSkills.length);

const machineModel = Machine({
  id: "home",
  initial: "home",
  context: {
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    experience: [],
    experienceDraft: null,
  },
  on: {
    BUILD: "build",
  },
  states: {
    home: {
      meta: {
        test: async page => {
          await page.waitForSelector('[data-testid="build-button"]');
        }
      }
    },
    build: {
      initial: "personal",
      meta: {
        test: async page => {
          await page.waitForSelector('[data-testid="build-layout-wrapper"]');
        }
      },
      on: {
        HOME: {
          actions: createMasterListOfSkills(),
          target: "home"
        },
      },
      states: {
        personal: {
          meta: {
            test: async page => {
              await page.waitForSelector('[data-testid="name"]');
            }
          },
          id: "personal",
          initial: "normal",
          states: {
            normal: {
              meta: {
                test: async page => {
                  await page.waitForSelector('[data-testid="name"]');
                }
              },
            },
            invalid: {
              meta: {
                test: async page => {
                  await page.waitForSelector('[data-testid="name"]');
                }
              },
            }
          },
          on: {
            "NEXT_STEP": [
              {
                cond: validContactInfo,
                target: "#experience",
              },
              {
                target: ".invalid"
              }
            ],
            SET_NAME: {
              actions: setContext("name")
            },
            SET_EMAIL: {
              actions: setContext("email")
            },
          }
        },
        experience: {
          meta: {
            test: async page => {
              await page.waitForSelector('[data-testid="exp-container"]');
            }
          },
          id: "experience",
          initial: "idle",
          states: {
            idle: {
              meta: {
                test: async page => {
                  await page.waitForSelector('[data-testid="add-draft-button"]');
                }
              },
              on: {
                "CREATE_EXPERIENCE_CLICK": {
                  target: "create",
                  actions: assign({
                    experienceDraft: context =>
                      blankExperience(context.experience.length)
                  })
                },
              }
            },
            create: {
              meta: {
                test: async page => {
                  await page.waitForSelector('[data-testid="save-draft-button"]');
                }
              },
              on: {
                SAVE_DRAFT: "idle"
              }
            }
          }
        }
      }
    }
  },
  guards: {
    validWorkExperience,
    validFurtherEd,
    validContactInfo,
    validTargetTitle,
    validSkillState
  }
});

module.exports.machineModel = machineModel;

