import { makeExecutableSchema } from 'graphql-tools'

const typeDefs = `

  # 记录一个朋友的联系信息
  type Person {
    # person的内部，必需
    id: ID!

    # 名，必需
    firstName: String!

    # 姓，必需
    lastName: String!

    # 年龄
    age: Int

    # person的电话号码
    phone: String

    # 电话号码是否手机号
    isMobile: Boolean

    # person的好友
    bestFriend: Person
  } 

  input PersonInput {
    # person的内部ID
    id: ID

    # 名，必需
    firstName: String!

    # 姓，必需
    lastName: String!

    # 年龄
    age: Int

    # person的电话号码
    phone: String

    # 电话号码是否手机号
    isMobile: Boolean

    # person的好友的ID
    bestFriend: ID
  }

  # the schema allows the following query:
  type Query {
    # 通过id获取单独的Person
    person (id: ID): Person

    # 获取所有的Person
    people: [Person!]!
  }

  type Mutation {
    # 创建或更新一个Person
    person (input: PersonInput): Person
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

// 将就一下，用内存里的数组作为数据库
const people = []
const resolvers = {
  Query: {
    // 获取一个person
    person(_, { id }) {
      console.log('person', people[id])
      return people[id]
    },
    // 获取所有的person
    people() {
      console.log('people', people)
      return people
    },
  },
  Mutation: {
    person(_, { input }) {
      // 如果该person已存在则进行更新
      if (input.id in people) {
        people[input.id] = input
        return input
      }
      // 默认添加（或创建）该person
      // 将id设为记录的索引
      const person = Object.assign({}, input, { id: people.length })
      people.push(person)
      console.log('people', people)
      return person
    },
  },
  Person: {
    // 将好友Id解析成一条person记录
    bestFriend(person) {
      return people[person.bestFriend]
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default schema
