import {_} from '../common'

const CUSTOM_GROUP_NAME = '自定义分组'

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
