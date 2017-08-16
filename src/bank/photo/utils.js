import {_, I18N} from '../common'

const CUSTOM_GROUP_NAME = I18N.customGroupName

const generateGroupNameLevel = (groupNames, level = 0) => {
  if (!_.some(groupNames, groupName => groupName === CUSTOM_GROUP_NAME + (level || ''))) {
    return level
  }

  return generateGroupNameLevel(groupNames, level + 1)
}

export const generateGroupName = groupNames => {
  const groupNameLevel = generateGroupNameLevel(groupNames)
  return CUSTOM_GROUP_NAME + (groupNameLevel || '')
}
