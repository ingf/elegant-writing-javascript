import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql'

import UserModel from '../models/user'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: GraphQLID,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
  },
})

const UserInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
  },
})

const User = {
  type: UserType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve(root, params) {
    return UserModel.findById(params.id).exec()
  },
}

const Users = {
  type: new GraphQLList(UserType),
  args: {},
  resolve() {
    return UserModel.find().exec()
  },
}

const UserCreate = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(UserInput),
    },
  },
  async resolve(root, params) {
    const userModel = new UserModel(params.data)
    const newUser = await userModel.save()

    if (!newUser) {
      throw new Error('Error create new user')
    }
    return true
  },
}

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: {
      User,
      Users,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      UserCreate,
    },
  }),
})
