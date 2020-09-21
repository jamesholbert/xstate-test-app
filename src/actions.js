const { assign, send } = require("xstate");

// *** BASE CONTEXT ***
// setting a base context field, like name
const setContext = field =>
  assign({
    [field]: (_, event) => event.value
  });

const pushArray = field =>
  assign({
    [field]: (context, event) => [...context[field], event.value]
  });

const appendArrayWithArray = field =>
  assign({
    [field]: (context, event) => [...context[field], ...event.value]
  });

const sliceArray = field =>
  assign({
    [field]: (context, event) =>
      context[field].slice(event.startIndex, event.endIndex)
  });
const removeElementFromArray = field =>
  assign({
    [field]: (context, event) => {
      if (event.index)
        return context[field].filter((_, i) => i !== event.index);

      return context[field].slice(1, context[field].length);
    }
  });
const replaceElementInArray = field =>
  assign({
    [field]: (context, event) =>
      context[field].map((item, i) => (i !== event.index ? item : event.value))
  });
const reorderArray = field =>
  assign({
    [field]: (context, event) => {
      let listCopy = [...context[field]];

      const movingItem = listCopy.splice(event.startIndex, 1);
      listCopy.splice(event.endIndex, 0, movingItem[0]);

      return listCopy;
    }
  });

const toggleItem = field =>
  assign({
    [field]: (context, event) =>
      context[field].map((item, index) => ({
        ...item,
        checked: index !== event.index ? item.checked : !item.checked
      }))
  });
// this uses an implicit id based on the `id` of the item being updated, no need to send extra `id`
const setContextArrayElementById = field =>
  assign({
    [field]: (context, event) =>
      context[field].map(item =>
        item.id !== event.value.id ? item : event.value
      )
  });

// this uses an implicit unique name field, no need to send extra `id`
const setContextArrayElementByName = field =>
  assign({
    [field]: (context, event) =>
      context[field].map(item =>
        item.name !== event.value.name ? item : event.value
      )
  });

// *** CONTEXT VALUES ON OBJECT KEYED ON BASE LEVEL OBJECT ***
// setting a value on an object such as {experienceDraft: jobTitle}
const setContextKey = (field, key) =>
  assign({
    [field]: (context, event) => ({ ...context[field], [key]: event.value })
  });
const clearContextKey = (field, key, doClear) => {
  return assign({
    [field]: (context, event) => ({
      ...context[field],
      [key]: doClear ? undefined : context[field][key]
    })
  });
};

// example: modifying work task textareas
const setContextKeyArrayElement = (field, key) =>
  assign({
    [field]: (context, event) => ({
      ...context[field],
      [key]: context[field][key].map((item, index) =>
        index !== event.index ? item : event.value
      )
    })
  });
const reorderContextKeyArray = (field, key) =>
  assign({
    [field]: (context, event) => {
      let listCopy = [...context[field][key]];

      const movingItem = listCopy.splice(event.startIndex, 1);
      listCopy.splice(event.endIndex, 0, movingItem[0]);

      return {
        ...context[field],
        [key]: listCopy
      };
    }
  });

// this uses an implicit id based on the `id` of the item being updated, no need to send extra `id`
const setContextKeyArrayElementById = (field, key) =>
  assign({
    [field]: (context, event) => ({
      ...context[field],
      [key]: context[field][key].map(item =>
        item.id !== event.value.id ? item : event.value
      )
    })
  });

const pushContextKeyArrayElement = (field, key) =>
  assign({
    [field]: (context, event) => ({
      ...context[field],
      [key]: [...context[field][key], event.value]
    })
  });

const removeElementFromKeyArray = (field, key) =>
  assign({
    [field]: (context, event) => {
      if (event.index)
        return {
          ...context[field],
          [key]: context[field][key].filter((_, i) => i !== event.index)
        };

      return {
        ...context[field],
        [key]: context[field][key].slice(1, context[field][key].length)
      };
    }
  });

// example: toggling a skill selected state
const toggleFieldKeyArrayElement = (field, key) =>
  assign({
    [field]: (context, event) => ({
      ...context[field],
      [key]: context[field][key].map((item, index) => ({
        ...item,
        checked: index !== event.index ? item.checked : !item.checked
      }))
    })
  });

const createMasterListOfSkills = () =>
  assign({
    addedSkills: context => {

    return []
    }
  });

const createFinalListOfSkills = () =>
  assign({
    finalSkillList: context => {
      const combinedSkillList = [
        ...context.relevantSkills,
        ...context.skillOpportunities.filter(skill => skill.checked),
        ...context.unusualSkills
      ];

      const uniqueSkills = combinedSkillList.reduce(
        (totalSkills, currentSkill) =>
          totalSkills.some(skill => skill.name === currentSkill.name)
            ? totalSkills
            : [...totalSkills, currentSkill],
        []
      );

      return uniqueSkills;
    }
  });

module.exports.setContext = setContext;
module.exports.pushArray = pushArray;
module.exports.appendArrayWithArray = appendArrayWithArray;
module.exports.sliceArray = sliceArray;
module.exports.removeElementFromArray = removeElementFromArray;
module.exports.replaceElementInArray = replaceElementInArray;
module.exports.reorderArray = reorderArray;
module.exports.toggleItem = toggleItem;
module.exports.setContextArrayElementById = setContextArrayElementById;
module.exports.setContextArrayElementByName = setContextArrayElementByName;
module.exports.setContextKey = setContextKey;
module.exports.clearContextKey = clearContextKey;
module.exports.setContextKeyArrayElement = setContextKeyArrayElement;
module.exports.reorderContextKeyArray = reorderContextKeyArray;
module.exports.setContextKeyArrayElementById = setContextKeyArrayElementById;
module.exports.pushContextKeyArrayElement = pushContextKeyArrayElement;
module.exports.removeElementFromKeyArray = removeElementFromKeyArray;
module.exports.toggleFieldKeyArrayElement = toggleFieldKeyArrayElement;
module.exports.createMasterListOfSkills = createMasterListOfSkills;
module.exports.createFinalListOfSkills = createFinalListOfSkills;