const { Machine } = require('xstate');
const { createModel } = require('@xstate/test');

describe('resume builder', () => {
  const { machineModel } = require('./stateMachine');

  const testModel = createModel(machineModel, {
    events: {
      BUILD: async page => {
        await page.click('[data-testid="build-button"]');
      },
      OPTIMIZE: async page => {
        await page.click('[data-testid="optimize-button"]');
      },
      HOME: async page => {
        await page.click('[data-testid="save-button"]');
      },
      SET_NAME: {
        exec: async (page, event, _) => {
          await page.type('[data-testid="name"]', event.name);
        },
        cases: [{ name: 'set_name' }]
        // cases: [{ name: 'something' }, { name: 'james' }]
      },

      SET_EMAIL: {
        exec: async (page, event, _) => {
          await page.type('[data-testid="email"]', event.email);
        },
        cases: [{ email: 'set_email' }]
        // cases: [{ email: 'something@emsi.com' }, { email: 'james@gmail.com' }]
      },
      "CREATE_EXPERIENCE_CLICK": async page => {
        console.log('e2e, CREATE.EXPERIENCE.CLICK')
        await page.click('[data-testid="add-draft-button"]');
      },
      "SAVE_DRAFT": async page => {
        console.log('e2e, SAVE_DRAFT')
        await page.click('[data-testid="save-draft-button"]');
      },

      NEXT_STEP: {
        exec: async (page, event, _) => {
          console.log('e2e, NEXT_STEP')
          await page.type('[data-testid="name"]', event.name);
          await page.type('[data-testid="email"]', event.email);
          await page.click('[data-testid="next-button"]');
        },
        cases: [{ name: 'something', email: 'something@emai.com' }]
      },

      // CLICK_BAD: async page => {
      //   await page.click('[data-testid="bad-button"]');
      // },
      // CLOSE: async page => {
      //   await page.click('[data-testid="close-button"]');
      // },
      // ESC: async page => {
      //   await page.press('Escape');
      // },
      // SUBMIT: {
      //   exec: async (page, event) => {
      //     await page.type('[data-testid="response-input"]', event.value);
      //     await page.click('[data-testid="submit-button"]');
      //   },
      //   cases: [{ value: 'something' }, { value: '' }]
      // }
    }
  });

  const testPlans = testModel.getShortestPathPlans();
  // const testPlans = testModel.getSimplePathPlans();
console.log(testPlans.length);

  testPlans.forEach((plan, i) => {
    describe(plan.description, () => {
      plan.paths.forEach((path, i) => {
        it(
          path.description,
          async () => {
            await page.goto('http://localhost:3000');
            await path.test(page);
          },
          10000
        );
      });
    });
  });

  it('coverage', () => {
    testModel.testCoverage({filter: stateNode => !!stateNode.meta});
  });
});
